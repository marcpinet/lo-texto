#include <SPI.h>
#include <LoRa.h>
#include <SoftwareSerial.h>

// Parameters you can play with :

int txPower = 14; // from 0 to 20, default is 14
int spreadingFactor = 12; // from 7 to 12, default is 12
long signalBandwidth = 125E3; // 7.8E3, 10.4E3, 15.6E3, 20.8E3, 31.25E3,41.7E3,62.5E3,125E3,250E3,500e3, default is 125E3
int codingRateDenominator = 5; // Numerator is 4, and denominator from 5 to 8, default is 5
int preambleLength = 8; // from 2 to 20, default is 8
String payload = ""; // you can change the payload
char appData;

// Setting up the bluetooth serial
SoftwareSerial HM10(2, 3); // RX = 2, TX = 3

#define SS 10
#define RST 8
#define DI0 3
#define BAND 922E6  // Here you define the frequency carrier

void receive() {
  int packetSize = LoRa.parsePacket();
  if (packetSize) {
    // read packet
    for (int i = 0; i < packetSize; i++) {
      Serial.print(char(LoRa.read())); // Parse the packet in a readable format
    }
  }
}

void setup() {
  Serial.begin(9600);
  HM10.begin(9600);
  while (!Serial);

  Serial.print("SetFrequency : ");
  Serial.print(BAND);
  Serial.println("Hz");
  Serial.print("SetSpreadingFactor : SF");
  Serial.println(spreadingFactor);

  SPI.begin();
  LoRa.setPins(SS, RST, DI0);

  if (!LoRa.begin(BAND)) {
    Serial.println("Starting LoRa failed!");
    while (1);
  }
  
  LoRa.setTxPower(txPower, 1);
  LoRa.setSpreadingFactor(spreadingFactor);
  LoRa.setSignalBandwidth(signalBandwidth);
  LoRa.setCodingRate4(codingRateDenominator);
  LoRa.setPreambleLength(preambleLength);
  
}

void sendPacket(String payload) {
  LoRa.beginPacket();
  LoRa.print(payload);
  LoRa.endPacket();
}

void loop() {
  receive();
  HM10.listen();  // listen the HM10 port
  while (HM10.available() > 0) {   // if HM10 sends something then read
    appData = HM10.read();
    payload += String(appData);  // save the data in string format
    receive();
  }
  receive();
  if (payload.indexOf("|") != -1) {
    sendPacket(payload);
    Serial.println("Message successfully sent! Content: " + payload);
    payload = "";
  }
  receive();
}
