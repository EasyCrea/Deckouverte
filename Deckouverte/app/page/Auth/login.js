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
import { loginCreateur } from "../../components/Auth";
import { useRouter } from "expo-router";

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
      <View style={styles.container}>
        <Text style={styles.title}>Page Connexion</Text>
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
              styles.button,
              loading && styles.buttonDisabled,
              pressed && styles.buttonPressed,
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
        <View style={styles.footerSection}>
          <Pressable
            onPress={() =>
              router.push({
                pathname: "/page/Auth/userconnexion",
                params: { page: "register" },
              })
            }
          >
            <Text style={{ color: "blue" }}>
              Pas encore de compte ? Inscrivez-vous
            </Text>
          </Pressable>
          <Pressable
            onPress={() =>
              router.push({
                pathname: "/",
              })
            }
          >
            <Text style={{ color: "blue" }}>Retour à la page d'accueil</Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f8f7ff',
  },
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "space-between",
    alignItems: "center",
  },
  footerSection: {
    alignItems: "center",
    marginBottom: 20,
  },
  title: {
    fontSize: 45,
    color: "#7C2EE0",
    fontWeight: "bold",
    marginBottom: 20,
  },
  formSection: {
    width: "100%",
    padding: 10,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
    color: "#333333",
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
    borderColor: "#E0E0E0",
  },
  error: {
    color: "#FF4D4D",
    fontSize: 14,
    textAlign: "center",
    marginBottom: 20,
  },
  button: {
    backgroundColor: "#5B3ADD",
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 16,
    alignItems: "center",
    marginTop: 10,
  },
  buttonDisabled: {
    backgroundColor: "#A8A8A8",
  },
  buttonPressed: {
    opacity: 0.8,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "600",
    letterSpacing: 0.5,
  },
});
