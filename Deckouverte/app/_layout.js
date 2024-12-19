import { Slot } from 'expo-router';
import { View } from 'react-native';
import "./global.css";

export default function Layout() {
  return (
    <View style={{ flex: 1 }}>
      <Slot />
    </View>
  );
}
