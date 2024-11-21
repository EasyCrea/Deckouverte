import { useState, useEffect } from "react";
import {
  View,
  Text,
  ActivityIndicator,
  StyleSheet,
  Pressable,
} from "react-native";
import { useRouter } from "expo-router";

export function Getdeck() {
  const router = useRouter();

  const [deck, setDeck] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost:8000/createur");
        if (!response.ok) {
          throw new Error("Échec de la récupération des données");
        }
        const json = await response.json();
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
        <Text>
          Erreur: {error?.message || "Une erreur inconnue est survenue"}
        </Text>
      </View>
    );
  }

  if (!deck) {
    return (
      <View style={styles.container}>
        <Text>Aucune donnée disponible</Text>
      </View>
    );
  }

  return (
    <View>
      <Text style={styles.title}>Decks récupérés</Text>
      {deck.decks.map((item, index) => (
        <Pressable key={item.id || index} style={styles.button} onPress={() => router.push(`/jeu?id=${item.id_deck}`)}>
          <View key={index} style={styles.card}>
            <Text style={styles.texte}>Le titre : {item.titre_deck}</Text>
            <Text>le début : {item.date_debut_deck}</Text>
            <Text>la fin : {item.date_fin_deck}</Text>
            <Text>Nombre de cartes : {item.nb_cartes}</Text>
          </View>
        </Pressable>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  card: {
    backgroundColor: "lightblue",
    padding: 10,
    marginBottom: 10,
  },
});
