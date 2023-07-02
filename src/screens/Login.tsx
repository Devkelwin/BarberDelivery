import {useState} from 'react'
import React from 'react'
import {Box,Text,Center,Image,HStack,useToast,ScrollView,} from 'native-base'
import { Button } from '../components/Button'
import { Input } from '../components/Input'
import {AntDesign,FontAwesome,MaterialCommunityIcons,MaterialIcons} from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native'
import { AppNavigatorRoutesProps } from '../routes/auth.routes'
import {Controller,useForm} from 'react-hook-form'
import * as yup from 'yup'
import {yupResolver} from '@hookform/resolvers/yup'
import auth from '@react-native-firebase/auth'
import { AppError } from '../utils/AppError'
import { Alert } from 'react-native'
type FormatDataProps = {
   email: string
   password: string
}
 const signinSchema = yup.object({
      email: yup.string().required('Informe um Telefone').email('Email Inválido'),
      password: yup.string().required('Informe a Senha')
   })

export function Login(){
   const [isLoading,setIsLoading] = useState(false)

    const navigation = useNavigation<AppNavigatorRoutesProps>()
   const toast = useToast()
   const {handleSubmit,control,formState:{errors}} = useForm<FormatDataProps>({
      resolver: yupResolver(signinSchema)
   })

   async function handleSign({email,password}: FormatDataProps){
     setIsLoading(true)

     
           auth().signInWithEmailAndPassword(email,password)
     .then(() => toast.show({
      placement: 'top',
      title: 'Login feito com Sucesso',
      bg: 'green.600'
     }))
     .catch((error) => console.log(error)).finally(() => setIsLoading(false))

     
     
     
   
   }
   

    return(
     
            <Box flex={1} bg={'black.normal'}>
            
              
            <Center flex={1} mx={30} >
                <Image alt='image' h={270} mb={8}  w={270} source={require('../assets/Logo-Barberb.png')}/>
                <Controller
                control={control}
                name='email'
                render={({field:{onChange,value}}) => (
                    <Input value={value} errorMessage={errors.email?.message} onChangeText={onChange}  placeholder='Email' InputRightElement={
                    <MaterialIcons name='email' size={18} style={{marginRight: 18}}/>
                 }/>
                )}
                />

                <Controller
                control={control}
                name='password'
                render={({field:{onChange,value}}) => (
                     <Input  type='password'  value={value} placeholder='Senha'  errorMessage={errors.password?.message} onChangeText={onChange} InputRightElement={
                    <MaterialCommunityIcons name='lock' size={18} style={{marginRight: 18}}/>
                 }/>
                )}
                />
               
              
                 <Button isLoading={isLoading} title='Entrar' onPress={handleSubmit(handleSign)}/>
                 <HStack>
                     <Text color={'white.normal'}>Ainda não tem uma conta?  </Text>
                     <Text color={'white.normal'} textDecorationLine={'underline'} onPress={() => {
                        navigation.navigate('Cadastro')
                     }}>Cadastrar-se</Text>
                 </HStack>
                
            </Center>
           
          
          </Box>
      
    )
}