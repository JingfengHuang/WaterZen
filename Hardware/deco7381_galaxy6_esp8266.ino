// Import required libraries
#include <ESP8266WiFi.h>
#include <SoftwareSerial.h>
// WiFi parameters
const char* SSID = "臭猫臭狗臭猪之家";
const char* PASS = "Szwobuzhidao1";
#define IP "192.168.1.12"
#define _baudrate 9600

void setup() {
    Serial.begin( _baudrate );
    debug.begin( _baudrate );
    sendDebug("AT");
    delay(1000);
    if(debug.find("OK"))
    {
        Serial.println("RECEIVED: OK\nData ready to sent!");
        connectWiFi();
    }
    else{
    Serial.println("NO RESEPONCE!");
  }
}
void loop() {
    delay(5000);   // 60 second
    SentOnCloud( String(5), String(9) );
}
void SentOnCloud( String T, String H )
{
  // set the client 
    String cmd = "AT+CIPSTART=\"TCP\",\"";
    cmd += IP;
    cmd += "\",80";
    sendDebug(cmd);
    if( debug.find( "Error" ) )
    {
        Serial.print( "RECEIVED: Error\nExit1" );
        return;
    }
    cmd = GET + "&field1=" + T + "&field2=" + H +"\r\n";
    debug.print( "AT+CIPSEND=" );
    debug.println( cmd.length() );
    if(debug.find( ">" ) )
    {
        Serial.print(">");
        Serial.print(cmd);
        debug.print(cmd);
    }
    else
    {
        debug.print( "AT+CIPCLOSE" );
    }
    if( debug.find("OK") )
    {
        Serial.println( "RECEIVED: OK" );
    }
    else
    {
        Serial.println( "RECEIVED: Error\nExit2" );
    }
}
void sendDebug(String cmd)
{
    Serial.print("SEND: ");
    Serial.println(cmd);
    debug.println(cmd);
} 
 
boolean connectWiFi()
{
    debug.println("AT+CWMODE=1");
    delay(2000);
    String cmd="AT+CWJAP=\"";
    cmd+=SSID;
    cmd+="\",\"";
    cmd+=PASS;
    cmd+="\"";
    sendDebug(cmd);
    delay(5000);
    if(debug.find("OK"))
    {
        Serial.println("RECEIVED: OK");
        return true;
    }
    else
    {
        Serial.println("RECEIVED: Error");
        return false;
    }
    cmd = "AT+CIPMUX=0";
    sendDebug( cmd );
    if( debug.find( "Error") )
    {
        Serial.print( "RECEIVED: Error" );
        return false;
    }
}

