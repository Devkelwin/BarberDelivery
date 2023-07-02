import {Box,Center,HStack,Image,Text,ScrollView,useToast} from 'native-base'
import {useRef, useState} from 'react'
import {useNavigation} from '@react-navigation/native'
import { Input } from '../components/Input'
import { Button } from '../components/Button'
import { AppNavigatorRoutesProps } from '../routes/auth.routes'
import * as yup from 'yup'
import { TextInputMasked } from 'react-native-masked-text';

import {yupResolver} from '@hookform/resolvers/yup'
import {Controller,useForm} from 'react-hook-form'
import {Ionicons,Fontisto,AntDesign,MaterialIcons,FontAwesome,MaterialCommunityIcons} from '@expo/vector-icons'
import auth from '@react-native-firebase/auth'
import firestore from '@react-native-firebase/firestore'
import { AppError } from '../utils/AppError'
import React,{useEffect} from 'react'
import { Alert } from 'react-native'
import {Picker} from '@react-native-picker/picker';
import uuid from 'uuid';
import { ChooseInput } from '../components/ChooseInput'
import { DataInput } from '../components/DataInput'
type FormatDataProps = {
    email: string
    password: string
    sex: string
    nasciment: string
    name: string
    phone: string
    
 }
 const signupSchema = yup.object({
    email: yup.string().required('Informe um Email').email('Insira um Email Valido').lowercase('O Email deve conter apenas letras minusculas'),
    password: yup.string().required('Informe a Senha').min(6, 'A senha deve conter no minimo 6 letras ou numeros'),
    name: yup.string().required('Informe o Nome'),
    nasciment: yup.string().required('Informe a Data').min(10, 'A Data deve ser informada na formatação correta; Ex: 20/02/2000'),
    phone: yup.string().required('Informe o seu Telefone'),
    sex: yup.string().required('Informe o seu sexo')
 })
export function Cadastro(){
  const sexOptions = [
    { value: 'Masculino', label: 'Masculino' },
    { value: 'Feminino', label: 'Feminino' },
   
  ];
  const [selectedSexValue, setSelectedSexValue] = useState(sexOptions[0].value);
    const [isLoading,setIsLoading] = useState(false)
    const [email, setEmail] = useState('');
    const openpicker = useRef(null)
   
    const [userId, setUserId] = useState('');
    const {control,handleSubmit,formState:{errors}} = useForm<FormatDataProps>({
        resolver: yupResolver(signupSchema)
    })
    const toast = useToast()
    const {navigate} = useNavigation()
    
    async function handleSignUp({email,password,name,nasciment,sex,phone}: FormatDataProps){
        const info = {
            name: name,
            Nascimento: nasciment,
            sex: selectedSexValue, // nova propriedade
           
            email: email,
            phone: phone
          }

        setIsLoading(true)

        firestore()
        .collection('Informations')
        .add(info)
        .then(() => console.log('Informações Adicionadas'))
        .catch((error) => console.error('Erro ao adicionar Informações: ', error));
  
       
        auth()
        .createUserWithEmailAndPassword(email,password)
        .then(() => toast.show({
          placement: 'top',
          title: 'Cadastro feito com Sucesso',
          bg: 'green.600'
         }))
        .catch((error => console.log(error)))
        .finally(() => setIsLoading(false))



    }
   
    useEffect(() => {
        const unsubscribeAuth = auth().onAuthStateChanged((user) => {
          if (user) {
            setUserId(user.uid);
            setEmail(user.email)
          } else {
            setUserId('');
            setEmail('')
          }
        });
         
        return unsubscribeAuth
       
      }
      
      )
  
      
    
    const navigation = useNavigation<AppNavigatorRoutesProps>()
    return(
        
            <ScrollView flex={1} bg={'black.normal'}  >
            <Center flex={1} mx={30} my={10}>
            <Image alt='image' h={180} mb={8}  w={180} source={require('../assets/Logo-Barberb.png')}/>
            
            <Controller
            control={control}
            name='email'
            render={({field:{onChange,value}}) => (
                 <Input placeholder='Email' value={value} onChangeText={onChange} errorMessage={errors.email?.message} InputRightElement={<MaterialIcons name='email' size={20} style={{marginRight: 18}} />} />
            )}
            />
           
            
         
         
           
          
<Controller
            control={control}
            name='password'
            render={({field:{onChange,value}}) => (
                 <Input  type='password' placeholder='Senha' value={value} onChangeText={onChange} errorMessage={errors.password?.message} InputRightElement={<MaterialCommunityIcons name='lock' size={18} style={{marginRight: 18}}/>} />
            )}
            />

<Controller
            control={control}
            name='phone'
            render={({field:{onChange,value}}) => (
                 <Input placeholder='Telefone' value={value} onChangeText={onChange} errorMessage={errors.phone?.message} InputRightElement={<MaterialCommunityIcons name='phone' size={18} style={{marginRight: 18}}/>} />
            )}
            />

<Controller
            control={control}
            name='name'
            render={({field:{onChange,value}}) => (
                 <Input placeholder='Nome (Primeiro e Ultimo)' value={value} onChangeText={onChange} errorMessage={errors.name?.message} InputRightElement={<Ionicons name='person-circle' size={18} style={{marginRight: 18}}/>} />
            )}
            />
           
           <Controller
            control={control}
            name='nasciment'
            render={({field:{onChange,value}}) => (

              <HStack alignItems={'center'}>
                 <DataInput type='datetime' 
                  
                  placeholderTextColor={'black'} 
                   placeholder='Data de Nascimento' 
                   value={value}
                 
                    onChangeText={onChange}
                     
                     
                     />
                     <Fontisto name='date' style={{right: 28, bottom: 10}} size={18}/>
</HStack>
            )}
            />
           


            
<Controller
  control={control}
  name='sex'
  render={({ field: { onChange, value } }) => (
    <Box>
      <ChooseInput
      placeholder='Sexo'
      placeholderTextColor={'black.normal'}
        selectedValue={value}
       onTouchStart={() => toast.show({
        placement: 'top',
        title: 'Clique na Seta para escolher uma das opções',
        bg: 'red.600'
       })}
       
        onValueChange={(itemValue) => {
          onChange(itemValue);
          setSelectedSexValue(itemValue);

        }}>
         <Picker.Item />
        {sexOptions.map(({ value, label }) => (
           <Picker.Item key={value} value={value} label={label} />
        ))}
      </ChooseInput>
    </Box>
  )}
/>

           
            
            
            <Button title='Cadastrar' isLoading={isLoading} onPress={handleSubmit(handleSignUp)}/>
            <HStack>
            <Text color={'white.normal'}>Já possui uma conta?  </Text>
                     <Text color={'white.normal'} textDecorationLine={'underline'} onPress={() => {
                        navigation.navigate('Login')
                     }}>Entrar</Text>


                     </HStack>

            </Center>
            </ScrollView>
        
    )
}