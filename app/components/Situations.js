import React,{useState} from 'react';
import {View, Text, Button, TouchableOpacity, FlatList, StyleSheet} from 'react-native';
import {situationData} from "../assets/data/situationData";
import {chatData} from "../assets/data/chatData";
import Colors from "../assets/colors/colors";
import Message from "./Message";
import moment from 'moment';
import Messaging from './Messaging';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {sendMessage} from './Bluetooth';
const Situations = ({navigation}) => {
    const [select, setSelect] = useState(situationData)
    const [nbSelected, setNbSelected] = useState(0)

    const selectionHandler=(item)=>{
        const newItem = select.map((val)=>{
            if(val.id===item.id){
                if(val.selected==false){
                    setNbSelected(previousState => previousState + 1);
                }else {
                    setNbSelected(previousState => previousState - 1);
                }
                return{...val, selected: !val.selected};
            }else{
                return val;
            }
        });
        setSelect(newItem);
    };

    const sendingHandler=()=>{
        let msm = {...Message}; //user message to send
        msm.sendAt = moment().format("DD MMM YYYY, HH:mm");
        msm.user = "sender";
        
        //adding all the text to the message (array of sentences)
        msm.content = select.map((val)=>{
            if(val.selected==true){
                return val.messageContent; //can be changed to messageContent instead of title being displayed
            }
        })

        //remove undefined content from the message array
        msm.content = msm.content.filter(function(element){
            return element !== undefined;
        });

        //don't send anything if nothing has been selected
        
        if(msm.content.length>0){
            chatData.push(msm);
            //saveChat();
        } //Si car t'auras toujours un indicateur.
        
        msm.id = select.map((val)=>{
            if(val.selected==true)
                return val.id;
        });
        msm.id = msm.id.filter(function(element){
            return element!==undefined;
        });

        console.log(msm.id.toString());
        sendMessage(msm.id.toString().replace(/,/g, ''));
        saveChat();
    }

    const saveChat = async() => {
        try {
            await AsyncStorage.setItem('Chat', JSON.stringify(chatData));
        } catch (error) {
            console.log(error);
        }
    }

    const onSend=()=>{
        sendingHandler();
        navigation.navigate("Messaging", {data: chatData});
    }

    return(
        <View style={styles.globalView}>
                <View style={styles.scrollingView}>
                    <FlatList
                    data = {select}
                    keyExtractor={item=>item.id}
                    renderItem={({item})=>{
                        return (
                                <TouchableOpacity onPress={()=>selectionHandler(item)}>
                                    <View style={[
                                            styles.defaultSituationButton, 
                                            item.selected? styles.selectedSituationButton : styles.unselectedSituationButton
                                        ]}>
                                        <Text>{item.title}</Text>
                                    </View>
                                </TouchableOpacity>
                            );
                    }}/>
                </View>
                <View style={styles.bottomView}>
                    <Button title="Send" onPress={onSend} disabled={nbSelected<=0}/>
                </View>
        </View>
        );
};

const styles = StyleSheet.create({
    globalView:{
        flex:1
    },

    bottomView:{
        flex: 0.1
    },

    scrollingView:{
        flex: 0.9,
        paddingHorizontal: 10
    },

    defaultSituationButton:{
        marginTop: 20,
        height: 50,
        widght: "80%",
        paddingHorizontal:70,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },

    selectedSituationButton:{
        borderWidth: 2,
        borderColor: Colors.grey,
        backgroundColor: Colors.light
    },

    unselectedSituationButton:{
        backgroundColor: Colors.white
    }
});

export default Situations;