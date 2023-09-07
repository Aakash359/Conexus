import React, {JSX} from 'react';
import {useSelector} from '../redux/reducers/index';
import {AppColors} from '.././theme';
import TabNavigator from './TabNavigator';
import {createDrawerNavigator} from '@react-navigation/drawer';
import {windowDimensions} from '../common/window-dimensions';
import NavigationService from './NavigationService';
import Icons from 'react-native-vector-icons/Ionicons';
import Icon from 'react-native-vector-icons/Feather';
import NurseHome from '../containers/NurseHome/nurseHome';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {DrawerActions} from '@react-navigation/native';
import CustomDrawer from '../components/CustomDrawer';
import {TouchableOpacity} from 'react-native';
import MessageCenter from '../containers/MessageCenter/messageCenter';
import AudioPlayer from '../containers/AudioPlayer/audioPlayer';
import InterviewQuestions from '../containers/InterviewQuestions/interviewQuestions';
import {
  MESSAGE_CENTER,
  AUDIO_PLAYER,
  INTERVIEW_QUESTIONS,
  NURSE_HOME,
  TABS,
  CONVERSATION_CONTAINER,
  VIDEO_PLAYER,
  ADD_QUESTIONS,
  INTERVIEW_QUESTIONS_DETAIL,
  VIDEO_RECORDER,
  CALL_SCREEN,
  MEETING_ROOM,
  APP_FEEDBACK,
  PROFILE,
  AGENT_MESSAGE,
  EDIT_PROFILE,
} from './Routes';
import AppFeedback from '../containers/SendFeedback/appFeedback';

import ConversationContainer from '../containers/MessageCenter/conversation';
import VideoPlayer from '../containers/VideoPlayer/videoPlayer';
import AddQuestion from '../containers/InterviewQuestions/AddQuestion';
import InterviewQuestionDetail from '../containers/InterviewQuestions/interviewQuestionsDetails';
import VideoRecorder from '../containers/VideoRecorder/videoRecoder';

import MeetingRoom from '../containers/VideoCalling/MeetingRoom';
import Profile from '../containers/Profile/profile-view';
import AgentMessage from '../containers/AgentMessage/agentMessage';
import EditProfile from '../containers/Profile/profile-edit';
import CallScreen from '../containers/VideoCalling/CallPage';

const Drawer = createDrawerNavigator();
const DrawerStack = () => {
  const userInfo: any = useSelector(state => state.userReducer);
  // const userType = (userInfo?.user?.userType).toUpperCase();
  return (
    <Drawer.Navigator
      drawerContent={(props: JSX.IntrinsicAttributes) => (
        <CustomDrawer {...props} />
      )}
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
          fontSize: 18,
        },
      }}
    >
      {/* {userType === 'HCP' ? (
        <Drawer.Screen
          name={NURSE_HOME}
          component={NurseHome}
          options={{
            headerShown: true,
            title: 'Nurse',
          }}
        />
      ) : ( */}
      <Drawer.Screen
        name={TABS}
        component={TabNavigator}
        options={{
          headerShown: false,
        }}
      />
      {/* )} */}

      <Drawer.Screen
        name={INTERVIEW_QUESTIONS}
        component={InterViewStack}
        options={{
          headerShown: false,
        }}
      />
      <Drawer.Screen
        name={APP_FEEDBACK}
        component={AppFeedback}
        options={{
          drawerItemStyle: {height: 0},
          title: 'App Feedback',
        }}
      />

      <Drawer.Screen
        name={MESSAGE_CENTER}
        component={MessageStack}
        options={{
          headerShown: false,
        }}
      />

      <Drawer.Screen
        name={PROFILE}
        component={Profile}
        options={{
          title: 'Your Profile',
          drawerItemStyle: {height: 0},
        }}
      />
      <Drawer.Screen
        name={EDIT_PROFILE}
        component={EditProfile}
        options={{
          title: 'Edit Your Profile',
          drawerItemStyle: {height: 0},
          headerTitleStyle: {
            color: AppColors.mediumGray,
            fontWeight: 'bold',
            fontSize: 22,
          },
        }}
      />
      <Drawer.Screen
        name={AGENT_MESSAGE}
        component={AgentMessage}
        options={{
          title: 'New Message',
          drawerItemStyle: {height: 0},
        }}
      />
    </Drawer.Navigator>
  );
};

const MessageStack = () => {
  const Stack = createNativeStackNavigator();
  return (
    <Stack.Navigator>
      <Stack.Screen
        name={MESSAGE_CENTER}
        component={MessageCenter}
        options={{
          headerShown: true,
          title: 'Message Center',
          headerTitleStyle: {
            color: AppColors.mediumGray,
            fontWeight: 'bold',
            fontSize: 22,
          },
          headerLeft: () => (
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() =>
                NavigationService.dispatch(DrawerActions.openDrawer())
              }
            >
              <Icons
                color={AppColors.black}
                style={{marginLeft: -10, top: 1}}
                size={32}
                name="menu-outline"
              />
            </TouchableOpacity>
          ),
        }}
      />
      <Stack.Screen
        name={CONVERSATION_CONTAINER}
        component={ConversationContainer}
        options={({route}) => ({
          title:
            ((route?.params || {})?.candidate || {})?.display?.title || ''
              ? route?.params?.candidate?.display?.title
              : 'Conversation',
        })}
      />
      <Stack.Screen
        name={AUDIO_PLAYER}
        component={AudioPlayer}
        options={{
          headerShown: true,
        }}
      />
      <Stack.Screen
        name={VIDEO_PLAYER}
        component={VideoPlayer}
        options={{
          headerShown: false,
        }}
      />
    </Stack.Navigator>
  );
};

const InterViewStack = () => {
  const Stack = createNativeStackNavigator();
  return (
    <Stack.Navigator>
      <Stack.Screen
        name={INTERVIEW_QUESTIONS}
        component={InterviewQuestions}
        options={{
          headerRight: () => (
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => NavigationService.navigate('Message Center')}
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
      <Stack.Screen
        name={ADD_QUESTIONS}
        component={AddQuestion}
        options={({route}) => ({
          title: route?.params?.title ? route?.params?.title : ' Add Questions',
        })}
      />
      <Stack.Screen
        name={INTERVIEW_QUESTIONS_DETAIL}
        component={InterviewQuestionDetail}
        options={({route}) => ({
          title:
            route?.params?.title == 'Interview Questions'
              ? 'Interview Questions'
              : route?.params?.sections?.sectionTitle,
        })}
      />
      <Stack.Screen
        name={VIDEO_RECORDER}
        component={VideoRecorder}
        options={{
          headerShown: false,
          title: 'VideoRecorder',
          headerTitleStyle: {
            color: AppColors.black,
            fontWeight: 'bold',
            fontSize: 22,
          },
        }}
      />
      <Stack.Screen
        name={VIDEO_PLAYER}
        component={VideoPlayer}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name={CALL_SCREEN}
        component={CallScreen}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name={MEETING_ROOM}
        component={MeetingRoom}
        options={{
          headerShown: false,
        }}
      />
    </Stack.Navigator>
  );
};

export default DrawerStack;
