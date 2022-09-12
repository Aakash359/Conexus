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

const enum VideoStatus {
  CONNECTING = 'CONNECTING',
  CONNECTED = 'CONNECTED',
  DISCONNECTED = 'DISCONNECTED',
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
  console.log('PopsData===>', propsData);
  const {text} = propsData;
  // const onCanceled = () => {
  //   if (props.onCanceled && props.onCanceled.call) {
  //     props.onCanceled();
  //   }
  //   StatusBar.setHidden(false);
  // };

  // const setConnected = flow(function* (isConnected: boolean) {
  //   self.status = isConnected
  //     ? VideoStatus.CONNECTED
  //     : VideoStatus.DISCONNECTED;
  //   if (!isConnected && self.isCall && self.retry) {
  //     self.retryCount--;
  //     yield connectSession();
  //   }
  // });

  // OpenTok.on(OpenTok.events.ON_SIGNAL_RECEIVED, (e: any) => {
  //   console.log(OpenTok.events.ON_SIGNAL_RECEIVED, e);
  // });

  // OpenTok.on(OpenTok.events.ON_SESSION_DID_CONNECT, (e: {sessionId: any}) => {
  //   console.log('did-connect', e), setSessionId(e.sessionId);
  //   SessionId, SessionToken;
  // });

  // OpenTok.on(OpenTok.events.ON_SESSION_DID_FAIL_WITH_ERROR, (e: any) => {
  //   console.log(OpenTok.events.ON_SESSION_DID_FAIL_WITH_ERROR, e);
  // });

  // OpenTok.on(OpenTok.events.ON_SESSION_DID_DISCONNECT, (e: any) => {
  //   console.log(OpenTok.events.ON_SESSION_DID_DISCONNECT, e);
  // });

  // const connectSession = ()=>{
  //   const isPublishing = false;
  //   const isSubscribed = false;
  //   const inCall = false;
  //   const  status = VideoStatus.CONNECTED
  //   if (status !== VideoStatus.CONNECTED) {
  //     console.log('VideoStore:connectingSession:', status);
  //     let status = VideoStatus.CONNECTING;
  //     let inCall = true;
  //     let result = yield OpenTok.connect(sessionId, sessionToken);
  //     if (result) {
  //       console.log('VideoStore:connectedSession:', status);
  //       status = VideoStatus.CONNECTED;
  //     } else {
  //       console.log('VideoStore:connectingFailedSession:', status);
  //     }
  //   } else {
  //     console.log('VideoStore:alreadyConnected', status);
  //   }
  // };

  const initVideoSession = async () => {
    try {
      const {data} = await initVideoSessionService();
      setVideoSessionData(data);
      // connectSession();
    } catch (error) {
      console.log(error);
      showYesNoAlert({
        title: `We're Sorry`,
        message: 'An error occurred while connecting to our recording service.',
        yesTitle: 'Try Again',
        noTitle: 'Cancel',
        onYes: () => initVideoSession(),
        onNo: () => onCanceled(),
      });
    }
  };

  // const setConnected = (isConnected: boolean)=> {
  //     const status = isConnected ? VideoStatus.CONNECTED : VideoStatus.DISCONNECTED
  //       if (!isConnected && isCall && retry) {
  //         self.retryCount--
  //         yield connectSession()
  //       }
  // }

  // const setSessionId = (sessionId: string) => {
  //   return sessionId;
  // };

  // const connectionSetup = () => {
  //   OpenTok.on(OpenTok.events.ON_SIGNAL_RECEIVED, (e: any) => {
  //     console.log(OpenTok.events.ON_SIGNAL_RECEIVED, e);
  //   });

  //   OpenTok.on(OpenTok.events.ON_SESSION_DID_CONNECT, (e: {sessionId: any}) =>
  //     setSessionId(e.sessionId)
  //     setConnected(true),
  //   )
  // };

  useEffect(() => {
    StatusBar.setHidden(true);
    initVideoSession();
  }, []);

  const menuButtons: ConexusVideoActionButton[] = [
    {
      title: 'Cancel Message',
      // onPress: onCanceled()
    },
  ];

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
          recordedData={data => setShowRecorder(data)}
        />
      }
      {showRecorder && (
        <ConexusVideoPlayer
          mediaUrl={showRecorder?.path}
          volumeLocation="top-left"
          autoPlay={false}
          pausable={true}
          showActionsOnEnd={true}
          menuButtons={menuButtons}
          activityIndicator={() => {
            return activityIndicator;
          }}
          actionButton={{
            title: finishedButtonTitle,
            // onPress: onFinished(archiveId, videoUrl),
          }}
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
