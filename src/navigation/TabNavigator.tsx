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
      <Stack.Screen
        name="Positions"
        component={PositionsScreen}
        // options={{
        //   tabBarIcon: ({color, size}) => (
        //     <Feather name="shopping-bag" color={color} size={size} />
        //   ),
        //   tabBarLabel: 'Positions',
        // }}
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
      <Tab.Screen name="Review Candidates" component={HomeStack} />
    </Tab.Navigator>
  );
};

export default TabNavigator;
