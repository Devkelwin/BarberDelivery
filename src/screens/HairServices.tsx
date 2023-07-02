import { useNavigation } from '@react-navigation/native'
import {Box,Center,Text,Image} from 'native-base'
import { BackButton } from '../components/BackButton'
import { AppNavigatorRoutesProps } from '../routes/app.routes'
import { StatusBar } from 'expo-status-bar';
import {AntDesign} from '@expo/vector-icons'
export function HairServices(){
    const navigation = useNavigation<AppNavigatorRoutesProps>()
    const {navigate} = useNavigation<AppNavigatorRoutesProps>()
return(
    <Box bg={'white.normal'} flex={1}  justifyContent={'center'}>
         <StatusBar   translucent style='light' backgroundColor='transparent'/>
         <Box mx={5} mt={16}>
             <AntDesign name='arrowleft' size={35}  onPress={() => navigation.navigate('Services')}/>
          </Box>
        <Center  flex={1} justifyContent='center'>
          <Image alt='image' h={250} mb={8}  w={250} source={require('../assets/Logo-Barber.png')}/>
        <Text fontFamily={'Adam'} fontSize={31} mt={10}  color={'black.normal'} onPress={() => navigation.navigate('Makeup')}>
        Maquilhagem 
            </Text>

        <Text fontFamily={'Adam'} fontSize={31}   mt={10}  color={'black.normal'} onPress={() => navigation.navigate('Wigs')}>
        Perucas
            </Text>
        <Text fontFamily={'Adam'} fontSize={31}  mt={10}   color={'black.normal'} onPress={() => navigation.navigate('Braids')}>
        Tranças 
            </Text>
      
</Center>
 
    </Box>
    
)
}