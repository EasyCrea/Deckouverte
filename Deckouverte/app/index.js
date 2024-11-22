import { View,  Pressable, Text, StyleSheet } from "react-native";
import { Getdeck } from "./Fetch/Getdeck";
import { Login } from "./page/Connexion/login";


export default function Index() {
  return (
    <View
      style={{
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Login/>
      <Getdeck />
    </View>
  );
}
