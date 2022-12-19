'use strict';
import React, {useState, useEffect} from 'react';
import {StyleSheet, ActivityIndicator, StatusBar, Alert} from 'react-native';
import {AppColors, AppSizes} from '../../theme';
import {VideoStore} from '../stores';
import {ConexusVideoActionButton, ConexusVideoRecorder} from '../../components';
import ConexusVideoPlayer from '../../components/conexus-video-player';
import NavigationService from '../../navigation/NavigationService';
import {
  updateNeedQuestionListService,
  updateQuestionListService,
} from '../../services/ApiServices';

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
  const [videoUrl, setVideoUrl] = useState('');
  const [loading, setLoading] = useState(true);
  const [closeable, setCloseable] = useState(true);
  const [videoSessionData, setVideoSessionData] = useState([]);
  const videoMessageSendComplete = false;
  const propsData = props?.route?.params;
  const {
    text,
    facilityId,
    needId,
    unitId,
    unitName,
    flagValue,
    tokBoxArchiveUrl,
  } = propsData;

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
    console.log('videoURL===>', data);

    if (propsData?.needId) {
      const payload = {
        facilityId: facilityId ? facilityId : '',
        text: text,
        unitId: unitId ? unitId : '',
        unitName: unitName,
        defaultFlag: flagValue,
        tokBoxArchiveUrl: data,
        maxAnswerLengthSeconds: '30',
        maxThinkSeconds: '30',
        mediaDurationSeconds: '12',
        needQuestion: false,
        displayOrder: 1,
        deleted: false,
      };
      try {
        const {result} = await updateNeedQuestionListService(payload);
        NavigationService.goBack();
        // NavigationService.navigate('InterviewQuestionDetail');
      } catch (error) {
        console.log('Error', error);
        Alert.alert(
          `We're Sorry`,
          'An error occurred to update the need questions list.',
        );
      }
    } else {
      const payload = {
        facilityId: '1353',
        text: text,
        unitId: unitId ? unitId : '',
        unitName: unitName,
        defaultFlag: flagValue,
        // tokBoxArchiveId: '83508fdc-f93b-4e54-8121-be76a22b7580',
        tokBoxArchiveUrl: data,
        maxAnswerLengthSeconds: '30',
        maxThinkSeconds: '30',
        mediaDurationSeconds: '12',
        needQuestion: false,
        displayOrder: 1,
        deleted: false,
      };
      try {
        const {result} = await updateQuestionListService(payload);
        // NavigationService.navigate('InterviewQuestionDetail');
        NavigationService.goBack();
      } catch (error) {
        console.log('Error', error);
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
