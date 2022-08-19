import React from 'react';
import {createDrawerNavigator} from '@react-navigation/drawer';
import CustomDrawer from '../components/CustomDrawer';
import {AppColors} from '.././theme';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import FacilityMessageCenterContainer from '../containers/MessageCenter/facility-message-center-container';
import NavigationService, {navigationRef} from './NavigationService';
import TabNavigator from './TabNavigator';
import {NavigationContainer} from '@react-navigation/native';
import Profile from '../containers/Profile/profile-view';
import AppFeedback from '../containers/SendFeedback/appFeedback';
import AgentMessage from '../containers/AgentMessage/agentMessage';
import EditProfile from '../containers/Profile/profile-edit';
import AddQuestion from '../containers/InterviewQuestions/addQuestion';
import InterviewQuestions from '../containers/InterviewQuestions/interviewQuestions';
import {windowDimensions} from '../common/window-dimensions';
import HcpDetailView from '../containers/Facility/HcpDetail/hcpDetailView';
import ImageGallery from '../containers/Facility/HcpDetail/imageGallery';
import Icons from 'react-native-vector-icons/Ionicons';
import InterviewQuestionDetail from '../containers/InterviewQuestions/interviewQuestionsDetails';

const Drawer = createDrawerNavigator();
const Stack = createNativeStackNavigator();

const AppStack = () => {
  return (
    <NavigationContainer ref={navigationRef}>
      <Stack.Navigator>
        <Stack.Screen
          name="DrawerStack"
          component={DrawerStack}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="AgentMessage"
          component={AgentMessage}
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
          name="AppFeedback"
          component={AppFeedback}
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
        <Stack.Screen
          name="AddQuestion"
          component={AddQuestion}
          options={{
            title: 'Add a Question',
            headerTitleStyle: {
              color: AppColors.black,
              fontWeight: 'bold',
              fontSize: 22,
            },
          }}
        />
        <Stack.Screen
          name="InterviewQuestionDetail"
          component={InterviewQuestionDetail}
          options={{
            headerTitleStyle: {
              color: AppColors.black,
              fontWeight: 'bold',
              fontSize: 22,
            },
          }}
        />
        <Stack.Screen
          name="HcpDetailView"
          component={HcpDetailView}
          options={{
            headerShown: false,
            headerTitleStyle: {
              color: AppColors.black,
              fontWeight: 'bold',
              fontSize: 22,
            },
          }}
        />
        <Stack.Screen
          name="ImageGallery"
          component={ImageGallery}
          options={{
            headerShown: false,
            headerTitleStyle: {
              color: AppColors.black,
              fontWeight: 'bold',
              fontSize: 22,
            },
          }}
        />
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
        drawerStyle: {
          width: windowDimensions.width * 0.8,
        },
        drawerActiveTintColor: '#fff',
        drawerInactiveTintColor: AppColors.blue,
        drawerLabelStyle: {
          marginLeft: 10,
          // fontFamily: fonts.h3,
          fontSize: 18,
        },
      }}>
      <Drawer.Screen
        name="Review Candidates"
        component={TabNavigator}
        options={{
          headerShown: false,
        }}
      />
      <Drawer.Screen
        name="Interview Questions"
        component={InterviewQuestions}
        options={{
          headerRight: () => (
            <Icons
              color={AppColors.blue}
              style={{marginRight: 20}}
              size={26}
              name="chatbubble-outline"
              onPress={() => NavigationService.navigate('MessageCenter')}
            />
          ),
        }}
      />
      <Drawer.Screen
        name="Message Center"
        component={FacilityMessageCenterContainer}
      />
    </Drawer.Navigator>
  );
};

export default AppStack;
