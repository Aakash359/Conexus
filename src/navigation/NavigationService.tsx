import * as React from 'react';
import {
  NavigationContainerRef,
  StackActions,
  NavigationAction,
} from '@react-navigation/native';
import {CommonActions} from '@react-navigation/native';
// NavigationContainer is referred here - Check NavigationStack
export const navigationRef = React.createRef<NavigationContainerRef>();

const navigate = (name: string, params?: any) => {
  navigationRef.current?.navigate(name, params);
};

const replace = (name: string, params?: object): void => {
  navigationRef.current?.dispatch(StackActions.replace(name, params));
};

const dispatch = (action: NavigationAction): void => {
  navigationRef.current?.dispatch(action);
};

const push = (name: string, params?: object): void => {
  navigationRef.current?.dispatch(StackActions.push(name, params));
};

const goBack = () => {
  navigationRef.current?.goBack();
};

const navigateReset = (key: any) => {
  try {
    navigationRef.current.dispatch(
      CommonActions.reset({
        routes: [{name: key}],
      }),
    );
  } catch (error) {}
};

export default {
  navigate,
  goBack,
  push,
  dispatch,
  replace,
  navigateReset,
};
