import {Box, Text,Image,Center, ScrollView} from 'native-base'
import { ServiceCard } from '../components/ServiceCard'
import React from 'react'
export function Barber(){
    return(
        <Box flex={1} bg={'black.normal'} justifyContent={'center'}> 
        <ScrollView mt={10}>
         <Center>
                  <Image alt='image' h={220} mb={8}  w={220} source={require('../assets/Logo-Barberb.png')}/>
                
                <Text  textAlign={'center'}  fontSize={25}  fontFamily={'Tilt'} color={'white.normal'}>Escolha um de nossos serviços das seguintes categorias:</Text>
              <Text mt={4} fontFamily={'Tilt'} fontSize={22} color={'yellow.normal'}>Barbearia</Text>
              </Center>
                
            <ServiceCard service='Corte de Cabelo Completo' price='1000 KZ'/>
            <ServiceCard service='Corte de Cabelo Personalizado' price='1500 KZ'/>
            <Center>
                 <Text mt={4} fontFamily={'Tilt'} fontSize={23} color={'yellow.normal'}>Combos</Text>
            </Center>
            <ServiceCard service='Corte de Cabelo Personalizado' price='2500 KZ'/>
          </ScrollView>
        </Box>
    )
}