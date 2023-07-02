import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text,View,ActivityIndicator } from 'react-native';
import {NativeBaseProvider} from 'native-base'
import { Routes} from './src/routes/index';
import { THEME } from './src/theme';
import React from 'react'
import 'expo-dev-client';
import {NavigationContainer} from '@react-navigation/native'
import { useFonts } from 'expo-font';
import { CartContextProvider } from './src/contexts/CartContext';
export default function App() {
  const [fontsLoaded] = useFonts({
    'Tilt': require('./src/assets/fonts/TiltWarp-Regular.ttf'),
    'Galano': require('./src/assets/fonts/Galano.otf'),
    'Adam': require('./src/assets/fonts/Adam.otf'),
  });

 
  return (
    
    <NativeBaseProvider theme={THEME}>
       
      <StatusBar translucent style='light' backgroundColor='transparent'/>
    
      <CartContextProvider>
       
     {fontsLoaded ? <Routes/> : <ActivityIndicator style={{flex: 1}}/>}
  
     </CartContextProvider>
     
    </NativeBaseProvider>
  );
}

