import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {NavigationContainer} from '@react-navigation/native';
import LoginScreen from '../containers/login';
import ForgotPassword from '../containers/forgot-password';
import RequestAccount from '../containers/request-account';
import {navigationRef} from './NavigationService';
const Stack = createNativeStackNavigator();
const OtherStack = createNativeStackNavigator();

const AuthNavigator = () => {
  // const isLoggedIn = useSelector(
  //   (state: IState) => state.loginReducer.isLoggedIn,
  // );
  return (
    <OtherStack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="ForgotPassword" component={ForgotPassword} />
      <Stack.Screen name="RequestAccount" component={RequestAccount} />
    </OtherStack.Navigator>
  );
};

const AuthStack = () => {
  return (
    <NavigationContainer ref={navigationRef}>
      <Stack.Navigator screenOptions={{headerShown: false}}>
        <Stack.Screen name="Login" component={AuthNavigator} />
        {/* <Stack.Screen name="Forgot Password" component={ForgotPassword} /> */}
        {/* <Stack.Screen name="Onboarding" component={OnboardingScreen} /> */}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AuthStack;
