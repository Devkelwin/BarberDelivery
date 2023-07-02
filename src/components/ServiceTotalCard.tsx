import { Box, Pressable,Text, VStack,HStack, IPressableProps } from "native-base";
import {Ionicons} from '@expo/vector-icons'
export type ServiceProps = IPressableProps & {
    service: string | number
    price: string
    name?: string
}
export function ServiceTotalCard({service,price,name,...rest}: ServiceProps){
    return(
        <Pressable {...rest}>
            
            <Box 
            bg={'gray.600'}
           rounded={15}
            
            mt={4}
            mb={3}
            mx={5}
            borderLeftColor={'white.normal'}
            borderLeftWidth={6}
            justifyContent={'center'}
            > 
            <HStack justifyContent='space-between' >
            
                <VStack mb={2}>
                    <HStack>
                    <Text fontSize={21} mx={5} my={3} fontFamily={'Tilt'} color={'white.normal'}>{name}</Text>
                    <Text fontSize={20} mx={5} my={3} fontFamily={'Tilt'} color={'white.normal'}>{price}</Text>
                    </HStack>
                    
                      <Text fontFamily={'Tilt'}  fontSize={19}  mx={4} my={1} color={'white.normal'}  >{service}</Text>
                </VStack>
            
          
            </HStack>
             
                
           
            
            </Box>
        </Pressable>
    )
}