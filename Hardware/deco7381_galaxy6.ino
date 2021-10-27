// Wireless connection
//#include <ESP8266WiFi.h>
//const char* ssid =  "臭猫臭狗臭猪之家"; 
//const char* password = "Szwobuzhidao1";

//Temperature chip i/o
#include <OneWire.h>
int DS18S20_Pin = 12; //DS18S20 Signal pin on digital 2
OneWire ds(DS18S20_Pin); // on digital pin 2

// GPS/BDS
#include <SoftwareSerial.h> 
SoftwareSerial GpsSerial(7, 6); //RX,TX
 
// TDS
#define TdsSensorPin A0
#define VREF 5.0      // analog reference voltage(Volt) of the ADC
#define SCOUNT  30           // sum of sample point
int analogBuffer[SCOUNT];    // store the analog value in the array, read from ADC
int analogBufferTemp[SCOUNT];
int analogBufferIndex = 0, copyIndex = 0;
float averageVoltage = 0, tdsValue = 0, temperatureTDS = 25;

// Turbidity
#define TurbidityPin A1

// Electrical Conductivity
#include "DFRobot_EC.h"
#include <EEPROM.h> // size modified
#define EC_PIN A3
float voltageEC,ecValue;
DFRobot_EC ec;

// pH Sensor
#include "DFRobot_PH.h"
#define PH_PIN A2
float voltagePH,phValue;
DFRobot_PH ph;

void setup(void) {
  //Serial.begin(9600);
  Serial.begin(115200);

  // WiFi Begin \\
  // Connect to WiFi
//  WiFi.begin(ssid, password);
//  while (WiFi.status() != WL_CONNECTED) {
//    delay(500);
//    Serial.print(".");
//  }
//  Serial.println("");
//  Serial.println("WiFi connected");
//  
//  // Print the IP address
//  Serial.println(WiFi.localIP());
  
  // Sensor Begin \\
  pinMode(TdsSensorPin, INPUT);
  ph.begin();
  ec.begin();
  //GpsSerial.begin(9600); //Gps Serial
}

void loop(void) {
  // GPS/BDS functions //
//  while (GpsSerial.available() > 0)
//  {
//    byte gpsData = GpsSerial.read();
//    Serial.write(gpsData); 
//  }
//  delay(1120);
  // Tempature Sensor functions //
  // Output -> degrees Celusis (float)
  float temperature = getTemp();
  Serial.print("Current temperature is: ");
  Serial.print(temperature);
  Serial.println(" ^C");
  delay(1120); //just here to slow down the output so it is easier to read

  // Turbidity sensor functions //
  // Output -> voltage (double) -> TU (double)
  // Turbidity-Voltage relational expression -> y = -1120.4x^2 + 5742.3x - 4352.9
  int sensorValue = analogRead(TurbidityPin);// read the input on analog pin 0:
  float voltage = sensorValue * (5.0 / 1024.0); // Convert the analog reading (which goes from 0 - 1023) to a voltage (0 - 5V):
  Serial.print("Current voltage is: ");
  Serial.print(voltage); // print out the value you read:
  Serial.println(" v"); 
  delay(1120);

  // TDS(Total dissloved Solids)sensor functions //
  // Output -> ppm (int)
  static unsigned long analogSampleTimepoint = millis();
  if (millis() - analogSampleTimepoint > 40U)  //every 40 milliseconds,read the analog value from the ADC
  {
    analogSampleTimepoint = millis();
    analogBuffer[analogBufferIndex] = analogRead(TdsSensorPin);    //read the analog value and store into the buffer
    analogBufferIndex++;
    if (analogBufferIndex == SCOUNT)
      analogBufferIndex = 0;
  }
  static unsigned long printTimepoint = millis();
  if (millis() - printTimepoint > 800U)
  {
    printTimepoint = millis();
    for (copyIndex = 0; copyIndex < SCOUNT; copyIndex++)
      analogBufferTemp[copyIndex] = analogBuffer[copyIndex];
    averageVoltage = getMedianNum(analogBufferTemp, SCOUNT) * (float)VREF / 1024.0; // read the analog value more stable by the median filtering algorithm, and convert to voltage value
    float compensationCoefficient = 1.0 + 0.02 * (temperature - 25.0); //temperature compensation formula: fFinalResult(25^C) = fFinalResult(current)/(1.0+0.02*(fTP-25.0));
    float compensationVolatge = averageVoltage / compensationCoefficient; //temperature compensation
    tdsValue = (133.42 * compensationVolatge * compensationVolatge * compensationVolatge - 255.86 * compensationVolatge * compensationVolatge + 857.39 * compensationVolatge) * 0.5; //convert voltage value to tds value
    Serial.print("TDS value is: ");
    Serial.print(tdsValue, 0);
    Serial.println(" ppm");
    delay(1120);
  }

  // Electrical Conductivity Sensor functions //
  // Output -> ms/cm(float)
  static unsigned long timepoint = millis();
  if(millis()-timepoint>1000U)  //time interval: 1s
  {
    timepoint = millis();
    voltage = analogRead(EC_PIN)/1024.0*5000;   // read the voltage
    ecValue =  ec.readEC(voltageEC,temperature);  // convert voltage to EC with temperature compensation
    Serial.print("EC:");
    Serial.print(ecValue,2);
    Serial.println(" ms/cm");
    delay(1120);
  }
  ec.calibration(voltage,temperature);          // calibration process by Serail CMD

  // pH Sensor functions //
  // Output -> ph(float)
  static unsigned long timepointPH = millis();
  if(millis()-timepointPH>1000U){                  //time interval: 1s
      timepointPH = millis();
      voltage = analogRead(PH_PIN)/1024.0*5000;  // read the voltage
      phValue = ph.readPH(voltagePH,temperature);  // convert voltage to pH with temperature compensation
      Serial.print("pH: ");
      Serial.println(phValue,2);
      delay(1120);
  }
  ph.calibration(voltage,temperature);           // calibration process by Serail CMD
        
}

// Helper functions for sensors //
float getTemp(){
  //returns the temperature from one DS18S20 in DEG Celsius

  byte data[12];
  byte addr[8];

  if ( !ds.search(addr)) {
      //no more sensors on chain, reset search
      ds.reset_search();
      return -1000;
  }

  if ( OneWire::crc8( addr, 7) != addr[7]) {
      Serial.println("CRC is not valid!");
      return -1000;
  }

  if ( addr[0] != 0x10 && addr[0] != 0x28) {
      Serial.print("Device is not recognized");
      return -1000;
  }

  ds.reset();
  ds.select(addr);
  ds.write(0x44,1); // start conversion, with parasite power on at the end

  byte present = ds.reset();
  ds.select(addr);
  ds.write(0xBE); // Read Scratchpad


  for (int i = 0; i < 9; i++) { // we need 9 bytes
    data[i] = ds.read();
  }

  ds.reset_search();

  byte MSB = data[1];
  byte LSB = data[0];

  float tempRead = ((MSB << 8) | LSB); //using two's compliment
  float TemperatureSum = tempRead / 16;

  return TemperatureSum;

}

int getMedianNum(int bArray[], int iFilterLen)
{
  int bTab[iFilterLen];
  for (byte i = 0; i < iFilterLen; i++)
    bTab[i] = bArray[i];
  int i, j, bTemp;
  for (j = 0; j < iFilterLen - 1; j++)
  {
    for (i = 0; i < iFilterLen - j - 1; i++)
    {
      if (bTab[i] > bTab[i + 1])
      {
        bTemp = bTab[i];
        bTab[i] = bTab[i + 1];
        bTab[i + 1] = bTemp;
      }
    }
  }
  if ((iFilterLen & 1) > 0)
    bTemp = bTab[(iFilterLen - 1) / 2];
  else
    bTemp = (bTab[iFilterLen / 2] + bTab[iFilterLen / 2 - 1]) / 2;
  return bTemp;
}
void Error_Flag(int num)
{
 Serial.print("ERROR");
 Serial.println(num);
 while (1)
 {
 digitalWrite(13, HIGH);
 delay(500);
 digitalWrite(13, LOW);
 delay(500);
 }
}
void print_GpsDATA()
{
 if (Save_Data.ParseData_Flag)
 {
 Save_Data.ParseData_Flag = false;

 Serial.print("Save_Data.UTCTime = ");
 Serial.println(Save_Data.UTCTime);
 if(Save_Data.Usefull_Flag)
 {
 Save_Data.Usefull_Flag = false;
 Serial.print("Save_Data.latitude = ");
 Serial.println(Save_Data.latitude);
 Serial.print("Save_Data.N_S = ");
 Serial.println(Save_Data.N_S);
 Serial.print("Save_Data.longitude = ");
 Serial.println(Save_Data.longitude);
 Serial.print("Save_Data.E_W = ");
 Serial.println(Save_Data.E_W);
 }
 else
 {
 Serial.println("GPS DATA is not usefull!");
 }
 }
}
void parse_GpsDATA()
{
 char *subString;
 char *subStringNext;
 if (Save_Data.GetData_Flag)
 {
 Save_Data.GetData_Flag = false;
 Serial.println("************************");
 Serial.println(Save_Data.GPS_DATA);

 for (int i = 0 ; i <= 6 ; i++)
 {
 if (i == 0)
 {
 if ((subString = strstr(Save_Data.GPS_DATA, ",")) == NULL)
 Error_Flag(1); // detect error
 }
 else
 {
 subString++;
 if ((subStringNext = strstr(subString, ",")) != NULL)
 {
 char usefullBuffer[2];
 switch(i)
 {
 case 1:memcpy(Save_Data.UTCTime, subString, subStringNext -
subString);break; // get UTC standard time
 case 2:memcpy(usefullBuffer, subString, subStringNext - subString);break;
//获取定位状态
 case 3:memcpy(Save_Data.latitude, subString, subStringNext -
subString);break; //// get longitude information
 case 4:memcpy(Save_Data.N_S, subString, subStringNext - subString);break;
//获取 N/S
 case 5:memcpy(Save_Data.longitude, subString, subStringNext -
subString);break; // get latitude information
 case 6:memcpy(Save_Data.E_W, subString, subStringNext - subString);
 break;
 // get E/W
 default:break;
 }
 subString = subStringNext;
 Save_Data.ParseData_Flag = true;
 if(usefullBuffer[0] == 'A')
 Save_Data.Usefull_Flag = true;
 else if(usefullBuffer[0] == 'V')
 Save_Data.Usefull_Flag = false;
 }
 else
 {
 Error_Flag(2); // detect error
 }
 }
 }
 }
}
void Read_Gps()
{
 while (GpsSerial.available())
 {
 gpsRxBuffer[gpsRxLength++] = GpsSerial.read();
 if (gpsRxLength == gpsRxBufferLength)RST_GpsRxBuffer();
 }
 char* GPS_DATAHead;
 char* GPS_DATATail;
 if ((GPS_DATAHead = strstr(gpsRxBuffer, "$GPRMC,")) != NULL || (GPS_DATAHead =
strstr(gpsRxBuffer, "$GNRMC,")) != NULL )
 {
 if (((GPS_DATATail = strstr(GPS_DATAHead, "\r\n")) != NULL) && (GPS_DATATail >
GPS_DATAHead))
 {
 memcpy(Save_Data.GPS_DATA, GPS_DATAHead, GPS_DATATail - GPS_DATAHead);
 Save_Data.GetData_Flag = true;
 RST_GpsRxBuffer();
 }
 }
}
void RST_GpsRxBuffer(void)
{
  memset(gpsRxBuffer, 0, gpsRxBufferLength); // reset buffer memorty
  gpsRxLength = 0;
}

