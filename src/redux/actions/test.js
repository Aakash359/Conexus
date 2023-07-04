import ConnectyCube from 'react-native-connectycube';
import axios from 'axios';
import {Dispatch} from 'react';
import {defaultBaseUrl} from '../../redux/constants';
import {Alert} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import PushNotificationsService from '../../services/connectycubeServices/pushnotifications-service';
import PermissionsService from '../../services/connectycubeServices/permissions-service';
import CallService from '../../services/connectycubeServices/call-service';
import {setCurrentUser} from '../../redux/actions/currentUser';
import {store} from '../../redux/store';
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
  const newPass = '123'
  const sessionData = {
    name: "RNVideoChat",
    displayName: "RNVideoChat",
    senderID: "147299227261",
    connectyCubeConfig: [
    {
       appId: 7109,
       authKey: "gr87NajH9M5VEzy",
       authSecret: "fZztP7YQdryQ6rQ"
    },
    {
      debug: {
        mode: 1
      }
    }
  ]
  };
  const config = {
    debug: {mode: 1},
  };
  const createUser = {
    email: username,
    password: password.concat(newPass),
  };
  return async (dispatch: Dispatch<UserAction>) => {
    const storeUser = async (
      sessionToken: any,
      createUser: any,
    ) => {
      try {
        const session = JSON.stringify(sessionToken);
        const profile = JSON.stringify(createUser);
        console.log("Data===>",session,profile);
        
        await AsyncStorage.setItem('session', session);
        await AsyncStorage.setItem('profile', profile);
      } catch (e) {
        console.error('_storeUser error: ', e);
      }
    };
    try {
      const response = await axios.post<UserModel>(
        `${defaultBaseUrl}/user/login-with-credentials`,
        data,
      );
      if (!response) {
        dispatch({
          type: 'ON_ERROR',
          payload: 'Login issue with API',
        });
      } else {
        await ConnectyCube.createSession(sessionData,config).then(async (session: any) => {
            const sessionToken = session.token;
            console.log('sessionToken', sessionToken);
            ConnectyCube.users.signup(createUser)
              .then(async (signInData: any) => {
                console.log('Profile created successfully !', signInData.user);
                const userCredentials = {
                  id: signInData.user.id,
                  password: password,
                };
                await storeUser(
                  sessionToken,
                  createUser,
                );
               ConnectyCube.createSession(userCredentials).then((session: any) => {
                    console.log('login successfully', session);
                    store.dispatch(setCurrentUser(signInData.user));
                    CallService.init();
                    PermissionsService.checkAndRequestDrawOverlaysPermission();
                    PushNotificationsService.init();
                  })
                  .catch((error: any) => {
                    console.log('login error', error);
                  });
              })
              .catch((error: any) => {
                console.log('Error in profile creation', error);
              });
          })
          .catch((error: any) => {
            console.log('Session error', error);
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
     console.log("Error===>",error?.response?.data?.description)
     Alert.alert('Error', error?.response?.data?.description);
    }
  };
};

export const logoutRequest = (data: {authToken: string}) => {
  return async (dispatch: Dispatch<UserAction>) => {
    dispatch({
      type: 'ON_LOGOUT',
      payload: data,
    });
  };
};




