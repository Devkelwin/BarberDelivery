import {Input as NativeBaseInput,IInputProps,FormControl,Text, VStack,} from 'native-base'
import {ImageProps,TextProps,View} from 'react-native'
import { TextInputMask, TextInputMaskProps,TextInputMasked } from 'react-native-masked-text';
import {Ionicons,Fontisto,AntDesign,MaterialIcons,FontAwesome,MaterialCommunityIcons} from '@expo/vector-icons'
import React from 'react'
type Props = TextInputMaskProps ;



export function DataInput({...rest} : Props){
   
return(
    <FormControl  mb={5}>
    <TextInputMask
   
    style={{backgroundColor: 'white',
    height: 58,
    paddingHorizontal: 15,
    alignItems: 'center',
    justifyContent: 'space-between',
    color: 'black',
    borderRadius: 22,
    fontSize: 16,
    left: 9
}}
    
  
  
  
     {...rest}
    
    > 
     
    </TextInputMask>
   
</FormControl>

)
}