import React, { useState, useEffect,useRef } from 'react';
import { View } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import {Text,Box, Center, HStack, ScrollView, Image} from 'native-base'
import { CartButton } from '../../components/CartButton';
import { CartCard } from '../../components/CartCard';
import { useNavigation } from '@react-navigation/native';
import {   ColabNavigatorRoutesProps} from '../../routes/colab.routes';
import { AppNavigatorRoutesProps } from '../../routes/app.routes';
import { ServiceTotalCard } from '../../components/ServiceTotalCard';
import MapView, { Marker } from "react-native-maps";
import {requestForegroundPermissionsAsync,
  LocationObject,
  getCurrentPositionAsync,
  watchPositionAsync,
  LocationAccuracy
  } from 'expo-location'
import { ButtonApp } from '../../components/ButtonApp';
import { AcceptServieButton } from '../../components/AcceptServiceButton';
export function OrdersAccept(){
  const [orders, setOrders] = useState([]);
  const [orderId, setOrderId] = useState([]);
  const [order, setOrder] = useState([]);
  const [location, setLocation] = useState<LocationObject | null>(null)
  const [userId, setUserId] = useState('');
  const {navigate} = useNavigation<ColabNavigatorRoutesProps>()
  const navigation = useNavigation<AppNavigatorRoutesProps>()
  const [name,setName] = useState('')
  const [phone,setPhone] = useState('')
    const [email, setEmail] = useState('');
    const [mail, setmail] = useState('');
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
      .collection('AcceptService')
      .where('userEmail', '==', email)
      .onSnapshot((querySnapshot) => {
      
        let total = 0;
        const orders = []
      
        querySnapshot.forEach((doc) => {
          total += doc.data().price;
            orders.push({...doc.data()})
         
        });
       
        setOrders(orders)
       
      });

    return () => {
    
      unsubscribeOrders();
    };
  }, [userId,email,name]);

  

  
  
 
  return (
  
    <Box flex={1} bg={'black.normal'} >
<ScrollView>
        
        <Center my={16} >
        <Image alt='image' h={190} mb={8}  w={190} source={require('../../assets/Logo-Barberb.png')}/>
    <Text color={'white.normal'} fontFamily={'Tilt'}  fontSize={30}>Pedidos Iniciados</Text>
      
      {orders.length > 0 ? (
        orders.map((item,index) => (

          <View key={index}  style={{ alignItems: 'center', padding: 10 }}>
          
        
          
          <ServiceTotalCard 
           service={item.totalService.map(service => `${service.quantity} ${service.productName}`).join(', ')}
          price={item.totalPrice} name={item.userName}/>
          <AcceptServieButton  textAlign={'center'}  
          title='Iniciar Crônometro' 
          onPress={() => navigation.navigate('TimerScreen',{orderId: item.orderId})}

                
          />
           
              
           
          </View>
          
        ))
      ) : (
        <View key="no-orders"  style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text my={5} fontSize={20} fontFamily={'Tilt'}  color={'white.normal'}>Nenhum Pedido Iniciado</Text>
        </View>
      )}
      
      
     </Center>
   
   
     </ScrollView>
    </Box>
  );
};


