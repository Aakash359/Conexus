import React from 'react';
import {AppColors} from '.././theme';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {NavigationContainer} from '@react-navigation/native';
import Profile from '../containers/Profile/profile-view';
import AppFeedback from '../containers/SendFeedback/appFeedback';
import AgentMessage from '../containers/AgentMessage/agentMessage';
import EditProfile from '../containers/Profile/profile-edit';
import InterviewQuestions from '../containers/InterviewQuestions/interviewQuestions';
import InterviewQuestionDetail from '../containers/InterviewQuestions/interviewQuestionsDetails';
import AddQuestion from '../containers/InterviewQuestions/AddQuestion';
import HcpDetailView from '../containers/facility/HcpDetail/HcpDetailView';
import ImageGalleries from '../containers/facility/HcpDetail/imageGallery';
import ConversationContainer from '../containers/MessageCenter/conversation';
import VideoPlayer from '../containers/VideoPlayer/videoPlayer';
import AudioPlayer from '../containers/AudioPlayer/audioPlayer';
import AnswerRatings from '../containers/facility/HcpDetail/answerRating';
import NurseInterview from '../containers/NurseHome/interviews/nurse-interview';
import VideoRecorder from '../containers/VideoRecorder/videoRecoder';
import CallScreen from '../containers/VideoCalling/CallScreen';
import MeetingRoom from '../containers/VideoCalling/MeetingRoom';
import DrawerStack from '../navigation/DrawerStack';
import {navigationRef} from './NavigationService';
import {
  DRAWER,
  AGENT_MESSAGE,
  APP_FEEDBACK,
  PROFILE,
  EDIT_PROFILE,
  ADD_QUESTIONS,
  INTERVIEW_QUESTIONS_DETAIL,
  INTERVIEW_QUESTIONS,
  HCP_DETAIL_VIEW,
  IMAGE_GALLERY,
  CONVERSATION_CONTAINER,
  ANSWER_RATINGS,
  AUDIO_PLAYER,
  VIDEO_PLAYER,
  VIDEO_RECORDER,
  NURSE_INTERVIEW,
  MEETING_ROOM,
  CALL_SCREEN,
} from './Routes';

const Stack = createNativeStackNavigator();

const AppStack = () => {
  return (
    <NavigationContainer ref={navigationRef}>
      <Stack.Navigator>
        <Stack.Screen
          name={DRAWER}
          component={DrawerStack}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name={AGENT_MESSAGE}
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
          name={APP_FEEDBACK}
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
          name={PROFILE}
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
          name={EDIT_PROFILE}
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
          name={ADD_QUESTIONS}
          component={AddQuestion}
          options={({route}) => ({
            title: route?.params?.title
              ? route?.params?.title
              : ' Add Questions',
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
          name={HCP_DETAIL_VIEW}
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
          name={IMAGE_GALLERY}
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
          name={VIDEO_PLAYER}
          component={VideoPlayer}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name={AUDIO_PLAYER}
          component={AudioPlayer}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name={ANSWER_RATINGS}
          component={AnswerRatings}
          options={{
            headerShown: false,
          }}
        />

        <Stack.Screen
          name={INTERVIEW_QUESTIONS}
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
          name={NURSE_INTERVIEW}
          component={NurseInterview}
          options={{
            headerShown: true,
            title: 'Nurse Interview',
            headerTitleStyle: {
              color: AppColors.black,
              fontWeight: 'bold',
              fontSize: 22,
            },
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
    </NavigationContainer>
  );
};

export default AppStack;
