import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import { useRouter } from "expo-router";
import DeckService from "../fetch/Deck";
import  colors  from "../styles/colors";

export default function GetCardInDeck({ deckId }) {
  const router = useRouter();

  const [cards, setCards] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await DeckService.getParticipants(deckId);
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
        <Text style={styles.emptyStateText}>Aucune créateur actuellement dans le deck</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.titre}>Participants :</Text>
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
  container:{
    width: "90%",
    marginTop: 10,
    padding: 10,
    backgroundColor: "white",
    alignItems:"start",
    shadowColor: colors.indigo300,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
    overflow: "hidden",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.gray200,
  },
  titre: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
  },
  cards: {
    flexDirection: "row",
    justifyContent: "center",
    flexWrap: "wrap",
  },
  card: {
    borderColor: colors.indigo700,
    borderWidth: 2,
    padding: 20,
    margin: 5,
    borderRadius: 5,
  },
  cardText: {
    color: colors.indigo700,
    fontWeight: "bold",

  },
});
