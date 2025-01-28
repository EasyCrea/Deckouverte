import React from "react";
import {
  Text,
  StyleSheet,
  Pressable,
  SafeAreaView,
  ScrollView,
  View,
  Image,
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import Svg, {
  Text as SvgText,
  Defs,
  LinearGradient,
  Stop,
} from "react-native-svg";
import { buttonStyles } from "../styles/buttons";
import logoEasyCrea from "./../../assets/images/logo_easy_crea.png";
import { useLocalSearchParams } from "expo-router";
import GameHistory from "../components/GameHistory";
import { useRouter } from "expo-router";

export default function HistoriqueScreen() {
  const router = useRouter();

  const { user_id, deck_id } = useLocalSearchParams();

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Image source={logoEasyCrea} style={styles.logo} />
        <Svg height={80} width="auto" style={styles.titleContainer}>
          <Defs>
            <LinearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="0%">
              <Stop offset="0%" stopColor="#6366f1" stopOpacity="1" />
              <Stop offset="100%" stopColor="#9333ea" stopOpacity="1" />
            </LinearGradient>
          </Defs>
          <SvgText
            x="50%"
            y="50%"
            fill="url(#grad)"
            fontSize="40"
            fontWeight="800"
            textAnchor="middle"
          >
            Deckouverte
          </SvgText>
        </Svg>
        <View style={styles.btnBackbox}>
          <Pressable style={buttonStyles.btnBack} onPress={() => router.back()}>
            <FontAwesome name="arrow-left" size={18} color="#333333" />
          </Pressable>
        </View>
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
    fontFamily: "arial",
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
  btnBackbox: {
    width: "90%",
    alignItems: "flex-start",
    marginBottom: 10,
  },
  logo: {
    width: 60,
    height: 60,
    resizeMode: "contain",
    marginRight: 10,
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
