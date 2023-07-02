import { useNavigation,useRoute } from "@react-navigation/native";
import { Box, Center, Text,Image, useToast } from "native-base";
import MapView, { Marker } from "react-native-maps";
import React,{useEffect,useState,useRef} from "react";
import { BackButton } from "../components/BackButton";
import firestore from '@react-native-firebase/firestore';
import * as geolib from 'geolib';
import auth from '@react-native-firebase/auth';
import { AppNavigatorRoutesProps } from "../routes/app.routes";
import {requestForegroundPermissionsAsync,
    LocationObject,
    getCurrentPositionAsync,
    watchPositionAsync,
    LocationAccuracy
    } from 'expo-location'
import { CartButton } from "../components/CartButton";
import {Fontisto,FontAwesome} from '@expo/vector-icons'
interface RouteParams {
  orderId: string;
}
import uuid from 'uuid'
import { DrawerButton } from "../components/DrawerButton";
import MapViewDirections from "react-native-maps-directions";
import { Alert } from "react-native";
export function ConfirmScreen(){
    const {navigate} = useNavigation<AppNavigatorRoutesProps>()
    const [location, setLocation] = useState<LocationObject | null>(null)
    const [cartItems, setCartItems] = useState([]);

    const [userId, setUserId] = useState('');
    const [phone,setPhone] = useState('')
    const toast = useToast()
    const [distance, setDistance] = useState(null);
    const [origin, setOrigin] = useState(null);
    const [destination, setDestination] = useState(null);
    const [name,setName] = useState('')
    const [Colabo, setColabo] = useState<Array<{latitude: number, longitude: number}>>([])
    const [markers, setMarkers] = useState<Array<{latitude: number, longitude: number}>>([])
    const [email, setEmail] = useState('');
    const totalPrice = cartItems.reduce((accumulator, item) => accumulator + item.price * item.quantity, 0);
    const totalService = cartItems.reduce((accumulator, item) => 
    {
      if (!accumulator.includes(item.productName)) {
        return accumulator + item.productName + ", ";
      }
      return accumulator;
    }, "");

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
       
    
        const unsubscribeLocation = firestore()
        .collection('LocationColab')
        .onSnapshot((querySnapshot) => {
          const items = [];
          let total = 0;
          let locationCo = []
          querySnapshot.forEach((doc) => {
            items.push({ id: doc.id, ...doc.data() });
            total += doc.data().price;
            locationCo.push({...doc.data()})
          });
          setColabo(locationCo)
          
        });
    
        return () => {
        unsubscribeLocation
        };
      }, []);
    
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

     
      async function handleConfirmOrder(items){
        const products = [];

  // Percorra o array de itens do carrinho e adicione cada produto ao array de produtos
  cartItems.forEach((item) => {
    products.push({
      productName: item.productName,
      quantity: item.quantity
    });
  });
        console.log(cartItems)

        const OrderInfo = {
          totalService: products,
          totalPrice: totalPrice,
          userId: userId,
          name: name,
          email: email,
          locationUser: location,
          orderId: uuid.v4(),
         phone: phone
          
        };
        
      
        firestore()
          .collection('Orders')
          .add(OrderInfo)
          .then(() => console.log('Produto adicionado ao carrinho!'))
          .catch((error) => console.error('Erro ao adicionar produto ao carrinho: ', error));
    
          navigate('ServicesAccept')
      }

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
  
    return(
        <Box flex={1} bg={'black.normal'}>
               <DrawerButton />
          {
            location && 
            <MapView
             
             ref={mapRef}
          style={{flex: 1,width:'100%',height: 700,zIndex:0}}
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
                
              />
            ))}
         

           
           {Colabo.map((marker, index) => (


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
          <Center>
          <Text my={6} fontFamily={'Tilt'}fontSize={20}  color={'white.normal'}>Total: {totalPrice} KZ</Text>
          <CartButton
           w={80}
            title="Confirmar"
            onPress={() => {
              const items = {};
              cartItems.forEach((item) => {
                items[item.productName] = item.quantity;
              });
              handleConfirmOrder(items);
            }}
            disabled={cartItems.length === 0}
          
         
          />
       </Center>
         
            
           
        </Box>
    )
}