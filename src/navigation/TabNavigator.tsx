import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import ExploreIcon from '.././theme/icons/ExploreIcon';
import ReviewCandidateHomeScreen from '../containers/ReviewCandidateHome';
import PositionsScreen from '../containers/Positions';
// import FavoriteScreen from '../screens/FavoriteScreen';
// import GameDetailsScreen from '../screens/GameDetailsScreen';
import Icon from 'react-native-vector-icons/Feather';
import {AppFonts, AppColors} from '.././theme';
import {ConexusIcon} from '../components/conexus-icon';
import {TouchableOpacity} from 'react-native';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

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
        component={ReviewCandidateHomeScreen}
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
