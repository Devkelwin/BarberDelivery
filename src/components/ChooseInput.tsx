import {Input as NativeBaseInput,IInputProps,FormControl,Text, VStack,Select,ISelectProps,ISelectItemProps} from 'native-base'
import {ImageProps,TextProps,View} from 'react-native'
import React from 'react'
type Props = ISelectProps & {
    errorMessage?: string | null;
    phone?: true
}
export function ChooseInput({errorMessage = null,phone,...rest}: Props){
    
return(
    <FormControl  mb={5}>
    <Select
    bg="white.normal"
    h={58}
    px={4}
    w={350}
  alignItems={'center'}
  justifyContent={'space-between'}
    rounded={22}
    borderWidth={0}
    fontSize="md"
    color="black.normal"
    
   
   
     {...rest}
    
    >
    </Select>
     
</FormControl>

)
}