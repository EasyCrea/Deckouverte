import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Modal,
} from "react-native";
import { PanGestureHandler, State } from "react-native-gesture-handler";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
  interpolate,
  Extrapolate,
  runOnJS,
} from "react-native-reanimated";
import { useLocalSearchParams, useRouter } from "expo-router";
import AuthService from "./../fetch/Auth";
import HistoriqueService from "../fetch/Historique";
import DeckService  from "../fetch/Deck";
import { Users, Coins } from "lucide-react-native";

const { width, height } = Dimensions.get("window");

const ReignsGame = () => {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const [gameStarted, setGameStarted] = useState(false);
  const [turn, setTurn] = useState(1);
  const [gameStates, setGameStates] = useState({ people: 10, treasury: 10 });
  const [cards, setCards] = useState([]);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isVictory, setIsVictory] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);
  const [remainingCards, setRemainingCards] = useState(0);
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const rotateValue = useSharedValue(0);
  const rotateY = useSharedValue(0);
  const scale = useSharedValue(1);
  const cardOpacity = useSharedValue(1);
  const [userId, setUserId] = useState(null);
  const [connexion, setConnexion] = useState(false);

  const resetGame = () => {
    setIsVictory(false);
    setIsGameOver(false);
    setTurn(1);
    setGameStates({ people: 10, treasury: 10 });
    setCurrentCardIndex(0);
    setRemainingCards(cards.length);

  };
  const resetAnimationValues = () => {
    translateX.value = 0;
    translateY.value = 0;
    rotateValue.value = 0;
    rotateY.value = 0;
    scale.value = 1;
    cardOpacity.value = 1;
  };

  useEffect(() => {
    const getUserId = async () => {
      try {
        const serverResponse = await AuthService.validateToken();
        if (serverResponse) {
          const id_createur = serverResponse.decoded.id;
          setUserId(id_createur);
          setConnexion(true);
        } else {
          console.log("Aucun utilisateur trouvé.");
        }
      } catch (error) {
        console.error("Erreur lors de la récupération du jeton :", error);
      }
    };
    getUserId();
  }, []);

  const saveGame = async () => {
    if (connexion) {
      try {
        await HistoriqueService.AjoutHistorique({
          user_id: userId,
          deck_id: id, // vous avez déjà l'id du deck dans les params
          turn_count: turn + 1,
          final_people: gameStates.people,
          final_treasury: gameStates.treasury,
          is_winner: isVictory === true ? 1 : 0,
        });
      } catch (error) {
        console.error("Erreur lors de l'enregistrement de la victoire:", error);
      }
    } else {
      console.log("utilisateur non connecté");
    }
  };

  useEffect(() => {
    const fetchCards = async () => {
      try {
        const cartes = await DeckService.RecupererCartes(id, gameStarted);
        setCards(cartes);
        setRemainingCards(cartes.length);
      } catch (error) {
        console.error("Erreur lors du chargement des cartes :", error.message);
      }
    };

    fetchCards();
  }, [gameStarted, id]);

  const handleGestureEvent = ({ nativeEvent }) => {
    translateX.value = nativeEvent.translationX;
    rotateValue.value = interpolate(
      nativeEvent.translationX,
      [-width / 2, 0, width / 2],
      [-15, 0, 15],
      Extrapolate.CLAMP
    );
  };
  const resetCardPosition = () => {
    // Animation plus douce avec des paramètres spring ajustés
    translateX.value = withSpring(0, {
      damping: 15,
      stiffness: 60,
      mass: 0.5,
    });
    translateY.value = withSpring(0, {
      damping: 10, // Réduit l'amortissement pour une animation plus rapide
      stiffness: 100, // Augmente la rigidité pour accélérer le retour
      mass: 0.3,
    });
    rotateValue.value = withSpring(0, {
      damping: 15,
      stiffness: 60,
      mass: 0.5,
    });
    scale.value = withSpring(1, {
      damping: 15,
      stiffness: 60,
      mass: 0.5,
    });
    cardOpacity.value = withTiming(1, { duration: 400 });

    // Animation de retournement de la nouvelle carte
    setTimeout(() => {
      rotateY.value = withTiming(0, {
        duration: 800,
      });
    }, 200);
  };

  const animateCardDismissal = () => {
    // Ignorer la direction et animer vers le bas
    translateX.value = withSpring(0, {
      damping: 15,
      stiffness: 60,
      mass: 1,
    });
    translateY.value = withSpring(height * 1.2, {
      // Tomber en bas de l'écran
      damping: 15,
      stiffness: 60,
      mass: 1,
    });
    rotateValue.value = withSpring(0, {
      // Pas de rotation
      damping: 15,
      stiffness: 60,
      mass: 1,
    });
    cardOpacity.value = withTiming(0, { duration: 400 });
  };

  const handleStateChange = ({ nativeEvent }) => {
    if (nativeEvent.state === State.END) {
      const choice =
        nativeEvent.translationX > 100
          ? "left"
          : nativeEvent.translationX < -100
          ? "right"
          : null;

      // Logique pour démarrer ou quitter le jeu
      if (!gameStarted) {
        if (choice === "left") {
          setGameStarted(true);
          resetCardPosition();
        } else if (choice === "right") {
          router.push("/page/home");
        }
        return;
      }

      // Si une direction valide est sélectionnée
      if (choice && cards[currentCardIndex]) {
        // Animer le rejet de la carte
        animateCardDismissal(choice);

        // Gérer la logique de jeu après l'animation
        setTimeout(() => {
          const card = cards[currentCardIndex];
          const impact =
            choice === "left"
              ? {
                  label: card.choice_2,
                  people: card.population_impact_2,
                  treasury: card.finance_impact_2,
                }
              : {
                  label: card.choice_1,
                  people: card.population_impact_1,
                  treasury: card.finance_impact_1,
                };

          const newGameStates = {
            people: gameStates.people + impact.people,
            treasury: gameStates.treasury + impact.treasury,
          };

          setGameStates(newGameStates);
          setTurn((prev) => prev + 1);
          setRemainingCards((prev) => prev - 1);

          // Vérification des conditions de défaite
          if (
            turn >= 3 &&
            (newGameStates.people <= 0 ||
              newGameStates.treasury <= 0 ||
              newGameStates.people >= 2 * newGameStates.treasury ||
              newGameStates.treasury >= 2 * newGameStates.people ||
              remainingCards <= 0)
          ) {
            setIsGameOver(true);
            saveGame();
            return;
          }

          // Vérification des conditions de victoire
          if (turn >= cards.length) {
            setIsVictory(true);
            saveGame();
            return;
          }

          // Passer à la carte suivante
          setCurrentCardIndex((prevIndex) => (prevIndex + 1) % cards.length);
          resetCardPosition();
        }, 500);
      } else {
        // Réinitialiser la position si le choix est invalide
        resetCardPosition();
      }
    }
  };

  const animatedStyle = useAnimatedStyle(() => {
    const rotateYString = `${rotateY.value}deg`;

    return {
      transform: [
        { translateX: translateX.value },
        { translateY: translateY.value },
        { rotate: `${rotateValue.value}deg` },
        { scale: scale.value },
        { perspective: 1000 },
        { rotateY: rotateYString },
      ],
      opacity: cardOpacity.value,
      backfaceVisibility: "hidden",
    };
  });
  const cardBackStyle = useAnimatedStyle(() => {
    const rotateYString = `${rotateY.value + 180}deg`;

    return {
      transform: [{ perspective: 1000 }, { rotateY: rotateYString }],
      opacity: interpolate(rotateY.value, [90, 180], [0, 1], Extrapolate.CLAMP),
      backfaceVisibility: "hidden",
    };
  });

  const choiceLabelLeftStyle = useAnimatedStyle(() => ({
    opacity: interpolate(
      translateX.value,
      [0, width / 4],
      [0, 1],
      Extrapolate.CLAMP
    ),
  }));

  const choiceLabelRightStyle = useAnimatedStyle(() => ({
    opacity: interpolate(
      translateX.value,
      [-width / 4, 0],
      [1, 0],
      Extrapolate.CLAMP
    ),
    
  }));

  return (
    <View style={styles.container}>
      {/* Écran d'accueil */}
      {!gameStarted && !isGameOver ? (
        <PanGestureHandler
          onGestureEvent={handleGestureEvent}
          onHandlerStateChange={handleStateChange}
        >
          <Animated.View style={[styles.card, animatedStyle]}>
            <Text style={styles.eventText}>Voulez-vous commencer à jouer?</Text>
            <Animated.Text style={[styles.choiceLabelLeft]}>Retour</Animated.Text>
            <Animated.Text style={[styles.choiceLabelRight]}>Jouer</Animated.Text>
          </Animated.View>
        </PanGestureHandler>
      ) : isGameOver ? (
        /* Écran de défaite */
        <View style={styles.endScreen}>
          <Text style={styles.modalTitle}>💥 Défaite 💥</Text>
          <Text style={styles.modalText}>
            Votre partie s'est terminée après {turn} tours.
          </Text>
          <Text style={styles.modalText}>Population : {gameStates.people}</Text>
          <Text style={styles.modalText}>Trésorerie : {gameStates.treasury}</Text>
          <View style={styles.modalButtonContainer}>
          <TouchableOpacity
            style={styles.modalButton}
            onPress={() => router.push("/page/home")}
            activeOpacity={0.7}
          >
            <Text style={styles.modalButtonText}>Quitter</Text>
          </TouchableOpacity>
  
          <TouchableOpacity
            style={styles.modalButton}
            onPress={() => {
              resetGame();
              resetAnimationValues();
            }}
            activeOpacity={0.7}
          >
            <Text style={styles.modalButtonText}>Recommencer</Text>
          </TouchableOpacity>
          </View>
        </View>
      ) : isVictory ? (
        /* Écran de victoire */
        <View style={styles.endScreen}>
          <Text style={styles.modalTitle}>🎉 Félicitations ! 🎉</Text>
          <Text style={styles.modalText}>Vous avez gagné.</Text>
          <Text style={styles.modalText}>Population : {gameStates.people}</Text>
          <Text style={styles.modalText}>Trésorerie : {gameStates.treasury}</Text>
          <View style={styles.modalButtonContainer}>
          <TouchableOpacity
            style={styles.modalButton}
            onPress={() => router.push("/page/home")}
            activeOpacity={0.7}
          >
            <Text style={styles.modalButtonText}>Quitter</Text>
          </TouchableOpacity>
  
          <TouchableOpacity
            style={styles.modalButton}
            onPress={() => {
              resetGame();
              resetAnimationValues();
            }}
            activeOpacity={0.7}
          >
            <Text style={styles.modalButtonText}>Recommencer</Text>
          </TouchableOpacity>
          </View>
        </View>
      ) : (
        /* Partie en cours */
        <>
          <View style={styles.scoreHeader}>
            <View style={styles.scoreContainer}>
              <Text style={styles.scoreText}>Cartes: {remainingCards}</Text>
            </View>
  
            <View style={styles.indicators}>
              {[
                {
                  key: "people",
                  label: (
                    <View style={{ flexDirection: "row", alignItems: "center" }}>
                      <Users size={20} color="black" />
                      <Text style={{ marginLeft: 5 }}>{gameStates.people}</Text>
                    </View>
                  ),
                },
                {
                  key: "treasury",
                  label: (
                    <View style={{ flexDirection: "row", alignItems: "center" }}>
                      <Coins size={20} color="black" />
                      <Text style={{ marginLeft: 5 }}>{gameStates.treasury}</Text>
                    </View>
                  ),
                },
              ].map(({ key, label }) => (
                <View key={key} style={styles.indicatorContainer}>
                  <Text style={styles.indicatorLabel}>{label}</Text>
                  <View style={styles.progressBarBackground}>
                    <View
                      style={[
                        styles.progressBarForeground,
                        { width: `${(gameStates[key] / 200) * 100}%` },
                      ]}
                    />
                  </View>
                </View>
              ))}
            </View>
          </View>
  
          <PanGestureHandler
            onGestureEvent={handleGestureEvent}
            onHandlerStateChange={handleStateChange}
          >
            <View>
              {/* Carte actuelle */}
              <Animated.View style={[styles.card, animatedStyle]}>
                {cards[currentCardIndex] && (
                  <Text style={styles.eventText}>
                    {cards[currentCardIndex].event_description}
                  </Text>
                )}
                <Animated.Text
                  style={[styles.choiceLabelLeft, choiceLabelLeftStyle]}
                >
                  {cards[currentCardIndex]
                    ? cards[currentCardIndex].choice_2
                    : "Choix Gauche"}
                </Animated.Text>
                <Animated.Text
                  style={[styles.choiceLabelRight, choiceLabelRightStyle]}
                >
                  {cards[currentCardIndex]
                    ? cards[currentCardIndex].choice_1
                    : "Choix Droit"}
                </Animated.Text>
              </Animated.View>
  
              {/* Carte suivante */}
              {currentCardIndex + 1 < cards.length && (
                <Animated.View style={[styles.cardBack, cardBackStyle]} />
              )}
            </View>
          </PanGestureHandler>
        </>
      )}
    </View>
  );
};

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
  },
  scoreContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 20,
  },
  scoreHeader: {
    borderRadius: 10,
    marginBottom: 10,
    backgroundColor: "white",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.25,
    shadowRadius: 2,
  },
  scoreText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
  },
  indicators: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 20,
  },
  indicatorContainer: {
    marginBottom: 15,
    textAlign: "center",
    width: "45%",
  },
  indicatorLabel: {
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 5,
    textTransform: "uppercase",
  },

  progressBarBackground: {
    backgroundColor: "#D1D5DB",
    height: 20,
    borderRadius: 10,
    overflow: "hidden",
  },
  progressBarForeground: {
    backgroundColor: "#4F46E5",
    height: "100%",
  },
  card: {
    backgroundColor: "white",
    borderRadius: 20,
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
    height: 300,
    width: 300, // Taille fixe pour éviter que la carte change
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  cardBack: {
    position: "absolute",
    top: 0,
    left: 0,
    height: 300,
    width: 300,
    backgroundColor: "#C0C0C0",
    borderRadius: 20,
    opacity: 0.8,
    zIndex: -1,
  },
  eventText: {
    fontSize: 18,
    fontWeight: "600",
    textAlign: "center",
    flexWrap: "wrap", // Permet de gérer le texte qui dépasse
    maxWidth: "90%", // Ajuste le texte dans la carte
  },
  cardBackImage: {
    flex: 1,
    width: "100%",
    height: "100%",
    borderRadius: 20,
    overflow: "hidden",
  },
  choiceLabelLeft: {
    position: "absolute",
    top: 20,
    left: 10,
    fontSize: 18,
    color: "green",
    fontWeight: "bold",
  },
  choiceLabelRight: {
    position: "absolute",
    top: 20,
    right: 10,
    fontSize: 18,
    color: "red",
    fontWeight: "bold",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
    position: 'absolute',
    top: 350,
    left: 180,
    right:200,
    bottom: 0,
  },
  modalContent: {
    backgroundColor: "white",
    borderRadius: 20,
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
    height: 300,
    width: 300,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    zIndex: 1000,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
    color: "#333",
  },
  modalText: {
    fontSize: 18,
    marginBottom: 30,
    textAlign: "center",
    color: "#333",
    fontWeight: "600",
  },
  modalButtonContainer: {
    flexDirection: "column", 
    alignItems: "center",     
    justifyContent: "center", 
    width: "100%",            
    paddingHorizontal: 10,    
  },
  modalButton: {
    backgroundColor: "#4F46E5",
    borderRadius: 10,
    padding: 12,
    width: "80%",
    alignItems: "center",
    marginVertical: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
  modalButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
});

export default ReignsGame;
