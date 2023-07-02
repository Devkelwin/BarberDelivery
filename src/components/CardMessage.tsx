import { Box, Pressable,Text, VStack,HStack, IPressableProps, Image } from "native-base";
import {Ionicons} from '@expo/vector-icons'
export type ServiceProps = IPressableProps & {
    name?: string
    phone?: string | number
}
export function CardMessage({name,phone,...rest}: ServiceProps){
    return(
        <Pressable {...rest}>
            
            <Box 
            bg={'black.normal'}
           
           w={380}
            h={145}
            mt={4}
            mb={3}
          mx={10}
        rounded={10}
        
            justifyContent={'center'}
            > 
            <HStack justifyContent='center' alignItems={'center'}>
                  <Image alt='image' h={32}   w={32} source={require('../assets/Logo-Barberb.png')}/>
                <VStack mb={2} alignItems={'center'} mt={3}>
              
                      <Text fontSize={21} mx={2} my={3} fontFamily={'Tilt'} color={'white.normal'} >{name}</Text>
                      <Text fontFamily={'Tilt'}  fontSize={21}  mx={2} my={1} color={'white.normal'}  >{phone}</Text>
                </VStack>
            
          
            </HStack>
             
                
           
            
            </Box>
        </Pressable>
    )
}