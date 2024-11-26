import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Getdeck } from '../Fetch/Getdeck';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { validateToken } from "../components/Auth";
import { useEffect } from 'react';

export default function home(){

    useEffect(() => {
        const token = async () => { 
            try  {
                const serverResponse = await validateToken();
                console.log(serverResponse.decoded.email);
                const tokenweb = await AsyncStorage.getItem('token');
                console.log(tokenweb);
            }
            catch (err) {
                console.error(err);
            }
        }
        token();

      }
      , []);
      

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Bienvenue à la page d'accueil</Text>
            <Getdeck />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5FCFF',
    },
    title: {
        fontSize: 20,
        textAlign: 'center',
        margin: 10,
    },
});
