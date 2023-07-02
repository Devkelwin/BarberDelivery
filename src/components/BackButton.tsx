import {Box,Text, Center,Pressable,IPressableProps} from 'native-base'
import React from 'react'
type ButtonProps = IPressableProps & {
    title?: string
}
export function BackButton({title,...rest}: ButtonProps){
    return(
       <Pressable
       alignItems='flex-end'
       justifyContent={'flex-end'}
      
     {...rest}
       >

        <Box  
        h={60}
      w={200}
       
        mb={4}
       
       borderWidth={4}
       borderColor={'white.normal'}
        bg={'black.normal'}>

       <Box borderWidth={1}
       borderColor={'gray.500'}
      mx={1.5}
      my={1}
      rounded={7}
       flex={1}
       >
        <Center flex={1}>
              {title ? 
               <Text fontSize={22} color={'white.normal'}>{title}</Text>
               :
               <Text fontSize={22} color={'white.normal'}>Voltar</Text>
            }
        </Center>
       
       </Box>
        </Box>
        </Pressable>
    )
}