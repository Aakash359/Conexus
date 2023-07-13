import ConnectyCube from 'react-native-connectycube';
import axios from 'axios';
import {Dispatch} from 'react';
import {defaultBaseUrl} from '../../redux/constants';
import {Alert} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {setCurrentUser} from '../../redux/actions/currentUser';
import {store} from '../../redux/store';
import PushNotificationsService from '../../services/connectycubeServices/pushnotifications-service';
import CallService from '../../services/connectycubeServices/call-service';

export interface UserModel {
  firstName: string;
  lastName: string;
  subscription: string;
  token: string;
}

export interface LoginAction {
  readonly type: 'ON_LOGIN';
  payload: UserModel;
}

export interface LogoutAction {
  readonly type: 'ON_LOGOUT';
  payload: any;
}

export interface ErrorAction {
  readonly type: 'ON_ERROR';
  payload: any;
}

export type UserAction = LoginAction | ErrorAction | LogoutAction;
// export type logoutAction = logoutAction | ErrorAction;

// we need to dispatch action
export const loginRequest = (data: {
  username: string;
  password: string;
  App: boolean;
}) => {
  const {username, password} = data;
  const newPass = '1234';
  const sessionData = {
    name: 'RNVideoChat',
    displayName: 'RNVideoChat',
    senderID: '147299227261',
    connectyCubeConfig: [
      {
        appId: 7109,
        authKey: 'gr87NajH9M5VEzy',
        authSecret: 'fZztP7YQdryQ6rQ',
      },
      {
        debug: {
          mode: 1,
        },
      },
    ],
  };
  const config = {
    debug: {mode: 1},
  };
  // const createUser = {
  //   email: username,
  //   password: password.concat(newPass)
  // };
  const amitUser = {
    color: '#34ad86',
    full_name: 'Amit',
    id: 8852814,
    login: 'pant123',
    password: 'Admin@123',
  };
  const akashUser = {
    color: '#34ad86',
    full_name: 'akash',
    id: 8852928,
    login: 'akash',
    password: 'Admin@123',
  };
  const akash =
    username === 'appletester@conexussolutions.com' ? akashUser : amitUser;
  return async (dispatch: Dispatch<UserAction>) => {
    const storeUser = async (akash: any) => {
      try {
        const user = JSON.stringify(akash);
        await AsyncStorage.setItem('@currentUser', user);
      } catch (e) {
        console.error('_storeUser error: ', e);
      }
    };
    try {
      const response = await axios.post<UserModel>(
        `${defaultBaseUrl}/user/login-with-credentials`,
        data,
      );
      console.log('response', response);
      if (!response) {
        dispatch({
          type: 'ON_ERROR',
          payload: 'Login issue with API',
        });
      } else {
        await ConnectyCube.createSession(akash)
          .then(async () => {
            CallService.init();
            PushNotificationsService.init();
            store.dispatch(setCurrentUser(akash));
            // await ConnectyCube.chat
            //   .connect({
            //     userId: session.user_id,
            //     password: 'Admin@123',
            //   })
            //   .then(() => {
            //     console.log('Connected Success');
            //   })
            //   .catch((error: any) => {
            //     console.log('chat error', error);
            //   });
            await storeUser(akash);
          })
          .catch((error: any) => {
            console.log('session error', error);
          });
        dispatch({
          type: 'ON_LOGIN',
          payload: response.data,
        });
      }
    } catch (error) {
      dispatch({
        type: 'ON_ERROR',
        payload: error,
      });
      console.log('Error===>', error?.response?.data?.description);
      Alert.alert('Error', error?.response?.data?.description);
    }
  };
};

export const getStoredUser = async () => {
  try {
    const jsonValue = await AsyncStorage.getItem('@currentUser');
    return jsonValue != null ? JSON.parse(jsonValue) : null;
  } catch (e) {
    console.error('_getStoredUser error: ', e);
  }
};

export const removeStoredUser = async () => {
  try {
    await AsyncStorage.removeItem('@currentUser');
  } catch (e) {
    console.error('_removeStoredUser error: ', e);
  }
};

export const logoutRequest = (data: {authToken: string}) => {
  return async (dispatch: Dispatch<UserAction>) => {
    dispatch({
      type: 'ON_LOGOUT',
      payload: data,
    });
  };
};
