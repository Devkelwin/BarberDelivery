import {Box,Text, Center,Pressable,IPressableProps} from 'native-base'
import React from 'react'
type ButtonProps = IPressableProps & {
    title: string
}
export function ButtonApp({title,...rest}: ButtonProps){
    return(
       <Pressable
       {...rest}
       >
        <Box  mx={9}
        h={100}
        rounded={20}
        mb={4}
        mt={8}
        
       borderWidth={4}
       borderColor={'white.normal'}
        bg={'black.normal'}>


        <Center flex={1}>
             <Text textAlign={'center'} fontSize={25} color={'white.normal'}>{title}</Text>
        </Center>
       
       
        </Box>
        </Pressable>
    )
}