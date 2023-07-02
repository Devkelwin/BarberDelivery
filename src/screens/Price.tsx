import {Box,Text} from 'native-base'
import React,{useEffect, useState} from 'react'
import { Button } from '../components/Button'
import auth from '@react-native-firebase/auth'
import { Input } from '../components/Input'
import * as yup from 'yup'
import {yupResolver} from '@hookform/resolvers/yup'
import {Controller,useForm} from 'react-hook-form'
import {MaterialCommunityIcons} from '@expo/vector-icons'

import firestore from '@react-native-firebase/firestore'

import { Alert } from 'react-native'
type FormatDataProps = {
    series: string
 }
 type SeriesProps = {
  id: string 
  series: string 
 } 
const priceSchema = yup.object({
    series: yup.string().required('Informe as series')
    
 })
export function Price(){
    const [AlSeries, setAlSeries] = useState<SeriesProps[]>([])
    const [isLoading,setIsLoading] = useState(false)
    const {handleSubmit,control,formState:{errors}} = useForm<FormatDataProps>({
        resolver: yupResolver(priceSchema)
     })
  async function handleSignout(){
    auth().signOut()
  }

  function saveSerie({series}: FormatDataProps) {
   firestore()
  .collection('Allseries')
  .add({
   series,
   created_at: firestore.FieldValue.serverTimestamp()
  })
  .then(() => {
    console.log('User added!');
  });
}

useEffect(() => {
  const subscribe = firestore()
  .collection('Allseries')
  .onSnapshot(querySnapshot => {
    const data = querySnapshot.docs.map(doc => {
      return {
        id: doc.id,
        ...doc.data()
      }
    }) as SeriesProps[]
    setAlSeries(data)
  })
  return () => subscribe()
},[])
    return(
    <Box bg={'black.normal'} flex={1}>
         <Controller
                control={control}
                name='series'
                render={({field:{onChange,value}}) => (
                     <Input mt={10} value={value} placeholder='Senha'  errorMessage={errors.series?.message} onChangeText={onChange} InputRightElement={
                    <MaterialCommunityIcons name='lock' size={18} style={{marginRight: 18}}/>
                 }/>
                )}
                />
               
              <Button title='Salvar series ' onPress={handleSubmit(saveSerie)}/>
              {AlSeries.map((item: SeriesProps) => (
  <Text ml={10}  color={'white.normal'}  key={item.id}>{item.series}</Text>
))}
        <Button mt={10} title='Deslogar' onPress={handleSignout}/>
    </Box>
    )
}