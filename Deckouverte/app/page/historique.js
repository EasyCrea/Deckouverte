import React from "react";
import {
  Text,
  StyleSheet,
  Pressable,
  SafeAreaView,
  ScrollView,
} from "react-native";
import { useLocalSearchParams } from "expo-router";
import GameHistory from "../components/GameHistory";
import { useRouter } from "expo-router";

export default function HistoriqueScreen() {
  const router = useRouter();

  const { user_id, deck_id } = useLocalSearchParams();

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.title}>Historique des Jeux</Text>
        <Pressable style={styles.button} onPress={() => router.back()}>
          <Text style={styles.buttonText}>Retour</Text>
        </Pressable>
        {user_id && deck_id ? (
          <GameHistory userId={user_id} deckId={deck_id} />
        ) : (
          <Text style={styles.errorText}>
            L'ID du créateur ou du deck est manquant.
          </Text>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f7ff",
  },
  scrollContainer: {
    flexGrow: 1,
    alignItems: "center",
    padding: 12,
  },
  title: {
    fontSize: 40,
    fontWeight: "800",
    color: "#9333ea",
    textAlign: "center",
    marginVertical: 16,
  },
  button: {
    backgroundColor: "#5B3ADD",
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 16,
    marginBottom: 16,
    width: 200,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 14,
    textAlign: "center",
    fontWeight: "600",
    letterSpacing: 0.5,
  },
  errorText: {
    color: "red",
    fontSize: 16,
    marginTop: 20,
    textAlign: "center",
  },
});
