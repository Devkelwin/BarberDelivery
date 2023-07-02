import { useNavigation, useRoute,useFocusEffect } from "@react-navigation/native";
import { GiftedChat } from 'react-native-gifted-chat';
import { useCallback, useEffect, useState } from "react";
import auth from '@react-native-firebase/auth'
import firestore from '@react-native-firebase/firestore';
import { AppNavigatorRoutesProps } from "../routes/app.routes";
import LoadingIndicator from "../components/Loading";
import { Box } from "native-base";

interface ChatParam {
    chatId: string
    messagedestine: string
}
    
export default function Chat() {
  const [messages, setMessages] = useState([]);
  const route = useRoute();
  const {messagedestine,chatId } = route.params as ChatParam;
  const {navigate} = useNavigation<AppNavigatorRoutesProps>()
  const [email, setEmail] = useState('');
  const [userId, setUserId] = useState('');
  const [phone,setPhone] = useState('')
  const [load,setLoad] = useState(false)
  const [name,setName] = useState('')
  const [receivedMessages, setReceivedMessages] = useState([]);
const [sentMessages, setSentMessages] = useState([]);


// ... restante do código ...

useFocusEffect(
  
  useCallback(() => {
    setLoad(false)
    setTimeout(() => {
      setLoad(true);
     
    }, 5000);
    


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
        let userPhone = phone
        querySnapshot.forEach((doc) => {
          items.push({ id: doc.id, ...doc.data() });
          total += doc.data().price;
          userName = doc.data().name
          userPhone = doc.data().phone
        });
        setName(userName);
        setPhone(userPhone)
      });

    return () => {
   
      unsubscribeAuth();
      unsubscribeCart();
    };
  }, [userId,email,phone,name])
);

useFocusEffect(
  useCallback(() => {
    const unsubscribe = firestore()
      .collection('chats')
      .where('chatId', '==', chatId)
      .orderBy('createdAt', 'desc')
      .onSnapshot(querySnapshot => {
        if (querySnapshot) {
          const newMessages = querySnapshot.docs.map(doc => ({
            _id: doc.id,
            createdAt: doc.data().createdAt.toDate(),
            text: doc.data().text,
            user: doc.data().user,
          }))
          setMessages(newMessages);
        }
      });
       

    
     
     
    return unsubscribe;
  }, [userId, messagedestine, chatId,messages])
);
  
 

  const mensagemEnviada = useCallback((messages = []) => {
    const { _id, createdAt, text, user } = messages[0];
    firestore()
      .collection('chats')
      .add({
        _id,
        createdAt,
        text,
        user,
        destination: messagedestine,
        phone: phone,
        chatId: chatId
      });
  }, [messages,chatId,phone,messagedestine]);

  return (
<>
   {load ?   <GiftedChat
      messages={messages}
      onSend={mensagemEnviada}
      
      user={{
        _id: userId,
        name: name,
        
      }}
      
      
    />
  :
  <LoadingIndicator/>
   
  }
   </>
  
   
  )
}
