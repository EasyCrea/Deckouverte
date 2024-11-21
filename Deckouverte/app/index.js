import { View,  Pressable, Text, StyleSheet } from "react-native";
import { Getdeck } from './components/Getdeck';
import { useRouter } from 'expo-router';
import { Stack } from "expo-router";


export default function Index() {
  const router = useRouter();
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
    <Getdeck />
    <Pressable 
        style={styles.button}
        onPress={() => router.push('/jeu')}
      >
        <Text style={styles.buttonText}>Commencer le Jeu</Text>
      </Pressable>
    </View>
  );
}
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
