import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {NavigationContainer} from '@react-navigation/native';
import LoginScreen from '../containers/Auth/Login/login';
import SplashScreen from '../containers/Auth/Splash/index';
import ForgotPassword from '../containers/Auth/ForgotPassword/forgot-password';
import SelectAccount from '../containers/Auth/SignIn/select-account';
import RequestAccount from '../containers/Auth/SignIn/request-account';
import {navigationRef} from './NavigationService';
import AppStack from './AppStack';
import {AppColors} from '../theme';

const Stack = createNativeStackNavigator();
const OtherStack = createNativeStackNavigator();

const AuthNavigator = () => {
  // const isLoggedIn = useSelector(
  //   (state: IState) => state.loginReducer.isLoggedIn,
  // );
  return (
    <OtherStack.Navigator
      screenOptions={{headerShown: true}}
      // initialRouteName={isLoggedIn ? 'AppStack' : 'AuthStack'}
    >
      {/* <Stack.Screen
        name="SplashScreen"
        component={SplashScreen}
        options={{headerShown: false}}
      /> */}

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
      <Stack.Screen name="AppStack" component={AppStack} />
    </OtherStack.Navigator>
  );
};

const AuthStack = () => {
  return (
    <NavigationContainer ref={navigationRef}>
      <Stack.Navigator
        screenOptions={{headerShown: false}}
        initialRouteName="Auth">
        <Stack.Screen name="Auth" component={AuthNavigator} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AuthStack;
