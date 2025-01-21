import { validateToken } from "./Auth";
import { useEffect } from 'react';
import { useRouter } from 'expo-router';

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