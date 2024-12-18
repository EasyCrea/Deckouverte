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
  interpolate,
  Extrapolate,
  withTiming,
} from "react-native-reanimated";
import { useLocalSearchParams, useRouter } from "expo-router";

const { width } = Dimensions.get("window");

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
  const rotateValue = useSharedValue(0);

  useEffect(() => {
    const fetchCards = async () => {
      try {
        const response = await fetch(`http://localhost:8000/createur/deckCard/${id}`);
        const data = await response.json();
        if (data.status === "success" && Array.isArray(data.cards)) {
          setCards(data.cards);
          setRemainingCards(data.cards.length);
        } else {
          console.error("Invalid card data format");
        }
      } catch (error) {
        console.error("Error loading cards:", error);
      }
    };

    if (gameStarted && id) {
      fetchCards();
    }
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

  const handleStateChange = ({ nativeEvent }) => {
    if (nativeEvent.state === State.END) {
      const choice =
        nativeEvent.translationX > 100
          ? "left"
          : nativeEvent.translationX < -100
          ? "right"
          : null;

      if (!gameStarted) {
        if (choice === "right") {
          setGameStarted(true);
          translateX.value = withTiming(0, { duration: 300 });
          rotateValue.value = withTiming(0, { duration: 300 });
        } else if (choice === "left") {
          router.push("/page/home");
        }
        return;
      }

      if (choice && cards[currentCardIndex]) {
        const impact =
          choice === "left"
            ? {
                label: cards[currentCardIndex].choice_2,
                people: cards[currentCardIndex].population_impact_2,
                treasury: cards[currentCardIndex].finance_impact_2,
              }
            : {
                label: cards[currentCardIndex].choice_1,
                people: cards[currentCardIndex].population_impact_1,
                treasury: cards[currentCardIndex].finance_impact_1,
              };

        const newGameStates = { ...gameStates };
        newGameStates.people += impact.people;
        newGameStates.treasury += impact.treasury;

        setGameStates(newGameStates);
        setTurn((prev) => prev + 1);
        setRemainingCards((prev) => prev - 1);

        // Condition de défaite
        if (
          turn >= 3 &&
          (newGameStates.people <= 0 ||
            newGameStates.treasury <= 0 ||
            newGameStates.people >= 2 * newGameStates.treasury ||
            newGameStates.treasury >= 2 * newGameStates.people ||
            remainingCards <= 0)
        ) {
          setIsGameOver(true);

          return;
        }

        if (turn >= cards.length) {
          setIsVictory(true);

          return;
        }

        setCurrentCardIndex((prevIndex) => (prevIndex + 1) % cards.length);
      }
      
      translateX.value = withSpring(0);
      rotateValue.value = withTiming(0, { duration: 300 });
    }
  };

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { translateX: translateX.value },
        { rotate: `${rotateValue.value}deg` },
      ],
      opacity: interpolate(
        Math.abs(translateX.value),
        [0, width / 2],
        [1, 0.5],
        Extrapolate.CLAMP
      ),
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
      
      {!gameStarted ? (
        <PanGestureHandler
          onGestureEvent={handleGestureEvent}
          onHandlerStateChange={handleStateChange}
        >
          <Animated.View style={[styles.card, animatedStyle]}>
            <Text style={styles.eventText}>Voulez-vous commencer à jouer?</Text>
            <Animated.Text
              style={[styles.choiceLabelLeft, choiceLabelLeftStyle]}
            >
              Retour
            </Animated.Text>
            <Animated.Text
              style={[styles.choiceLabelRight, choiceLabelRightStyle]}
            >
              Jouer
            </Animated.Text>
          </Animated.View>
        </PanGestureHandler>
      ) : (
        <>
          <View style={styles.scoreContainer}>
            <Text style={styles.scoreText}>
              Population: {gameStates.people}
            </Text>
            <Text style={styles.scoreText}>
              Finances: {gameStates.treasury}
            </Text>
            <Text style={styles.scoreText}>Cartes: {remainingCards}</Text>
          </View>

          <View style={styles.indicators}>
            {[
              { key: "people", label: "Population" },
              { key: "treasury", label: "Finances" },
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

          <PanGestureHandler
            onGestureEvent={handleGestureEvent}
            onHandlerStateChange={handleStateChange}
          >
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
          </PanGestureHandler>
        </>
      )}

      <Modal visible={isVictory} transparent animationType="fade">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>🎉 Félicitations ! 🎉</Text>
            <Text style={styles.modalText}>
              Vous avez gagné en {turn} tours.
            </Text>
            <TouchableOpacity onPress={() => router.push("/page/home")}>
              <Text style={styles.modalButtonText}>Quitter</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.modalButton}
              onPress={() => {
                setIsGameOver(false);
                setTurn(1);
                setGameStates({ people: 10, treasury: 10 });
                setCurrentCardIndex(0);
                setGameStarted(false);
              }}
            >
              <Text style={styles.modalButtonText}>Recommencer</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Modale de défaite */}
      <Modal visible={isGameOver} transparent animationType="fade">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>💥 Défaite 💥</Text>
            <Text style={styles.modalText}>
              Votre partie s'est terminée après {turn} tours.
            </Text>
            <TouchableOpacity
              style={styles.modalButton}
              onPress={() => {
                setIsGameOver(false);
                setTurn(1);
                setGameStates({ people: 10, treasury: 10 });
                setCurrentCardIndex(0);
                setGameStarted(false);
              }}
            >
              <Text style={styles.modalButtonText}>Recommencer</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#E6E6FA",
    justifyContent: "center",
    padding: 20,
  },
  scoreContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 20,
  },
  scoreText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
  },
  indicators: {
    flexDirection: "column",
    marginBottom: 20,
  },
  indicatorContainer: {
    marginBottom: 15,
  },
  indicatorLabel: {
    fontSize: 16,
    fontWeight: "bold",
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
    height: 400,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  eventText: {
    fontSize: 20,
    fontWeight: "600",
    textAlign: "center",
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
  },
  modalContent: {
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 15,
  },
  modalText: {
    fontSize: 18,
    marginBottom: 20,
  },
  modalButton: {
    backgroundColor: "#4F46E5",
    borderRadius: 10,
    padding: 10,
    elevation: 2,
  },
  modalButtonText: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
});

export default ReignsGame;
