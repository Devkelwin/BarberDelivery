import { Box, Pressable,Text, VStack,HStack, IPressableProps } from "native-base";
import {Ionicons} from '@expo/vector-icons'
type Props = IPressableProps & {
    service: string
    price: string | number
}
export function CartCard({service,price,...rest}: Props){
    return(
        <Pressable {...rest}>
            
            <Box 
            bg={'gray.600'}
           rounded={8}
            h={120}
            w={64}
            mt={3}
            mb={3}
            mx={5}
            
            
            justifyContent={'center'}
            > 
            <HStack justifyContent='space-between' >
                <VStack mb={2}>
                      <Text fontSize={20} mx={5} my={2} fontFamily={'Tilt'} color={'yellow.light'}>{price}</Text>
                      <Text fontFamily={'Tilt'}  fontSize={20}  mx={4} my={1} color={'white.normal'}  >{service}</Text>
                </VStack>
            
          
            </HStack>
             
                
           
            
            </Box>
        </Pressable>
    )
}