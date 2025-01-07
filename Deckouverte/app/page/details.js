import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import  GetDeckById  from "../Fetch/GetDeckById";
import  GetCardInDeck  from "../Fetch/GetCardInDeck";
import { Heart } from "lucide-react-native";
import { AjoutLike, RecupererLike, DeleteLike } from "../components/Auth";
import { validateToken } from "../components/Auth";
import { SafeAreaView } from "react-native-safe-area-context";

export default function GameScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [liked, setLiked] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [connect, setConnect] = useState(false);

  const confirmLike = async () => {
    setLoading(true);
    setError(null);
    try {
      const serverResponse = await validateToken();
      if (serverResponse) {
        setConnect(true);
      } else {
        const id_createur = serverResponse.decoded.id;
        if (!liked) {
          setLiked(true);
          await AjoutLike(id, id_createur);
        } else {
          setLiked(false);
          await DeleteLike(id, id_createur);
        }
      }
    } catch (error) {
      console.error(error);
      setError("Failed to add like");
      setLiked(false);
    } finally {
      setLoading(false);
    }
  };
  const clientLike = async () => {
    try {
      const serverResponse = await validateToken();
      const id_createur = serverResponse.decoded.id;
      const userLike = await RecupererLike(id, id_createur);
      if (userLike.status === "success") {
        setLiked(true);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    clientLike();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <GetDeckById deckId={id} />
      {connect &&(
        <TouchableOpacity onPress={confirmLike} style={styles.likeContainer}>
          <Heart
            color={liked ? "red" : "#5B3ADD"}
            fill={liked ? "red" : "none"}
            size={30}
          />
        </TouchableOpacity>
      )}

      <GetCardInDeck deckId={id} />
      <Pressable style={styles.button} onPress={() => router.back()}>
        <Text style={styles.buttonText}>Retour à la page des decks</Text>
      </Pressable>
      {error && <Text style={styles.errorText}>{error}</Text>}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f7ff",
    alignItems: "center",
  },
  button: {
    backgroundColor: "#5B3ADD",
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 16,
    marginBottom: 16,
    marginTop: 20,
    width: "80%",
    maxWidth: 300,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    textAlign: "center",
  },
  likeContainer: {
    marginTop: 20,
  },
});
