/* eslint-disable prettier/prettier */
/* eslint-disable quotes */
import { BleManager } from 'react-native-ble-plx';
import {Alert, PermissionsAndroid} from "react-native";
import base64 from 'react-native-base64';
import { chatData } from '../assets/data/chatData';
import {saveChat} from './Situations';
const manager = new BleManager();


var d = null;
var message = "";
//initialize ble
export const initializeBle = () => {
  var states;
  PermissionsAndroid.request(
    PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
    {
      'title': 'Bluetooth Permission',
      'message': 'Bluetooth Permission',
      'buttonPositive': 'Oui',
      'buttonNegative': 'Non',
    }
  ).then(() =>{
    //check if bluetooth is available
    manager.state().then(state => {
      if (state !== 'PoweredOn'){
        states = state;
        alerte();
      } else {
        states = state;
        scan();
      }
    });

    manager.onStateChange((state) => {
      console.log(state);
      if (state === 'PoweredOn' && states !== state) {
        states = state;
      }
      else if (state !== 'PoweredOn' && states !== state) {
        states = state;
        alerte();
      }
    });
  });

};

const alerte = () => {
  manager.stopDeviceScan();
  manager.state().then(state => {
    Alert.alert('Bluetooth is not available',
      'Turn on bluetooth',
      [{text: 'Ok',
        onPress: () => {
          if (state !== 'PoweredOn'){alerte();}
          else {
            scan();
          }
        },
      }]
    );
  });
};

//check if the device disconnect
const checkDisconnect = () => {
  var dis = manager.onDeviceDisconnected((device) => {
    console.log('Disconnected from', device.id);
    dis.remove();
    manager.scan();
  });
};


//Scan for bluetooth deivces
const scan = () => {
  console.log("scan");
  manager.startDeviceScan(null, null, (error, device) => {
    if (error) {
      console.log(error);
    }
    if (device) {
      console.log(device.name);
      if (device.name === "MLT-BT05"){
        console.log("found");
        manager.stopDeviceScan();
        manager.connectToDevice(device.id)
          .then((deviced) => {
            d = deviced;
            manager.discoverAllServicesAndCharacteristicsForDevice(d.id)
              .then(() => {
                checkDisconnect();
                receiveMessage();
                console.log("fini");
              });
          });
      }
    }
  });
};

//Send message to connected device
export const sendMessage = (messages) => {
  if (d == null){
    Alert.alert('No device connected', 'Please wait for a device to connect');
  } else {
    console.log("Message envoyé à : " + d.name);
    manager.writeCharacteristicWithoutResponseForDevice(d.id,"FFE0","FFE1",base64.encode(messages + "|"));
  }
};

//Receive message from connected device
const receiveMessage = () => {
  const regex = /^[A=]*$/;
  manager.monitorCharacteristicForDevice(
    d.id,
    "FFE0",
    "FFE1",
    (error, characteristic) => {
      if (error) {
        console.log(error);
      }
      if (!regex.test(characteristic.value)) {
        console.log("message = " + base64.decode(characteristic.value) + ";");
        chatData.push(base64.decode(characteristic.value));
        saveChat();
      }
    }
  );
};

export const returnMessage = () => {
  var tmp = message;
  message = "";
  return tmp;
};
