import {Text, View, TouchableOpacity} from 'react-native';
import React, {Component} from 'react';
import {StyleProvider} from 'native-base';
import {enableLogging} from 'mobx-logger';
import {Provider} from 'mobx-react';
import {AppRouter} from './src/containers';

import getTheme from './src/theme/components';
import variables from './src/theme';
import {userStoreInstance} from './src/stores/userStore';
import {deviceStore} from './src/stores/deviceStore';
import {facilitySubmissionsStoreInstance} from './src/stores/facility/facility-submissions-store';
import {facilityQuestionsStoreInstance} from './src/stores/facility/facility-questions-store';
import {conversationStoreInstance} from './src/stores/message-center';
import {
  setupNotifications,
  destroyNotifications,
} from './src/common/notifications';
import {facilityNeedsStoreInstance} from './src/stores/facility/facility-needs-store';
import {nurseSubmissionsStore} from './src/stores/nurseStore';
import {videoStore} from './src/stores/videoStore';
import codePush from 'react-native-code-push';

(console as any).disableYellowBox = true;

enableLogging({
  predicate: () => __DEV__ && Boolean(window.navigator.userAgent),
  // action: true,
  transaction: true,
  // reaction: true,
  // compute: true,
});

const facilitySubmissionsStore = facilitySubmissionsStoreInstance;
const facilityQuestionsStore = facilityQuestionsStoreInstance;
const conversationStore = conversationStoreInstance;
const userStore = userStoreInstance;
const facilityNeedsStore = facilityNeedsStoreInstance;

const stores = {
  userStore,
  deviceStore,
  nurseSubmissionsStore,
  videoStore,
  // facilitySubmissionsStore,
  // facilityQuestionsStore,
  facilityNeedsStore,
  conversationStore,
};

// autorun('NavigationStore State', () => {
//   console.log('navigationState', stores.navStore.navigationState)
//    console.log('current state', stores.navStore.state)
// })

let codePushOptions = {checkFrequency: codePush.CheckFrequency.ON_APP_START};

class App extends Component {
  constructor(props, context) {
    super(props, context);
  }

  state: {ready: boolean; updateDialog: boolean} = {
    ready: false,
    updateDialog: false,
  };
  componentDidMount() {
    codePush.notifyAppReady();
  }

  componentWillUnmount() {
    // destroyNotifications()
  }

  render() {
    return (
      <Provider {...stores}>
        <AppRouter />
      </Provider>
      // <Provider { ...stores }>
      //  <StyleProvider style={getTheme(variables)}>
      //  <AppRouter />
      //  </StyleProvider>
      // </Provider>
    );
  }
}

export default codePush(codePushOptions)(App);
