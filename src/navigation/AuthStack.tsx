import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
// import OnboardingScreen from '../screens/OnboardingScreen';
import LoginScreen from '../containers/login';
import ForgotPassword from '../containers/forgot-password';
// import RegisterScreen from '../screens/RegisterScreen';

const Stack = createNativeStackNavigator();

const AuthStack = () => {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Forgot Password" component={ForgotPassword} />
      {/* <Stack.Screen name="Onboarding" component={OnboardingScreen} /> */}
    </Stack.Navigator>
  );
};

export default AuthStack;
