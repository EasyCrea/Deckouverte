import { View, Text, StyleSheet, Pressable } from "react-native";
import { Login } from "./login";
import { Register } from "./register";
import { useGlobalSearchParams } from "expo-router/build/hooks";
import { useRouter } from "expo-router";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect } from "react";


export default function Index() {
    const router = useRouter();
    useEffect(() => {
        const clear = async () => { 
          await AsyncStorage.removeItem('token');
        }
        clear();
      }
      , []);
      
    const { page } = useGlobalSearchParams();
    if (page === "connexion") {
        return (
            <View style={styles.container}>
                <Text style={styles.title}>Bienvenue sur la page de connexion</Text>
                <Login />
                <Pressable
                    onPress={() => router.push({
                        pathname: "/page/Auth/userconnexion",
                        params: { page: "register" }
                    })}>
                    <Text style={{ color: "blue" }}>Pas encore de compte ? Inscrivez-vous</Text>
                </Pressable>
                <Pressable
                    onPress={() => router.push({
                        pathname: "/",
                    })}>
                    <Text style={{ color: "blue" }}>Retour à la page d'accueil</Text>
                </Pressable>

            </View>
        );
    } else if (page === "register") {
        return (
            <View style={styles.container}>
                <Text style={styles.title}>Bienvenue sur la page d'inscription</Text>
                <Register />
            </View>
        );
    }
}
const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "#f5f5f5",
      padding: 20,
    },
    title: {
      fontSize: 24,
      fontWeight: "bold",
      color: "#333",
      marginBottom: 20,
    },
  });
