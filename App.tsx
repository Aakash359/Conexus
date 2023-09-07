import React, {useEffect} from 'react';
import codePush from 'react-native-code-push';
<<<<<<< HEAD
import {LogBox} from 'react-native';
=======
import {store} from './src/redux/store';
import AppRouter from './src/navigation/AppRouter';
import {Provider} from 'react-redux';
import {LogBox, Platform} from 'react-native';
>>>>>>> a5b2ef0c35a082b002cc49cf47c3007f2ffc1e90
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
    if(Platform.OS === "ios") {
      console.log('oneSignalToken iOS:- ', oneSignalToken);
      await OneSignal.addSubscriptionObserver(event => {
        console.log('event:- ', JSON.stringify(event));
      });
    } else {
      console.log('oneSignalToken Android:- ', oneSignalToken);
    }

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
