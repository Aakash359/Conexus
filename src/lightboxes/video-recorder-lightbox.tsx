import React from 'react';
import {
  StyleSheet,
  ViewProperties,
  ActivityIndicator,
  StatusBar,
} from 'react-native';

import {Actions} from 'react-native-router-flux';
import {ConexusLightbox} from '../lightboxes/base-lightbox';
import {AppColors, AppSizes} from '../theme';
import {showYesNoAlert} from '../common';
import {VideoStore, ConversationStore} from '../stores';
import {
  ConexusVideoRecorder,
  ConexusVideoPlayer,
  ConexusVideoActionButton,
} from '../components';
import {logger} from 'react-native-logs';
import InCallManager from 'react-native-incall-manager';

const log = logger.createLogger();

interface VideoRecorderLightboxProps extends ViewProperties {
  finishedButtonTitle?: string;
  videoStore?: VideoStore;
  onFinished?: (archiveId: string, videoUrl: string) => {};
  onCanceled?: () => {};
  videoMessage?: boolean;
  conversationId?: string;
  submissionId?: string;
  conversationStore: typeof ConversationStore.Type;
  onMessageSendCallback?: (conversationId: string) => any;
}

interface VideoRecorderLightboxState {
  showRecorder: boolean;
  showPlayer: boolean;
  archiveId: string;
  videoUrl: string;
  loading: boolean;
  closeable: boolean;
}

export class VideoRecorderLightbox extends React.Component<
  VideoRecorderLightboxProps,
  VideoRecorderLightboxState
> {
  get finishedButtonTitle(): string {
    return this.props.finishedButtonTitle || 'Finished';
  }

  constructor(props, state) {
    super(props, state);

    this.state = {
      showRecorder: false,
      showPlayer: false,
      archiveId: '',
      videoUrl: '',
      loading: true,
      closeable: true,
    };
  }

  componentWillMount() {
    StatusBar.setHidden(true);
  }

  componentDidMount() {
    this.initVideoSession();
    InCallManager.start({media: 'video'});
    InCallManager.setKeepScreenOn(true);
    InCallManager.setForceSpeakerphoneOn(true);
  }

  componentWillUnmount() {
    StatusBar.setHidden(false);
    InCallManager.setKeepScreenOn(false);
    InCallManager.setForceSpeakerphoneOn(null);
    InCallManager.stop();
  }

  initVideoSession() {
    const {videoStore} = this.props;
    log.info('VideoRecorderLightbox', 'Initing video session');

    videoStore.initVideoSession().then(
      () => {
        this.setState({showRecorder: true, loading: false});
      },
      error => {
        log.info('Video Session init from video recorder lightbox.', error);
        showYesNoAlert({
          title: `We're Sorry`,
          message:
            'An error occurred while connecting to our recording service.',
          yesTitle: 'Try Again',
          noTitle: 'Cancel',
          onYes: this.initVideoSession.bind(this),
          onNo: this.onCanceled.bind(this),
        });
      },
    );
  }

  onRecorderError(error, code?: string) {
    this.setState({showRecorder: false, closeable: true});
  }

  onPlayError() {
    setTimeout(() => {
      showYesNoAlert({
        title: `We're Sorry`,
        message: 'An error occurred while playing this video.',
        yesTitle: 'Try Again',
        noTitle: 'Cancel',
        onYes: () => {
          this.setState({showPlayer: true});
        },
        onNo: this.onCanceled.bind(this),
      });
    }, 0);
  }

  onRecordComplete(archiveId: string, videoUrl: string) {
    log.info('onRecordComplete', archiveId, videoUrl);

    this.setState({
      closeable: true,
      showRecorder: false,
      showPlayer: true,
      archiveId,
      videoUrl,
    });
  }

  private videoMessageSendComplete = false;

  onFinished(archiveId: string, videoUrl: string) {
    const {videoMessage} = this.props;

    if (videoMessage && !this.videoMessageSendComplete) {
      return this.sendVideoMessage(archiveId, videoUrl);
    }

    if (this.props.onFinished && this.props.onFinished.call) {
      this.props.onFinished(archiveId, videoUrl);
    }

    StatusBar.setHidden(false);
    // return Actions.pop()
  }

  onMessageSend(conversationId: string) {
    if (
      this.props.onMessageSendCallback &&
      this.props.onMessageSendCallback.call
    ) {
      try {
        this.props.onMessageSendCallback(conversationId);
      } catch (error) {
        log.info('VideoRecorderLightbox', 'onMessageSendError', error);
      }
    }
  }

  onCanceled() {
    if (this.props.onCanceled && this.props.onCanceled.call) {
      this.props.onCanceled();
    }

    StatusBar.setHidden(false);
    // Actions.pop()
  }

  onRecordError() {
    // Do nothing. The recorder shows an error page
  }

  onRecordStart() {
    this.setState({closeable: false});
  }

  sendVideoMessage(archiveId: string, videoUrl: string) {
    const {conversationId, conversationStore, submissionId} = this.props;

    if (!conversationId && !submissionId) {
      throw new Error(
        'Either a conversationID or a submissionId is required to send a video message',
      );
    }

    return conversationStore
      .sendVideoMessage(conversationId, submissionId, archiveId, videoUrl)
      .then(() => {
        this.videoMessageSendComplete = true;
        this.onFinished(archiveId, videoUrl);
        this.onMessageSend(conversationId);
      })
      .catch(error => {
        log.info('sendVideoMessage error', error);
        showYesNoAlert({
          title: 'Send Error',
          message: 'The message could not be sent. Please try again.',
          yesTitle: 'Try Again',
          onYes: this.sendVideoMessage.bind(
            this,
            conversationId,
            submissionId,
            archiveId,
            videoUrl,
          ),
          onNo: () => {
            this.videoMessageSendComplete = true;
            this.onFinished(archiveId, videoUrl);
          },
        });
      });
  }

  menuButtons: ConexusVideoActionButton[] = [
    {title: 'Cancel Message', onPress: this.onCanceled.bind(this)},
  ];

  render() {
    const {showRecorder, showPlayer, videoUrl, loading, closeable} = this.state;
    const activityIndicator = (
      <ActivityIndicator style={{flex: 1}} color={AppColors.blue} />
    );

    return (
      <ConexusLightbox
        closeable={closeable}
        hideHeader={true}
        verticalPercent={1}
        horizontalPercent={1}
        style={styles.lightbox}>
        {showRecorder && (
          <ConexusVideoRecorder
            style={{
              flex: 1,
              width: AppSizes.screen.width,
              height: AppSizes.screen.height,
            }}
            onComplete={(result: boolean, data: object) => {
              if (!result) {
                this.onCanceled();
              }
            }}
            onRecordStart={this.onRecordStart.bind(this)}
            onRecordComplete={this.onRecordComplete.bind(this)}
            onRecordError={this.onRecordError.bind(this)}
          />
        )}
        {showPlayer && !!videoUrl && (
          <ConexusVideoPlayer
            mediaUrl={videoUrl}
            volumeLocation="top-left"
            autoPlay={false}
            pausable={true}
            showActionsOnEnd={true}
            menuButtons={this.menuButtons}
            activityIndicator={() => {
              return activityIndicator;
            }}
            actionButton={{
              title: this.finishedButtonTitle,
              onPress: this.onFinished.bind(
                this,
                this.state.archiveId,
                this.state.videoUrl,
              ),
            }}
            onLoad={() => log.info('Video Loaded')}
            onError={this.onPlayError.bind(this)}
            style={{flex: 1}}
            overlayFooterStyle={styles.overlayFooter}
          />
        )}
        {loading && (
          <ActivityIndicator color={AppColors.blue} style={{flex: 1}} />
        )}
      </ConexusLightbox>
    );
  }
}

const styles = StyleSheet.create({
  lightbox: {
    flex: 1,
    padding: 0,
    backgroundColor: AppColors.black,
    borderRadius: 0,
    // width: AppSizes.screen.width,
    // height: AppSizes.screen.height
  },
  overlayFooter: {
    marginBottom: AppSizes.isIPhoneX ? AppSizes.iPhoneXFooterSize : 0,
  },
});
