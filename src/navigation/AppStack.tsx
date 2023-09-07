import React from 'react';
import {AppColors} from '.././theme';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {NavigationContainer} from '@react-navigation/native';
import Profile from '../containers/Profile/profile-view';
import AgentMessage from '../containers/AgentMessage/agentMessage';
import EditProfile from '../containers/Profile/profile-edit';
import ImageGalleries from '../containers/facility/HcpDetail/imageGallery';
import AnswerRatings from '../containers/facility/HcpDetail/answerRating';
import NurseInterview from '../containers/NurseHome/interviews/nurse-interview';
import {navigationRef} from './NavigationService';

import {
  AGENT_MESSAGE,
  APP_FEEDBACK,
  PROFILE,
  EDIT_PROFILE,
  IMAGE_GALLERY,
  ANSWER_RATINGS,
  AUDIO_PLAYER,
  NURSE_INTERVIEW,
} from './Routes';

const Stack = createNativeStackNavigator();

const AppStack = () => {
  return (
    <NavigationContainer ref={navigationRef}>
      <Stack.Navigator>
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
          name={ANSWER_RATINGS}
          component={AnswerRatings}
          options={{
            headerShown: false,
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
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppStack;
