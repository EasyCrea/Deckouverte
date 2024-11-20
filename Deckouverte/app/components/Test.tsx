import { PropsWithChildren, useState } from 'react';
import { StyleSheet, TouchableOpacity, View, Text } from 'react-native';


export function Test({ children, title }: PropsWithChildren & { title: string }) {
  

  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
      }}
    >
      <Text>{title}</Text>
        {children}
    </View>
  );
  };
