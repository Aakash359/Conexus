import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import AppStack from './AppStack';
import AuthStack from './AuthStack';

const AppRouter = () => {
  const isAuth = false;
  return (
    <AuthStack />
    //  <AppStack />

    // {isAuth ? <AppStack /> : <AuthStack />}
  );
};

export default AppRouter;
