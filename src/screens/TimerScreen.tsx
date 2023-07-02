
import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View,Button } from 'react-native';
import { ButtonApp } from '../components/ButtonApp';
import {Box, Center, Image} from 'native-base'
import { useNavigation, useRoute } from '@react-navigation/native';
import { AppNavigatorRoutesProps } from '../routes/app.routes';
import firestore from '@react-native-firebase/firestore'
import auth from '@react-native-firebase/auth'
import { ColabNavigatorRoutesProps } from '../routes/colab.routes';
interface RouteParams {
  orderId: string;
}

export  function TimerScreen() {
  const [seconds, setSeconds] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [hours, setHours] = useState(0);
  const [intervalId, setIntervalId] = useState(null);
  const {navigate} = useNavigation<AppNavigatorRoutesProps>()
  const navigation = useNavigation<ColabNavigatorRoutesProps>()
  const route = useRoute();       
  const [email, setEmail] = useState('');
  const [colabemail, setColabEmail] = useState('');
  const [name, setName] = useState('');
    const [userId, setUserId] = useState('');
  const [orders, setOrders] = useState([]);
  const [buttonDisabled, setButtonDisabled] = useState(false);

  const [order, setOrder] = useState([]);
  const { orderId } = route.params as RouteParams;

  async function handleSendTime(){
    const order = orders.find((item) => item.orderId === orderId);
    if (!order) {
    console.log('Erro ta aquu')
      return;

    }

    const OrderInfo = {
      totalService: order.totalService,
      totalPrice: order.totalPrice,
      Colabname: name,
      Colabemail: colabemail,
   
     time: [hours,'horas',minutes,'minutos',seconds,'segundos']
      
    };
  
    firestore()
      .collection('TimeOrders')
      .add(OrderInfo)
      .then(() => console.log('Produto adicionado ao carrinho!'))

      .catch((error) => console.error('Erro ao adicionar produto ao carrinho: ', error));

      
    setSeconds(0);
    setMinutes(0);
    setHours(0);
     clearInterval(intervalId);
      
       navigation.navigate('Home', { orderId: order.orderId })
       
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



  useEffect(() => {
       
    
    const unsubscribeOrder = firestore()
    .collection('AcceptOrders')
    .where('email', '==', email)
    .onSnapshot((querySnapshot) => {
      const items = [];
      let total = 0;
      const orderData = [];
     let colabName = ''
     let colabEmail = ''
      querySnapshot.forEach((doc) => {
        items.push({ id: doc.id, ...doc.data() });
        total += doc.data().price;
        orderData.push({id: doc.id,...doc.data()}) 
        colabName = doc.data().name
        colabEmail = doc.data().email
      });
      setOrder(orderData);
     setName(colabName)
     setColabEmail(colabEmail)
    });

  return () => {
   
    unsubscribeOrder();
  };
}, [userId,orderId,email]);
  
useEffect(() => {

    const unsubscribeOrders = firestore()
      .collection('AcceptOrders')
      
      .onSnapshot((querySnapshot) => {
        const items = [];
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
  }, [userId]);

  useEffect(() => {
    
    return () => clearInterval(intervalId);
   
  }, []);

  

  const start = () => {
    const id = setInterval(() => {
      setSeconds(seconds => {
        if (seconds === 59) {
          setMinutes(minutes => {
            if (minutes === 59) {
              setHours(hours => hours + 1);
              return 0;
            } else {
              return minutes + 1;
            }
          });
          return 0;
        } else {
          return seconds + 1;
        }
      });
    }, 1000);
    setIntervalId(id);
  };

  const pause = () => {
    clearInterval(intervalId);
    

  };

  const reset = () => {
   
    setSeconds(0);
    setMinutes(0);
    setHours(0);
     clearInterval(intervalId);
  };



  return (
  <Box bg={'white.normal'} flex={1} justifyContent={'center'}>
    <Center mt={12} >
    <Image alt='image' h={230} mb={8}  w={230} source={require('../assets/Logo-Barber.png')}/>
      <Text style={{color: 'black', fontSize: 20,marginBottom: 40}} >{hours.toString().padStart(2, '0')}:{minutes.toString().padStart(2, '0')}:{seconds.toString().padStart(2, '0')}</Text>
         </Center>
      <Box >
        <ButtonApp title="Iniciar" 
      onPress={() => {
        setButtonDisabled(true);
        start();
      }}
      disabled={buttonDisabled}
        mb={10}
        />
        <ButtonApp title="Finalizar" onPress={handleSendTime} />
      </Box>
   
  </Box>
  );
}

