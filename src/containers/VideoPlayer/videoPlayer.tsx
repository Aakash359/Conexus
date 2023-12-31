import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  Alert,
  AlertButton,
  ActivityIndicator,
  StatusBar,
  Text,
  View,
} from 'react-native';

import ConexusVideoPlayer, {
  ConexusVideoActionButton,
} from '../../components/conexus-video-player';
import QuestionPlaybackHeader from '../../components/question-playback-header';
import {AppColors, AppSizes} from '../../theme';

interface VideoPlayer {
  videoUrl?: string;
  closeable: any;
}

interface VideoPlayerState {
  showPlayer: boolean;
}
const menuButtons: ConexusVideoActionButton[] = [];
const VideoPlayer = (props: VideoPlayer, state: VideoPlayerState) => {
  const [showPlayer, setShowPlayer] = useState(true);
  const {videoUrl} = props?.route?.params;

  useEffect(() => {
    StatusBar.setHidden(true);
    StatusBar.setHidden(false);
  }, []);

  const isVideo = (): boolean => {
    return videoUrl;
  };

  const isPlayable = (): boolean => {
    return isVideo() && showPlayer;
  };

  const errorDisplayText = (): string => {
    return `This message is currently unavailable and can not be played.`;
  };

  const onError = (error: any, code?: string) => {
    setShowPlayer(false);
    //TODO: Might handle this better with a retry and cancel
    setTimeout(() => {
      const buttons: AlertButton[] = [
        {
          text: 'Retry',
          onPress: () => {
            setShowPlayer(true);
          },
        },
        {text: 'Cancel', onPress: onCancel},
      ];

      Alert.alert(
        `We're Sorry`,
        `An error occurred while playing this video. ${
          code ? ` (${code})` : ''
        }`,
        buttons,
      );
    }, 0);
  };

  const onClose = () => {
    StatusBar.setHidden(false);
  };

  const onCancel = () => {
    StatusBar.setHidden(false);
  };

  const renderQuestionHeader = () => {
    return (
      <QuestionPlaybackHeader
        showAvatar={false}
        showCountdown={false}
        style={undefined}
      />
    );
  };

  const activityIndicator = (
    <ActivityIndicator style={{flex: 1}} color={AppColors.blue} />
  );

  return (
    <>
      {isPlayable() && (
        <View style={styles.lightbox}>
          <ConexusVideoPlayer
            mediaUrl={videoUrl}
            autoPlay={true}
            pausable={true}
            errorDisplayText={errorDisplayText()}
            showActionsOnEnd={true}
            menuButtons={menuButtons}
            activityIndicator={() => {
              return activityIndicator;
            }}
            actionButton={{title: 'Close', onPress: onClose}}
            renderStoppedOverlay={renderQuestionHeader()}
            // onError={onError()}
            style={styles.videoPlayer}
            overlayFooterStyle={styles.overlayFooter}
            loadingColor={AppColors.blue}
            volumeLocation="top-left"
          />
        </View>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  videoPlayer: {
    flex: 1,
  },

  lightbox: {
    flex: 1,
    padding: 0,
    backgroundColor: AppColors.baseGray,
    borderRadius: 0,
  },
  overlayFooter: {
    marginBottom: AppSizes.isIPhoneX ? AppSizes.iPhoneXFooterSize : 0,
  },
});

export default VideoPlayer;
