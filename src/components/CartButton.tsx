import {Button as NativeBaseButton,IButtonProps,Text,ITextProps} from 'native-base'
import React from 'react'
type ButtonProps = IButtonProps & {
    title: string
}
type TextProps = ITextProps & {
    textSize: number
}
export function CartButton(  {title,...rest}: ButtonProps,{textSize}: TextProps){
    return(
        <NativeBaseButton
        w={24}
        rounded={5}
        bg={'gray.700'}
        mb={7}
        mt={4}
        {...rest}
        >
            <Text  textAlign={'center'} fontSize={15} fontFamily={'Tilt'} color={'white.normal'}>{title}</Text>
        </NativeBaseButton>
    )
}