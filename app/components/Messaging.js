/* eslint-disable prettier/prettier */
import React, {useState} from 'react';
import {View, Text, Button, FlatList, StyleSheet, TouchableOpacity} from 'react-native';
import {chatData} from "../assets/data/chatData";
import Colors from "../assets/colors/colors";
import {Message} from "./Message.js";

const ChatMessageProps=()=>{
    message: Message
}

const ChatMessage = (props: ChatMessageProps)=>{
    const {message} = props
    var tmp = '';
    var tmp2 = '';
    try{
        message.item.content.map((text,id)=>{
            tmp2 = text + '\n';
            tmp = (
            <Text key={id} style={styles.text}>
                {tmp2}
            </Text>
            );
        });
    }catch (error) {}
    if (tmp !== ''){
        return(
            <View><Text style={styles.date}>{message.item.sendAt}</Text>
                <View style={[
                    styles.defaultMessage, 
                    message.item.user=="sender"?styles.senderMessage:styles.receiverMessage
                    ]}>
                    {tmp}
                </View>
            </View>
        );
    }
    else {
        return ( <View/> );
    }
};


const Messaging = ({navigation}) => {
    return (
        <View style={styles.globalView}>
            <View style={styles.scrollingView}>
                <FlatList
                    //contentContainerStyle={{ flexDirection: 'column-reverse' }}
                    //inverted = {true}
                    data = {chatData}
                    extraData = {chatData}
                    keyExtractor = { (item,id) => id}
                    maxToRenderPerBatch = {8}
                    removeClippedSubviews = {true}
                    ListEmptyComponent={<Text style={styles.welcomeText}>
                    Welcome! Write a message by choosing texts that best describe your current situation. 
                    Bluetooth must be activated. Messages history is cleaned up by each new day.
                    </Text>}
                    renderItem = {((item)=>{return (
                    <View>
                    <ChatMessage message={item}/>
                    </View>
                    );})}
                />
            </View>
            <View style={styles.bottomView}>
            <Button title="Describe your situation" onPress={()=>navigation.navigate("Situations")}/>
            </View>
        </View>
    );
};

const styles=StyleSheet.create({
    globalView:{
        flex:1,
        justifyContent: 'center',
        backgroundColor: Colors.grey
    },

    bottomView:{
        flex: 0.1
    },

    scrollingView:{
        flex: 0.9,
        paddingHorizontal: 10,
    },

    defaultMessage:{
        padding: 10,
        marginTop: 10,
        marginBottom: 10,
        widght: "80%",
        borderRadius: 10,
        alignItems: 'center',
    },

    senderMessage:{
        alignSelf: 'flex-end',
        justifyContent: 'flex-end',
        backgroundColor: Colors.white,
    },
    receiverMessage:{
        alignSelf: 'flex-start',
        justifyContent: 'flex-start',
        backgroundColor: Colors.light,
    },
    text:{
        right: 0,
        color: Colors.grey,
        fontWeight: 'bold',
        textAlign: 'right',
        alignSelf: 'flex-end',
    },

    welcomeText:{
        color: Colors.black,
        textAlign: 'center',
        marginTop: 10,
    },

    date:{
        marginTop: 20,
        fontSize: 10,
        textAlign: 'center',
    }
});

export default Messaging;