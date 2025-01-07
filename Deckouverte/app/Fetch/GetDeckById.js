import React, { useState, useEffect } from "react";
import { View, Text, ActivityIndicator, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import API from "../components/API";

export default function GetDeckById({ deckId }) {
  const router = useRouter();

  const [deck, setDeck] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await API.get(
          `http://localhost:8000/createur/deck/${deckId}`
        );
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

  return (
    <View style={styles.container}>
      <Text style={styles.Titre_deck}>{deck.deck.titre_deck}</Text>
      <View style={styles.date}>
        <Text style={styles.date_deck}>
          Début :{" "}
          {new Date(deck.deck.date_debut_deck).toLocaleDateString("fr-FR", {
            day: "2-digit",
            month: "long",
            year: "numeric",
          })}
        </Text>
        <Text style={styles.date_deck}>
          Fin :{" "}
          {new Date(deck.deck.date_fin_deck).toLocaleDateString("fr-FR", {
            day: "2-digit",
            month: "long",
            year: "numeric",
          })}
        </Text>
      </View>
      <Text style={styles.like_deck}>Like : {deck.deck.nb_jaime}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
  },
  Titre_deck: {
    fontSize: 40,
    fontWeight: "bold",
    color: "#9333ea",
    width: "100%",
    textAlign: "center",
  },
  date: {
    marginTop: 10,
    marginBottom: 10,
    flexDirection: "row",
    gap: 10,
    justifyContent: "space-around",
  },
  date_deck: {
    fontSize: 14,
    color: "#6B7280",
    marginBottom: 2,
    fontStyle: "italic",
  },
  like_deck: {
    fontSize: 20,
    fontWeight: "bold",
  },
});
