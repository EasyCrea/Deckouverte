import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    Pressable,
    StyleSheet,
    TouchableOpacity,
    ActivityIndicator
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { GetDeckById } from '../Fetch/GetDeckById';
import { Secure } from '../components/Secure';
import { GetCardInDeck } from '../Fetch/GetCardInDeck';
import { Heart } from 'lucide-react-native';
import { AjoutLike, RecupererLike, DeleteLike } from '../components/Auth';
import { validateToken } from '../components/Auth';

export default function GameScreen() {
    const { id } = useLocalSearchParams();
    const router = useRouter();
    const [liked, setLiked] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    Secure();
    
    const toggleLikeColor = () => {
        setLiked(!liked);  // Permet de basculer entre like et unlike
    };

    const confirmLike = async () => {
        setLoading(true);
        setError(null);
        try {
            const serverResponse = await validateToken();
            const id_createur = serverResponse.decoded.id;
            console.log(liked);

            if (liked) {
                await AjoutLike(id, id_createur);
                router.replace('/page/home');
            }
            else {
                await DeleteLike(id, id_createur);
                 router.replace('/page/home');  
            }
            
        } catch (error) {
            console.error(error);
            setError('Failed to add like');
            setLiked(false);
        } finally {
            setLoading(false);
        }
    };
    const clientLike = async () => {
        try {
            const serverResponse = await validateToken();
            const id_createur = serverResponse.decoded.id;
            const userLike = await RecupererLike(id, id_createur);
            console.log(userLike);
            if (userLike.status === "success") {
                setLiked(true);
            }

        } catch (error) {
            console.error(error);
        }
    }

    useEffect(() => {
        clientLike();
    }, []);
    
    

    

    return (
        <View style={styles.container}>
            <GetDeckById deckId={id} />
            <GetCardInDeck deckId={id} />

            <Pressable
                style={styles.button}
                onPress={() => router.back()}
            >
                <Text>Retour à la page des decks</Text>
            </Pressable>

            <TouchableOpacity
                onPress={toggleLikeColor}
                style={styles.likeContainer}
            >
                <Heart
                    color={liked ? 'red' : 'gray'}
                    fill={liked ? 'red' : 'none'}
                    size={48}
                />
            </TouchableOpacity>
                <TouchableOpacity
                    style={styles.confirmButton}
                    onPress={confirmLike}
                >
            
                <Text style={styles.confirmButtonText}>Valider</Text>
                </TouchableOpacity>

            {error && <Text style={styles.errorText}>{error}</Text>}
        </View>
    );
}

const styles = StyleSheet.create({
});