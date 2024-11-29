import { Pressable, View, Text} from "react-native";
import { useRouter } from "expo-router";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect } from "react";
import { StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';


export default function Index() {

  const router = useRouter();

  useEffect(() => {
    const clear = async () => { 
      await AsyncStorage.removeItem('token');
    }
    clear();
  }
  , []);
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bienvenue sur DeckOuverte</Text>
      <Text style={styles.subtitle}>le nouveau jeu mobile collaboratif</Text>
      <Text style={styles.description}>pour les créateurs de jeux de cartes vous pouvez également nous retrouvé sur le web et participé à la création de ce jeu</Text>
      <Pressable
        onPress={() =>
          router.push({
            pathname: "/page/Auth/userconnexion",
            params: { page: "connexion" },
          })
        }
        style={styles.button}
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
        style={styles.button}
      >
        <Text style={styles.buttonText}>Inscription</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 20,
    backgroundColor: '#e0e7ff', // indigo-100
  },
  gradientWrapper: {
    marginBottom: 20,
  },
  gradient: {
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  title: {
    fontSize: 60, // Texte plus grand
    fontWeight: 'bold',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 22,
    fontStyle: 'italic',
    color: '#7e22ce', // purple-700
    marginBottom: 20,
    textAlign: 'center',
    letterSpacing: 0.8,
  },
  description: {
    fontSize: 18,
    color: '#4338ca', // indigo-700
    marginBottom: 36,
    textAlign: 'center',
    lineHeight: 26,
    paddingHorizontal: 10,
  },
  button: {
    backgroundColor: '#4f46e5', // indigo-600
    paddingVertical: 16,
    paddingHorizontal: 36,
    borderRadius: 16,
    marginBottom: 20,
    width: '100%',
    maxWidth: 320,
    elevation: 8,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: '800',
    textAlign: 'center',
    textTransform: 'uppercase',
    letterSpacing: 1.5,
  },
});