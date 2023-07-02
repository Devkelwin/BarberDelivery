import { useNavigation, useRoute } from "@react-navigation/native";
import { Box, Center, Text,Button } from "native-base";
import { useState,useEffect } from "react";
import { Rating, AirbnbRating } from 'react-native-ratings';
import { ButtonApp } from "../components/ButtonApp";
import { AppNavigatorRoutesProps } from '../routes/app.routes';
import firestore from '@react-native-firebase/firestore'
import auth from '@react-native-firebase/auth'

import { CartButton } from "../components/CartButton";
interface RouteParams {
    orderId: string;
  }
  
export function RankScreen(){
    const {navigate} = useNavigation<AppNavigatorRoutesProps>()
    const [stars,setStars] = useState()
    const route = useRoute();       
  const [email, setEmail] = useState('');
  const [colabemail, setColabEmail] = useState('');
  const [name, setName] = useState('');
    const [userId, setUserId] = useState('');
  const [orders, setOrders] = useState([]);
  const [order, setOrder] = useState([]);
  const { orderId } = route.params as RouteParams;

  async function handleSendRating(){
    

    const OrderInfo = {
      Colabname: name,
      Colabemail: colabemail,

    Stars: stars
    
      
    };
  
    firestore()
      .collection('Ratings')
      .add(OrderInfo)
      .then(() => console.log('Produto adicionado ao carrinho!'))

      .catch((error) => console.error('Erro ao adicionar produto ao carrinho: ', error));
       
      navigate('Services')
        
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
    .where('userEmail', '==', email)
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
      .collection('Orders')
      
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

 



    return(
        <Box flex={1} bg={'black.normal'} justifyContent='flex-end'>
            <Box bg={'white.normal'} h={450} justifyContent={'center'}  roundedTopLeft={40} roundedTopRight={40} >
          
            <Center my={10}>
                <Text fontFamily={'Tilt'} mb={5}  fontSize={30}>Classifique o Serviço</Text>
           
<AirbnbRating
  count={5}
  reviews={["PÉSSIMO","RUIM","Ok","BOM","ÓTIMO"]}
  defaultRating={3}
  reviewSize={30}
  size={45}
  onFinishRating={setStars}
/>
<Button   
        w={24}
        rounded={5}
        bg={'#007aff'}
        mb={7}
        mt={8}

onPress={handleSendRating}
>
  <Text color={'white.normal'}>Enviar</Text>
</Button>

<Button   
        w={32}
        rounded={5}
        bg={'#007aff'}
        mb={7}
        mt={2}

onPress={() => navigate('Services')}
>
  <Text color={'white.normal'}>Agora Não</Text>
</Button>



</Center>


</Box>

        </Box>
    )
}