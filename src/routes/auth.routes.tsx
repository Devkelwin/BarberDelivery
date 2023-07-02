import {NavigationContainer,DefaultTheme,NavigationProp} from '@react-navigation/native'
import {createNativeStackNavigator} from '@react-navigation/native-stack'
import { InitialScreen } from '../screens/InitialScreen'
import { Login } from '../screens/Login'
import {createDrawerNavigator} from '@react-navigation/drawer'
import {Box} from 'native-base'
import { Cadastro } from '../screens/Cadastro'
import React from 'react'
type Screens = {
    Login: undefined
    InitialScreen: undefined
    Cadastro: undefined
}
export type AppNavigatorRoutesProps = NavigationProp<Screens>
export function AuthRoutes(){
   
   
    
    const {Screen,Navigator} = createNativeStackNavigator()
return(
    <Box flex={1} >
   
        <Navigator screenOptions={{headerShown: false}}>
             <Screen name='InitialScreen' component={InitialScreen}/>
             <Screen name='Login' component={Login}/>
            <Screen name='Cadastro' component={Cadastro}/>
           

        </Navigator>
    
    </Box>
)
}