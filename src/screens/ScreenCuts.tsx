import {Box, Text,Image,Center, ScrollView,useToast} from 'native-base'
import { ServiceCard } from '../components/ServiceCard'
import React,{useState,useEffect} from 'react'
import { AppNavigatorRoutesProps } from '../routes/app.routes'
import { BackButton } from '../components/BackButton'
import { useNavigation,useRoute } from '@react-navigation/native'
import {AntDesign} from '@expo/vector-icons'
import auth from '@react-native-firebase/auth'
import firestore from '@react-native-firebase/firestore'

export function ScreenCuts(){
   
    const {navigate} = useNavigation<AppNavigatorRoutesProps>()
  
   
  const [userId, setUserId] = useState('');

  const handleAddToCart = (service,price,quantity = 1) => {
    const cartItem = {
      productName: service,
      price: price,
      quantity: quantity,
      userId: userId
    };
    const cartRef = firestore().collection('cart');
    cartRef
      .where('userId', '==', cartItem.userId)
      .where('productName', '==', cartItem.productName)
      .where('price', '==', cartItem.price)
      .get()
      .then((querySnapshot) => {
        if (querySnapshot.empty) {
          // Item doesn't exist yet, add as new item
          cartRef.add(cartItem);
        } else {
          // Item already exists, update quantity
          querySnapshot.forEach((doc) => {
            const existingItem = doc.data();
            const updatedQuantity = existingItem.quantity + cartItem.quantity;
            doc.ref.update({ quantity: updatedQuantity });
          });
        }
      })
      .catch((error) => console.error('Erro ao adicionar produto ao carrinho: ', error));
  
    navigate('Cart');
  };

  
  
    useEffect(() => {
      const unsubscribeAuth = auth().onAuthStateChanged((user) => {
        if (user) {
          setUserId(user.uid);
        } else {
          setUserId('');
        }
      });
      unsubscribeAuth
    }
    
    )

    
       
      
 
    return(
        <Box flex={1} bg={'white.normal'} > 
        <ScrollView mt={10}>
          <Box mx={3} mb={4}>
             <AntDesign name='arrowleft' size={35} onPress={() => navigate('BarberServices')} />
          </Box>
          
            <Center mt={24}>
         <Center >
              
                <Text  textAlign={'center'}  fontSize={25}  fontFamily={'Tilt'} color={'black.normal'}>Escolha o serviço que deseja</Text>
              <Text mt={4} fontFamily={'Tilt'} fontSize={22} color={'black.normal'}>Barbearia</Text>
              </Center>
                
            <ServiceCard service='Corte de Cabelo Completo (Corte de cabelo + Barba + Bigode)' price='1000 KZ' onPress={() => handleAddToCart('Corte de Cabelo Completo', 1000)}/>
            <ServiceCard service='Corte de Cabelo Personalizado (Cabelo + Barba + Bigode + Pintura )' price='1500 KZ'onPress={() => handleAddToCart('Corte de Cabelo Personalizado', 1500)} />
        
         
           
            </Center>
          </ScrollView>
        </Box>
    )
}