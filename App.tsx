import React, { useEffect } from 'react';
import codePush from 'react-native-code-push';
import ConnectyCube from 'react-native-connectycube';
import { store } from './src/redux/store';
import AppRouter from './src/navigation/AppRouter';
import { Provider } from 'react-redux';
import { LogBox } from 'react-native';
import config from './connectycube_config.json';

ConnectyCube.init(...config.connectyCubeConfig)
LogBox.ignoreLogs(['Warning: ...']); // Ignore log notification by message
LogBox.ignoreAllLogs(); //Ignore all log notifications

let codePushOptions = { checkFrequency: codePush.CheckFrequency.ON_APP_START };

const sessionData = {
  appId: 7109,
  authKey: 'gr87NajH9M5VEzy',
  authSecret: 'fZztP7YQdryQ6rQ',
};

const App = () => {



  useEffect(() => {
    // initConnectyCube()
    codePush.notifyAppReady();
  })

  return (
    <Provider store={store}>
      <AppRouter />
    </Provider>
  );

}

export default codePush(codePushOptions)(App);
