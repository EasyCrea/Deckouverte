import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Getdeck } from '../Fetch/Getdeck';
import { useRouter } from 'expo-router';
import { Secure } from '../components/Secure';

export default function home(){
    const router = useRouter();
    Secure();

   

    return (
        <View style={styles.container}>
            <Getdeck />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8f7ff',
    },
});
