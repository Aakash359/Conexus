import * as React from 'react';
import {
  NavigationContainerRef,
  StackActions,
  NavigationAction,
} from '@react-navigation/native';

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

export default {
  navigate,
  goBack,
  push,
  dispatch,
  replace,
};
