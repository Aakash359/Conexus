import React, {useEffect} from 'react';
import {AUTH, DRAWER} from './Routes';
import {getPreferences, USER_ACCESS_TOKEN} from '../utils/AsyncStorageHelper';
import {View} from 'react-native';

const LaunchScreen = (props: any) => {
  useEffect(() => {
    (async () => {
      const accessToken = await getPreferences(USER_ACCESS_TOKEN);
      if (accessToken) {
        props.navigation.replace(DRAWER);
      } else {
        props.navigation.replace(AUTH);
      }
    })();
  }, []);
  return <View />;
};

export default LaunchScreen;
