import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import { useRouter } from "expo-router";
import API from "../components/API";

export function GameHistory({ userId, deckId }) {
  const router = useRouter();

  const [gameHistory, setGameHistory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchGameHistory = async () => {
      try {
        const response = await API.get(
          `http://localhost:8000/gamehistory/${userId}/${deckId}`
        );
        const json = await response.data;
        setGameHistory(json.game_history);
      } catch (error) {
        setError({
          message: error?.message || "Une erreur est survenue",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchGameHistory();
  }, [userId, deckId]);

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

  if (!gameHistory || gameHistory.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.emptyStateText}>Aucun historique disponible</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Historique de jeu</Text>
      {gameHistory.map((historyItem, index) => (
        <View key={index} style={styles.historyItem}>
          <Text style={styles.text}>Date: {historyItem.game_date}</Text>
          <Text style={styles.text}>Nombre de tours: {historyItem.turn_count}</Text>
          <Text style={styles.text}>Population finale: {historyItem.final_people}</Text>
          <Text style={styles.text}>Trésorerie finale: {historyItem.final_treasury}</Text>
          <Text style={styles.text}>
            {historyItem.is_winner ? "Victoire" : "Défaite"}
          </Text>
        </View>
      ))}
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
  historyItem: {
    marginBottom: 15,
    padding: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
  },
  text: {
    fontSize: 16,
    marginBottom: 5,
  },
  errorText: {
    color: "red",
    fontSize: 16,
  },
  emptyStateText: {
    fontSize: 16,
    color: "gray",
  },
});
