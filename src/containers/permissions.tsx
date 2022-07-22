import React from 'react';
import {Button} from 'native-base';
import {StyleSheet, Text, View} from 'react-native';
import Permissions from 'react-native-permissions';
import {windowDimensions} from '../common';
import {DeviceStore} from '../stores';

export interface PermissionCheckProps {
  deviceStore?: DeviceStore;
}
export interface PermissionCheckState {}

const style = StyleSheet.create({
  content: {
    ...windowDimensions,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export class PermissionCheck extends React.Component<
  PermissionCheckProps,
  PermissionCheckState
> {
  componentDidMount() {
    Permissions.checkMultiple([
      'ios.permission.CAMERA',
      'ios.permission.PHOTO_LIBRARY',
      'android.permission.CAMERA',
    ]).then(response => {
      // Permissions.check('photo').then(response => {
      // Response is one of: 'authorized', 'denied', 'restricted', or 'undetermined'
      this.setState({photoPermission: response});
    });
  }
  render() {
    return (
      <View style={style.content}>
        <View>
          <Text></Text>
          <Button>All Permisson</Button>
        </View>
      </View>
    );
  }
}
