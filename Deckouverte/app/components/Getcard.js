import React, { useState, useEffect } from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';

export default function GetCard({ deckId }) {
  const [cards, setCards] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCards = async () => {
      try {
        const response = await fetch(`http://localhost:8000/createur/deckCard/${deckId}`);
        if (!response.ok) {
          throw new Error("Échec de la récupération des données");
        }
        const json = await response.json();
        setCards(json.cards);
      } catch (error) {
        setError({ message: error.message || "Une erreur est survenue" });
      } finally {
        setLoading(false);
      }
    };

    fetchCards();
  }, [deckId]);

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
        <Text>Erreur: {error.message || "Une erreur inconnue est survenue"}</Text>
      </View>
    );
  }

  return (
    <View>
      {cards && cards.length > 0 ? (
        cards.map((card) => (
          <View key={card.id_carte} style={styles.card}>
            <Text style={styles.cardText}>Texte de la carte : {card.texte_carte}</Text>
            <Text>Valeur Choix 1 : {card.valeurs_choix1}</Text>
            <Text>Valeur Choix 2 : {card.valeurs_choix2}</Text>
            <Text>Date de soumission : {card.date_soumission}</Text>
          </View>
        ))
      ) : (
        <Text>Aucune carte disponible pour ce deck.</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    backgroundColor: 'lightblue',
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
    width: '90%',
  },
  cardText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});
