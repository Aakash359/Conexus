'use strict';
import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  ActivityIndicator,
  StatusBar,
  View,
  TouchableOpacity,
  Text,
  Pressable,
  Alert,
} from 'react-native';
import {AppColors, AppSizes} from '../../theme';
import {VideoStore, ConversationStore} from '../stores';
import {ConexusVideoActionButton, ConexusVideoRecorder} from '../../components';
import variables from '../../theme';
import InCallManager from 'react-native-incall-manager';
import {showYesNoAlert} from '../../common/cancel-retry-alert';
import ConexusVideoPlayer from '../../components/conexus-video-player';
import {initVideoSessionService} from '../../services/VideoCallingServices';
import {windowDimensions} from '../../common';
import NavigationService from '../../navigation/NavigationService';
import {updateNeedQuestionListService} from '../../services/VideoRecording/updateNeedQuestionListService';
import {updateQuestionListService} from '../../services/VideoRecording/updateQuestionListService';

interface VideoRecorderProps {
  finishedButtonTitle?: string;
  videoStore?: VideoStore;
  onFinished?: (archiveId: string, videoUrl: string) => {};
  onCanceled?: () => {};
  videoMessage?: boolean;
  conversationId?: string;
  submissionId?: string;
  conversationStore: any;
  onMessageSendCallback?: (conversationId: string) => any;
}

interface VideoRecorderState {
  showRecorder: boolean;
  showPlayer: boolean;
  archiveId: string;
  videoUrl: string;
  loading: boolean;
  closeable: boolean;
}

const VideoRecorder = (
  props: VideoRecorderProps,
  state: VideoRecorderState,
) => {
  const finishedButtonTitle = (): string => {
    return finishedButtonTitle || 'Finished';
  };

  const [showRecorder, setShowRecorder] = useState(false);
  const [showPlayer, setShowPlayer] = useState(false);
  const [archiveId, setArchiveId] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [loading, setLoading] = useState(true);
  const [closeable, setCloseable] = useState(true);
  const [videoSessionData, setVideoSessionData] = useState([]);
  const videoMessageSendComplete = false;
  const propsData = props?.route?.params;
  const {text, facilityId, needId} = propsData;

  useEffect(() => {
    StatusBar.setHidden(true);
  }, []);

  const menuButtons: ConexusVideoActionButton[] = [
    {
      title: 'Cancel Message',
      // onPress: onCanceled()
    },
  ];

  const saveQuestionRecording = async (data: any) => {
    console.log('Data--->', data);

    if (propsData?.needId) {
      const payload = {
        needId: needId,
        videoUrl: data,
      };
      try {
        const {result} = await updateNeedQuestionListService(payload);
        NavigationService.goBack();
      } catch (error) {
        console.log('Error', error);
        NavigationService.goBack();
        Alert.alert(
          `We're Sorry`,
          'An error occurred to update the need questions list.',
        );
      }
    } else {
      const payload = {
        facilityId: facilityId,
        videoUrl: data,
      };
      try {
        const {result} = await updateQuestionListService(payload);
        NavigationService.goBack();
      } catch (error) {
        console.log('Error', error);
        NavigationService.goBack();
        Alert.alert(
          `We're Sorry`,
          'An error occurred to update the questions list.',
        );
      }
    }
  };

  const activityIndicator = (
    <ActivityIndicator style={{flex: 1}} color={AppColors.blue} />
  );

  return (
    <>
      {
        <ConexusVideoRecorder
          style={{
            flex: 1,
            width: AppSizes.screen.width,
            height: AppSizes.screen.height,
          }}
          text={text}
          recordedData={(data: boolean | ((prevState: boolean) => boolean)) =>
            setShowRecorder(data)
          }
        />
      }
      {showRecorder && (
        <ConexusVideoPlayer
          mediaUrl={showRecorder?.path}
          videoPath={showRecorder?.path}
          volumeLocation="top-left"
          autoPlay={false}
          pausable={true}
          showActionsOnEnd={true}
          menuButtons={menuButtons}
          activityIndicator={() => {
            return activityIndicator;
          }}
          onSaveQuestion={(data: string) => saveQuestionRecording(data)}
          // actionButton={{
          //   title: finishedButtonTitle,
          //   onPress: onFinished(archiveId, videoUrl),
          // }}
          onLoad={() => console.log('Video Loaded')}
          // onError={onPlayError}
          style={{flex: 1}}
          overlayFooterStyle={styles.overlayFooter}
        />
      )}
      {/* {loading && (
        <ActivityIndicator color={AppColors.blue} style={{flex: 1}} />
      )} */}
    </>
  );
};

const styles = StyleSheet.create({
  headerViews: {
    flex: 1,
  },
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: 'white',
  },

  preview: {
    width: '100%',
    height: 55,
  },
});

export default VideoRecorder;
