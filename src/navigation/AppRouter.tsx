import React, {useEffect} from 'react';
import {useSelector} from '../redux/reducers/index';
import AppStack from './AppStack';
import AuthStack from './AuthStack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import SplashScreen from 'react-native-splash-screen';

const AppRouter = () => {
  const userInfo = useSelector(state => state.userReducer);

  useEffect(() => {
    SplashScreen.hide();
  }, []);
  return <>{userInfo?.user?.authToken ? <AppStack /> : <AuthStack />}</>;
};

export default AppRouter;
