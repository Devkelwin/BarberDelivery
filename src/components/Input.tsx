import {Input as NativeBaseInput,IInputProps,FormControl,Text, VStack,} from 'native-base'
import {ImageProps,TextProps,View} from 'react-native'
import React from 'react'
type Props = IInputProps & {
    errorMessage?: string | null;
    phone?: true
}
export function Input({errorMessage = null,isInvalid,phone,...rest}: Props){
    const Invalid = !!errorMessage || isInvalid
return(
    <FormControl isInvalid={Invalid} mb={5}>
    <NativeBaseInput
    bg="white.normal"
    h={58}
    px={4}
  
  alignItems={'center'}
  justifyContent={'space-between'}
    rounded={22}
    borderWidth={0}
    fontSize="md"
    color="black.normal"
  
   isInvalid={Invalid}
   _invalid={{
    borderWidth: 1,
    borderColor: "red.500"
   }}
    placeholderTextColor="black.normal"
    _focus={{
        bg:"white.normal",
        borderWidth: 1,
        borderColor: "gray.500"
    }}
     {...rest}
    
    >
    </NativeBaseInput>
      <FormControl.ErrorMessage _text={{color: "red.500"}}>
        {errorMessage}
     </FormControl.ErrorMessage>
</FormControl>

)
}