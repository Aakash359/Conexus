import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import ExploreIcon from '.././theme/icons/ExploreIcon';
import ReviewCandidateHomeScreen from '../containers/ReviewCandidateHome';
import PositionsScreen from '../containers/Positions';
// import FavoriteScreen from '../screens/FavoriteScreen';
// import GameDetailsScreen from '../screens/GameDetailsScreen';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Feather from 'react-native-vector-icons/Feather';
import {AppFonts, AppColors} from '.././theme';
import {ConexusIcon} from '../components/conexus-icon';
import {TouchableOpacity} from 'react-native';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const HomeStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="ReviewCandidateHomeScreen"
        component={ReviewCandidateHomeScreen}
        options={{headerShown: false}}
      />
      {/* <Stack.Screen
        name="GameDetails"
        component={GameDetailsScreen}
        options={({route}) => ({
          title: route.params?.title,
        })}
      /> */}
    </Stack.Navigator>
  );
};

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
      {/* <Tab.Screen
        name="Home2"
        component={HomeStack}
        options={({route}) => ({
          tabBarStyle: {
            display: getTabBarVisibility(route),
            backgroundColor: '#AD40AF',
          },
          tabBarIcon: ({color, size}) => (
            <Ionicons name="home-outline" color={color} size={size} />
          ),
        })}
      /> */}
      <Tab.Screen
        name="Review Candidates"
        component={ReviewCandidateHomeScreen}
        options={{
          tabBarIcon: ({color, size}) => (
            <ExploreIcon color={color} size={size} />
          ),
          tabBarLabel: 'Review',
        }}
      />
      <Tab.Screen
        name="Positions"
        component={PositionsScreen}
        options={{
          tabBarIcon: ({color, size}) => (
            <Feather name="shopping-bag" color={color} size={size} />
          ),
          tabBarLabel: 'Positions',
        }}
      />
    </Tab.Navigator>
  );
};

export default TabNavigator;
