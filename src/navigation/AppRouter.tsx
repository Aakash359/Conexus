import React, {useEffect} from 'react';
import {useSelector} from '../redux/reducers/index';
import AppStack from './AppStack';
import AuthStack from './AuthStack';
import SplashScreen from 'react-native-splash-screen';
import NavigationService from './NavigationService';
import {AUTH_NAVIGATOR, DRAWER, LOGIN} from './Routes';
import {getPreferences, USER_ACCESS_TOKEN} from '../utils/AsyncStorageHelper';

const AppRouter = () => {
  const userInfo = useSelector(state => state.userReducer);

  useEffect(() => {
    SplashScreen.hide();
    // async () => {
    //   const accessToken = await getPreferences(USER_ACCESS_TOKEN, null);
    //   console.log('AccessToken===>', accessToken);

    //   if (accessToken) {
    //     NavigationService.replace(DRAWER);
    //   } else {
    //     NavigationService.replace(AUTH_NAVIGATOR);
    //   }
    // };
  }, []);
  return <>{userInfo?.user?.authToken ? <AppStack /> : <AuthStack />}</>;
};

export default AppRouter;
