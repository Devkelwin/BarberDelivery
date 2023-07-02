import {useState,useEffect,useCallback}from 'react'
import {Box} from 'native-base'
import {useNavigation,useFocusEffect} from '@react-navigation/native'
import {ActivityIndicator,Image} from 'react-native'
import { AppNavigatorRoutesProps } from '../routes/auth.routes'
import React from 'react'

export function InitialScreen(){
    const navigation = useNavigation<AppNavigatorRoutesProps>()
   
        const [text, setText] = useState('');
        const [animate, setAnimate] = useState(true);

        useEffect(() => {
            if (!animate) {
                setText("Value updated \n successfully");
            }
        }, [animate]);
        
        useFocusEffect(
            useCallback(() => {
                setTimeout(() => {
                    setText("Value updated \n successfully");
                    setAnimate(false);
                }, 4000,);
              
               
            },[animate])
        )
       
       
       
            
    
    
    return(
        <Box alignItems={'center'} justifyContent={'center'} flex={1}>
              <ActivityIndicator animating={animate} 
                color="black"  size={50}/>
                {animate ?   <Image source={require('../assets/Logo-Barber.png')} 
                style={{height:400,width:400}}/> : navigation.navigate('Login') }
            
        </Box>
    )

}