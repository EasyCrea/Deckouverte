// historique.js
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { GameHistory } from '../Fetch/GameHistory'; 

export default function HistoriqueScreen() {
    const { user_id, deck_id } = useLocalSearchParams();  // Récupérer les paramètres de l'URL (user_id et deck_id)
  
    console.log("user_id", user_id);
    console.log("deck_id", deck_id);
  
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Historique des Jeux</Text>
        {user_id && deck_id ? (
          <GameHistory userId={user_id} deckId={deck_id} />  // Passer les IDs à GameHistory pour afficher l'historique
        ) : (
          <Text style={styles.errorText}>L'ID du créateur ou du deck est manquant.</Text>
        )}
      </View>
    );
  }
  
  const styles = StyleSheet.create({
    container: {
      padding: 20,
    },
    title: {
      fontSize: 18,
      fontWeight: "bold",
      marginBottom: 10,
    },
    errorText: {
      color: "red",
      fontSize: 16,
    },
  });
  