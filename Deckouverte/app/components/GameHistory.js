import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ActivityIndicator,
  StyleSheet,
  Pressable,
} from "react-native";
import { Coins, Users, Trash2 } from "lucide-react";
import  buttonStyles  from "../styles/buttons.js";
import  colors  from "../styles/colors.js";
import HistoriqueService from "../fetch/Historique";

export default function GameHistory({ userId, deckId }) {
  const [gameHistory, setGameHistory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchGameHistory = async () => {
      try {
        const reponse = await HistoriqueService.RecupererHistorique(userId, deckId);
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
      await HistoriqueService.DeleteHistorique(id);
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
          <View style={styles.headerContainer}>
            <Text style={styles.textIndicator}>{index + 1}</Text>
            <Text style={styles.dateText}>
              {new Date(historyItem.game_date).toLocaleDateString("fr-FR", {
                day: "2-digit",
                month: "long",
                year: "numeric",
              })}
            </Text>
            <Text style={styles.turnText}>{historyItem.turn_count} tours</Text>
          </View>

          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <View style={styles.indicatorsContainer}>
                <Users size={20} color="black" />
                <Text style={styles.statLabel}>Population finale</Text>
              </View>
              <View style={styles.scoreContainer}>
                <Text style={styles.statValue}>{historyItem.final_people}</Text>
              </View>
            </View>

            <View style={styles.statItem}>
              <View style={styles.indicatorsContainer}>
                <Coins size={20} color="black" />
                <Text style={styles.statLabel}>Trésorerie  finale</Text>
              </View>
              <View style={styles.scoreContainer}>
                <Text style={styles.statValue}>
                  {historyItem.final_treasury}
                </Text>
              </View>
            </View>
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
              buttonStyles.btn,
              buttonStyles.btnDelete,
              styles.deleteButton,
              pressed && buttonStyles.btnPressed,
            ]}
            onPress={() => Deletehistory(historyItem.id)}
          >
            <Trash2 size={20} color="#9825e2" style={styles.deleteIcon} />
            <Text style={[buttonStyles.btnDeleteText, styles.deleteButtonText]}>
              Supprimer
            </Text>
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
    backgroundColor: colors.gray50,
  },
  historyItem: {
    backgroundColor: "white",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.indigo300,
    shadowColor: colors.indigo300,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    padding: 20,
    marginBottom: 15,
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray200,
  },
  textIndicator: {
    fontSize: 18,
    fontWeight: "bold",
    color: colors.purple600,
  },
  indicatorsContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  dateText: {
    fontSize: 14,
    color: colors.gray600,
  },
  turnText: {
    fontSize: 14,
    color: colors.gray600,
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 15,
  },
  statItem: {
    flexDirection: "column",
    alignItems: "center",
    justifyContent:"space-between",
    flex: 1,
  },
  statTextContainer: {
    marginLeft: 10,
  },
  statLabel: {
    fontSize: 14,
    color: colors.gray700,
    fontWeight: "600",
  },
  statValue: {
    fontSize: 16,
    color: colors.indigo700,
    fontWeight: "bold",
  },
  textwin: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  victoryText: {
    color: colors.success,
    backgroundColor: colors.successBackground,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    fontSize: 14,
    fontWeight: "600",
  },
  defeatText: {
    color: colors.danger,
    backgroundColor: colors.dangerBackground,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    fontSize: 14,
    fontWeight: "600",
  },
  deleteButton: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 15,
  },
  deleteIcon: {
    marginRight: 8,
  },
  deleteButtonText: {
    textAlign: "center",
  },
});
