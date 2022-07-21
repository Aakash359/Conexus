import React, {useEffect, useState} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {StyleSheet, ImageBackground, View} from 'react-native';
import {useDispatch} from 'react-redux';
import {windowDimensions} from '../../../common';

const USER_STORE_AUTH_TOKEN_STORAGE_KEY = '@USER';

interface SplashState {
  displayMode: 'login' | 'splash';
}
const SplashScreen: React.FC<SplashState> = ({}) => {
  const [displayMode, setDisplayMode] = useState('Splash');
  const dispatch = useDispatch();

  useEffect(() => {
    // checkAuthState();
  }, []);

  const setConexusApiEnvironment = (env: ApiEnvironment) => {
    // codePush.getUpdateMetadata().then((details) => {
    //   if (details.deploymentKey === 'UXrzeFYjiGySFOm2mOfuU8pm08Cfaa10473a-eea0-4543-a44c-79c6482beade' || details.deploymentKey === 'OCHtsMWbGSdmM6XRfKhCB5SYFy1saa10473a-eea0-4543-a44c-79c6482beade')
    //     env = 'dev'
    // })
    if (env === 'dev') {
      console.log('setting to dev environment');
      // rest.defaults.baseURL = devUrl
      currentEnvironment = 'dev';
    } else {
      console.log('setting to production environment');
      // rest.defaults.baseURL = productionUrl
      currentEnvironment = 'prod';
    }
  };

  const checkAuthState = async () => {
    const data = await AsyncStorage.getItem(USER_STORE_AUTH_TOKEN_STORAGE_KEY);
    if (data.token && data.token.length) {
      //  setConexusApiEnvironment(data.environment);
      //  yield actions.applyUserAuthorizationToken(data.token);
      //  const validToken = yield actions.refreshAuthorizationToken();
      //  if (validToken) {
      //    return yield actions.initUser(yield userService.getProfile());
      //  }
    }
  };

  return (
    <ImageBackground
      source={require('../../../components/Images/splash.png')}
      style={style.splash}
    />
  );
};

const style = StyleSheet.create({
  splash: {
    ...windowDimensions,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default SplashScreen;
