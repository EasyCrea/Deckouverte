import { Pressable, View, Text, StyleSheet, SafeAreaView } from "react-native";
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
  }, []);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.headerSection}>
          <Text style={styles.title}>DeckOuverte</Text>
          <Text style={styles.subtitle}>le nouveau jeu mobile collaboratif</Text>
        </View>
        
        <View style={styles.buttonContainer}>
          <Pressable
            onPress={() =>
              router.push({
                pathname: "/page/Auth/userconnexion",
                params: { page: "connexion" },
              })
            }
            style={({ pressed }) => [
              styles.button,
              pressed && styles.buttonPressed
            ]}
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
            style={({ pressed }) => [
              styles.button2,
              pressed && styles.button2Pressed
            ]}
          >
            <Text style={styles.buttonText2}>Inscription</Text>
          </Pressable>
          <Pressable
            onPress={() =>
              router.push({
                pathname: "/page/home",
              })
            }
            style={({ pressed }) => [
              styles.button,
              pressed && styles.buttonPressed
            ]}
          >
            <Text style={styles.buttonText}>Joué sans connexion</Text>
          </Pressable>
        </View>
        

        <View style={styles.footerSection}>
          <Text style={styles.description}>
            pour les créateurs de jeux de cartes vous pouvez également nous retrouver sur le web et participer à la création de ce jeu
          </Text>
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
    paddingHorizontal: 20,
    justifyContent: 'space-between',
  },
  headerSection: {
    alignItems: 'center',
    paddingTop: 40,
  },
  buttonContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
  },
  footerSection: {
    paddingBottom: 40,
  },
  title: {
    fontSize: 55,
    fontWeight: '700',
    textAlign: 'center',
    color: "#7C2EE0",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    letterSpacing: 0.5,
    color: '#000000',
  },
  description: {
    fontSize: 14,
    fontStyle: 'italic',
    textAlign: 'center',
    lineHeight: 20,
    color: '#666666',
    paddingHorizontal: 10,
  },
  button: {
    backgroundColor: '#5B3ADD',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 16,
    marginBottom: 16,
    width: '100%',
    maxWidth: 300,
  },
  buttonPressed: {
    opacity: 0.8,
  },
  button2: {
    backgroundColor: '#F5F3FE',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 16,
    marginBottom: 16,
    width: '100%',
    maxWidth: 300,
    borderWidth: 2,
    borderColor: "#5B3ADD",
  },
  button2Pressed: {
    backgroundColor: '#ECEAFE',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    textAlign: 'center',
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  buttonText2: {
    color: "#5B3ADD",
    fontSize: 18,
    textAlign: 'center',
    fontWeight: '600',
    letterSpacing: 0.5,
  },
});