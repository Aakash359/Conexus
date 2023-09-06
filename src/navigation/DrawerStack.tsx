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
} from './Routes';

const Drawer = createDrawerNavigator();
const DrawerStack = () => {
  const userInfo: any = useSelector(state => state.userReducer);
  const userType = (userInfo?.user?.userType).toUpperCase();
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
      {userType === 'HCP' ? (
        <Drawer.Screen
          name={NURSE_HOME}
          component={NurseHome}
          options={{
            headerShown: true,
            title: 'Nurse',
          }}
        />
      ) : (
        <Drawer.Screen
          name={TABS}
          component={TabNavigator}
          options={{
            headerShown: false,
          }}
        />
      )}

      <Drawer.Screen
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
      <Drawer.Screen
        name={MESSAGE_CENTER}
        component={MessageStack}
        options={{
          headerShown: false,
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
        name={AUDIO_PLAYER}
        component={AudioPlayer}
        options={{
          headerShown: true,
        }}
      />
    </Stack.Navigator>
  );
};

export default DrawerStack;
