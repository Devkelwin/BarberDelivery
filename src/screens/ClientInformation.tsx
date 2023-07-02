import React, { useState, useEffect,useRef } from 'react';
import { ActivityIndicator, Alert, View } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import {Text,Box, Center, HStack, ScrollView, Image, VStack} from 'native-base'
import { useNavigation, useRoute } from '@react-navigation/native';
import { AppNavigatorRoutesProps } from '../routes/app.routes';
import { ServiceTotalCard } from '../components/ServiceTotalCard';
import uuid from 'uuid'
import MapViewDirections, { MapViewDirectionsDestination } from 'react-native-maps-directions';
import {requestForegroundPermissionsAsync,
    LocationObject,
    getCurrentPositionAsync,
    watchPositionAsync,
    LocationAccuracy
    } from 'expo-location'
    import * as geolib from 'geolib';
    import {Fontisto,FontAwesome} from '@expo/vector-icons'
    import MapView, { Marker } from "react-native-maps";
import { ButtonApp } from '../components/ButtonApp';
import { DrawerButton } from '../components/DrawerButton';
import { Button } from '../components/Button';
import { Rating } from 'react-native-ratings';
interface RouteParams {
    orderId: string;
  }
  
  interface Order {
    totalService: string;
    totalPrice: number;
    name: string;
   
    // outras informações do pedido
  }

export function ClientInformation(){
    const [order, setOrder] = useState([]);
    const [location, setLocation] = useState<LocationObject | null>(null)
    const {navigate} = useNavigation<AppNavigatorRoutesProps>();
    const [userId, setUserId] = useState('');
    const [destination, setDestination] = useState({ latitude: 0, longitude: 0 });
    const [emailOrder, setEmailOrder] = useState('')
    const [email, setEmail] = useState('')
    const [name, setName] = useState('')
    const [ratingColaborador,setRatingColaborador] = useState('')
    const route = useRoute();
    const [origin, setOrigin] = useState(null);
 
  const [distance, setDistance] = useState(null);
    const [ratings, setRatings] = useState([]);
const [averageRating, setAverageRating] = useState(0);
    const [clientlocation, setClientLocation] = useState<Array<{latitude: number, longitude: number}>>([])
    const [markers, setMarkers] = useState<Array<{latitude: number, longitude: number}>>([])
    const mapRef = useRef<MapViewDirections>(null)
    const { orderId } = route.params as RouteParams;
    
    async function handleMarkerPress(marker) {
      if (!origin) {
        setOrigin(marker);
      } else if (!destination || destination) {
        setDestination(marker);
        const originCoords = {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        };
        const destinationCoords = {
          latitude: marker.latitude,
          longitude: marker.longitude,
        };
        const distanceInKM = geolib.getDistance(originCoords, destinationCoords) / 1000;
        setDistance(distanceInKM.toFixed(2));
        Alert.alert('Distancia em Km:',distanceInKM.toFixed(2));
      }
    }

    async function handleAcceptService(){
      const orders = order.find((item) => item.orderId === orderId);
      if (!order) {
        // handle error, order not found
        return;
      }
  
          const OrderInfo = {
      
       userName: name,
       email: email,
       orderId: orderId,
       
       userId: userId,
       totalPrice: orders.totalPrice,
       totalService: orders.totalService,
       
          userEmail: orders.email
    }

    firestore()
     .collection('AcceptService')
     .add(OrderInfo)
    
    Alert.alert('Confirmamento de Iniciamento de Serviço Enviado')
  }


    useEffect(() => {
        watchPositionAsync({
          accuracy: LocationAccuracy.Highest,
          timeInterval: 2000,
          distanceInterval: 1
        },(response) => {
          setLocation(response)
          
        })
      },[])
      useEffect(() => {
        const unsubscribeAuth = auth().onAuthStateChanged((user) => {
          if (user) {
            setUserId(user.uid)
            setEmail(user.email)
          } else {
            setUserId('')
            setEmail('')
          }
        })
    
        const unsubscribeCart = firestore()
          .collection('Informations')
          .where('email', '==', email)
          .onSnapshot((querySnapshot) => {
            const items = []
            let total = 0
            let userName = name
          
            querySnapshot.forEach((doc) => {
              items.push({id: doc.id, ...doc.data()})
              total += doc.data().price
              userName = doc.data().name
            
            })
            setName(userName)
            
          })
    
        return () => {
          unsubscribeAuth()
          unsubscribeCart()
        }
      }, [userId, email])
    

    useEffect(() => {
        const unsubscribeOrder = firestore()
        .collection('AcceptOrders')
        .where('orderId', '==', orderId)
        .onSnapshot((querySnapshot) => {
          const items = [];
          let total = 0;
          const orderData = [];
         
          querySnapshot.forEach((doc) => {
            items.push({ id: doc.id, ...doc.data() });
            total += doc.data().price;
            orderData.push({id: doc.id,...doc.data()}) 
            
          });
          setOrder(orderData);
         
        });
  
      return () => {
    
        unsubscribeOrder();
      };
    }, [userId,orderId]);
    
    useEffect(() => {
       
        const unsubscribeLocation = firestore()
        .collection('AcceptOrders')
        .where('orderId', '==', orderId)
        .onSnapshot((querySnapshot) => {
          const items = [];
          let emailOrde = emailOrder
          const markers = [];
          
          querySnapshot.forEach((doc) => {
            items.push({ id: doc.id, ...doc.data() });
           emailOrde = doc.data().email
            const locationUser = doc.data().locationColaborador;
            if (locationUser) {
                markers.push({id: doc.id, latitude: doc.data().locationColaborador.coords.latitude, longitude: doc.data().locationColaborador.coords.longitude});
              }
          });
          setMarkers(markers);
       setEmailOrder(emailOrde)
        });
    
        return () => {
        unsubscribeLocation
        
        };
      }, [orderId]);

      useEffect(() => {
        const unsubscribe = firestore()
          .collection('Ratings')
          .where('Colabemail', '==', emailOrder)
          .onSnapshot((querySnapshot) => {
            const ratingsData = [];
            let totalStars = 0;
            querySnapshot.forEach((doc) => {
              ratingsData.push(doc.data());
              totalStars += doc.data().Stars;
            });
            setRatings(ratingsData);
            if (ratingsData.length > 0) {
              const averageStars = totalStars / ratingsData.length;
              setAverageRating(averageStars);
            }
          });
        return unsubscribe;
      }, [emailOrder]);
      


   
       
    return(


        
            
        
        <Box flex={1} bg={'white.normal'}>
        <ScrollView>
         
        
          {order.length > 0 ? (
        order.map((item,index) => (

         
          
           <Box key={index}>
             
             
           <Center mt={12} mb={5}>
             <Text color={'black.normal'} textAlign={'center'}  fontSize={26} mx={4} fontFamily='Tilt'> Nome: {item.name}</Text>
             
            
             <Text  mt={10} color={'black.normal'} textAlign={'center'} mx={4} fontSize={26} fontFamily='Tilt'>Telefone: {item.phone}</Text>
           
             <Rating
  showRating
  onFinishRating={this.ratingCompleted}
  startingValue={averageRating ? averageRating : 3}
  ratingTextColor='white'
/>

           </Center>
           <VStack>
           <DrawerButton />
             {
            location && 

           
             <MapView
         
       


   
          style={{width:'100%',height: 500}}
          initialRegion={{
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
            latitudeDelta: 0.005,
            longitudeDelta: 0.005
          }}

          >
            
           
           {markers.map((marker, index) => (
   <Marker
   key={index}
     coordinate={marker}
     onPress={() => handleMarkerPress(marker)}
   >
  
       
       <Image alt='image' h={16}  w={10} source={require('../assets/Logo-Pinbranco.png')}/>
     </Marker>
  ))}

          </MapView>
      
        
          }  
           </VStack>
           <ButtonApp title='Conversar Com Colaborador' 
       
       onPress={() => navigate('Chat', {messagedestine: item.userId, chatId: uuid.v4()})}
           />

<ButtonApp title='Iniciar Serviço' 
       
       onPress={handleAcceptService}
           />
           
           <ButtonApp title='Pagamento' 
       
       onPress={() => navigate('Payment', { orderId: item.orderId })}
           />
           </Box>
           
          
          
          
            
           
          
          
        ))
      ) : (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text my={5} fontSize={20} fontFamily={'Tilt'}  color={'white.normal'}>Carrinho vazio.</Text>
        </View>
      )}
          
         
        </ScrollView>
      </Box>
    )
}
