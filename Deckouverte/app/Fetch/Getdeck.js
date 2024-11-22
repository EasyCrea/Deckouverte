import React, { useState, useEffect } from "react";
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
    <View style={styles.main}>
        <Text style={styles.title}>Bienvenue sur Deckouverte</Text>
        {deck.decks.map((item, index) => (
          <View key={item.id || index} style={styles.container}>
            <Pressable
              style={styles.button}
              onPress={() => router.push(`/jeu?id=${item.id_deck}`)}
            >
              <View style={styles.card}>
                <Text style={styles.texte}>Le titre : {item.titre_deck}</Text>
                <View style={styles.information}>
                  <Text style={styles.cardDetails}>
                    le début : {item.date_debut_deck}
                  </Text>
                  <Text style={styles.cardDetails}>
                    la fin : {item.date_fin_deck}
                  </Text>
                  <Text style={styles.cardDetails}>
                    Nombre de cartes : {item.nb_cartes}
                  </Text>
                </View>
              </View>
            </Pressable>
            <Pressable
              style={styles.button}
              onPress={() => router.push(`/details?id=${item.id_deck}`)}
            >
              <Text style={styles.button}>Détails</Text>
            </Pressable>
          </View>
        ))}
    </View>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 50,
    fontWeight: "bold",
    marginBottom: 20,
  },
  container:{
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#c2c2c2',
    marginBottom: 10,
    padding: 10,
    borderRadius: 10,
  },
  button:{
    color: 'blue',
  }

});
