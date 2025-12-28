import React from 'react';
import { Provider as PaperProvider } from 'react-native-paper';
import { NavigationContainer } from '@react-navigation/native';
import AppNavigator from './src/navigation/AppNavigator';
import { StatusBar } from 'expo-status-bar';

export default function App() {
  return (
    <PaperProvider>
      <NavigationContainer>
        <StatusBar style="auto" />
        <AppNavigator />
      </NavigationContainer>
    </PaperProvider>
  );
}
