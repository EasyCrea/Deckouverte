import React, { useState } from 'react';
import { View, Text, Pressable, StyleSheet, Modal } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import CardSwipe from './../Fetch/Getcard';
import { AntDesign } from '@expo/vector-icons';
import { Secure } from '../components/Secure';

export default function GameScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [isRulesVisible, setIsRulesVisible] = useState(false);
  Secure();

  return (
    <View style={styles.container}>
       <Text style={styles.title}>LOGO</Text>

      <View style={styles.buttonsContainer}>
        <Pressable 
          style={styles.button} 
          onPress={() => router.back()}
        >
          <AntDesign name="arrowleft" size={20} color="white" style={styles.buttonIcon} />
          <Text style={styles.buttonText}>Retour</Text>
        </Pressable>

        <Pressable 
          style={styles.button} 
          onPress={() => setIsRulesVisible(true)}
        >
          <AntDesign name="infocirlceo" size={20} color="white" style={styles.buttonIcon} />
          <Text style={styles.buttonText}>Règles</Text>
        </Pressable>
      </View>
      
      <CardSwipe deckId={id} />

      {/* Modal pour afficher les règles */}
      <Modal
        transparent={true}
        visible={isRulesVisible}
        animationType="slide"
        onRequestClose={() => setIsRulesVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Règles du Jeu</Text>
            <Text style={styles.modalText}>
              Pour gagner, vous devez maintenir l'équilibre entre la population et les finances. 
              Si l'un des paramètres (population ou finances) descend à zéro ou devient double de l'autre, le jeu se termine.
            </Text>
            <Text style={styles.modalText}>
              Vous devrez choisir entre différentes décisions à chaque tour. 
              Faites attention aux impacts de chaque choix sur la population et les finances.
            </Text>
            <Pressable 
              style={styles.modalButton} 
              onPress={() => setIsRulesVisible(false)}
            >
              <Text style={styles.modalButtonText}>Fermer</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
    marginTop:20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    paddingHorizontal: 20,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#5B3ADD',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginBottom: 20,
  },
  buttonIcon: {
    marginRight: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  modalText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
  },
  modalButton: {
    backgroundColor: '#5B3ADD',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  modalButtonText: {
    color: 'white',
    fontSize: 16,
  },
});
