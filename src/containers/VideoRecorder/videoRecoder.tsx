import React, {useState, useEffect} from 'react';
import {StyleSheet, ActivityIndicator, StatusBar} from 'react-native';
import {ConexusLightbox} from '../lightboxes/base-lightbox';
import {AppColors, AppSizes} from '../../theme';

import {VideoStore, ConversationStore} from '../stores';
import {ConexusVideoActionButton} from '../../components';
import {ConexusVideoRecorder} from '../../components';

import InCallManager from 'react-native-incall-manager';
import {showYesNoAlert} from '../../common/cancel-retry-alert';
import ConexusVideoPlayer from '../../components/conexus-video-player';

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

  const videoMessageSendComplete = false;
  const propsData = props?.route?.params;
  const {videoMessage, conversationId, submissionId} = propsData;
  const {videoStore} = props;

  // const initVideoSession = () => {
  //   try {
  //     const {data} = await initVideoSessionService({
  //       conversationId: conversationId || null,
  //       submissionId: null,
  //       messageText: messageText.replace(/\s+$/g, ''),
  //       messageTypeId: '1',
  //     });
  //   } catch (error) {
  //     console.log(error);
  //     showYesNoAlert({
  //       title: `We're Sorry`,
  //       message: 'An error occurred while connecting to our recording service.',
  //       yesTitle: 'Try Again',
  //       noTitle: 'Cancel',
  //       onYes: this.initVideoSession.bind(this),
  //       onNo: this.onCanceled.bind(this),
  //     });
  //   }

  //  videoStore.initVideoSession().then(
  //   () => {
  //     this.setState({showRecorder: true, loading: false});
  //   },
  //   error => {
  //     log.info('Video Session init from video recorder lightbox.', error);
  //     showYesNoAlert({
  //       title: `We're Sorry`,
  //       message:
  //         'An error occurred while connecting to our recording service.',
  //       yesTitle: 'Try Again',
  //       noTitle: 'Cancel',
  //       onYes: this.initVideoSession.bind(this),
  //       onNo: this.onCanceled.bind(this),
  //     });
  //   },
  // );
  // };

  useEffect(() => {
    StatusBar.setHidden(true);
    // initVideoSession();
    InCallManager.start({media: 'video'});
    InCallManager.setKeepScreenOn(true);
    InCallManager.setForceSpeakerphoneOn(true);
  }, []);

  const onRecorderError = (error, code?: string) => {
    setShowRecorder(false);
    setLoading(false);
  };

  // const onPlayError = () => {
  //   setTimeout(() => {
  //     showYesNoAlert({
  //       title: `We're Sorry`,
  //       message: 'An error occurred while playing this video.',
  //       yesTitle: 'Try Again',
  //       noTitle: 'Cancel',
  //       onYes: () => {
  //         setShowPlayer(true);
  //       },
  //       onNo: onCanceled(z),
  //     });
  //   }, 0);
  // };

  // const onRecordComplete = (archiveId: string, videoUrl: string) => {

  // const onFinished = (archiveId: string, videoUrl: string) => {
  //   if (videoMessage && !videoMessageSendComplete) {
  //     return sendVideoMessage(archiveId, videoUrl);
  //   }

  //   if (props.onFinished && props.onFinished.call) {
  //     props.onFinished(archiveId, videoUrl);
  //   }

  //   StatusBar.setHidden(false);
  //   // return Actions.pop()
  // };

  // const onMessageSend = (conversationId: string) => {
  //   if (
  //     this.props.onMessageSendCallback &&
  //     this.props.onMessageSendCallback.call
  //   ) {
  //     try {
  //       this.props.onMessageSendCallback(conversationId);
  //     } catch (error) {
  //       log.info('VideoRecorderLightbox', 'onMessageSendError', error);
  //     }
  //   }
  // };

  const onCanceled = () => {
    if (props.onCanceled && props.onCanceled.call) {
      props.onCanceled();
    }
    StatusBar.setHidden(false);
  };

  // const onRecordError = () => {
  //   // Do nothing. The recorder shows an error page
  // };

  // const onRecordStart = () => {
  //   this.setState({closeable: false});
  // };

  // const sendVideoMessage = (archiveId: string, videoUrl: string) => {
  //   const {conversationId, conversationStore, submissionId} = this.props;

  //   if (!conversationId && !submissionId) {
  //     throw new Error(
  //       'Either a conversationID or a submissionId is required to send a video message',
  //     );
  //   }

  //   return conversationStore
  //     .sendVideoMessage(conversationId, submissionId, archiveId, videoUrl)
  //     .then(() => {
  //       this.videoMessageSendComplete = true;
  //       this.onFinished(archiveId, videoUrl);
  //       this.onMessageSend(conversationId);
  //     })
  //     .catch(error => {
  //       log.info('sendVideoMessage error', error);
  //       showYesNoAlert({
  //         title: 'Send Error',
  //         message: 'The message could not be sent. Please try again.',
  //         yesTitle: 'Try Again',
  //         onYes: this.sendVideoMessage.bind(
  //           this,
  //           conversationId,
  //           submissionId,
  //           archiveId,
  //           videoUrl,
  //         ),
  //         onNo: () => {
  //           this.videoMessageSendComplete = true;
  //           this.onFinished(archiveId, videoUrl);
  //         },
  //       });
  //     });
  // };

  const menuButtons: ConexusVideoActionButton[] = [
    {
      title: 'Cancel Message',
      onPress: onCanceled(),
    },
  ];

  const activityIndicator = (
    <ActivityIndicator style={{flex: 1}} color={AppColors.blue} />
  );

  return (
    <>
      {!showRecorder && (
        <ConexusVideoRecorder
          style={{
            flex: 1,
            width: AppSizes.screen.width,
            height: AppSizes.screen.height,
          }}
          onComplete={(result: boolean, data: object) => {
            if (!result) {
              onCanceled();
            }
          }}
          // onRecordStart={onRecordStart}
          // onRecordComplete={onRecordComplete}
          // onRecordError={onRecordError}
        />
      )}

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
      {loading && (
        <ActivityIndicator color={AppColors.blue} style={{flex: 1}} />
      )}
    </>
  );
};

const styles = StyleSheet.create({
  lightbox: {
    flex: 1,
    padding: 0,
    backgroundColor: AppColors.black,
    borderRadius: 0,
  },
  overlayFooter: {
    marginBottom: AppSizes.isIPhoneX ? AppSizes.iPhoneXFooterSize : 0,
  },
});

export default VideoRecorder;
