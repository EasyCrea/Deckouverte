import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  ActivityIndicator,
  StyleSheet,
  Pressable,
  TextInput,
  FlatList,
  useWindowDimensions,
} from "react-native";
import { useRouter } from "expo-router";
import API from "../components/API";
import { validateToken } from "../components/Auth";

export function Getdeck() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const [deck, setDeck] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [idCreateur, setIdCreateur] = useState(null);

  // Calculer le nombre de colonnes en fonction de la largeur de l'écran
  const numColumns = Math.max(1, Math.floor(width / 320));
  const listKey = `list-${numColumns}`;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const serverResponse = await validateToken();
        const id_createur = serverResponse.decoded.id;
        setIdCreateur(id_createur); // Stocker l'id_createur dans un état
        const response = await API.get("http://localhost:8000/createur");
        setDeck(response.data);
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

  const filteredDecks = deck?.decks.filter((item) =>
    item.titre_deck.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Memoize renderCard pour optimiser les performances
  const renderCard = useCallback(
    ({ item }) => (
      <Pressable
        style={[styles.card, { width: width / numColumns - 20 }]}
        onPress={() => router.push(`/page/jeu?id=${item.id_deck}`)}
      >
        <View style={styles.cardContent}>
          <View style={styles.cardHeader}>
            <View style={styles.cardIcon}>
              <Text style={styles.cardIconText}>
                {item.titre_deck[0]?.toUpperCase()}
              </Text>
            </View>
            <View style={styles.cardBadge}>
              <Text style={styles.cardCount}>{item.nb_cartes} cartes</Text>
            </View>
          </View>

          <Text style={styles.cardTitle} numberOfLines={2}>
            {item.titre_deck}
          </Text>

          <View style={styles.dateContainer}>
            <Text style={styles.dateText}>Du {item.date_debut_deck}</Text>
            <Text style={styles.dateText}>au {item.date_fin_deck}</Text>
          </View>

          <Pressable
            style={styles.detailsButton}
            onPress={() =>
              router.push(`/page/details?id=${item.id_deck}`)
            }
          >
            <Text style={styles.detailsButtonText}>Voir les détails →</Text>
          </Pressable>

          <Pressable
            style={styles.detailsButton}
            onPress={() =>
              router.push(`/page/historique?user_id=${idCreateur}&deck_id=${item.id_deck}`)
            }
          >
            <Text style={styles.detailsButtonText}>Voir l'historique →</Text>
          </Pressable>
        </View>
      </Pressable>
    ),
    [numColumns, width, idCreateur] // Inclure idCreateur dans les dépendances
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#312E81" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>
          {error?.message || "Une erreur inconnue est survenue"}
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Deckouverte</Text>

      <View style={styles.searchContainer}>
        <Text style={styles.searchIcon}>🔍</Text>
        <TextInput
          style={styles.searchInput}
          placeholder="Rechercher un deck..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholderTextColor="#9CA3AF"
        />
      </View>

      <FlatList
        key={listKey}
        data={filteredDecks}
        renderItem={renderCard}
        keyExtractor={(item) => item.id_deck.toString()}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        numColumns={numColumns}
        columnWrapperStyle={numColumns > 1 ? styles.row : undefined}
        ListEmptyComponent={
          <Text style={styles.emptyText}>Aucun deck trouvé</Text>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E2E8F0',
    padding: 12,
  },
  row: {
    flex: 1,
    justifyContent: 'space-around',
    marginBottom: 12,
  },
  title: {
    fontSize: 40,
    fontWeight: '800',
    color: '#9333ea',
    textAlign: 'center',
    marginVertical: 16,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 12,
    marginBottom: 16,
    height: 44,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  searchIcon: {
    marginRight: 8,
    fontSize: 16,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#1F2937',
    height: '100%',
  },
  listContainer: {
    paddingVertical: 8,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  cardContent: {
    padding: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  cardIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#312E81',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardIconText: {
    fontSize: 22,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  cardBadge: {
    backgroundColor: '#6366f1',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
  },
  cardCount: {
    fontSize: 14,
    color: '#FFFFFF',
    fontWeight: '500',
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 8,
    lineHeight: 24,
  },
  dateContainer: {
    marginBottom: 16,
  },
  dateText: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 2,
  },
  detailsButton: {
    backgroundColor: '#312E81',
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: 'center',
  },
  detailsButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '500',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    color: '#DC2626',
    fontSize: 16,
    textAlign: 'center',
  },
  emptyText: {
    textAlign: 'center',
    color: '#6B7280',
    fontSize: 16,
    marginTop: 32,
  },
});
