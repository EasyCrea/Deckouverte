import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ActivityIndicator,
  StyleSheet,
  Pressable,
} from "react-native";
import { buttonStyles } from "../styles/buttons.js";
import { RecupererHistorique, DeleteHistorique } from "../fetch/Historique";

export default function GameHistory({ userId, deckId }) {
  const [gameHistory, setGameHistory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchGameHistory = async () => {
      try {
        const reponse = await RecupererHistorique(userId, deckId);
        setGameHistory(reponse.game_history);
        setLoading(false);
      } catch (error) {
        setError(error);
        setLoading(false);
      }
    };

    fetchGameHistory();
  }, [userId, deckId]);

  const Deletehistory = async (id) => {
    try {
      await DeleteHistorique(id);
      setGameHistory((prevHistory) =>
        prevHistory.filter((item) => item.id !== id)
      );
    } catch (error) {
      setError(error);
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#5B3ADD" />
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
      {gameHistory.map((historyItem, index) => (
        <View key={index} style={styles.historyItem}>
          <Text style={styles.textIndicator}>{index + 1}</Text>
          <Text style={styles.text}>
            {new Date(historyItem.game_date).toLocaleDateString("fr-FR", {
              day: "2-digit",
              month: "long",
              year: "numeric",
            })}
          </Text>
          <Text style={styles.text}>{historyItem.turn_count} tours</Text>
          <View style={styles.stats}>
            <Text style={styles.statstext}>
              <Text style={styles.statsBold}>Population finale: </Text>
              <Text>{historyItem.final_people}</Text>
            </Text>
            <Text style={styles.statstext}>
              <Text style={styles.statsBold}>Trésorerie finale: </Text>
              <Text>{historyItem.final_treasury}</Text>
            </Text>
          </View>
          <Text
            style={[
              styles.textwin,
              historyItem.is_winner ? styles.victoryText : styles.defeatText,
            ]}
          >
            {historyItem.is_winner ? "Victoire" : "Défaite"}
          </Text>
          <Pressable
            style={({ pressed }) => [
              styles.btn,
              styles.btnDelete,
              pressed && styles.btnPressed,
            ]}
            onPress={() => Deletehistory(historyItem.id)}
          >
            <Text style={styles.btnText}>Supprimer</Text>
          </Pressable>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    width: "100%",
  },
  historyItem: {
    alignItems: "center",
    marginBottom: 15,
    padding: 20,
    borderWidth: 1,
    borderColor: "#5B3ADD",
    borderRadius: 5,
  },
  text: {
    fontSize: 16,
    marginBottom: 5,
  },
  textIndicator: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#5B3ADD",
    marginBottom: 5,
  },
  stats: {
    flexDirection: "row",
    gap: 15,
  },
  statstext: {
    fontSize: 16,
    marginBottom: 5,
  },
  statsBold: {
    fontWeight: "bold",
  },
  errorText: {
    color: "red",
    fontSize: 16,
  },
  emptyStateText: {
    fontSize: 16,
    color: "gray",
  },
  textwin: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
  },
  victoryText: {
    color: "#4CAF50",
  },
  defeatText: {
    color: "#F44336",
  },
  // Styles de bouton
  btn: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    elevation: 2, // Pour Android
    shadowColor: "#000", // Pour iOS
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  btnDelete: {
    backgroundColor: "#FFF1F0", // Couleur de fond rose clair
    borderWidth: 1,
    borderColor: "#FF4D4F",
  },
  btnPressed: {
    opacity: 0.7,
  },
  btnText: {
    color: "#FF4D4F", // Rouge pour le texte du bouton supprimer
    fontSize: 14,
    fontWeight: "600",
    textAlign: "center",
  },
});
