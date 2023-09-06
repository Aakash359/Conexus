import React, {useEffect} from 'react';
import codePush from 'react-native-code-push';
import {store} from './src/redux/store';
import AppRouter from './src/navigation/AppRouter';
import {Provider} from 'react-redux';
import {LogBox, Platform} from 'react-native';
import OneSignal from 'react-native-onesignal';
import AsyncStorage from '@react-native-async-storage/async-storage';

LogBox.ignoreLogs(['Warning: ...']); // Ignore log notification by message
LogBox.ignoreAllLogs(); //Ignore all log notifications

let codePushOptions = {checkFrequency: codePush.CheckFrequency.ON_APP_START};

const App = () => {
  useEffect(() => {
    codePush.notifyAppReady();
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
    <Provider store={store}>
      <AppRouter />
    </Provider>
  );
};

export default codePush(codePushOptions)(App);
