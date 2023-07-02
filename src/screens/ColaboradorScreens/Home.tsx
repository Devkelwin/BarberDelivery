import { Box, Center, Image } from "native-base";
import MapView, { Marker } from "react-native-maps";
import React,{useEffect,useState,useRef} from "react";
import firestore from '@react-native-firebase/firestore'
import auth from '@react-native-firebase/auth';
import {requestForegroundPermissionsAsync,
    LocationObject,
    getCurrentPositionAsync,
    watchPositionAsync,
    LocationAccuracy
    } from 'expo-location'
import { ButtonApp } from "../../components/ButtonApp";
import {Fontisto,FontAwesome} from '@expo/vector-icons'
import { BackButton } from "../../components/BackButton";
import { useNavigation } from "@react-navigation/native";
import { DrawerButton } from "../../components/DrawerButton";
export function Home(){
    const {navigate} = useNavigation()
    const [markers, setMarkers] = useState<Array<{latitude: number, longitude: number}>>([])
    const [location, setLocation] = useState<LocationObject | null>(null)
    const [Colabo, setColabo] = useState<Array<{latitude: number, longitude: number}>>([])
    const [email, setEmail] = useState('');
    const [userId, setUserId] = useState('');
   
    const [name,setName] = useState('')
    const mapRef = useRef<MapView>(null)

    async function logout(){
        await auth().signOut();
        
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

  
  const handleMarkerPress = (event: any) => {
    const ColabLocation = {
        latitude: location.coords.latitude,
            longitude: location.coords.longitude,
            latitudeDelta: 0.005,
            longitudeDelta: 0.005,
            userId: userId
      };

    
    
    firestore()
      .collection('LocationColab')
      .add(ColabLocation)
      .then(() => console.log('Produto adicionado ao carrinho!'))
      .catch((error) => console.error('Erro ao adicionar produto ao carrinho: ', error));
  }



    
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



    return(
        <Box bg={'black.normal'} flex={1}>
          <Box bg={'black.normal'} flex={1}>
          <DrawerButton />
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
                
              />
            ))}
{Colabo.map((marker, index) => (
    <Marker
      key={index}
      coordinate={{
        latitude: marker.latitude,
        longitude: marker.longitude
      }}
>
<Image alt='image' h={16} mb={8}  w={10} source={require('../../assets/Logo-Pinbranco.png')}/>
</Marker>
  ))}
          </MapView>
          }  
          <ButtonApp title="Marcar"  
          onPress={handleMarkerPress}
          disabled={Colabo.some((item) => item.userId === userId)}
          />
          <Center>
             <BackButton my={3} onPress={logout} title='Sair'/>
          </Center>
         
        </Box>
        </Box>
    )
}