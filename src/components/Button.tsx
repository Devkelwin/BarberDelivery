import {Button as NativeBaseButton,IButtonProps,Text} from 'native-base'
import React from 'react'
type ButtonProps = IButtonProps & {
    title: string
}
export function Button({title,...rest}: ButtonProps){
    return(
        <NativeBaseButton
        w={'full'}
        rounded={18}
        bg={'gray.700'}
        mb={7}
        {...rest}
        mt={10}
        >
            <Text fontFamily={'Tilt'} color={'white.normal'}>{title}</Text>
        </NativeBaseButton>
    )
}