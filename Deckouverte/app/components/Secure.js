import AsyncStorage from '@react-native-async-storage/async-storage';
import { validateToken } from "../components/Auth";
import { useEffect } from 'react';
import { useRouter } from 'expo-router';
import { jwtDecode } from 'jwt-decode';

export function Secure(){
    const router = useRouter();

    useEffect(() => {
        const token = async () => { 
            try  {
                await validateToken();
            }
            catch (err) {
                router.replace('/');
                alert("Vous n'êtes pas connecté.");
            }
        }
        token();
    }, []);
    return null; 
}