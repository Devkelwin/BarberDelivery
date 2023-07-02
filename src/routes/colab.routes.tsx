import {NavigationContainer,DefaultTheme,NavigationProp} from '@react-navigation/native'
import {createNativeStackNavigator} from '@react-navigation/native-stack'

import { THEME } from '../theme'
import {Box,useTheme} from 'native-base'
import { Cadastro } from '../screens/Cadastro'
import React from 'react'
import { Home } from '../screens/ColaboradorScreens/Home'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { Orders } from '../screens/ColaboradorScreens/Orders'
import { OrderInfo } from '../screens/ColaboradorScreens/OrderInfo'
import {Entypo,FontAwesome5,MaterialIcons,AntDesign} from '@expo/vector-icons'
import { OrdersAccept } from '../screens/ColaboradorScreens/OrdersAccept'
import { createDrawerNavigator } from '@react-navigation/drawer';
import {ColaboradorChat} from '../screens/ColaboradorScreens/ColaboradorChat'
import { MensagensColabo } from '../screens/ColaboradorScreens/MensagensColabo'
import { TimerScreen } from '../screens/TimerScreen'
import { RankScreen } from '../screens/RankScreen'
type Screens = {
    Home: undefined
    Orders: undefined
    OrderInfo: { orderId: string };
    ColaboradorChat: undefined;
    MensagensColabo: undefined
}
export type ColabNavigatorRoutesProps = NavigationProp<Screens>
export function ColabRoutes(){
    const {colors} = useTheme()
    const theme = DefaultTheme
    theme.colors.background = colors.black
    const Drawer = createDrawerNavigator()
return(
   
   
        <Drawer.Navigator screenOptions={{headerShown: false}}>
            
              
             <Drawer.Screen name='Home' component={Home} options={{drawerLabel: 'Tela Principal'}} /> 
             <Drawer.Screen name='Orders' component={Orders} options={{drawerLabel: 'Pedidos'}} /> 
              <Drawer.Screen name='OrdersAccept' component={OrdersAccept} options={{drawerLabel: 'Pedidos Aceitos'}} /> 
                <Drawer.Screen name='MensagensColabo' options={{drawerLabel: 'Mensagens'}}   component={MensagensColabo}/>
              <Drawer.Screen name='ColaboradorChat' component={ColaboradorChat} options={{drawerLabel: () => null,drawerActiveBackgroundColor: 'white'}} /> 
              
             <Drawer.Screen name='OrderInfo' options={{drawerLabel: () => null,drawerActiveBackgroundColor: 'white'}}  component={OrderInfo}/>
             <Drawer.Screen  options={{drawerLabel: () => null,drawerActiveBackgroundColor: 'white'}} name='TimerScreen' component={TimerScreen}  />
            <Drawer.Screen  options={{drawerLabel: () => null,drawerActiveBackgroundColor: 'white'}}   name='RankScreen' component={RankScreen}  />
           
        </Drawer.Navigator>
    
   
)
}