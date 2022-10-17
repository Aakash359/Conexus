import React from 'react';
import {createDrawerNavigator} from '@react-navigation/drawer';
import CustomDrawer from '../components/CustomDrawer';
import {AppColors} from '.././theme';
import {DrawerActions} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import MessageCenter from '../containers/MessageCenter/messageCenter';
import NavigationService, {navigationRef} from './NavigationService';
import TabNavigator from './TabNavigator';
import {NavigationContainer} from '@react-navigation/native';
import Profile from '../containers/Profile/profile-view';
import AppFeedback from '../containers/SendFeedback/appFeedback';
import AgentMessage from '../containers/AgentMessage/agentMessage';
import EditProfile from '../containers/Profile/profile-edit';
import InterviewQuestions from '../containers/InterviewQuestions/interviewQuestions';
import {windowDimensions} from '../common/window-dimensions';
import Icons from 'react-native-vector-icons/Ionicons';
import Icon from 'react-native-vector-icons/Feather';
import InterviewQuestionDetail from '../containers/InterviewQuestions/interviewQuestionsDetails';
import AddQuestion from '../containers/InterviewQuestions/AddQuestion';
import HcpDetailView from '../containers/Facility/HcpDetail/HcpDetailView';
import ImageGalleries from '../containers/Facility/HcpDetail/imageGallery';
import ConversationContainer from '../containers/MessageCenter/conversation';
import VideoRecorder from '../containers/VideoRecorder/videoRecoder';
import VideoPlayer from '../containers/VideoPlayer/videoPlayer';
import VideoCalling from '../containers/VideoCalling/calling';
import {useSelector} from '../redux/reducers/index';
import NurseHome from '../containers/NurseHome/nurseHome';
import AnswerRatings from '../containers/Facility/HcpDetail/answerRating';

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
          options={({route}) => ({
            title: route?.params?.title
              ? route?.params?.title
              : ' Add Questions',
          })}
        />
        <Stack.Screen
          name="InterviewQuestionDetail"
          component={InterviewQuestionDetail}
          options={({route}) => ({
            title:
              route?.params?.props?.route?.name == 'Positions'
                ? 'Interview Questions'
                : route?.params?.sections?.sectionTitle,
          })}
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
          component={ImageGalleries}
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
          name="ConversationContainer"
          component={ConversationContainer}
          options={({route}) => ({
            title:
              ((route?.params || {})?.candidate || {})?.display?.title || ''
                ? route?.params?.candidate?.display?.title
                : 'Conversation',
          })}
        />
        <Stack.Screen
          name="VideoRecorder"
          component={VideoRecorder}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="VideoPlayer"
          component={VideoPlayer}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="AnswerRatings"
          component={AnswerRatings}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="VideoCalling"
          component={VideoCalling}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="InterviewQuestions"
          component={InterviewQuestions}
          options={{
            headerShown: true,
            title: 'InterviewQuestions',
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

const MessageStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="MessageCenter"
        component={MessageCenter}
        options={{
          headerShown: true,
          title: 'Message Center',
          headerLeft: () => (
            <Icons
              color={AppColors.black}
              style={{marginLeft: -10, top: 1}}
              size={32}
              name="menu-outline"
              onPress={() =>
                NavigationService.dispatch(DrawerActions.openDrawer())
              }
            />
          ),
        }}
      />
    </Stack.Navigator>
  );
};

const DrawerStack = () => {
  const userInfo = useSelector(state => state.userReducer);
  const userType = (userInfo?.user?.userType).toUpperCase();
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
          fontSize: 18,
        },
      }}
    >
      {userType === 'HCP' ? (
        <Drawer.Screen
          name="NurseHome"
          component={NurseHome}
          options={{
            headerShown: true,
            title: 'Nurse',
          }}
        />
      ) : (
        <Drawer.Screen
          name="Review Candidates"
          component={TabNavigator}
          options={{
            headerShown: false,
          }}
        />
      )}

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
      <Drawer.Screen
        name="Message Center"
        component={MessageStack}
        options={{
          headerShown: false,
        }}
      />
    </Drawer.Navigator>
  );
};

export default AppStack;
