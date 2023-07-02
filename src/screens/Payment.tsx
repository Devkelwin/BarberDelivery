import { useNavigation, useRoute } from '@react-navigation/native'
import {Box,Center,Text,Image} from 'native-base'
import { BackButton } from '../components/BackButton'
import { AppNavigatorRoutesProps } from '../routes/app.routes'
import { StatusBar } from 'expo-status-bar';
import {AntDesign} from '@expo/vector-icons'
import { ButtonApp } from '../components/ButtonApp';
import { SafeAreaView } from 'react-native';
interface RouteParams {
  orderId: string;
}
export function Payment(){
    const {navigate} = useNavigation<AppNavigatorRoutesProps>()
    const route = useRoute();
    const navigation = useNavigation<AppNavigatorRoutesProps>()
    const { orderId } = route.params as RouteParams;
    
return(
 
    <Box bg={'white.normal'} flex={1}  justifyContent={'center'}>
      
         <StatusBar translucent style='light' backgroundColor='transparent'/>
         <Box mx={5} mt={16}>
             <AntDesign name='arrowleft' size={35} onPress={() => navigation.navigate('Services')} />
          </Box>
        <Center  flex={1} justifyContent='center'>
          <Image alt='image' h={250} mb={8}  w={250} source={require('../assets/Logo-Barber.png')}/>
        <Text fontFamily={'Adam'} fontSize={27} mt={10}  color={'black.normal'} >
           Método de Pagamento:
            </Text>

        
          
      
</Center>
 
            <ButtonApp title='Dinheiro'/>
            <ButtonApp title=' Referência Bancária'/>
        
    </Box>
    
)
}