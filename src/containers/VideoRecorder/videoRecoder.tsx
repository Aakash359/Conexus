import React, {useState, useEffect, useRef} from 'react';
import {
  StyleSheet,
  ActivityIndicator,
  StatusBar,
  View,
  Text,
  Alert,
} from 'react-native';
import {AppColors, AppSizes} from '../../theme';
import Icon from 'react-native-vector-icons/Ionicons';
import {VideoStore, ConversationStore} from '../stores';
import {ConexusVideoActionButton} from '../../components';
import {ConexusVideoRecorder} from '../../components';
import variables from '../../theme';
import InCallManager from 'react-native-incall-manager';
import {showYesNoAlert} from '../../common/cancel-retry-alert';
import ConexusVideoPlayer from '../../components/conexus-video-player';
import {initVideoSessionService} from '../../services/VideoCallingServices';
import {windowDimensions} from '../../common';
import NavigationService from '../../navigation/NavigationService';
import OpenTok, {Publisher, Subscriber} from 'react-native-opentok';
import {TouchableOpacity} from 'react-native-gesture-handler';

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
  // const {videoMessage, conversationId, submissionId, text} = propsData;
  // const {sessionId, sessionToken} = videoSessionData;
  const cameraRef = useRef<Video>(null);
  // const onCanceled = () => {
  //   if (props.onCanceled && props.onCanceled.call) {
  //     props.onCanceled();
  //   }
  //   StatusBar.setHidden(false);
  // };

  const videoRecord = async () => {
    if (cameraRef && cameraRef.current) {
      cameraRef.current.open({maxLength: 30}, data => {
        console.log('captured data', data); // data.uri is the file path
      });
    }
  };

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

  const setSessionId = (sessionId: string) => {
    return sessionId;
  };

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
    // connectionSetup();
    StatusBar.setHidden(true);
    initVideoSession();
    InCallManager.start({media: 'video'});
    InCallManager.setKeepScreenOn(true);
    InCallManager.setForceSpeakerphoneOn(true);
    OpenTok.connect(sessionId, sessionToken);
  }, []);

  const onRecorderError = (error, code?: string) => {
    setShowRecorder(false);
    setLoading(false);
  };

  // const menuButtons: ConexusVideoActionButton[] = [
  //   {
  //     title: 'Cancel Message',
  //     onPress: onCanceled(),
  //   },
  // ];

  const activityIndicator = (
    <ActivityIndicator style={{flex: 1}} color={AppColors.blue} />
  );

  return (
    <>
      <View style={styles.headerViews}>
        <Icon
          style={styles.closeButton}
          name="ios-close-circle-sharp"
          size={22}
          onPress={() => NavigationService.goBack()}
        />
        <TouchableOpacity onPress={() => videoRecord()}>
          <Text>Opne</Text>
        </TouchableOpacity>
        <VideoRecorder ref={cameraRef} />
        {/* {!showRecorder && (
          <ConexusVideoRecorder
            style={{
              flex: 1,
              width: AppSizes.screen.width,
              height: AppSizes.screen.height,
            }}
            SessionId={sessionId}
            SessionToken={sessionToken}
            onComplete={(result: boolean, data: object) => {
              if (!result) {
                onCanceled();
              }
            }}
            // onRecordStart={onRecordStart}
            // onRecordComplete={onRecordComplete}
            // onRecordError={onRecordError}
          />
        )} */}
      </View>

      {/* {
        <ConexusVideoPlayer
          mediaUrl={videoUrl}
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
      } */}
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
  closeButton: {
    position: 'absolute',
    right: 12,
    top: 12,
  },
});

export default VideoRecorder;
