import { View, StyleSheet, Pressable, Text} from "react-native";
import  Getdeck  from "../Fetch/Getdeck";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";


export default function Home() {
  const router = useRouter();
  return (
    <SafeAreaView style={styles.container}>
      <Getdeck />
      
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f7ff",
  },
  
});
