import React, { useState, useEffect } from 'react';
import { View } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import {Text,Box, Center, HStack, ScrollView, Image, VStack, Pressable} from 'native-base'
import { ServiceCard } from '../components/ServiceCard';
import { CartCard } from '../components/CartCard';
import { ButtonApp } from '../components/ButtonApp';
import { CartButton } from '../components/CartButton';
import { useNavigation } from '@react-navigation/native';
import {Ionicons,AntDesign} from '@expo/vector-icons'
import { AppNavigatorRoutesProps } from '../routes/app.routes';
export function Cart(){
  const [cartItems, setCartItems] = useState([]);
  const [userId, setUserId] = useState('');
 
  const {navigate} = useNavigation<AppNavigatorRoutesProps>()
  const totalPrice = cartItems.reduce((accumulator, item) => accumulator + item.price * item.quantity, 0);
  useEffect(() => {
    const unsubscribeAuth = auth().onAuthStateChanged((user) => {
      if (user) {
        setUserId(user.uid);
      } else {
        setUserId('');
      }
    });


    const unsubscribeCart = firestore()
      .collection('cart')
      .where('userId', '==', userId)
      .onSnapshot((querySnapshot) => {
        const items = [];
        let total = 0;

        querySnapshot.forEach((doc) => {
          items.push({ id: doc.id, ...doc.data() });
          const item = { id: doc.id, ...doc.data() };
          
         
          total += doc.data().price;
        });
        setCartItems(items);
        
      });

    return () => {
      unsubscribeAuth();
      unsubscribeCart();
    };
  }, [userId]);

  const handleRemoveItem = (itemId) => {
    firestore()
      .collection('cart')
      .doc(itemId)
      .delete()
      .then(() => console.log('Item removido do carrinho!'))
      .catch((error) => console.error('Erro ao remover item do carrinho: ', error));
  };

  const handleAddQuantity = (itemId) => {
    const itemRef = firestore().collection('cart').doc(itemId);
    const increment = firestore.FieldValue.increment(1);

    itemRef.update({
      quantity: increment,
    });
  };

  const handleRemoveQuantity = (itemId) => {
    const itemRef = firestore().collection('cart').doc(itemId);
    const decrement = firestore.FieldValue.increment(-1);

    itemRef.update({
      quantity: decrement,
    });
  };

  
  const handleCheckout = () => {
    console.log('Realizando o checkout do carrinho...');
  };

  return (
  
    <Box flex={1} bg={'black.normal'} >
<ScrollView>
        
        <Center my={16} >
        <Image alt='image' h={190} mb={8}  w={190} source={require('../assets/Logo-Barberb.png')}/>
    <Text color={'white.normal'} fontFamily={'Tilt'}  fontSize={30}>Seu Carrinho</Text>
      
      {cartItems.length > 0 ? (
        cartItems.map((item) => (

          <View key={item.id} style={{ flexDirection: 'row', alignItems: 'center', padding: 10 }}>
          
        
            <CartCard service={item.productName} price={item.price * item.quantity}/>
            <VStack mt={3}>
                 <Text fontFamily={'Tilt'}   color={'white.normal'}>Quantidade:</Text>
                 
                 
                 <Text fontFamily={'Tilt'} color={'white.normal'}  textAlign={'center'} mb={2}>{item.quantity}</Text>
              
                 <HStack>
                   <Pressable  onPress={() => handleAddQuantity(item.id)} >
 <Box h={8} w={8} bg={'gray.700'} alignItems={'center'} justifyContent={'center'} mr={8}>
                    <Ionicons name='add-sharp' color={'white'} size={25}/>
                 </Box>
                 </Pressable>

                 <Pressable  onPress={() => handleRemoveQuantity(item.id)} >
                 <Box h={8} w={8} bg={'gray.700'} alignItems={'center'} justifyContent={'center'}>
                    <AntDesign name='minus' color={'white'} size={25}/>
                 </Box>
                 </Pressable>
                 </HStack>
                
              
            <CartButton title='Remover' onPress={() => handleRemoveItem(item.id)}  />
            </VStack>
         
            
           
          </View>
          
        ))
      ) : (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text my={5} fontSize={20} fontFamily={'Tilt'}  color={'white.normal'}>Carrinho vazio.</Text>
        </View>
      )}
      <Text fontFamily={'Tilt'}fontSize={20}  color={'white.normal'}>Total: {totalPrice} KZ</Text>
      <CartButton w={80} title="Solicitar" onPress={() => navigate('ConfirmScreen')} disabled={cartItems.length === 0} />
     </Center>
   
   
     </ScrollView>
    </Box>
  );
};


