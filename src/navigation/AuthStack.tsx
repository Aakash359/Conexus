import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {NavigationContainer} from '@react-navigation/native';
import LoginScreen from '../containers/Auth/Login/login';
import ForgotPassword from '../containers/Auth/ForgotPassword/forgot-password';
import SelectAccount from '../containers/Auth/SignIn/select-account';
import RequestAccount from '../containers/Auth/SignIn/request-account';
import {navigationRef} from './NavigationService';
import {AppColors} from '../theme';
import {
  LOGIN,
  SELECT_ACCOUNT,
  REQUEST_ACCOUNT,
  AUTH_NAVIGATOR,
  FORGOT_PASSWORD,
} from './Routes';

const Stack = createNativeStackNavigator();
const OtherStack = createNativeStackNavigator();

const AuthNavigator = () => {
  return (
    <OtherStack.Navigator screenOptions={{headerShown: true}}>
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
    </OtherStack.Navigator>
  );
};

const AuthStack = () => {
  return (
    <NavigationContainer ref={navigationRef}>
      <Stack.Navigator screenOptions={{headerShown: false}}>
        <Stack.Screen name={AUTH_NAVIGATOR} component={AuthNavigator} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AuthStack;
