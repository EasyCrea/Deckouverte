import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Getdeck } from '../Fetch/Getdeck';

export default function home(){
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
