import React, {useState} from 'react';
import {View, Text, Button, Switch, StyleSheet} from 'react-native';
import Colors from "../assets/colors/colors";

const Permissions = ({navigation}) => {
    const [isBluetoothEnabled, setIsBluetoothEnabled] = useState(false); //Bluetooth
    const [isGeolocationEnabled, setGeolocationIsEnabled] = useState(false); //Geolocation
    const [allActive, setAllActive] = useState(false);

    const toggleBluetoothSwitch = () =>{
        setIsBluetoothEnabled(previousState => !previousState)
        setAllActive(isGeolocationEnabled && !isBluetoothEnabled);
    }

    const toggleGeolocationSwitch = () =>{
        setGeolocationIsEnabled(previousState => !previousState)
        setAllActive(isBluetoothEnabled && !isGeolocationEnabled);
    }

    return (
        <View style={styles.defaultView}>
            <View style={styles.centerView}>
                <Text style={styles.font}>Activate Bluetooth</Text>
                <Switch title="Bluetooth"
                    trackColor={styles.trackColor}
                    thumbColor={Colors.white}
                    onValueChange={toggleBluetoothSwitch}
                    value={isBluetoothEnabled}
                />
            </View>
            <View style={styles.centerView}>
                <Text style={styles.font}>Activate Geolocation</Text>
                <Switch title="Geolocation"
                    trackColor={styles.trackColor}
                    thumbColor={Colors.white}
                    onValueChange={toggleGeolocationSwitch}
                    value={isGeolocationEnabled}
                />
            </View>
            <Button title="Next"
            onPress={()=>navigation.navigate("Messaging")}
            disabled={!allActive}
            />
        </View>
    );
};


const styles = StyleSheet.create({
    defaultView: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'space-around',
        paddingHorizontal:50,
    },
    centerView:{
        alignItems: 'center'
    },
    font: {
        fontSize: 20
    },
    trackColor: {
        false: Colors.light, 
        true: Colors.grey
    }

});

export default Permissions;