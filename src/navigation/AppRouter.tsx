import React, {useState, useEffect} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import AppStack from './AppStack';
import AuthStack from './AuthStack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import SplashScreen from 'react-native-splash-screen';

const AppRouter = () => {
  const [token, setToken] = useState(null);

  const getToken = async () => {
    let userToken = await AsyncStorage.getItem('userToken');
    console.log('Usertoken====>', await AsyncStorage.getItem('userToken'));
    setToken(userToken);
  };

  useEffect(() => {
    getToken();
    SplashScreen.hide();
  }, []);

  return (
    <>
      {token ? (
        <NavigationContainer>
          <AppStack />
        </NavigationContainer>
      ) : (
        <AuthStack />
      )}
    </>
  );
};

export default AppRouter;
