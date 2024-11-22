import { View } from "react-native";
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
    </View>
  );
}
