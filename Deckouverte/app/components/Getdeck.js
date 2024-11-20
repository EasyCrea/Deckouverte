import { useState, useEffect } from 'react';
import { View, Text, ActivityIndicator, StyleSheet, ScrollView } from 'react-native';

export function Getdeck() {
  const [deck, setDeck] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:8000/createur');
        if (!response.ok) {
          throw new Error('Échec de la récupération des données');
        }
        const json = await response.json();
        setDeck(json);
      } catch (error) {
        setError({
          message: error?.message || 'Une erreur est survenue'
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
        <Text>Erreur: {error?.message || 'Une erreur inconnue est survenue'}</Text>
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
      <View key={index}>
        <Text>Le titre : {item.titre_deck}</Text>
        <Text>le début : {item.date_debut_deck}</Text>
      </View>
      
    ))}
    </View>

  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
});