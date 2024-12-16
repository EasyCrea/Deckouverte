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

  if (!cards.createurs || cards.createurs.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.emptyStateText}>Aucune carte actuellement dans le deck</Text>
      </View>
    );
  }
  console.log(cards);

  return (
    <View>
      <Text>Créateur ayant participer aux decks</Text>
      {cards.createurs.map((card, index) => (
        <View key={index}>
          <Text>{card.nom_createur}</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({

});
