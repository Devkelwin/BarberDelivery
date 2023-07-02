import {NavigationContainer,DefaultTheme,NavigationProp} from '@react-navigation/native'
import {createNativeStackNavigator} from '@react-navigation/native-stack'
import { InitialScreen } from '../screens/InitialScreen'
import { Login } from '../screens/Login'
import { THEME } from '../theme'
import {Box,useTheme} from 'native-base'
import { Cadastro } from '../screens/Cadastro'
import { AuthRoutes } from './auth.routes'
import { AppRoutes } from './app.routes'
import React,{useEffect,useState} from 'react'
import auth,{FirebaseAuthTypes} from '@react-native-firebase/auth'
import { Combos } from '../screens/Combos'
import { Services } from '../screens/Services'

 

export function Routes(){
    const {colors} = useTheme()
    const theme = DefaultTheme
    const [user,setUser] = useState<FirebaseAuthTypes.User | null>(null)
  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(setUser)
    return subscriber
  },[])
    theme.colors.background = colors.black
    
return(
    <Box flex={1} >
    <NavigationContainer theme={theme}>
      
   {user ? <AppRoutes/> : <AuthRoutes/>}
    </NavigationContainer>
    
    </Box>
    
)
}