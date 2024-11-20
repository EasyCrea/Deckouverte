import { Text, View } from "react-native";
import { Getdeck } from './components/Getdeck';

export default function Index() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
    <Getdeck />
    </View>
  );
}
