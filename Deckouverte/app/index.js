import { Pressable, View, Text, StyleSheet, SafeAreaView } from "react-native";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect } from "react";

import Svg, {
  Text as SvgText,
  Defs,
  LinearGradient,
  Stop,
} from "react-native-svg";

export default function Index() {
  const router = useRouter();

  useEffect(() => {
    const clear = async () => {
      await AsyncStorage.removeItem("token");
    };
    clear();
  }, []);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.headerSection}>
          <Svg height="50" width="300" viewBox="0 0 300 50">
            <Defs>
              <LinearGradient id="gradient" x1="0" y1="0" x2="1" y2="0">
                <Stop offset="0" stopColor="#6366f1" stopOpacity="1" />
                <Stop offset="1" stopColor="#9333ea" stopOpacity="1" />
              </LinearGradient>
            </Defs>
            <SvgText
              fill="url(#gradient)"
              fontSize="40"
              fontWeight="800"
              x="150"
              y="40"
              textAnchor="middle"
            >
              DeckOuverte
            </SvgText>
          </Svg>
          <Text style={styles.subtitle}>
            Le nouveau jeu mobile collaboratif
          </Text>
        </View>

        <View style={styles.buttonContainer}>
          <Pressable
            onPress={() =>
              router.push({
                pathname: "/page/Auth/userconnexion",
                params: { page: "connexion" },
              })
            }
            style={({ pressed }) => [
              styles.button,
              pressed && styles.buttonPressed,
            ]}
          >
            <Text style={styles.buttonText}>Connexion</Text>
          </Pressable>

          <Pressable
            onPress={() =>
              router.push({
                pathname: "/page/Auth/userconnexion",
                params: { page: "register" },
              })
            }
            style={({ pressed }) => [
              styles.button2,
              pressed && styles.button2Pressed,
            ]}
          >
            <Text style={styles.buttonText2}>Inscription</Text>
          </Pressable>
          <Pressable
            onPress={() =>
              router.push({
                pathname: "/page/home",
              })
            }
            style={({ pressed }) => [
              styles.button,
              pressed && styles.buttonPressed,
            ]}
          >
            <Text style={styles.buttonText}>Jouer sans connexion</Text>
          </Pressable>
        </View>

        <View style={styles.footerSection}>
          <Text style={styles.description}>
            2025 © DeckOuverte. Tous droits réservés.
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#f8f7ff",
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
    justifyContent: "space-between",
  },
  headerSection: {
    alignItems: "center",
    paddingTop: 40,
    fontFamily: "Arial",
  },
  buttonContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 20,
  },
  footerSection: {
    paddingBottom: 40,
  },
  subtitle: {
    fontSize: 16,
    textAlign: "center",
    letterSpacing: 0.5,
    color: "#000000",
  },
  description: {
    fontSize: 14,
    fontStyle: "italic",
    textAlign: "center",
    lineHeight: 20,
    color: "#666666",
    paddingHorizontal: 10,
  },
  button: {
    backgroundColor: "#5B3ADD",
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 16,
    marginBottom: 16,
    width: "100%",
    maxWidth: 300,
  },
  buttonPressed: {
    opacity: 0.8,
  },
  button2: {
    backgroundColor: "#F5F3FE",
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 16,
    marginBottom: 16,
    width: "100%",
    maxWidth: 300,
    borderWidth: 2,
    borderColor: "#5B3ADD",
  },
  button2Pressed: {
    backgroundColor: "#ECEAFE",
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 18,
    textAlign: "center",
    fontWeight: "600",
    letterSpacing: 0.5,
  },
  buttonText2: {
    color: "#5B3ADD",
    fontSize: 18,
    textAlign: "center",
    fontWeight: "600",
    letterSpacing: 0.5,
  },
});
