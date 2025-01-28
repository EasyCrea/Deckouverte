import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  ActivityIndicator,
  StyleSheet,
  SafeAreaView,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { loginCreateur } from "../../fetch/Auth";
import { useRouter } from "expo-router";
import { buttonStyles } from "../../styles/buttons";
import { FontAwesome } from '@expo/vector-icons';
import { colors } from "../../styles/colors";

import Svg, {
  Text as SvgText,
  Defs,
  LinearGradient,
  Stop,
} from "react-native-svg";

export function Login() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      setError("Veuillez remplir tous les champs.");
      return;
    }

    setError("");
    setLoading(true);

    try {
      const data = await loginCreateur(email, password);
      await AsyncStorage.setItem("token", data.token);
      console.log("Connecté avec succès !");
      router.push("/page/home");
    } catch (err) {
      setError(err.response?.data?.message || "Erreur de connexion.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.title}>
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
          Connexion
        </SvgText>
      </Svg>
      </View>
      <View style={styles.btnBackbox}>
      <Pressable 
        style={buttonStyles.btnBack}
        onPress={() => router.back()}
      >
        <FontAwesome name="arrow-left" size={18} color="#333333" />
      </Pressable>
      </View>

      <View style={styles.formSection}>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            placeholder="Votre email"
            placeholderTextColor="#666666"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            required
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Mot de passe</Text>
          <TextInput
            style={styles.input}
            placeholder="Votre mot de passe"
            placeholderTextColor="#666666"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            required
          />
        </View>

        {error ? <Text style={styles.error}>{error}</Text> : null}

        <Pressable
          style={({ pressed }) => [
            buttonStyles.btn,
            buttonStyles.btnFilled,
            buttonStyles.btnText,
            pressed && buttonStyles.btnFilledPressed,
            loading && buttonStyles.buttonDisabled,
          ]}
          onPress={handleLogin}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={styles.buttonText}>Se connecter</Text>
          )}
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#f8f7ff",
    padding: 20,
    alignItems: "center",
    fontFamily: "arial",
  },
  title: {
    marginBottom: 40,
    marginTop: 30,
  },
  btnBackbox: {
    marginBottom: 20,
    width: "80%",
    alignItems: "flex-start",
  },

  formSection: {
    justifyContent: "center",
    width: "80%",
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
    color: colors.indigo700,
    paddingLeft: 4,
  },
  input: {
    backgroundColor: "#FFFFFF",
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 16,
    fontSize: 16,
    color: "#333333",
    borderWidth: 1,
    borderColor: colors.indigo200,
  },
  error: {
    color: "#FF4D4D",
    fontSize: 14,
    textAlign: "center",
    marginBottom: 20,
  },

  buttonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "600",
    letterSpacing: 0.5,
  },
});
