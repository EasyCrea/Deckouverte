import React, { useState, useEffect, useRef } from 'react';
import { 
  View, 
  Text, 
  PanResponder, 
  Animated, 
  Dimensions, 
  StyleSheet 
} from 'react-native';

const { width, height } = Dimensions.get('window'); // Dimensions de l'écran pour gérer les animations

export default function CardSwipe({ deckId }) {
  // Déclaration des états pour les cartes, index actuel, population, argent et valeurs des choix
  const [cards, setCards] = useState([]);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [population, setPopulation] = useState(0);
  const [argent, setArgent] = useState(0);
  const [leftValue, setLeftValue] = useState(null);
  const [rightValue, setRightValue] = useState(null);
  const [isCardCentered, setIsCardCentered] = useState(true);

  // Définition des animations de translation et de rotation
  const pan = useRef(new Animated.ValueXY()).current;
  const cardRotation = useRef(new Animated.Value(0)).current;

  // Effet pour récupérer les cartes du backend
  useEffect(() => {
    const fetchCards = async () => {
      try {
        const response = await fetch(`http://localhost:8000/createur/deckCard/10`);
        if (!response.ok) {
          throw new Error("Failed to fetch cards");
        }
        const json = await response.json();
        setCards(json.cards);
      } catch (error) {
        console.error(error);
      }
    };

    fetchCards();
  }, [deckId]); // Recharge les cartes lorsque deckId change

  // Définition du comportement du PanResponder pour gérer le swipe
  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onPanResponderMove: (event, gestureState) => {
      // Gère le déplacement de la carte pendant le swipe
      Animated.event([null, { dx: pan.x }], { useNativeDriver: false })(event, gestureState);

      // Animation de la rotation de la carte
      Animated.timing(cardRotation, {
        toValue: gestureState.dx / width,
        duration: 0,
        useNativeDriver: true
      }).start();

      const swipeDirection = gestureState.dx > 0 ? 'right' : 'left';
      const currentCard = cards[currentCardIndex];
      
      setIsCardCentered(false);

      // Mise à jour des valeurs en fonction de la direction du swipe
      if (swipeDirection === 'left') {
        setLeftValue(currentCard.valeurs_choix1);
        setRightValue(null);
      } else {
        setRightValue(currentCard.valeurs_choix2);
        setLeftValue(null);
      }
    },
    onPanResponderRelease: (event, gestureState) => {
      const swipeThreshold = width * 0.3;

      // Si le swipe dépasse un certain seuil, effectuer l'action
      if (Math.abs(gestureState.dx) > swipeThreshold) {
        const swipeDirection = gestureState.dx > 0 ? 'right' : 'left';
        handleCardSwipe(swipeDirection);
      } else {
        // Si le swipe est trop faible, ramener la carte au centre
        Animated.parallel([
          Animated.spring(pan, {
            toValue: { x: 0, y: 0 },
            useNativeDriver: true
          }),
          Animated.spring(cardRotation, {
            toValue: 0,
            useNativeDriver: true
          })
        ]).start(() => {
          setIsCardCentered(true);
          setLeftValue(null);
          setRightValue(null);
        });
      }
    }
  });

  // Gère l'action après un swipe
  const handleCardSwipe = (direction) => {
    const currentCard = cards[currentCardIndex];

    // Fonction pour obtenir les valeurs de population et argent à partir des choix
    const getValues = (choice) => {
      const values = choice.split(/[,.]/).map(val => parseFloat(val.trim()));
      return values;
    };

    const values = direction === 'right'
      ? getValues(currentCard.valeurs_choix2)
      : getValues(currentCard.valeurs_choix1);

    if (values.length >= 2) {
      const [populationChange, argentChange] = values;
      setPopulation(prevPopulation => prevPopulation + populationChange);
      setArgent(prevArgent => prevArgent + argentChange);
    }

    // Animation de la carte qui s'éloigne
    Animated.parallel([
      Animated.timing(pan, {
        toValue: { 
          x: direction === 'right' ? width : -width, 
          y: 0 
        },
        duration: 300,
        useNativeDriver: true
      }),
      Animated.timing(cardRotation, {
        toValue: direction === 'right' ? 1 : -1,
        duration: 300,
        useNativeDriver: true
      })
    ]).start(() => {
      setCurrentCardIndex(prevIndex => (prevIndex + 1) % cards.length);
      pan.setValue({ x: 0, y: 0 });
      cardRotation.setValue(0);
      setIsCardCentered(true);
      setLeftValue(null);
      setRightValue(null);
    });
  };

  // Fonction d'affichage des valeurs des choix
  const renderValue = (value) => {
    if (value) {
      const values = value.split(/[,.]/).map(val => parseFloat(val.trim()));
      return values.map((val, index) => (
        <Text key={index} style={styles.valueText}>
          {val > 0 ? `+${val}` : `${val}`}
        </Text>
      ));
    }
    return null;
  };

  if (cards.length === 0) {
    return <Text style={styles.loadingText}>Loading cards...</Text>;
  }

  const currentCard = cards[currentCardIndex];

  const cardStyle = {
    transform: [
      { translateX: pan.x },
      { 
        rotate: cardRotation.interpolate({
          inputRange: [-1, 0, 1],
          outputRange: ['-30deg', '0deg', '30deg']
        }) 
      }
    ]
  };

  return (
    <View style={styles.container}>
      <View style={styles.scoreContainer}>
        <View style={[styles.scoreBox, styles.centeredScore]}>
          <Text style={styles.scoreLabelText}>Population</Text>
          <Text style={styles.scoreValueText}>{population}</Text>
        </View>
        <View style={[styles.scoreBox, styles.centeredScore]}>
          <Text style={styles.scoreLabelText}>Argent</Text>
          <Text style={styles.scoreValueText}>{argent}</Text>
        </View>
      </View>

      <Animated.View 
        {...panResponder.panHandlers}
        style={[styles.card, cardStyle]}
      >
        <Text style={styles.cardText} selectable={false}>{currentCard.texte_carte}</Text>
      </Animated.View>

      {/* Affiche les valeurs des choix seulement si la carte n'est pas centrée */}
      {!isCardCentered && (
        <View style={styles.valueContainer}>
          {leftValue && renderValue(leftValue)}
          {rightValue && renderValue(rightValue)}
        </View>
      )}
    </View>
  );
}

// Styles pour l'UI et l'animation
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1A1A2E',
  },
  scoreContainer: {
    position: 'absolute',
    top: 30,
    flexDirection: 'row',
    justifyContent: 'center',
    width: '100%',
  },
  centeredScore: {
    marginHorizontal: 20,
  },
  scoreBox: {
    backgroundColor: '#16213E',
    borderRadius: 10,
    padding: 10,
    alignItems: 'center',
    shadowColor: '#0F3460',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 6,
    elevation: 8,
  },
  scoreLabelText: {
    fontSize: 14,
    color: '#E94560', 
    textTransform: 'uppercase',
    fontWeight: 'bold',
  },
  scoreValueText: {
    fontSize: 24,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  loadingText: {
    color: '#E94560',
    fontSize: 20,
    textAlign: 'center',
  },
  card: {
    width: width * 0.3, 
    height: height * 0.6,
    backgroundColor: '#16213E', 
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    position: 'absolute',
    shadowColor: '#0F3460',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.7,
    shadowRadius: 20,
    elevation: 15,
    borderWidth: 2,
    borderColor: '#E94560', 
  },
  cardText: {
    fontSize: 24,
    fontWeight: '600',
    textAlign: 'center',
    color: '#FFFFFF', 
    lineHeight: 34,
  },
  valueContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    width: '100%',
    position: 'absolute',
    bottom: 50,
  },
  valueText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#E94560', 
    marginHorizontal: 10,
  },
});
