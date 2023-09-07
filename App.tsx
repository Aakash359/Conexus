import React, {useEffect} from 'react';
import codePush from 'react-native-code-push';
import {LogBox} from 'react-native';
import OneSignal from 'react-native-onesignal';
import AsyncStorage from '@react-native-async-storage/async-storage';
import MainNavigator from './src/navigation/MainNavigator';
import {NavigationContainer} from '@react-navigation/native';
import {navigationRef} from './src/navigation/NavigationService';
import SplashScreen from 'react-native-splash-screen';
LogBox.ignoreLogs(['Warning: ...']); // Ignore log notification by message
LogBox.ignoreAllLogs(); //Ignore all log notifications

let codePushOptions = {checkFrequency: codePush.CheckFrequency.ON_APP_START};

const App = () => {
  useEffect(() => {
    codePush.notifyAppReady();
    SplashScreen.hide();
  });

  useEffect(() => {
    getDevice();
  }, []);

  const getDevice = async () => {
    const oneSignalToken = await AsyncStorage.getItem('oneSignalToken');
    console.log('oneSignalToken:- ', oneSignalToken);

    if (!oneSignalToken) {
      try {
        const deviceState: any = await OneSignal.getDeviceState();
        await AsyncStorage.setItem('oneSignalToken', deviceState.userId);
        console.log('deviceState:- ', deviceState.userId);
      } catch (error) {
        console.log('error:- ', error);
      }
    }
  };

  return (
    <NavigationContainer ref={navigationRef}>
      <MainNavigator />
    </NavigationContainer>
  );
};

export default codePush(codePushOptions)(App);
