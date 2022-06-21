/* eslint-disable prettier/prettier */
import React,{useState,useEffect} from "react";
import {View, Text, LogBox} from 'react-native';
import {chatData} from "./assets/data/chatData";
import Messaging from './components/Messaging';
import Permissions from './components/Permissions';
import Situations from './components/Situations';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {initializeBle} from "./components/Bluetooth";

import {createStackNavigator} from '@react-navigation/stack';
import {NavigationContainer} from '@react-navigation/native';


const Stack = createStackNavigator()


const App = () => {

  useEffect(()=>{
        LogBox.ignoreLogs(['new NativeEventEmitter']);
      //clearChat();
      initializeBle();
      //check if asyncStorage is null
        AsyncStorage.getItem('Chat').then((value)=>{
            if(value!=null){
                loadChat();
            }
        });
  }, []);

  const loadChat=()=>{
      try {
          AsyncStorage.getItem('Chat')
              .then(value=>{
                  if(value!=null){
                      let chatArr = JSON.parse(value);
                      chatArr.map((item)=>{
                          chatData.push(item);
                      });
                      //console.log(chatData);
                  }
              })
      } catch (error) {
          console.log(error);
      }
  }

  const clearChat = async() => {
      try {
          await AsyncStorage.setItem('Chat', '');
      } catch (error) {
          console.log(error);
      }
  }


  return(
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Messaging" component={Messaging}/>
        <Stack.Screen name="Situations" component={Situations}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;