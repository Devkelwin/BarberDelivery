import { useNavigation } from "@react-navigation/native";
import { Box, Center, ScrollView, Text } from "native-base";
import MapView, { Marker } from "react-native-maps";
import React,{useEffect,useState,useRef} from "react";
import { BackButton } from "../components/BackButton";
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import { AppNavigatorRoutesProps } from "../routes/app.routes";
import {requestForegroundPermissionsAsync,
    LocationObject,
    getCurrentPositionAsync,
    watchPositionAsync,
    LocationAccuracy
    } from 'expo-location'
import { CartButton } from "../components/CartButton";
export function Profissional(){
    const {navigate} = useNavigation<AppNavigatorRoutesProps>()
    const [location, setLocation] = useState<LocationObject | null>(null)
    const [cartItems, setCartItems] = useState([]);
    const [userId, setUserId] = useState('');
 
    const totalPrice = cartItems.reduce((accumulator, item) => accumulator + item.price, 0);
    
    const mapRef = useRef<MapView>(null)
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
              total += doc.data().price;
            });
            setCartItems(items);
            
          });
    
        return () => {
          unsubscribeAuth();
          unsubscribeCart();
        };
      }, [userId]);
    
    return(
        <ScrollView  bg={'black.normal'}>
        <Box flex={1}  alignItems={'center'}>
           
            <Box my={8}>
                 <Text color={'white.normal'} fontSize={20}  textAlign='center' fontFamily='Tilt'>Kelwin Carlos Siqueira </Text>
                 <Text color={'white.normal'} fontSize={20}  textAlign='center'  fontFamily='Tilt'>33 4002-8922</Text>
                 <Text color={'white.normal'} fontSize={20}  textAlign='center' fontFamily='Tilt'>Rua Maria ribeiro</Text>
            </Box>
          
          {
            location && 
             <MapView
             ref={mapRef}
          style={{flex: 1,width:'100%',height: 500,marginBottom:30}}
          initialRegion={{
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
            latitudeDelta: 0.005,
            longitudeDelta: 0.005
          }}

          >
            <Marker coordinate={{
               latitude: location.coords.latitude,
               longitude: location.coords.longitude,
            }}/>
          </MapView>
      
        
          }  
          
         
          <CartButton w={80} title="Iniciar" onPress={() => navigate('TimerScreen')} disabled={cartItems.length === 0} />
       
         
            
          
        </Box>
        </ScrollView>
    )
}