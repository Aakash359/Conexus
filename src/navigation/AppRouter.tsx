import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import AppStack from './AppStack';
import AuthStack from './AuthStack';

const AppRouter = () => {
  const isAuth = false;
  return (
    <NavigationContainer>
      {/* <AppStack /> */}
      <AuthStack />
      {/* {isAuth ? <AppStack /> : <AuthStack />} */}
    </NavigationContainer>
  );
};

export default AppRouter;
