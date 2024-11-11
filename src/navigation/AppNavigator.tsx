import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Routes from './routes';
import HomeScreen from '@screens/HomeScreen';

export type RootStackParamList = {
  [Routes.HomeScreen]: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName={Routes.HomeScreen}
        screenOptions={{
          headerShown: false,
        }}>
        <Stack.Screen name={Routes.HomeScreen} component={HomeScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
