import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ActivityIndicator,
  StyleSheet,
  Dimensions,
} from "react-native";
import { useRouter } from "expo-router";
import Svg, {
  Text as SvgText,
  Defs,
  LinearGradient,
  Stop,
} from "react-native-svg";
import { Heart, Calendar, TrendingUp } from "lucide-react";
import API from "../fetch/API";
import { colors } from "../styles/colors";

export default function GetDeckById({ deckId }) {
  const router = useRouter();

  const [deck, setDeck] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await API.get(
          `/createur/deck/${deckId}`
        );
        const json = await response.data;
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
  }, [deckId]);

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color={colors.indigo500} />
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
    <View style={styles.container}>
      <View style={styles.cardContainer}>
        <Svg height="80" width="100%" viewBox="0 0 300 80">
          <Defs>
            <LinearGradient id="gradient" x1="0" y1="0" x2="1" y2="0">
              <Stop offset="0" stopColor={colors.indigo500} stopOpacity="1" />
              <Stop offset="1" stopColor={colors.purple500} stopOpacity="1" />
            </LinearGradient>
          </Defs>
          <SvgText
            fill="url(#gradient)"
            fontSize="32"
            fontWeight="800"
            x="150"
            y="50"
            textAnchor="middle"
          >
            {deck.deck.titre_deck}
          </SvgText>
        </Svg>

        <View style={styles.detailsContainer}>
          <View style={styles.dateSection}>
            <Calendar size={24} color={colors.gray600} />
            <View>
              <Text style={styles.dateSectionTitle}>Période</Text>
              <Text style={styles.date_deck}>
                Du{" "}
                {new Date(deck.deck.date_debut_deck).toLocaleDateString(
                  "fr-FR",
                  {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  }
                )}
              </Text>
              <Text style={styles.date_deck}>
                Au{" "}
                {new Date(deck.deck.date_fin_deck).toLocaleDateString("fr-FR", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                })}
              </Text>
            </View>
          </View>

          <View style={styles.likeSection}>
            <Heart size={24} color={colors.red500} />
            <View>
              <Text style={styles.likeSectionTitle}>Popularité</Text>
              <Text style={styles.like_deck}>{deck.deck.nb_jaime} Likes</Text>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
}

const { width } = Dimensions.get("window");

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    backgroundColor: colors.gray50,
    paddingTop: 20,
    fontFamily: "arial",
  },
  cardContainer: {
    width: width * 0.9,
    backgroundColor: "white",
    borderRadius: 16,
    shadowColor: colors.indigo300,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
    overflow: "hidden",
  },
  detailsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: colors.gray200,
  },
  dateSection: {
    flexDirection: "row",
    alignItems: "center",
    gap: 15,
  },
  likeSection: {
    flexDirection: "row",
    alignItems: "center",
    gap: 15,
  },
  dateSectionTitle: {
    fontSize: 14,
    color: colors.gray700,
    fontWeight: "600",
  },
  likeSectionTitle: {
    fontSize: 14,
    color: colors.gray700,
    fontWeight: "600",
  },
  date_deck: {
    fontSize: 13,
    color: colors.gray600,
    fontStyle: "italic",
  },
  like_deck: {
    fontSize: 16,
    fontWeight: "bold",
    color: colors.red500,
  },
  errorText: {
    color: colors.danger,
    fontSize: 16,
    textAlign: "center",
  },
  emptyStateText: {
    fontSize: 16,
    color: colors.gray500,
    textAlign: "center",
  },
});
