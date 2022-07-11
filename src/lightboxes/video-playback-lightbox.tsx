import React from 'react'
import { StyleSheet, ViewProperties, Alert, AlertButton, ActivityIndicator, StatusBar, Text, View } from 'react-native'
import { Actions } from 'react-native-router-flux'
import { ConexusLightbox } from '../lightboxes/base-lightbox'
import { QuestionPlaybackHeader } from '../components'
import { AppColors, AppSizes, AppFonts } from '../theme'
import { ConexusVideoPlayer, ConexusVideoActionButton, Avatar } from '../components'
import { logger } from 'react-native-logs'
const log = logger.createLogger()
interface VideoPlaybackLightboxProps extends ViewProperties {
  videoUrl?: string
  closeable
}

interface VideoPlaybackLightboxState {
  showPlayer: boolean
}

export class VideoPlaybackLightbox extends React.Component<VideoPlaybackLightboxProps, VideoPlaybackLightboxState> {

  get isPlayable(): boolean {
    return this.isVideo && this.state.showPlayer
  }

  get isVideo(): boolean {
    return !!this.props.videoUrl
  }


  get errorDisplayText(): string {
    return `This message is currently unavailable and can not be played.`
  }

  constructor(props, state) {
    super(props, state);

    this.state = {
      showPlayer: true
    };
  }

  componentWillMount() {
    StatusBar.setHidden(true)
  }

  componentWillUnMount() {
    StatusBar.setHidden(false)
  }

  onError(error, code?: string) {
    this.setState({ showPlayer: false });
    log.info('VideoPlayback Lightbox', 'Error', error)

    //TODO: Might handle this better with a retry and cancel
    setTimeout(() => {
      const buttons: AlertButton[] = [
        { text: 'Retry', onPress: () => { this.setState({ showPlayer: true }) } },
        { text: 'Cancel', onPress: this.onCancel.bind(this) }
      ]

      Alert.alert(`We're Sorry`, `An error occurred while playing this video. ${code ? ` (${code})` : ''}`, buttons);

    }, 0)
  }

  onClose() {
    StatusBar.setHidden(false)
    Actions.pop();
  }

  onCancel() {
    StatusBar.setHidden(false)
    Actions.pop();
  }

  menuButtons: ConexusVideoActionButton[] = []

  renderQuestionHeader() {
    return (
      <QuestionPlaybackHeader
        showAvatar={false}
        showCountdown={false}
      />
    )
  }


  render() {
    const { videoUrl } = this.props;

    const activityIndicator = (<ActivityIndicator style={{ flex: 1 }} color={AppColors.blue} />)

    return (
      <ConexusLightbox verticalPercent={1} horizontalPercent={1} hideHeader={true} closeable={true} style={styles.lightbox}>
        {this.isPlayable &&
          <ConexusVideoPlayer
            mediaUrl={videoUrl}
            autoPlay={true}
            pausable={true}
            errorDisplayText={this.errorDisplayText}
            showActionsOnEnd={true}
            menuButtons={this.menuButtons}
            activityIndicator={() => { return activityIndicator }}
            actionButton={{ title: 'Close', onPress: this.onClose.bind(this) }}
            renderStoppedOverlay={this.renderQuestionHeader.bind(this)}
            onError={this.onError.bind(this)}
            style={styles.videoPlayer}
            overlayFooterStyle={styles.overlayFooter}
            loadingColor={AppColors.blue}
            volumeLocation="top-left"
          />
        }
      </ConexusLightbox>
    )
  }
}

const styles = StyleSheet.create({
  videoPlayer: {
    flex: 1
  },
  lightbox: {
    flex: 1,
    padding: 0,
    backgroundColor: AppColors.baseGray,
    borderRadius: 0
  },
  overlayFooter: {
    marginBottom: AppSizes.isIPhoneX ? AppSizes.iPhoneXFooterSize : 0
  }
});