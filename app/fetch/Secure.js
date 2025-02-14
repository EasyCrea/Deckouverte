import  AuthService  from "./Auth";
import { useEffect } from 'react';
import { useRouter } from 'expo-router';

export default function Secure(){
    const router = useRouter();

    useEffect(() => {
        const token = async () => { 
            try  {
                await AuthService.validateToken();
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

