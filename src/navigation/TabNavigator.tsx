import React, {createRef} from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/Feather';
import {DrawerActions} from '@react-navigation/native';
import Icons from 'react-native-vector-icons/Ionicons';
import {AppColors, AppFonts} from '.././theme';
import {TouchableOpacity} from 'react-native';
import NavigationService from './NavigationService';
import Positions from '../containers/facility/Positions/positions';
import ReviewCandidateContainer from '../containers/facility/ReviewCandidateHome/reviewCandidateContainer';

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
      }}
    >
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
          headerRight: () => (
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => NavigationService.navigate('MessageCenter')}
            >
              <Icons
                color={AppColors.blue}
                style={{marginRight: 20}}
                size={26}
                name="chatbubble-outline"
              />
            </TouchableOpacity>
          ),
          headerLeft: () => (
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() =>
                NavigationService.dispatch(DrawerActions.openDrawer())
              }
            >
              <Icon
                color={AppColors.black}
                style={{marginLeft: 10}}
                size={26}
                name="menu"
              />
            </TouchableOpacity>
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
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() =>
                NavigationService.dispatch(DrawerActions.openDrawer())
              }
            >
              <Icon
                color={AppColors.black}
                style={{marginLeft: 10}}
                size={26}
                name="menu"
              />
            </TouchableOpacity>
          ),
          headerRight: () => (
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => NavigationService.navigate('MessageCenter')}
            >
              <Icons
                color={AppColors.blue}
                style={{marginRight: 20}}
                size={26}
                name="chatbubble-outline"
              />
            </TouchableOpacity>
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default TabNavigator;
