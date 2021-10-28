# WaterZen
DECO7381 Assignment - Team Galaxy 6

--------------------------------------------------------------------------------------------
**SOFTWARE PART**

Before starting the WaterZen project on local

**1) Windows Computer is recommended!**

**2) Make sure you have node.js and XAMPP installed on your computer.**


⏬Now Let's begin the starting process⏬

**Step 1. Database Condiguration**

1.1) Start Apache and MySQL service on XAMPP

1.2) Type "http://localhost/phpmyadmin/" in your preferred browser

1.3) Create a new database named "waterzen"

1.4) Find the WaterZen.sql file in "WaterZem/SQL/" folder

1.5) Import the SQL file into the just made waterzen database


**Step 2. Start Project**

2.1) Open the project folder with VScode

2.2) Open the terminal in VScode (Make sure the terminal path is at the project directory)

2.3) Type: "npm start" in terminal


**If there's no error until now, then you should be good to go!**

**Type "http://localhost:5000/" into your browser and start using WaterZen!😉**


**To Stop the Project**

Return back to VS terminal and press "Ctrl + C" to stop the project

--------------------------------------------------------------------------------------------
**HARDWARE PART**

***(For WaterZen Users)***
Before starting the WaterZen Water Monitor Device

**1) Make sure you have WiFi or Mobile Hotspot.**

⏬Now Let's begin the starting process⏬

**Step 1. Connect the USB cable to your PC or Use Battery Instead to have power supply**

**Step 2. Testing and Uploading date to WaterZen**

2.1) Insert the probe into the solution

2.2) Open report page to see the result of testing

NOTE:
The probe is a laboratory-grade probe. Do not immerse in liquid for a long time. Otherwise this will shorten the life of the probe.

***(For Developer)***

**ESP8266-s01**

There’s so many ways to bend this SoC (System on a Chip), but the basics are:

To program, you have to toggle the GPIO 0 “PRGM” pin to ground after a low signal to the “RSET” pin, so both have to have their own momentary button connected to ground.
Hook it up to a FTDI (or similar UART as shown in the product images), making sure it’s configured for 3.3V.
Program it through the Arduino IDE. After you click the “Program” button in Arduino, it will start compiling your program.
At this time: 
press and HOLD your “PRGM” button,
tap the “RSET” button then RELEASE the “program” button when the Arduino IDE finishes the compile, and start “programming…”
Manually wiring it up can be a PAIN. Look into the very-convenient 29248 adapter that mates your USB-TTL to it easily.

To see the source code of esp8266, please check the Hardware Folder -> deco7381_galaxy6_esp8266.ino

**Arduino Uno with I/O Expansion Shield**

Source code for 6 different sensors can be viewed in the Hardware Folder -> deco7381_galaxy6.ino
