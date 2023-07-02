import {Box, Text, Image, Center, ScrollView, useToast} from 'native-base'
import React, {useState, useEffect} from 'react'
import {AppNavigatorRoutesProps} from '../routes/app.routes'
import {BackButton} from '../components/BackButton'
import {useNavigation, useRoute} from '@react-navigation/native'
import {AntDesign} from '@expo/vector-icons'
import auth from '@react-native-firebase/auth'
import firestore from '@react-native-firebase/firestore'
import {CardMessage} from '../components/CardMessage'

export function Mensagens() {
  const {navigate} = useNavigation<AppNavigatorRoutesProps>()
  const [email, setEmail] = useState('')
  const [userId, setUserId] = useState('')
  const [messages, setMessages] = useState([])
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')

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
        let userPhone = phone
        querySnapshot.forEach((doc) => {
          items.push({id: doc.id, ...doc.data()})
          total += doc.data().price
          userName = doc.data().name
          userPhone = doc.data().phone
        })
        setName(userName)
        setPhone(userPhone)
      })

    return () => {
      unsubscribeAuth()
      unsubscribeCart()
    }
  }, [userId, email, phone])

  useEffect(() => {
    const chats = {}

    const unsubscribeOrders = firestore()
      .collection('chats')
      .where('destination', '==', userId)
      .onSnapshot((querySnapshot) => {
        const newMessages = []

        querySnapshot.forEach((doc) => {
          const message = {...doc.data()}
          if (!chats[message.chatId]) {
            chats[message.chatId] = true
            newMessages.push(message)
          }
        })

        setMessages(newMessages)
      })

    return () => {
      unsubscribeOrders()
    }
  }, [userId])

  return (
    <Box>
      {messages.length > 0 ? (
        messages.map((item, index) => {
          return (
            <Box key={item.chatId} style={{alignItems: 'center', padding: 10}}>
              <CardMessage
                name={item.user.name}
                phone={item.phone}
                onPress={() => navigate('Chat', {messagedestine: item.user._id, chatId: item.chatId})}
              />
            </Box>
          )
        })
      ) : (
        <Box>
          <Center mt={48}>
            <Text fontSize={28} fontFamily={'Tilt'} textAlign={'center'} color={'black.normal'}>
              Nenhuma Mensagem no Momento
            </Text>
          </Center>
       

     </Box>
    )}
  </Box>
);

    }
