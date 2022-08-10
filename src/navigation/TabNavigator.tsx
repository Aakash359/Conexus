import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import PositionsScreen from '../containers/Positions';
import Icon from 'react-native-vector-icons/Feather';
import {AppColors} from '.././theme';
import ReviewCandidateContainer from '../containers/Facility/ReviewCandidateHome/reviewCandidateContainer';

const Tab = createBottomTabNavigator();

const TabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
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
          tabBarIcon: ({color, size}) => (
            <Icon color={AppColors.blue} size={26} name="user-plus" />
          ),
        }}
      />
      <Tab.Screen
        name="Positions"
        component={PositionsScreen}
        options={{
          tabBarIcon: ({color, size}) => (
            <Icon color={AppColors.blue} size={26} name="user-plus" />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default TabNavigator;
