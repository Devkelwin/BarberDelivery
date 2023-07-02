import { useNavigation } from '@react-navigation/native'
import {Box,Image, Center, ScrollView,Text,Heading, useToast}from 'native-base'
import React,{useEffect,useState,useRef} from 'react'
import MapView,{Marker} from 'react-native-maps'
import MapViewDirections from 'react-native-maps-directions';


import { Alert, SafeAreaView} from 'react-native'
import { ButtonApp } from '../components/ButtonApp'
import {AppNavigatorRoutesProps} from '../routes/app.routes'
import { StatusBar } from 'expo-status-bar';
import firestore from '@react-native-firebase/firestore'
import firebase from '@react-native-firebase/app';

import {requestForegroundPermissionsAsync,

LocationObject,
getCurrentPositionAsync,
watchPositionAsync,
LocationAccuracy
} from 'expo-location'
import * as geolib from 'geolib';

import { BackButton } from '../components/BackButton'
import auth,{FirebaseAuthTypes} from '@react-native-firebase/auth'
import {Fontisto,FontAwesome} from '@expo/vector-icons'
import { DrawerButton } from '../components/DrawerButton'
export function Services(){
  const [loading, setLoading] = useState(true);
  const [location, setLocation] = useState<LocationObject | null>(null)
  const [user,setUser] = useState<FirebaseAuthTypes.User | null>(null)
  const [email, setEmail] = useState('');
  const [origin, setOrigin] = useState(null);
  const [destination, setDestination] = useState(null);
  const [distance, setDistance] = useState(null);
  const toast = useToast()
  const [userId, setUserId] = useState('');
  const [Colabo, setColabo] = useState<Array<{latitude: number, longitude: number}>>([])
  const [name,setName] = useState('')
  const [markers, setMarkers] = useState<Array<{latitude: number, longitude: number}>>([])
  const mapRef = useRef<MapView>(null)
    const navigation = useNavigation<AppNavigatorRoutesProps>()
    
    async function logout(){
      await auth().signOut();
    }
    async function requestLocationPermission() {
      const {granted} = await requestForegroundPermissionsAsync()

      if(granted){
        const currentPosition = await getCurrentPositionAsync()
        setLocation(currentPosition)
        
      }
    }

    useEffect(() => {
      requestLocationPermission()
    },[])

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
          querySnapshot.forEach((doc) => {
            items.push({ id: doc.id, ...doc.data() });
            total += doc.data().price;
            userName = doc.data().name
          });
          setName(userName);
          
        });
  
      return () => {
      
        unsubscribeAuth();
        unsubscribeCart();
      };
    }, [userId,email]);

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
      
      <ScrollView bg='white.normal' >
        <StatusBar   translucent style='dark' backgroundColor='transparent'/>
        <SafeAreaView>
       
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
            
              <Text textTransform={'uppercase'}  fontSize={28} fontFamily={'Galano'} mt={8} color={'yellow.normal'}>
    {name}
  </Text>
                <Text  fontSize={30} fontFamily={'Galano'}   color={'black.normal'}>O que vai ser Hoje?</Text>
              </Center>
            <ButtonApp title='Barbearia'  onPress={() => navigation.navigate('BarberServices')}/>
            
           
            <ButtonApp title='Salão de Beleza' onPress={() => navigation.navigate('HairServices')}/>
          
            <ButtonApp title='Sair' onPress={logout}/>
           
      </SafeAreaView>
        </ScrollView>
    )
}