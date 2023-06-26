import React, { useEffect } from 'react';
import codePush from 'react-native-code-push';
import ConnectyCube from 'react-native-connectycube';
import { store } from './src/redux/store';
import AppRouter from './src/navigation/AppRouter';
import { Provider } from 'react-redux';
import { LogBox } from 'react-native';

LogBox.ignoreLogs(['Warning: ...']); // Ignore log notification by message
LogBox.ignoreAllLogs(); //Ignore all log notifications

let codePushOptions = { checkFrequency: codePush.CheckFrequency.ON_APP_START };

const sessionData = {
  appId: 7109,
  authKey: 'gr87NajH9M5VEzy',
  authSecret: 'fZztP7YQdryQ6rQ',
};
const config = {
  debug: { mode: 1 },
};
const App = () => {

  const initConnectyCube = async () => {
    await ConnectyCube.init(sessionData, config);
  }

  useEffect(() => {
    initConnectyCube()
    codePush.notifyAppReady();
  })

  return (
    <Provider store={store}>
      <AppRouter />
    </Provider>
  );

}

export default codePush(codePushOptions)(App);
