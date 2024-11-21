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
  const [population, setPopulation] = useState(0);
  const [argent, setArgent] = useState(0);
  const [leftValue, setLeftValue] = useState(null);
  const [rightValue, setRightValue] = useState(null);
  const [isCardCentered, setIsCardCentered] = useState(true);
  const [deckSize, setDeckSize] = useState(0);  // État pour le nombre de cartes restantes

  const pan = useRef(new Animated.ValueXY()).current;
  const cardRotation = useRef(new Animated.Value(0)).current;
  const cardScale = useRef(new Animated.Value(1)).current;  
  const cardOpacity = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const fetchCards = async () => {
      try {
        const response = await fetch(`http://localhost:8000/createur/deckCard/${deckId}`);
        if (!response.ok) {
          throw new Error("Failed to fetch cards");
        }
        const json = await response.json();
        setCards(json.cards);
        setDeckSize(json.cards.length);  // Mise à jour du nombre de cartes
      } catch (error) {
        console.error(error);
      }
    };
    fetchCards();
  }, [deckId]);

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onPanResponderMove: (event, gestureState) => {
      Animated.event([null, { dx: pan.x }], { useNativeDriver: false })(event, gestureState);

      Animated.timing(cardRotation, {
        toValue: gestureState.dx / width,
        duration: 0,
        useNativeDriver: true
      }).start();

      const swipeDirection = gestureState.dx > 0 ? 'right' : 'left';
      const currentCard = cards[currentCardIndex];
      
      setIsCardCentered(false);

      if (swipeDirection === 'left') {
        setLeftValue(currentCard.valeurs_choix1);
        setRightValue(null);
      } else {
        setRightValue(currentCard.valeurs_choix2);
        setLeftValue(null);
      }

      const scaleValue = 1 - Math.abs(gestureState.dx) / (width * 2);
      cardScale.setValue(scaleValue);
      
      const opacityValue = 1 - Math.abs(gestureState.dx) / (width * 1.5);
      cardOpacity.setValue(opacityValue);
    },
    onPanResponderRelease: (event, gestureState) => {
      const swipeThreshold = width * 0.3;

      if (Math.abs(gestureState.dx) > swipeThreshold) {
        const swipeDirection = gestureState.dx > 0 ? 'right' : 'left';
        handleCardSwipe(swipeDirection);
      } else {
        Animated.parallel([
          Animated.spring(pan, {
            toValue: { x: 0, y: 0 },
            useNativeDriver: true
          }),
          Animated.spring(cardRotation, {
            toValue: 0,
            useNativeDriver: true
          }),
          Animated.spring(cardScale, {
            toValue: 1,
            useNativeDriver: true
          }),
          Animated.spring(cardOpacity, {
            toValue: 1,
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

  const handleCardSwipe = (direction) => {
    const currentCard = cards[currentCardIndex];

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
      }),
      Animated.timing(cardScale, {
        toValue: 0.9,
        duration: 300,
        useNativeDriver: true
      }),
      Animated.timing(cardOpacity, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true
      })
    ]).start(() => {
      setCurrentCardIndex(prevIndex => (prevIndex + 1) % cards.length);
      setDeckSize(prevSize => prevSize - 1);  
      pan.setValue({ x: 0, y: 0 });
      cardRotation.setValue(0);
      cardScale.setValue(1);
      cardOpacity.setValue(1);
      setIsCardCentered(true);
      setLeftValue(null);
      setRightValue(null);
    });
  };

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
      },
      { scale: cardScale }  
    ],
    opacity: cardOpacity 
  };

  return (
    <View style={styles.container}>
      <View style={styles.scoreContainer}>
        <View style={[styles.scoreBox, styles.centeredScore]}>
          <Text style={styles.scoreLabelText}>Population</Text>
          <Text style={styles.scoreValueText}>{population}</Text>
        </View>
        <View style={[styles.scoreBox, styles.centeredScore]}>
          <Text style={styles.scoreLabelText}>Finance</Text>
          <Text style={styles.scoreValueText}>{argent}</Text>
        </View>
        {/* Ajout du nombre de cartes restantes */}
        <View style={[styles.scoreBox, styles.centeredScore]}>
          <Text style={styles.scoreLabelText}>Cartes restantes</Text>
          <Text style={styles.scoreValueText}>{deckSize}</Text>
        </View>
      </View>

      <Animated.View 
        {...panResponder.panHandlers}
        style={[styles.card, cardStyle]}
      >
        <Text style={styles.cardText} selectable={false}>{currentCard.texte_carte}</Text>
      </Animated.View>

      {!isCardCentered && (
        <View style={styles.valueContainer}>
          {leftValue && renderValue(leftValue)}
          {rightValue && renderValue(rightValue)}
        </View>
      )}
    </View>
  );
}

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
