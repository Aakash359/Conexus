import React, {useState, useEffect, useRef} from 'react';
import {
  View,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  Platform,
  ViewStyle,
  Text,
  Alert,
} from 'react-native';
import {AppColors, AppFonts, AppSizes} from '../theme/index';
import {logger} from 'react-native-logs';
import Video from 'react-native-video';
import {ActionButton} from '../components';
import Icon from 'react-native-vector-icons/Ionicons';
import _ from 'lodash';
import InCallManager from 'react-native-incall-manager';
import SystemSetting from 'react-native-system-setting';
import Slider from '@react-native-community/slider';
import IconTitleBlock from './icon-title-block';
import {windowDimensions} from '../common/window-dimensions';
import NavigationService from '../navigation/NavigationService';

const isAndroid = Platform.OS === 'android';

const log = logger.createLogger();

export interface ConexusVideoPlayerProps {
  mediaUrl: string;
  actionButton?: (() => ConexusVideoActionButton) | ConexusVideoActionButton;
  menuButtons?: ConexusVideoActionButton[];
  autoPlay?: boolean;
  pausable?: boolean;
  showActionsOnEnd?: boolean;
  style: any;
  activityIndicator?: () => any;

  onEnd?: () => any;
  onLoad?: () => any;
  onError?: (error: any) => any;

  renderStoppedOverlay?: () => JSX.Element;
  renderPlayOverlay?: () => JSX.Element;
  replayTitle?: string;
  playWhenInactive?: () => JSX.Element;

  hideErrors?: boolean;
  hideErrorIcon?: boolean;
  errorIconName?: string;
  errorDisplayText?: string;

  overlayContentStyle?: ViewStyle;
  overlayContentWithErrorStyle?: ViewStyle;
  overlayFooterStyle?: ViewStyle;

  showActionButtonWhilePlaying?: boolean;
  loadingColor?: string;

  volumeLocation?: 'top-left' | 'top-right';
}

export interface ConexusVideoPlayerState {
  loaded: boolean;
  isPaused: boolean;
  hasEnded: boolean;
  hasError: boolean;
  playWhenInactive?: boolean;
  volume?: number;
}

export interface ConexusVideoActionButton {
  title: string;
  onPress: () => void;
  showOnError?: boolean;
  loaded: any;
}

const ConexusVideoPlayer = (
  props: ConexusVideoPlayerProps,
  state: ConexusVideoPlayerState,
) => {
  const {
    volumeLocation,
    mediaUrl,
    actionButton,
    showActionsOnEnd,
    showActionButtonWhilePlaying,
  } = props;
  const [volume, setVolume] = useState(10);
  const [hasError, setHasError] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [hasEnded, setHasEnded] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const replaying: boolean = false;

  const videoRef = useRef<Video>(null);
  const progress: number = 0;
  const player: Video = Video;

  const volumeListener = SystemSetting.addVolumeListener(
    _.debounce((data: any) => {
      const volume = isAndroid ? data['music'] : data.value;
      setVolume(data?.value);
    }, 200),
  );

  useEffect(() => {
    SystemSetting.getVolume().then(volume => {
      setVolume(volume);
    });
    if (Platform.OS === 'android') {
      InCallManager.start({media: 'audio'});
      InCallManager.setForceSpeakerphoneOn(true);
    }
    InCallManager.setKeepScreenOn(false);
    InCallManager.setForceSpeakerphoneOn(null);
    InCallManager.stop();

    SystemSetting.removeVolumeListener(volumeListener);
  }, []);

  const pausable = (): boolean => {
    return props.pausable;
  };

  const isPauseded = (): boolean => {
    return isPaused;
  };

  const loads = (): boolean => {
    return loaded;
  };

  const isPlaying = (): boolean => {
    return !loads() && !isPauseded() && !hasErrors() && !hasEnd();
  };

  const hasEnd = (): boolean => {
    return hasEnded;
  };

  const hasErrors = (): boolean => {
    return hasError;
  };

  const autoPlay = (): boolean => {
    return props.autoPlay;
  };

  // get mediaUrl(): string {
  //   return this.props.mediaUrl;
  // }

  const hidePlayer = (mediaUrl: string): boolean => {
    return !mediaUrl || hasErrors();
  };

  const playWhenInactive = (): boolean => {
    return props.playWhenInactive;
  };

  const replayTitle = (): string => {
    return props.replayTitle || 'Replay';
  };

  // get hideErrors(): boolean {
  //   return this.props.hideErrors;
  // }

  const hideErrorIcons = (): boolean => {
    return !!props.hideErrorIcon;
  };

  const errorIconNames = (): string => {
    return props.errorIconName || 'cn-info';
  };

  const errorDisplayText = (): string => {
    return props.errorDisplayText || `This video is currently unavailable.`;
  };

  const Volume = (value: any) => {
    SystemSetting.setVolume(value, {
      playSound: true,
      showUI: false,
      type: 'music',
    });
    setVolume(value);
  };

  const defaultState = (): ConexusVideoPlayerState => {
    return {
      loaded: false,
      isPaused: false,
      hasEnded: false,
      hasError: false,
    };
  };

  const getVolumeStyle = (): ViewStyle => {
    const location = volumeLocation;

    if (location === 'top-right') {
      return {
        position: 'absolute',
        zIndex: 101,
        right: 0,
        width: 150,
        top: 0,
        padding: 10,
        flexDirection: 'row',
        backgroundColor: 'transparent',
      };
    }

    return {
      position: 'absolute',
      zIndex: 101,
      left: 0,
      width: 150,
      top: 0,
      padding: 10,
      flexDirection: 'row',
      backgroundColor: 'transparent',
    };
  };

  const replay = () => {
    if (replaying) {
      return;
    }
    try {
      const replaying: boolean = false;
      const loads = loaded; // Preserve this value
      setIsPaused(true);
      if (player) {
        console.log('Replay');
        player.seek(0);
        setLoaded(defaultState, loaded);
      }
    } finally {
      replaying;
    }
  };

  const getActionButton = (): ConexusVideoActionButton => {
    if (actionButton && _.isFunction(actionButton)) {
      return actionButton();
    } else if (actionButton && actionButton['title']) {
      return actionButton as ConexusVideoActionButton;
    }

    return undefined;
  };

  const onEnd = () => {
    setTimeout(() => {
      setHasEnded(true);
      if (props.onEnd) {
        props.onEnd();
      }
    }, 0);
  };

  const onError = (error: any) => {
    setTimeout(() => {
      setHasError(true);
      if (props.onError) {
        props.onError(error);
      }
    }, 0);
  };

  const onLoad = () => {
    setTimeout(() => {
      setLoaded(true);
      setIsPaused(!autoPlay);
      // player.seek(0);
    }, 0);
  };

  const onProgress = (event: any) => {
    // progress = event.currentTime;
  };

  const togglePause = () => {
    if (!pausable || !player) {
      return;
    }
    setIsPaused(!isPauseded());
  };

  const renderLoading = () => {
    if (loads()) {
      return null;
    }
    let indicator = (
      <ActivityIndicator
        color={props.loadingColor || AppColors.blue}
        style={{flex: 1}}
      />
    );

    if (props.activityIndicator && props.activityIndicator.call()) {
      indicator = props.activityIndicator();
    }

    return <View style={[styles.container]}>{indicator}</View>;
  };

  const renderActions = () => {
    if (replaying) {
      return null;
    }

    if (!showActionsOnEnd && hasEnded) {
      return null;
    }

    let buttons: any[] = [];
    let overlayHeaderText = '';

    const replayButton = {
      title: replayTitle,
      onPress: () => replay(),
    };
    const menuButtons = props.menuButtons || [];

    if (hasErrors()) {
      overlayHeaderText = errorDisplayText();
      replayButton.title = 'Retry';
      buttons = [replayButton, ...menuButtons.filter(i => i.showOnError)];
    } else if (isPauseded()) {
      // Add Play to the top of the list
      buttons = [{title: 'Play', onPress: () => togglePause()}];

      if (progress > 0) {
        buttons.push(replayButton);
      }

      buttons = [...buttons, ...menuButtons];
    } else if (!loads() || !isPlaying()) {
      if (isPlaying()) {
        const btnDetails = getActionButton();

        if (btnDetails) {
          return (
            <View style={[styles.overlayFooter, props.overlayFooterStyle]}>
              <ActionButton
                customStyle={styles.btnEnable}
                title={btnDetails.title}
                onPress={() => NavigationService.goBack()}
              />
            </View>
          );
        }
      }

      return null;
    } else {
      buttons = [replayButton, ...menuButtons];
    }

    const actionButton = getActionButton();

    return (
      <View style={[styles.overlay]}>
        <View
          style={[
            styles.overlayContent,
            hasErrors()
              ? props.overlayContentWithErrorStyle
              : props.overlayContentStyle,
          ]}
        >
          {hasErrors() && (
            <IconTitleBlock
              textColor={AppColors.white}
              iconColor={AppColors.white}
              style={styles.errorHeader}
              iconName={hideErrorIcons() ? undefined : errorIconNames()}
              text={errorDisplayText()}
            />
          )}
          <View
            style={[
              styles.overlayButtons,
              hasErrors() ? styles.overlayButtonsWithError : null,
            ]}
          >
            {buttons.map((b, i) => (
              <TouchableOpacity
                key={'mb' + i}
                style={styles.overlayButton}
                onPress={() => b.onPress()}
              >
                <Text style={styles.overlayButtonText}>{b.title}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
        {!actionButton && (
          <View style={styles.footer}>
            <ActionButton
              title={actionButton.title}
              customStyle={styles.btnEnable}
              onPress={actionButton.onPress}
            />
          </View>
        )}
      </View>
    );
  };

  const renderPausedOverlay = (): any => {
    if (!isPaused) {
      return null;
    }
    if (props.renderStoppedOverlay && props.renderStoppedOverlay.call()) {
      return props.renderStoppedOverlay();
    }

    return null;
  };

  const renderPlayOverlay = () => {
    if (!isPaused) {
      return null;
    }
    if (props.renderPlayOverlay && renderPlayOverlay.call) {
      return renderPlayOverlay();
    }
    return null;
  };

  const renderPlayer = () => {
    return (
      <TouchableOpacity
        disabled={!pausable() || isPauseded()}
        style={[styles.container, props.style]}
        onPress={() => togglePause()}
      >
        {
          <Video
            source={{uri: mediaUrl}}
            ref={videoRef}
            resizeMode={'cover'}
            rate={1.0} // 0 is paused, 1 is normal.
            volume={volume} // 0 is muted, 1 is normal.
            muted={false} // Mutes the audio entirely.
            paused={isPauseded()}
            ignoreSilentSwitch={'ignore'}
            playWhenInactive={() => playWhenInactive()}
            onLoad={onLoad()}
            onEnd={onEnd()}
            // onError={onError()}
            onProgress={() => onProgress()}
            style={[styles.video]}
          />
        }
        {renderPausedOverlay()}
        {renderPlayOverlay()}
        {renderActions()}
        {renderLoading()}
        {
          <View style={getVolumeStyle()}>
            <Slider
              style={{flex: 1, height: 54}}
              minimumValue={0}
              value={volume}
              thumbTintColor={AppColors.blue}
              maximumValue={1}
              minimumTrackTintColor={AppColors.blue}
              maximumTrackTintColor={AppColors.white}
              onValueChange={(value: any) => Volume(value)}
              thumbImage={require('./Images/player/volume.png')}
            />
          </View>
        }
        <Icon
          style={styles.closeButton}
          name="close-outline"
          size={35}
          color={AppColors.blue}
          onPress={() => NavigationService.goBack()}
        />
      </TouchableOpacity>
    );
  };

  // if (hasErrors()) {
  //   return renderActions();
  // }

  return renderPlayer();
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    flex: 1,
    alignSelf: 'stretch',
    alignItems: 'stretch',
  },
  closeButton: {
    top: 24,
    right: 18,
    alignSelf: 'flex-end',
  },
  footer: {
    right: 10,
    left: 10,
    position: 'absolute',
    bottom: 20,
  },
  btnEnable: {
    alignSelf: 'center',
    width: windowDimensions.width * 0.5,
  },
  video: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
  overlay: {
    position: 'absolute',
    backgroundColor: 'rgba(0,0,0,0.7)',
    flex: 1,
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 3,
  },
  errorHeader: {
    paddingLeft: 20,
    paddingRight: 20,
    marginBottom: 30,
  },
  overlayContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 120,
  },
  overlayButtons: {},
  overlayButtonsWithError: {},
  overlayFooter: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    flex: 0,
    flexDirection: 'row',
    alignSelf: 'center',
    justifyContent: 'center',
    paddingTop: 30,
    paddingBottom: 30,
  },
  textBase: {
    ...AppFonts.bodyTextLarge,
    color: AppColors.white,
    backgroundColor: 'transparent',
    textAlign: 'center',
  },
  overlayButton: {
    borderWidth: 1,
    borderColor: AppColors.white,
    height: 46,
    width: 190,
    marginBottom: 18,
    justifyContent: 'center',
    alignSelf: 'center',
  },
  overlayButtonText: {
    ...AppFonts.buttonText,
    color: AppColors.white,
    flex: 1,
    textAlign: 'center',
  },
});

export default ConexusVideoPlayer;
