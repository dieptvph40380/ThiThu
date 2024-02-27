import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import Wellcome from './Screen/Wellcome';
import Home from './Screen/Home';

const Stack=createNativeStackNavigator();

const App = () => {
  return (
    // <View>
    //   <Text>App</Text>
    // </View>
    <NavigationContainer>
      <Stack.Navigator screenOptions={{headerShown : false}}>
        <Stack.Screen name='welcome' component={Wellcome} />
        <Stack.Screen name='home' component={Home} />
      </Stack.Navigator>
    </NavigationContainer>
  )
}

export default App

const styles = StyleSheet.create({})