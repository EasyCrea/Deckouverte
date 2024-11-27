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
                const serverResponse = await validateToken();
                const serverEmail = serverResponse.decoded.email;
                
                const tokenFromStorage = await AsyncStorage.getItem('token');
                const decodedStorageToken = jwtDecode(tokenFromStorage);
                const storageEmail = decodedStorageToken.email;
                
                // Comparaison des emails
                if (serverEmail !== storageEmail) {
                    router.replace('/');
                } 
            }
            catch (err) {
                router.replace('/');
                alert("Vous n'êtes pas connecté.");
            }
        }
        token();
    }, []);
}