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
import { FontAwesome } from "@expo/vector-icons";
import  buttonStyles  from "../styles/buttons";
import  colors  from "../styles/colors";
import GetDeckById from "../components/GetDeckById";
import GetCardInDeck from "../components/GetCardInDeck";
import { Heart } from "lucide-react-native";
import LikeService from "../fetch/Like";
import AuthService from "../fetch/Auth";
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
      const serverResponse = await AuthService.validateToken();
      if (!serverResponse) {
        setConnect(false);
        return;
      }

      const id_createur = serverResponse.decoded.id;
      if (!liked) {
        await LikeService.AjoutLike(id, id_createur);
        setLiked(true);
      } else {
        await LikeService.DeleteLike(id, id_createur);
        setLiked(false);
      }
    } catch (error) {
      console.error(error);
      setError("Failed to add like");
    } finally {
      setLoading(false);
    }
  };

  const checkConnectionAndLike = async () => {
    try {
      const serverResponse = await AuthService.validateToken();
      if (serverResponse) {
        setConnect(true);
        const id_createur = serverResponse.decoded.id;
        const userLike = await LikeService.RecupererLike(id, id_createur);
        if (userLike.status === "success") {
          setLiked(true);
        }
      }
    } catch (error) {
      console.error(error);
      setConnect(false);
    }
  };

  useEffect(() => {
    checkConnectionAndLike();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <GetDeckById deckId={id} />
      
      <GetCardInDeck deckId={id} />
      {connect && (
        <>
        <TouchableOpacity
          onPress={confirmLike}
          style={styles.likeContainer}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator size="small" color="#5B3ADD" />
          ) : (
            <Heart
              color={liked ? "red" : colors.indigo700}
              fill={liked ? "red" : "none"}
              size={30}
            />
          )}
          {liked && 
            <Text style={{fontSize: 15 }}>Vous avez liké le deck</Text>
          }
        </TouchableOpacity>

        </>
      )}
      <View style={styles.btnBackbox}>
        <Pressable
          style={[buttonStyles.btnBack, styles.button]}
          onPress={() => router.back()}
        >
          <FontAwesome name="arrow-left" size={18} color="#333333" />
        </Pressable>
      </View>
      {error && <Text style={styles.errorText}>{error}</Text>}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f7ff",
    alignItems: "center",
    justifyContent: "space-between",
  },
  button: {
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 16,
    marginBottom: 16,
    marginTop: 20,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    textAlign: "center",
  },
  likeContainer: {
    marginTop: 20,
    alignItems: "center",
  },
  btnBackbox: {
    width: "80%",
  },
});
