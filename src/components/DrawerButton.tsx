import { Box, Icon } from 'native-base';
import React from 'react';
import {useDrawerProgress, DrawerNavigationOptions} from '@react-navigation/drawer'

import { FontAwesome } from '@expo/vector-icons';
import { DrawerActions, useNavigation } from '@react-navigation/native';
import { Pressable } from 'react-native';

export function DrawerButton() {
 const navigation = useNavigation()

  return (
    <Box mx={2}  my={3} zIndex={1} position={'absolute'}>
    <Pressable onPress={() => navigation.dispatch(DrawerActions.openDrawer()) } >
         <Box zIndex={1} rounded={50} top={10} w={12} h={12} bg={'black.normal'} alignItems={'center'} justifyContent={'center'}>
      <FontAwesome name="bars" color={'white'}  size={22}/>

    </Box>
    </Pressable>
   </Box>
  );
};
