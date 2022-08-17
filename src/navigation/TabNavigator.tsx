import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Positions from '../containers/Facility/Positions/positions';
import Icon from 'react-native-vector-icons/Feather';
import {DrawerActions} from '@react-navigation/native';
import Icons from 'react-native-vector-icons/Ionicons';
import {AppColors, AppFonts} from '.././theme';
import ReviewCandidateContainer from '../containers/Facility/ReviewCandidateHome/reviewCandidateContainer';
import {Alert} from 'react-native';
import NavigationService from './NavigationService';

const Tab = createBottomTabNavigator();

const TabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: true,
        tabBarShowLabel: true,
        tabBarStyle: {backgroundColor: AppColors.white},
        tabBarLabelStyle: {fontWeight: 'bold', fontSize: 10},
        tabBarActiveTintColor: AppColors.blue,
        tabBarInactiveTintColor: AppColors.mediumGray,
      }}>
      <Tab.Screen
        name="Review"
        component={ReviewCandidateContainer}
        options={{
          tabBarIcon: ({color, focused, size}) => (
            <Icons
              color={focused ? AppColors.blue : AppColors.mediumGray}
              size={26}
              name="ios-create-outline"
            />
          ),
          title: 'Review Candidate',
          headerLeft: () => (
            <Icon
              color={AppColors.black}
              style={{marginLeft: 10}}
              size={26}
              name="menu"
              onPress={() =>
                NavigationService.dispatch(DrawerActions.openDrawer())
              }
            />
          ),
        }}
      />
      <Tab.Screen
        name="Positions"
        component={Positions}
        options={{
          tabBarIcon: ({color, size, focused}) => (
            <Icon
              color={focused ? AppColors.blue : AppColors.mediumGray}
              size={26}
              name="user-plus"
            />
          ),
          title: 'Positions',
          headerLeft: () => (
            <Icon
              color={AppColors.black}
              style={{marginLeft: 10}}
              size={26}
              name="menu"
              onPress={() =>
                NavigationService.dispatch(DrawerActions.openDrawer())
              }
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default TabNavigator;
