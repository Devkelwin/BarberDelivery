import {Button as NativeBaseButton,IButtonProps,Text,ITextProps, Center} from 'native-base'
import React from 'react'
type ButtonProps = IButtonProps & {
    title: string
}
type TextProps = ITextProps & {
    textSize: number
}
export function AcceptServieButton({title,...rest}: ButtonProps,{textSize}: TextProps){
    return(
        <NativeBaseButton
        w={300}
        rounded={5}
      h={50}
        bg={'gray.700'}
        mb={7}
        alignItems="center"
        justifyContent={'center'}
        mt={2}
        {...rest}
        >
            <Center >
                <Text  textAlign={'center'}  fontSize={15} fontFamily={'Tilt'} color={'white.normal'}>{title}</Text>
            </Center>
            
        </NativeBaseButton>
    )
}