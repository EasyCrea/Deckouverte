import { View,  Pressable, Text, StyleSheet } from "react-native";
import { Getdeck } from "./components/Getdeck";


export default function Index() {
  return (
    <View
      style={{
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Getdeck />
    </View>
  );
}
