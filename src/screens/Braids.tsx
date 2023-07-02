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
export function Braids(){
   
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
        <Box flex={1} bg={'white.normal'} justifyContent={'center'}> 
        <ScrollView mt={10}>
        <Box mx={3} mb={10}>
             <AntDesign name='arrowleft' size={35} onPress={() => navigate('HairServices')} />
          </Box>

         <Center>
              
                
                <Text  textAlign={'center'}  fontSize={25}  fontFamily={'Tilt'} color={'black.normal'}>Escolha o serviço que deseja</Text>
              <Text mt={4} fontFamily={'Tilt'} fontSize={22} color={'black.normal'}>Tranças</Text>
              </Center>
                
            <ServiceCard2 service='Bob Americano: Fino' price='10000 KZ' onPress={() => handleAddToCart('Bob Americano: Fino', 10000)}/>
            <ServiceCard2 service='Bob Americano: Grosso' price='8000 KZ'onPress={() => handleAddToCart('Bob Americano: Grosso', 8000)} />
            <ServiceCard2 service='Cordolete' price='10000 KZ'onPress={() => handleAddToCart('Cordolete', 10000)} />
            <ServiceCard2 service='Dred: Curto' price='8000 KZ' onPress={() => handleAddToCart('Dred: Curto', 8000)}/>
            <ServiceCard2 service='Dred: Longo' price='10500 KZ'onPress={() => handleAddToCart('Dred: Longo', 10500)} />
            <ServiceCard2 service='Escama' price='7000 KZ'onPress={() => handleAddToCart('Escama', 7000)} />
            <ServiceCard2 service='Twist de Croject' price='8500 KZ' onPress={() => handleAddToCart('Twist de Croject', 8500)}/>
            <ServiceCard2 service='Twist de Sanguita' price='13000 KZ'onPress={() => handleAddToCart('Twist de Sanguita', 13000)} />
            <ServiceCard2 service='Pipoca: Curto' price='7000 KZ'onPress={() => handleAddToCart('Pipoca: Curto', 7000)} />
            <ServiceCard2 service='Pipoca: Longo' price='9000 KZ'onPress={() => handleAddToCart('Pipoca: Longo', 9000)} />
            <ServiceCard2 service='Viradas Americana' price='8000 KZ'onPress={() => handleAddToCart('Viradas Americana', 8000)} />

          
          </ScrollView>
        </Box>
    )
}