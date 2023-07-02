import {NavigationContainer,DefaultTheme,NavigationProp,RouteProp} from '@react-navigation/native'
import {createNativeStackNavigator} from '@react-navigation/native-stack'
import { InitialScreen } from '../screens/InitialScreen'
import { Login } from '../screens/Login'
import { THEME } from '../theme'
import {Box,useTheme} from 'native-base'
import { Cadastro } from '../screens/Cadastro'
import { Price } from '../screens/Price'
import React from 'react'
import { Services } from '../screens/Services'
import { HairServices } from '../screens/HairServices'
import { Barber } from '../screens/Barber'
import { BarberServices } from '../screens/BarberServices'
import { ScreenCuts } from '../screens/ScreenCuts'
import { Cart } from '../screens/Cart'
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs'
import { ConfirmScreen } from '../screens/ConfirmScreen'
import { Combos } from '../screens/Combos'
import { ManicureScreen } from '../screens/ManicureScreen'
import { Braids } from '../screens/Braids'
import { Wigs } from '../screens/Wigs'
import { Makeup } from '../screens/Makeup'
import {Entypo,FontAwesome,MaterialIcons} from '@expo/vector-icons'
import {TimerScreen}from '../screens/TimerScreen'
import { RankScreen } from '../screens/RankScreen'
import { ServicesAccept } from '../screens/ServicesAccept'
import { Profissional } from '../screens/Profissional'
import{useEffect,useState} from 'react'
import auth,{FirebaseAuthTypes} from '@react-native-firebase/auth'
import {Alert} from 'react-native'
import { ColabRoutes } from './colab.routes'
import { ClientInformation } from '../screens/ClientInformation'
import { Payment} from '../screens/Payment'
import { createDrawerNavigator } from '@react-navigation/drawer';
import {Mensagens} from '../screens/Mensagens'
import Chat from '../screens/Chat'
type ScreensAPP = {
    Price: undefined
    HairServices: undefined
    Barber: undefined
    BarberServices: undefined
    ScreenCuts: undefined
    Services: undefined
    Cart: undefined
    ConfirmScreen: undefined

    ManicureScreen: undefined
    Combos: undefined
    Makeup: undefined
    Wigs: undefined
    Braids: undefined
    TimerScreen: undefined
    Payment: undefined
    RankScreen: undefined
    ServicesAccept: undefined
    ClientInformation: undefined
    Profissional: undefined
    Mensagens: undefined
    Chat: undefined
    
}
export type AppNavigatorRoutesProps = NavigationProp<ScreensAPP>
export function AppRoutes(){
    const {colors} = useTheme()
    const [user,setUser] = useState<FirebaseAuthTypes.User | null>(null)
    const theme = DefaultTheme
    theme.colors.background = colors.black

    
    const Drawer = createDrawerNavigator();
    useEffect(() => {
        const subscriber = auth().onAuthStateChanged(setUser)
        return subscriber
      },[])

     
return(
    <Box flex={1} >
   
      
            {user?.email.includes('colaborador')?
            <ColabRoutes/>
            :
              <Drawer.Navigator initialRouteName='Services'  screenOptions={{headerShown: false} } >
                 <Drawer.Screen name='Services' component={Services} options={{drawerLabel: 'Tela Principal'}} />
                <Drawer.Screen name='Cart' component={Cart} options={{drawerLabel: 'Carrinho'}} />
                <Drawer.Screen name='ServicesAccept' component={ServicesAccept} options={{drawerLabel: 'Seus Serviços'}}/>
                <Drawer.Screen name='Mensagens' component={Mensagens} options={{drawerLabel: 'Mensagens'}}/>
            <Drawer.Screen   options={{drawerLabel: () => null,drawerActiveBackgroundColor: 'white'}} name='BarberServices' component={BarberServices}/>
             <Drawer.Screen  options={{drawerLabel: () => null,drawerActiveBackgroundColor: 'white'}} name='Price' component={Price} />
            <Drawer.Screen  options={{drawerLabel: () => null,drawerActiveBackgroundColor: 'white'}}  name='HairServices' component={HairServices} />
            <Drawer.Screen  options={{drawerLabel: () => null,drawerActiveBackgroundColor: 'white'}}  name='Barber' component={Barber} />
            <Drawer.Screen  options={{drawerLabel: () => null,drawerActiveBackgroundColor: 'white'}}  name='ScreenCuts' component={ScreenCuts}  />
              
                
             
            <Drawer.Screen  options={{drawerLabel: () => null,drawerActiveBackgroundColor: 'white'}}  name='ConfirmScreen' component={ConfirmScreen}  />
            <Drawer.Screen  options={{drawerLabel: () => null,drawerActiveBackgroundColor: 'white'}}  name='ClientInformation' component={ClientInformation} />
            < Drawer.Screen  options={{drawerLabel: () => null,drawerActiveBackgroundColor: 'white'}}  name='ManicureScreen' component={ManicureScreen} /> 
            
            <Drawer.Screen  options={{drawerLabel: () => null,drawerActiveBackgroundColor: 'white'}}  name='Combos' component={Combos} /> 
            <Drawer.Screen  options={{drawerLabel: () => null,drawerActiveBackgroundColor: 'white'}}       name='Makeup' component={Makeup}/>
            <Drawer.Screen   options={{drawerLabel: () => null,drawerActiveBackgroundColor: 'white'}}  name='Wigs' component={Wigs} />
            
            <Drawer.Screen  options={{drawerLabel: () => null,drawerActiveBackgroundColor: 'white'}}  name='Braids' component={Braids} />
            <Drawer.Screen  options={{drawerLabel: () => null,drawerActiveBackgroundColor: 'white'}} name='TimerScreen' component={TimerScreen}  />
            <Drawer.Screen  options={{drawerLabel: () => null,drawerActiveBackgroundColor: 'white'}}   name='RankScreen' component={RankScreen}  />

            <Drawer.Screen  options={{drawerLabel: () => null,drawerActiveBackgroundColor: 'white'}}   name='Payment' component={Payment}   />
           
                
             
              <Drawer.Screen  options={{drawerLabel: () => null,drawerActiveBackgroundColor: 'white'}}   name='Profissional' component={Profissional}  />
              <Drawer.Screen  options={{drawerLabel: () => null,drawerActiveBackgroundColor: 'white'}}   name='Chat' component={Chat}  />
        </Drawer.Navigator>
        
            }
           
 
    </Box>
)
}