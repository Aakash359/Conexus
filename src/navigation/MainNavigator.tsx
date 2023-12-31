import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {NavigationContainer} from '@react-navigation/native';
import LoginScreen from '../containers/Auth/Login/login';
import ForgotPassword from '../containers/Auth/ForgotPassword/forgot-password';
import SelectAccount from '../containers/Auth/SignIn/select-account';
import RequestAccount from '../containers/Auth/SignIn/request-account';
import DrawerStack from '../navigation/DrawerStack';
import {AppColors} from '../theme';
import {
  LOGIN,
  SELECT_ACCOUNT,
  REQUEST_ACCOUNT,
  AUTH,
  FORGOT_PASSWORD,
  LAUNCH_SCREEN,
  DRAWER,
} from './Routes';
import LaunchScreen from './LaunchScreen';

const Stack = createNativeStackNavigator();

const AuthStack = () => {
  return (
    <Stack.Navigator screenOptions={{headerShown: true}}>
      <Stack.Screen
        name={LOGIN}
        component={LoginScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name={FORGOT_PASSWORD}
        component={ForgotPassword}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name={SELECT_ACCOUNT}
        component={SelectAccount}
        options={{
          title: 'Account Type',
          headerTitleStyle: {
            color: AppColors.mediumGray,
            fontWeight: 'bold',
            fontSize: 22,
          },
        }}
      />
      <Stack.Screen
        name={REQUEST_ACCOUNT}
        component={RequestAccount}
        options={{
          title: 'Request Account',
          headerTitleStyle: {
            color: AppColors.mediumGray,
            fontWeight: 'bold',
            fontSize: 22,
          },
        }}
      />
    </Stack.Navigator>
  );
};

const MainNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen
        name={LAUNCH_SCREEN}
        component={LaunchScreen}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen name={AUTH} component={AuthStack} />
      <Stack.Screen
        name={DRAWER}
        component={DrawerStack}
        options={{headerShown: false}}
      />
    </Stack.Navigator>
  );
};

export default MainNavigator;
