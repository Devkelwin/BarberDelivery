import React, { useState, useEffect,useRef } from 'react';
import { View } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import {Text,Box, Center, HStack, ScrollView, Image} from 'native-base'
import { CartButton } from '../../components/CartButton';
import { CartCard } from '../../components/CartCard';
import { useNavigation } from '@react-navigation/native';
import { ColabNavigatorRoutesProps } from '../../routes/colab.routes';
import { ServiceTotalCard } from '../../components/ServiceTotalCard';
import MapView, { Marker } from "react-native-maps";
import {requestForegroundPermissionsAsync,
  LocationObject,
  getCurrentPositionAsync,
  watchPositionAsync,
  LocationAccuracy
  } from 'expo-location'
export function Orders(){
  const [orders, setOrders] = useState([]);
  const [location, setLocation] = useState<LocationObject | null>(null)
  const [userId, setUserId] = useState('');
  const {navigate} = useNavigation<ColabNavigatorRoutesProps>()
  const [name,setName] = useState('')
  const [phone,setPhone] = useState('')
    const [email, setEmail] = useState('');
    const [mail, setmail] = useState('');
    const [orderIdOrders,setOrderIdOrders ] = useState([])
    const [orderIdAcceptOrders,setOrderIdAcceptOrders] = useState([])
  const [cartItems, setCartItems] = useState([]);
  const mapRef = useRef<MapView>(null)
  const totalPrice = cartItems.reduce((accumulator, item) => accumulator + item.price, 0);
    const totalService = cartItems.reduce((accumulator, item) => {
      if (!accumulator.includes(item.productName)) {
        return accumulator + item.productName + ", ";
      }
      return accumulator;
    }, "");
    
    
    
    

    useEffect(() => {
      watchPositionAsync({
        accuracy: LocationAccuracy.Highest,
        timeInterval: 2000,
        distanceInterval: 1
      },(response) => {
        setLocation(response)
        mapRef.current?.animateCamera({
          pitch:40,
         
        })
      })
    },[])

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
  
      const unsubscribeCart = firestore()
        .collection('Informations')
        .where('email', '==', email)
        .onSnapshot((querySnapshot) => {
          const items = [];
          let total = 0;
          let userName = name
          let userEmail = email
          let userPhone = phone
          querySnapshot.forEach((doc) => {
            items.push({ id: doc.id, ...doc.data() });
            total += doc.data().price;
            userName = doc.data().name
            userEmail = doc.data().email
            userPhone = doc.data().phone
          });
          setName(userName);
          setEmail(userEmail)
          setPhone(userPhone)
        });
  
      return () => {
      
        unsubscribeAuth();
        unsubscribeCart();
      };
    }, [userId,email]);

   



    useEffect(() => {
        
      const unsubscribeCart = firestore()
        .collection('cart')
        .where('userId', '==', userId)
        .onSnapshot((querySnapshot) => {
          const items = [];
          let total = 0;
          querySnapshot.forEach((doc) => {
            items.push({ id: doc.id, ...doc.data() });
            total += doc.data().price;
          });
          setCartItems(items);
          
        });
  
      return () => {
        
        unsubscribeCart();
      };
    }, [userId]);

  useEffect(() => {
    
    const unsubscribeOrders = firestore()
      .collection('Orders')
     
      .onSnapshot((querySnapshot) => {
        const items = [];
        let total = 0;
        const orders = []
        let orderIdOrder = orderIdOrders
        querySnapshot.forEach((doc) => {
          total += doc.data().price;
            orders.push({...doc.data()})
         orderIdOrder = doc.data().orderId
        });
      
        setOrders(orders)
        
       setOrderIdOrders(orderIdOrder)
      });

    return () => {
     
      unsubscribeOrders();
    };
  }, [userId,orderIdOrders,orders]);

  useEffect(() => {
    
    const unsubscribeAcceptOrders = firestore()
      .collection('AcceptOrders')
      
      .onSnapshot((querySnapshot) => {
     
   
      
        let orderIdAcceptOrder = orderIdAcceptOrders
        querySnapshot.forEach((doc) => {
       
          
         orderIdAcceptOrder = doc.data().orderId
        
        });
       
     
       setOrderIdAcceptOrders(orderIdAcceptOrder)
        console.log(orderIdAcceptOrders)
      });

    return () => {
     
      unsubscribeAcceptOrders();
    };
  }, [userId,orderIdAcceptOrders]);




  
  
  async function handleAcceptOrder(orderId, userId){
    const order = orders.find((item) => item.orderId === orderId);
    if (!order) {
      // handle error, order not found
      return;
    }

        const OrderInfo = {
    phone: phone,
     name: name,
     email: email,
     orderId: orderId,
     
     userId: userId,
     totalPrice: order.totalPrice,
     totalService: order.totalService,
      locationColaborador: location,
        userEmail: order.email
    
   };
 
   firestore()
     .collection('AcceptOrders')
     .add(OrderInfo)
    
    
   
     const db = firestore();
     const ordersCollection = db.collection('Orders');
     
     ordersCollection.where('orderId', '==', orderId).get()
       .then((querySnapshot) => {
         querySnapshot.forEach((doc) => {
          firestore().collection('Orders').doc(doc.id).delete()

         });
       })
       .catch((error) => {
         console.error('Erro ao recuperar documentos:', error);
       });
     
     
     
     
    
  }
 
  return (
  
    <Box flex={1} bg={'black.normal'} >
<ScrollView>
        
        <Center my={16} >
        <Image alt='image' h={190} mb={8}  w={190} source={require('../../assets/Logo-Barberb.png')}/>
    <Text color={'white.normal'} fontFamily={'Tilt'}  fontSize={30}>Pedidos em Aberto</Text>
      
   
   
      {orders.length > 0 ? (
  orders.map((item,index) => (
          <View key={index}  style={{ alignItems: 'center', padding: 10 }}>
          
        
          
          <ServiceTotalCard 
           service={item.totalService.map(service => `${service.quantity} ${service.productName}`).join(', ')}
           price={item.totalPrice}
            name={item.name}/>
            <HStack>
               <CartButton title='Ver informações'
                mx={5}
                onPress={() => navigate('OrderInfo', { orderId: item.orderId })}
                
                />
            <CartButton title='Aceitar Pedido'
             mx={5} 
             onPress={() => handleAcceptOrder(item.orderId, userId)}

             />
            </HStack>
           
          </View>
          
        ))
      ) : (
        <View key="no-orders"  style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text my={5} fontSize={20} fontFamily={'Tilt'}  color={'white.normal'}>Sem Pedidos</Text>
        </View>
      )}
      
      
     </Center>
   
   
     </ScrollView>
    </Box>
  );
};


