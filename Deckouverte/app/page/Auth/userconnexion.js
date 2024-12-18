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
}const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F4F6', // Couleur d'arrière-plan douce et moderne
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: '#4F46E5', // Couleur d'accent pour correspondre au thème
    textAlign: 'center',
    marginBottom: 20,
  },
  textLink: {
    color: '#3B82F6', // Couleur bleu vif pour les liens
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
    marginVertical: 10,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginVertical: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 4,
    width: '100%',
    maxWidth: 400,
    alignItems: 'center',
  },
  cardHeader: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 10,
  },
  cardContent: {
    fontSize: 16,
    color: '#6B7280', // Couleur neutre pour le texte
    textAlign: 'center',
    lineHeight: 24,
  },
  button: {
    backgroundColor: '#4F46E5', // Couleur principale pour les boutons
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 20,
    marginVertical: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  inputContainer: {
    width: '100%',
    maxWidth: 400,
    marginVertical: 10,
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#1F2937',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  errorText: {
    color: '#DC2626',
    fontSize: 14,
    marginTop: 5,
  },
});
