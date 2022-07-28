import React from 'react';
import {createDrawerNavigator} from '@react-navigation/drawer';
import CustomDrawer from '../components/CustomDrawer';
import {AppFonts, AppColors} from '.././theme';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import PositionsScreen from '../containers/Positions';
import FacilityMessageCenterContainer from '../containers/MessageCenter/facility-message-center-container';
import {navigationRef} from './NavigationService';
import TabNavigator from './TabNavigator';
import {TouchableOpacity} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import ExploreScreen from '../containers/Explore';
import Profile from '../containers/profile-view';
import AppFeedbackModal from '../containers/facility/appFeedbackModal';
import {AgentMessageModal} from '../containers/facility/agentMessageModal';
import EditProfile from '../containers/profile-edit';
import CatalogContainer from '../containers/facility/question-catalog/catalog-container';

const Drawer = createDrawerNavigator();
const Stack = createNativeStackNavigator();

const AppStack = () => {
  return (
    <NavigationContainer ref={navigationRef}>
      <Stack.Navigator>
        <Stack.Screen
          name="Review Candidates"
          component={DrawerStack}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="AgentMessageModal"
          component={AgentMessageModal}
          options={{
            title: 'New Message',
            headerTitleStyle: {
              color: AppColors.mediumGray,
              fontWeight: 'bold',
              fontSize: 22,
            },
          }}
        />
        <Stack.Screen
          name="AppFeedbackModal"
          component={AppFeedbackModal}
          options={{
            title: 'App Feedback',
            headerTitleStyle: {
              color: AppColors.mediumGray,
              fontWeight: 'bold',
              fontSize: 22,
            },
          }}
        />
        <Stack.Screen
          name="Profile"
          component={Profile}
          options={{
            title: 'Your Profile',
            headerTitleStyle: {
              color: AppColors.mediumGray,
              fontWeight: 'bold',
              fontSize: 22,
            },
          }}
        />
        <Stack.Screen
          name="EditProfile"
          component={EditProfile}
          options={{
            title: 'Edit Your Profile',
            headerTitleStyle: {
              color: AppColors.mediumGray,
              fontWeight: 'bold',
              fontSize: 22,
            },
          }}
        />
        {/* <Stack.Screen
          name="EditProfile"
          component={EditProfile}
          options={{
            title: 'Interview Question',
            headerTitleStyle: {
              color: AppColors.mediumGray,
              fontWeight: 'bold',
              fontSize: 22,
            },
          }}
        /> */}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const DrawerStack = () => {
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
      <Drawer.Screen name="CatalogContainer" component={CatalogContainer} />
      <Drawer.Screen
        name="Message Center"
        component={FacilityMessageCenterContainer}
        // options={{drawerLabel: 'Hi'}}
      />
    </Drawer.Navigator>
  );
};

export default AppStack;
