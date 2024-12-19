import { Pressable, View, Text} from "react-native";
import { useRouter } from "expo-router";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect } from "react";
import { StyleSheet } from 'react-native';


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
        style={styles.button2}
      >
        <Text style={styles.buttonText2}>Inscription</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 20,
    backgroundColor: '#F4F3FE', // indigo-100
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
    marginBottom: 20,
    textAlign: 'center',
    letterSpacing: 0.8,
  },
  description: {
    fontSize: 18,
    marginBottom: 36,
    textAlign: 'center',
    lineHeight: 26,
    paddingHorizontal: 10,
  },
  button: {
    backgroundColor: '#5B3ADD', // indigo-600
    paddingVertical: 16,
    paddingHorizontal: 36,
    borderRadius: 16,
    marginBottom: 20,
    width: '100%',
    maxWidth: 320,
  },
  button2: {
    backgroundColor: '#F5F3FE', // indigo-600
    paddingVertical: 16,
    paddingHorizontal: 36,
    borderRadius: 16,
    marginBottom: 20,
    width: '100%',
    maxWidth: 320,
    borderWidth: 2,
    borderColor: "#5B3ADD",
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 20,
    textAlign: 'center',
    letterSpacing: 1.5,
  },
  buttonText2: {
    color:"#5B3ADD",
    fontSize: 20,
    textAlign: 'center',
    letterSpacing: 1.5,
  },
});