/*
 * Smart farming proof-of-concept using IoT
 * Done by Jia Jian, Xin Wei, Fiona, Jack and Sam
 * BPAS AY19/20 Term 1 - G9T1
 */

#include <Firmata.h>

const int pinLight = A0; // Light sensor is at A0.
const int pinTemp = A1; // Define the pin to which the temperature sensor is connected.
const int pinLed = 7; // D7.

// Define the B-value of the thermistor.
// This value is a property of the thermistor used in the Grove - Temperature Sensor,
// and used to convert from the analog value it measures and a temperature value.
const int B = 3975;

// Defines the light-sensor threshold value below which the LED will turn on.
// Decrease this value to make the device more sensitive to ambient light, or vice-versa.
int lightTreshold = 400;

void setup() {
    // Configure the serial communication line at 9600 baud (bits per second.)
    Serial.begin(9600);
    pinMode(pinLed, OUTPUT); // Sets this digital pin as output (LED)
}

void loop() {
    // Temperature reading.
    int temp = analogRead(pinTemp); // Get the (raw) value of the temperature sensor.
    float resistance = (float)(1023-temp)*10000/temp; // Determine the current resistance of the thermistor based on the sensor value.
    float temperature = 1/(log(resistance/10000)/B+1/298.15)-273.15; // Calculate the temperature based on the resistance value.
    Serial.println("Temp: " + (String)temperature); // Print the temperature to the serial console.
    delay(1000); // Wait one second between measurements.

    int light = analogRead(pinLight); // Get raw value of temp sensor, it's an analog sensor!
    Serial.println("Light intensity: " + (String)light);
    
    if (light < lightTreshold) {
      digitalWrite(pinLed, HIGH);
    }
    else {
      digitalWrite(pinLed, LOW);
    }
}
