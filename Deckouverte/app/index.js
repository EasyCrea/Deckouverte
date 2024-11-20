import { Text, View } from "react-native";
import { Test } from './components/Test';
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
      <Text>Edit app/index.tsx to edit this screen.</Text>
      <Test title="Hello World">
        <Text>Je suis le meilleur</Text>
        <Getdeck />
      </Test>

    </View>
  );
}
