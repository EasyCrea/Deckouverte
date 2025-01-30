import { Slot } from 'expo-router';
import { View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import "./global.css";

export default function Layout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View style={{ flex: 1 }}>
        <Slot />
      </View>
    </GestureHandlerRootView>
  );
}