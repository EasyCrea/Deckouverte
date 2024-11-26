import { View, Text, Pressable, StyleSheet } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { GetDeckById } from '../Fetch/GetDeckById';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { validateToken } from "../components/Auth";

export default function GameScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();

  


  return (
    <View style={styles.container}>
      <GetDeckById deckId={id} />
      <Pressable 
        style={styles.button}
        onPress={() => router.back()}
      >
        <Text style={styles.buttonText}>Retour à l'accueil</Text>
      </Pressable>
      <Text>Deck id : {id}</Text>
    </View>
  );
}

// Styles communs
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#007bff',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
  },
});