import { Box, Pressable,Text, VStack,HStack, IPressableProps } from "native-base";
import {Ionicons} from '@expo/vector-icons'
export type ServiceProps = IPressableProps & {
    service: string
    price: string
}
export function ServiceCard({service,price,...rest}: ServiceProps){
    return(
        <Pressable {...rest}>
            
            <Box 
            bg={'black.normal'}
           rounded={15}
            h={140}
            mt={4}
            mb={3}
            mx={5}
            borderLeftColor={'white.normal'}
            borderLeftWidth={6}
            justifyContent={'center'}
            > 
            <HStack justifyContent='space-between' >
                <VStack mb={2}>
                      <Text fontSize={19} mx={5} my={3} fontFamily={'Tilt'} color={'white.normal'}>{price}</Text>
                      <Text fontFamily={'Tilt'}  fontSize={17}  mx={4} my={1} color={'white.normal'}  >{service}</Text>
                </VStack>
            
          
            </HStack>
             
                
           
            
            </Box>
        </Pressable>
    )
}