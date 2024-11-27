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

export function GetCardInDeck({ deckId }) {
  const router = useRouter();

  const [cards, setCards] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await API.get(`http://localhost:8000/createur/participants/${deckId}`);
        const json = await response.data;
        setCards(json);
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

  if (!cards) {
    return (
      <View style={styles.container}>
        <Text style={styles.emptyStateText}>Aucune donnée disponible</Text>
      </View>
    );
  }
  console.log(cards);

  return (
    <View style={styles.main}>
      <Text style={styles.title}>Cartes dans le deck</Text>
      {cards.createurs.map((card, index) => (
        <View key={index}>
          <Text style={styles.cardTitle}>{card.nom_createur}</Text>
        </View>
      ))}
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
