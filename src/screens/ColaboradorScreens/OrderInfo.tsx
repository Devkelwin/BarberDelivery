import React, { useState, useEffect,useRef } from 'react';
import { ActivityIndicator, Alert, View } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import {Text,Box, Center, HStack, ScrollView, Image, VStack} from 'native-base'
import { useNavigation, useRoute } from '@react-navigation/native';
import { ColabNavigatorRoutesProps } from '../../routes/colab.routes';
import * as geolib from 'geolib';
import { ServiceTotalCard } from '../../components/ServiceTotalCard';
import {requestForegroundPermissionsAsync,
    LocationObject,
    getCurrentPositionAsync,
    watchPositionAsync,
    LocationAccuracy
    } from 'expo-location'
    import uuid from 'uuid'
    import {Fontisto,FontAwesome} from '@expo/vector-icons'
    import MapView, { Marker } from "react-native-maps";
import { ButtonApp } from '../../components/ButtonApp';
import { Button } from '../../components/Button';
import MapViewDirections from 'react-native-maps-directions';
import { DrawerButton } from '../../components/DrawerButton';
interface RouteParams {
    orderId: string;
  }
  
  interface Order {
    totalService: string;
    totalPrice: number;
    name: string;
   
    // outras informações do pedido
  }

export function OrderInfo(){
    const [order, setOrder] = useState([]);
    const [location, setLocation] = useState<LocationObject | null>(null)
    const {navigate} = useNavigation<ColabNavigatorRoutesProps>();
    const [userId, setUserId] = useState('');
    const [distance, setDistance] = useState(null);
    const [origin, setOrigin] = useState(null);
    const [destination, setDestination] = useState(null);
    const route = useRoute();
    const [cartItems, setCartItems] = useState([]);
    const [clientlocation, setClientLocation] = useState<Array<{latitude: number, longitude: number}>>([])
    const [markers, setMarkers] = useState<Array<{latitude: number, longitude: number}>>([])
    const mapRef = useRef<MapView>(null)
    
    const totalPrice = cartItems.reduce((accumulator, item) => accumulator + item.price, 0);
    const totalService = cartItems.reduce((accumulator, item) => {
      if (!accumulator.includes(item.productName)) {
        return accumulator + item.productName + ", ";
      }
      return accumulator;
    }, "");
    
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
       
    
        const unsubscribeOrder = firestore()
        .collection('Orders')
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
          setCartItems(items)
          setOrder(orderData);
         
        });
  
      return () => {
      console.log(order)
        unsubscribeOrder();
      };
    }, [userId,orderId]);
    
    useEffect(() => {
       
    
        const unsubscribeLocation = firestore()
        .collection('Orders')
        .where('orderId', '==', orderId)
        .onSnapshot((querySnapshot) => {
          const items = [];
      
          const markers = [];
          
          querySnapshot.forEach((doc) => {
            items.push({ id: doc.id, ...doc.data() });
           
            const locationUser = doc.data().locationUser;
            if (locationUser) {
                markers.push({id: doc.id, latitude: doc.data().locationUser.coords.latitude, longitude: doc.data().locationUser.coords.longitude});
              }
          });
          setMarkers(markers);
          console.log(markers)
        });
    
        return () => {
        unsubscribeLocation
        
        };
      }, [orderId]);

   
       
    return(


        
            
        
        <Box flex={1} bg={'black.normal'}>
        <ScrollView>
         
          
          {order.length > 0 ? (
        order.map((item,index) => (

         
          
           <Box key={index} mt={20} >
             <Center >
             <Text color={'white.normal'} mx={5}  fontSize={30} fontFamily='Tilt'>Serviços:</Text>
             <Text color={'white.normal'} mx={6}  fontSize={23} fontFamily='Tilt' mb={8}>{item.totalService.map(service => `${service.quantity} ${service.productName}`).join(', ')}</Text>
             <Text color={'white.normal'}  mx={5} fontSize={30} fontFamily='Tilt'>Valor total:</Text>
              <Text color={'white.normal'} mx={5}  fontSize={26} fontFamily='Tilt' mb={8} >{item.totalPrice}</Text>
              <Text color={'white.normal'}  mx={5}  fontSize={30} fontFamily='Tilt'>Nome:</Text>
              <Text color={'white.normal'} mx={5}  fontSize={26} fontFamily='Tilt' mb={8} >{item.name}</Text>
              <Text color={'white.normal'} mx={5}  fontSize={30} fontFamily='Tilt'>Telefone:</Text>
              
              <Text color={'white.normal'}  fontSize={26} fontFamily='Tilt' mb={8} >{item.phone}</Text>
              <Button title='Conversar Com Cliente' 
       
       onPress={() => navigate('ColaboradorChat', { messagedestine: item.userId,chatId: uuid.v4() })}
           />
             </Center>
         
           <VStack>
             {
            location && 
             <MapView
             ref={mapRef}
          style={{flex: 1,width:'100%',height: 700}}
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
   
<Image alt='image' h={16} mb={8}  w={10} source={require('../../assets/Logo-Pinpreto.png')}/>
</Marker>
  ))}

          </MapView>
      
        
          }  
           </VStack>
           </Box>
           
          
          
          
            
           
          
          
        ))
      ) : (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
         
        </View>
      )}
          
       
        </ScrollView>
      </Box>
    )
}