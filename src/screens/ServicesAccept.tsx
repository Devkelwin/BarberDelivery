import { Box, Center, Image, ScrollView, Text } from "native-base";
import { CartButton } from "../components/CartButton";
import { CartCard } from "../components/CartCard";
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import { AppNavigatorRoutesProps } from "../routes/app.routes";
import {useState,useEffect} from 'react'
import { ServiceTotalCard } from "../components/ServiceTotalCard";
import { useNavigation } from "@react-navigation/native";
import {View} from 'react-native'
import { AcceptServieButton } from "../components/AcceptServiceButton";
export function ServicesAccept(){
    const {navigate} = useNavigation<AppNavigatorRoutesProps>()
    const [cartItems, setCartItems] = useState([]);
    const [orderId, setOrderId] = useState([]);
    const [order, setOrder] = useState([]);
    const [orders, setOrders] = useState([]);
    const totalPrice = cartItems.reduce((accumulator, item) => accumulator + item.price, 0);
    const [userId, setUserId] = useState('');
    const [email, setEmail] = useState('');
    const totalService = cartItems.reduce((accumulator, item) => {
        if (!accumulator.includes(item.productName)) {
          return accumulator + item.productName + ", ";
        }
        return accumulator;
      }, "");
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
    
        const unsubscribeOrder = firestore()
        .collection('AcceptOrders')
        .where('userEmail', '==', email)
        .onSnapshot((querySnapshot) => {
       
          let total = 0;
          const orderData = [];
          let userEmail = email
          querySnapshot.forEach((doc) => {
            
            total += doc.data().price;
            orderData.push({...doc.data()}) 
            userEmail = doc.data().email
          });
          setOrder(orderData);
          setEmail(userEmail)
        });
  
      return () => {
        unsubscribeAuth()
        unsubscribeOrder();
      };
      }, [userId,email]);


      useEffect(() => {

        const unsubscribeCart = firestore()
        .collection('Informations')
        .where('email', '==', email)
        .onSnapshot((querySnapshot) => {
          const items = [];
          let total = 0;
       
          let userEmail = email
          
          querySnapshot.forEach((doc) => {
            items.push({ id: doc.id, ...doc.data() });
            total += doc.data().price;
          
            userEmail = doc.data().email
           
          });
         ;
          setEmail(userEmail)
        
        });
      
      return () => {
      
      
        unsubscribeCart();
      };
      })
   


    
    
  
    return(
        <Box flex={1} bg={'black.normal'}   justifyContent='center'>
            <ScrollView>
            <Center my={12} >

                  <Image alt='image' h={220} mb={8}  w={220} source={require('../assets/Logo-Barberb.png')}/>
                <Text color={'white.normal'}  fontSize={26} fontFamily='Tilt'>Serviços Aceitos</Text>
            
               
                {order.length > 0 ? (
        order.map((item,index) => (

          <Box key={index} style={{  alignItems: 'center', padding: 10 }}>
          
        
          <ServiceTotalCard 
          service={item.totalService.map(service => `${service.quantity} ${service.productName}`).join(', ')}
           price={item.totalPrice}  
           name={item.name}
           />
        
          <AcceptServieButton  textAlign={'center'}  
          title='Ver Informações' 
          onPress={() => navigate('ClientInformation',{orderId: item.orderId})}

                
          />

           
          </Box>
         
          
        ))
      ) : (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text my={5} fontSize={20} fontFamily={'Tilt'}  color={'white.normal'}>Nenhum serviço aceito</Text>
        </View>
      )}
            
            </Center>
             </ScrollView>
        </Box>
    )
}