import React, { useState, useEffect } from "react";
import { View, Text, ActivityIndicator, StyleSheet, Pressable } from "react-native";
import {RecupererHistorique, DeleteHistorique} from "../fetch/Historique";


export default function GameHistory({ userId, deckId }) {
 
  const [gameHistory, setGameHistory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchGameHistory = async () => {
      try {
        const reponse = await RecupererHistorique(userId, deckId);
        setGameHistory(reponse.game_history);
        setLoading(false); // N'oubliez pas de mettre loading à false en cas de succès
      } catch (error) {
        setError(error);
        setLoading(false);
      }
    };
  
    // Appeler la fonction
    fetchGameHistory();
   
  }, [userId, deckId]);

  const Deletehistory = async (id) => {
    try {
      await DeleteHistorique(id);
      // Mettre à jour l'état en filtrant l'élément supprimé
      setGameHistory(prevHistory => 
        prevHistory.filter(item => item.id !== id)
      );
    } catch (error) {
      setError(error);
    }
  };

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
      {gameHistory.map((historyItem, index) => (
        <View key={index} style={styles.historyItem}>
          <Text style={styles.textIndicator}>{index + 1}</Text>
          <Text style={styles.text}>
            {" "}
            {new Date(historyItem.game_date).toLocaleDateString("fr-FR", {
              day: "2-digit",
              month: "long",
              year: "numeric",
            })}
          </Text>
          <Text style={styles.text}>
            {historyItem.turn_count} tours
          </Text>
          <View style={styles.stats}>
            <Text style={styles.statstext}>
              <Text style={{fontWeight: "bold"}}>Population finale:</Text><Text> {historyItem.final_people}</Text>
            </Text>
            <Text style={styles.statstext}>
              <Text style={{fontWeight: "bold"}}>Trésorerie finale:</Text><Text>{historyItem.final_treasury}</Text> 
            </Text>
          </View>
          <Text style={styles.textwin}>
            {historyItem.is_winner ? "Victoire" : "Défaite"}
          </Text>
          <Pressable onPress={() => Deletehistory(historyItem.id)}>
            <Text style={{color: "red"}}>Supprimer</Text>
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
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
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
  textwin: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#5B3ADD",
  },
});
