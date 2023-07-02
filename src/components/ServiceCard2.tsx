import { Box, Pressable,Text, VStack,HStack, IPressableProps } from "native-base";
import {Ionicons} from '@expo/vector-icons'
export type ServiceProps = IPressableProps & {
    service: string
    price: string
}
export function ServiceCard2({service,price,...rest}: ServiceProps){
    return(
        <Pressable {...rest}>
            
            <Box 
            bg={'black.normal'}
           rounded={15}
            h={130}
            mt={4}
            mb={5}
            mx={10}
          
            justifyContent={'center'}
            > 
            <HStack justifyContent='space-between' >
                <VStack mb={2}>
                      <Text fontSize={22} mx={5} my={3} fontFamily={'Tilt'} color={'white.normal'}>{price}</Text>
                      <Text fontFamily={'Tilt'}  fontSize={23}  mx={4} my={1} color={'white.normal'}  >{service}</Text>
                </VStack>
            
          
            </HStack>
             
                
           
            
            </Box>
        </Pressable>
    )
}