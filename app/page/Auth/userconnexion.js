import { View, StyleSheet } from "react-native";
import  Login  from "./login";
import  Register  from "./register";
import { useGlobalSearchParams } from "expo-router/build/hooks";
import { useRouter } from "expo-router";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect } from "react";


export default function Index() {
    const router = useRouter();
    useEffect(() => {
        const clear = async () => { 
          await AsyncStorage.removeItem('token');
        }
        clear();
      }
      , []);
      
    const { page } = useGlobalSearchParams();
    if (page === "connexion") {
        return (
            <View style={styles.container}>
                <Login />
            </View>
        );
    } else if (page === "register") {
        return (
            <View style={styles.container}>
                <Register />
            </View>
        );
    }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F4F3FE",
  },

});
