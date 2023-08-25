import React, {useEffect} from 'react';
import codePush from 'react-native-code-push';
import {store} from './src/redux/store';
import AppRouter from './src/navigation/AppRouter';
import {Provider} from 'react-redux';
import {LogBox} from 'react-native';
import OneSignal from 'react-native-onesignal';
import AsyncStorage from '@react-native-async-storage/async-storage';
import notifee from '@notifee/react-native';

// LogBox.ignoreLogs(['Warning: ...']); // Ignore log notification by message
// LogBox.ignoreAllLogs(); //Ignore all log notifications

let codePushOptions = {checkFrequency: codePush.CheckFrequency.ON_APP_START};

const App = () => {
  useEffect(() => {
    codePush.notifyAppReady();
  });

  useEffect(() => {
    getDevice();
  }, []);

  useEffect(() => {
    getNotifeePermission();
  }, []);

  const getNotifeePermission = async () => {
    // Request Permission
    // setTimeout(async () => {
    //   await notifee.requestPermission();
    // }, 100);
    await notifee.requestPermission();
  };

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
    <Provider store={store}>
      <AppRouter />
    </Provider>
  );
};

export default codePush(codePushOptions)(App);
