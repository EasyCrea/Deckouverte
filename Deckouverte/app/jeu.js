
import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import GetCard from './components/Getcard';

export default function GameScreen() {
  const { id } = useLocalSearchParams(); // Récupère l'id du deck
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Écran de Jeu</Text>
      <Pressable 
        style={styles.button} 
        onPress={() => router.back()}
      >
        <Text style={styles.buttonText}>Retour à l'accueil</Text>
      </Pressable>
      <Text>Deck id : {id}</Text>

      {}
      <GetCard deckId={id} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#007bff',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginBottom: 20,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
  },
});
