import React, {useState, useEffect} from 'react';
import {useSelector} from '../redux/reducers/index';
import AppStack from './AppStack';
import AuthStack from './AuthStack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import SplashScreen from 'react-native-splash-screen';

const AppRouter = () => {
  // const [token, setToken] = useState(null);

  const user = useSelector(state => state.userReducer.user);
  console.log('User====>', user?.authToken);

  // const getToken = async () => {
  //   let userToken = await AsyncStorage.getItem('userToken');
  //   console.log('Usertoken====>', await AsyncStorage.getItem('userToken'));
  //   setToken(user?.authToken);
  // };

  useEffect(() => {
    // getToken();
    SplashScreen.hide();
  }, []);

  return <>{user?.authToken ? <AppStack /> : <AuthStack />}</>;
};

export default AppRouter;
