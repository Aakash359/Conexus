import React, {useState} from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {NavigationContainer} from '@react-navigation/native';
import LoginScreen from '../containers/Auth/Login/login';
import ForgotPassword from '../containers/Auth/ForgotPassword/forgot-password';
import SelectAccount from '../containers/Auth/SignIn/select-account';
import RequestAccount from '../containers/Auth/SignIn/request-account';
import {navigationRef} from './NavigationService';
import {AppColors} from '../theme';

const Stack = createNativeStackNavigator();
const OtherStack = createNativeStackNavigator();

const AuthNavigator = () => {
  return (
    <OtherStack.Navigator screenOptions={{headerShown: true}}>
      <Stack.Screen
        name="Login"
        component={LoginScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="ForgotPassword"
        component={ForgotPassword}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="SelectAccount"
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
        name="RequestAccount"
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
    </OtherStack.Navigator>
  );
};

const AuthStack = () => {
  return (
    <NavigationContainer ref={navigationRef}>
      <Stack.Navigator screenOptions={{headerShown: false}}>
        <Stack.Screen name="AuthNavigator" component={AuthNavigator} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AuthStack;
