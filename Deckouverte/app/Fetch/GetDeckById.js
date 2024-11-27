import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ActivityIndicator,
  StyleSheet,
  Pressable,
} from "react-native";
import { useRouter } from "expo-router";
import API from "../components/API";

export function GetDeckById({ deckId }) {
  const router = useRouter();

  const [deck, setDeck] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await API.get(`http://localhost:8000/createur/deck/${deckId}`);
        const json = await response.data;
        setDeck(json);
      } catch (error) {
        setError({
          message: error?.message || "Une erreur est survenue",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>
          Erreur: {error?.message || "Une erreur inconnue est survenue"}
        </Text>
      </View>
    );
  }

  if (!deck) {
    return (
      <View style={styles.container}>
        <Text style={styles.emptyStateText}>Aucune donnée disponible</Text>
      </View>
    );
  }
  console.log(deck);

  return (
    <View style={styles.main}>
        <Text style={styles.title}>Nous sommes dans le deck {deck.deck.titre_deck}</Text>


    </View>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 50,
    fontWeight: "bold",
    marginBottom: 20,
  },
  container:{
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#c2c2c2',
    marginBottom: 10,
    padding: 10,
    borderRadius: 10,
  },
  button:{
    color: 'blue',
  }

});
