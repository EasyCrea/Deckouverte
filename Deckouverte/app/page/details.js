import { View, Text, Pressable, StyleSheet } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { GetDeckById } from '../Fetch/GetDeckById';
import { Secure } from '../components/Secure';
import { GetCardInDeck } from '../Fetch/GetCardInDeck';

export default function GameScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter(); 
  Secure();

    return (
      <View style={styles.container}>
        <GetDeckById deckId={id} />
        <GetCardInDeck deckId={id} />
        <Pressable 
          style={styles.button}
          onPress={() => router.back()}
        >
          <Text style={styles.buttonText}>Retour à la page des decks</Text>
        </Pressable>
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