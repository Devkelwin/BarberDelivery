import {Box, Text,Image,Center, ScrollView,useToast} from 'native-base'
import { ServiceCard } from '../components/ServiceCard'
import React,{useState,useEffect} from 'react'
import { AppNavigatorRoutesProps } from '../routes/app.routes'
import { BackButton } from '../components/BackButton'
import { useNavigation,useRoute } from '@react-navigation/native'
import auth from '@react-native-firebase/auth'
import firestore from '@react-native-firebase/firestore'
import { ServiceCard2 } from '../components/ServiceCard2'
import {AntDesign} from '@expo/vector-icons'
export function Combos(){
   
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
      return unsubscribeAuth
    }
    
    )

    
       
      
 
    return(
        <Box flex={1} bg={'white.normal'} justifyContent={'center'}> 
        <ScrollView mt={10}>
        <Box mx={3} mb={4}>
             <AntDesign name='arrowleft' size={35} onPress={() => navigate('BarberServices')} />
          </Box>
         <Center mt={8}>
                  
                
                <Text  textAlign={'center'}  fontSize={25}  fontFamily={'Tilt'} color={'black.normal'}>Escolha o serviço que deseja</Text>
              <Text mt={4} fontFamily={'Tilt'} fontSize={22} color={'black.normal'}>Barbearia</Text>
              </Center>
                
            <ServiceCard2 service='Corte Completo + Manicure + Pedicure' price='2500 KZ' onPress={() => handleAddToCart('Corte Completo + Manicure + Pedicure', 2500)}/>
            <ServiceCard2 service='Manicure + Pedicure' price='1500 KZ'onPress={() => handleAddToCart('Manicure + Pedicure', 1500)} />
            <ServiceCard2 service='Manicure + Pedicure completo' price='2000 KZ'onPress={() => handleAddToCart('Manicure + Pedicure completo', 2000)} />
            <Center>
            
            </Center>
          </ScrollView>
        </Box>
    )
}