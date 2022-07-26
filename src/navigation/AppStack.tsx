import React from 'react';
import {createDrawerNavigator} from '@react-navigation/drawer';
import CustomDrawer from '../components/CustomDrawer';
import {AppFonts, AppColors} from '.././theme';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import PositionsScreen from '../containers/Positions';
import FacilityMessageCenterContainer from '../containers/MessageCenter/facility-message-center-container';
// import MessagesScreen from '../screens/MessagesScreen';
// import MomentsScreen from '../screens/MomentsScreen';
// import SettingsScreen from '../screens/SettingsScreen';

import TabNavigator from './TabNavigator';
import {TouchableOpacity} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';

const Drawer = createDrawerNavigator();
// const Stack = createNativeStackNavigator();

const AppStack = () => {
  return (
    <Drawer.Navigator
      drawerContent={props => <CustomDrawer {...props} />}
      screenOptions={{
        headerShown: true,
        drawerActiveBackgroundColor: AppColors.blue,
        drawerActiveTintColor: '#fff',
        drawerInactiveTintColor: AppColors.blue,
        drawerLabelStyle: {
          marginLeft: 10,
          // fontFamily: fonts.h3,
          fontSize: 18,
        },
      }}>
      <Drawer.Screen name="Review Candidates" component={TabNavigator} />
      <Drawer.Screen name="Interview Questions" component={PositionsScreen} />
      <Drawer.Screen
        name="Message Center"
        component={FacilityMessageCenterContainer}
      />
    </Drawer.Navigator>
  );
};

export default AppStack;
