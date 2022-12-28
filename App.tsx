import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { useFonts, Roboto_400Regular, Roboto_700Bold } from '@expo-google-fonts/roboto';

import { NativeBaseProvider } from "native-base";

import { THEME } from './src/styles/theme';

import { Loading } from './src/components/Loading';
import { Routes } from './src/routes';

export default function App() {
  const [fontsLoaded] = useFonts({
    Roboto_400Regular,
    Roboto_700Bold
  });

  return (
    <NativeBaseProvider theme={THEME}>
      <StatusBar
        backgroundColor='transparent'
        style="light"
        translucent
      />

      { fontsLoaded
        ? <Routes />
        : <Loading />
      }
    </NativeBaseProvider>
  );
}