import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet } from "react-native";
import { Getdeck } from "../Fetch/Getdeck";
import { Secure } from "../components/Secure";
import { loginCreateur } from "../components/Auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useGlobalSearchParams } from "expo-router/build/hooks";

export default function Home() {
    const { user } = useGlobalSearchParams();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
  
    useEffect(() => {
        handleLogin();
    }, []);
  
    const handleLogin = async () => {
      try {
        const email = "user@user.fr";
        const password = "FB85Q6z7Macp4i";
        const data = await loginCreateur(email, password);
        await AsyncStorage.setItem("token", data.token);
        setLoading(true);
      } catch (err) {
        setError(err.response?.data?.message || "Erreur de connexion.");
      }
    };
  
    return (
      <View style={styles.container}>
        {loading ? (
          <>
            <Secure />
            <Getdeck />
          </>
        ) : (
          <>
            <Text style={styles.title}>Page d'accueil</Text>
            <Text style={styles.error}>{error}</Text>
          </>
        )}
      </View>
    );
  }

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f7ff",
  },
});
