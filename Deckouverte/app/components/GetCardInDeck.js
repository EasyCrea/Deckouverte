import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import { useRouter } from "expo-router";
import { getParticipants } from "../fetch/Deck";

export default function GetCardInDeck({ deckId }) {
  const router = useRouter();

  const [cards, setCards] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getParticipants(deckId);
        setCards(response);
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

  return (
    <View style={styles.container}>
      <Text style={styles.titre}>Créateur ayant participer aux decks :</Text>
      <View style={styles.cards}>
      {cards.createurs.map((card, index) => (
        <View key={index} style={styles.card}>
          <Text style={styles.cardText}>{card.nom_createur}</Text>
        </View>
      ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  titre: {
    fontSize: 20,
    marginVertical: 10,
    fontWeight: "bold",
    textAlign: "center",
  },
  cards: {
    flexDirection: "row",
    justifyContent: "center",
    flexWrap: "wrap",
  },
  card: {
    borderColor: "#5B3ADD",
    borderWidth: 2,
    padding: 20,
    margin: 5,
    borderRadius: 5,
  },
  cardText: {
    color: "#5B3ADD",
    fontWeight: "bold",

  },
});
