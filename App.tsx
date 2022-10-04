import React, {Component} from 'react';
import codePush from 'react-native-code-push';
import {store} from './src/redux/store';
import AppRouter from './src/navigation/AppRouter';
import {Provider} from 'react-redux';
import {LogBox} from 'react-native';
LogBox.ignoreLogs(['Warning: ...']); // Ignore log notification by message
LogBox.ignoreAllLogs(); //Ignore all log notifications

let codePushOptions = {checkFrequency: codePush.CheckFrequency.ON_APP_START};

class App extends Component {
  componentDidMount() {
    codePush.notifyAppReady();
  }

  render() {
    return (
      <Provider store={store}>
        <AppRouter />
      </Provider>
    );
  }
}

export default codePush(codePushOptions)(App);
