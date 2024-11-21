import React, { useState, useEffect, useRef } from 'react';
import { 
  View, 
  Text, 
  PanResponder, 
  Animated, 
  Dimensions, 
  StyleSheet 
} from 'react-native';

const { width, height } = Dimensions.get('window');

export default function CardSwipe({ deckId }) {
  const [cards, setCards] = useState([]);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [population, setPopulation] = useState(0); // Initial population score
  const [argent, setArgent] = useState(0); // Initial argent score
  const [leftValue, setLeftValue] = useState(null);
  const [rightValue, setRightValue] = useState(null);

  const pan = useRef(new Animated.ValueXY()).current;
  const cardRotation = useRef(new Animated.Value(0)).current;

  // Fetch cards when component mounts
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
  }, [deckId]);

  // Pan Responder for card swipe interactions
  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onPanResponderMove: (event, gestureState) => {
      Animated.event(
        [null, { dx: pan.x }],
        { useNativeDriver: false }
      )(event, gestureState);

      // Rotate card based on x movement
      Animated.timing(cardRotation, {
        toValue: gestureState.dx / width,
        duration: 0,
        useNativeDriver: true
      }).start();

      // Update displayed values based on swipe direction
      const swipeDirection = gestureState.dx > 0 ? 'right' : 'left';
      const currentCard = cards[currentCardIndex];
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

      if (Math.abs(gestureState.dx) > swipeThreshold) {
        // Determine swipe direction
        const swipeDirection = gestureState.dx > 0 ? 'right' : 'left';
        handleCardSwipe(swipeDirection);
      } else {
        // Return card to center
        Animated.parallel([
          Animated.spring(pan, {
            toValue: { x: 0, y: 0 },
            useNativeDriver: true
          }),
          Animated.spring(cardRotation, {
            toValue: 0,
            useNativeDriver: true
          })
        ]).start();
      }
    }
  });

  const handleCardSwipe = (direction) => {
    const currentCard = cards[currentCardIndex];

    // Function to split and parse values for population and argent
    const getValues = (choice) => {
      // Split by both comma and period and parse the values
      const values = choice.split(/[,.]/).map(val => parseFloat(val.trim()));
      return values;
    };

    // Get population and argent changes for the chosen card side
    const values = direction === 'right'
      ? getValues(currentCard.valeurs_choix2)
      : getValues(currentCard.valeurs_choix1);

    // Ensure the values are valid (non-NaN)
    if (values.length >= 2) {
      const [populationChange, argentChange] = values;
      setPopulation(prevPopulation => prevPopulation + populationChange); // Allow negative population change
      setArgent(prevArgent => prevArgent + argentChange); // Allow negative argent change
    }

    // Animate card off screen
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
      // Move to next card
      setCurrentCardIndex(prevIndex => (prevIndex + 1) % cards.length);

      // Reset pan and rotation
      pan.setValue({ x: 0, y: 0 });
      cardRotation.setValue(0);
      setLeftValue(null);
      setRightValue(null);
    });
  };

  const renderValue = (value) => {
    if (value) {
      const values = value.split(/[,.]/).map(val => parseFloat(val.trim()));
      return values.map((val, index) => (
        <Text key={index} style={styles.valueText}>
          {val > 0 ? `+${val}` : `${val}`} {/* Display negative values without "+" */}
        </Text>
      ));
    }
    return null;
  };

  if (cards.length === 0) {
    return <Text>Loading cards...</Text>;
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
        <Text style={styles.scoreText}>Population: {population}</Text>
        <Text style={styles.scoreText}>Argent: {argent}</Text>
      </View>

      <Animated.View 
        {...panResponder.panHandlers}
        style={[styles.card, cardStyle]}
      >
        <Text style={styles.cardText} selectable={false}>{currentCard.texte_carte}</Text>
      </Animated.View>

      <View style={styles.valueContainer}>
        {leftValue && renderValue(leftValue)}
        {rightValue && renderValue(rightValue)}
      </View>
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
  scoreContainer: {
    position: 'absolute',
    top: 30,
    left: 10,
    right: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  scoreText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  card: {
    width: width * 0.3,
    height: height * 0.6,
    backgroundColor: '#FFFCF9',
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    position: 'absolute',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.6,
    shadowRadius: 15,
    elevation: 10,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  cardText: {
    fontSize: 22,
    fontWeight: '600',
    textAlign: 'center',
    color: '#333',
    lineHeight: 30,
  },
  valueContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    width: '100%',
    position: 'absolute',
    bottom: 50, // Positionner sous la carte
  },
  valueText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#555',
  },
});
