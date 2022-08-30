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
import {ActionButton, IconTitleBlock, ScreenFooterButton} from '../components';
import _ from 'lodash';
import InCallManager from 'react-native-incall-manager';
import SystemSetting from 'react-native-system-setting';
import Slider from 'react-native-slider';

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
  playWhenInactive?: boolean;

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
  const {volumeLocation, mediaUrl, actionButton, showActionsOnEnd} = props;
  const [volume, setVolume] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [hasEnded, setHasEnded] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const replaying: boolean = false;

  const videoRef = useRef<Video>(null);
  // const progress: number = 0;
  const player: Video = null;

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
    return loads() && !isPauseded() && !hasErrors() && !hasEnd();
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

  const hidePlayer = (): boolean => {
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

  // get volume(): number {
  //   return this.state.volume;
  // }
  // set volume(value: number) {
  //   SystemSetting.setVolume(value, {
  //     playSound: false,
  //     showUI: false,
  //     type: 'music',
  //   });
  //   this.setState({volume: value});
  // }

  // get defaultState(): ConexusVideoPlayerState {
  //   return {
  //     loaded: false,
  //     isPaused: false,
  //     hasEnded: false,
  //     hasError: false,
  //   };
  // }

  // volumeListener = SystemSetting.addVolumeListener(
  //   _.debounce(data => {
  //     const volume = isAndroid ? data['music'] : data.value;
  //     this.setState({volume: data.value});
  //   }, 200),
  // );

  // constructor(
  //   props: ConexusVideoPlayerProps,
  //   context: ConexusVideoPlayerState,
  // ) {
  //   super(props, context);
  //   this.state = {...this.defaultState};
  // }

  // componentDidMount() {
  //   SystemSetting.getVolume().then(volume => {
  //     this.setState({volume});
  //   });
  // }

  // componentWillMount() {
  //   // Force audio to play via the primary speaker
  //   if (Platform.OS === 'android') {
  //     InCallManager.start({media: 'audio'});
  //     InCallManager.setForceSpeakerphoneOn(true);
  //   }
  // }

  // componentWillUnmount() {
  //   InCallManager.setKeepScreenOn(false);
  //   InCallManager.setForceSpeakerphoneOn(null);
  //   InCallManager.stop();

  //   SystemSetting.removeVolumeListener(this.volumeListener);
  // }

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
      replaying = true;
      const loads = loaded; // Preserve this value
      setIsPaused(true);
      // this.setState({isPaused: true}, () => {
      //   if (this._player) {
      //     log.info('Replay');
      //     this._player.seek(0);

      //     this.setState({...this.defaultState, loaded}, () => {
      //       log.info('replayed', this.state);
      //     });
      //   }
      // });
    } finally {
      replaying = false;
    }
  };

  const getActionButton = (): ConexusVideoActionButton => {
    if (actionButton && _.isFunction(actionButton)) {
      return actionButton();
    } else if (actionButton && !!actionButton['title']) {
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

  const onProgress = event => {
    progress = event.currentTime;
  };

  const togglePause = () => {
    if (!pausable || !player) {
      return;
    }
    setIsPaused(!isPauseded);
  };

  // renderLoading() {
  //   if (this.loaded) {
  //     return null;
  //   }

  //   let indicator = (
  //     <ActivityIndicator
  //       color={this.props.loadingColor || AppColors.blue}
  //       style={{flex: 1}}
  //     />
  //   );

  //   if (this.props.activityIndicator && this.props.activityIndicator.call) {
  //     indicator = this.props.activityIndicator();
  //   }

  //   return <View style={[styles.container]}>{indicator}</View>;
  // }

  const renderActions = () => {
    if (replaying) {
      return null;
    }

    if (!showActionsOnEnd && hasEnded) {
      return null;
    }

    let buttons = [];
    let overlayHeaderText = '';

    const replayButton = {
      title: replayTitle,
      onPress: () => replay(),
    };
    const menuButtons = props.menuButtons || [];

    if (hasError) {
      overlayHeaderText = errorDisplayText();
      replayButton.title = 'Retry';
      buttons = [replayButton, ...menuButtons.filter(i => i.showOnError)];
    } else if (isPauseded()) {
      // Add Play to the top of the list
      buttons = [{title: 'Play', onPress: () => togglePause()}];

      // if (progress() > 0) {
      //   buttons.push(replayButton);
      // }

      buttons = [...buttons, ...menuButtons];
    } else if (!loads() || isPlaying()) {
      if (isPlaying() && props.showActionButtonWhilePlaying) {
        const btnDetails = getActionButton();
        console.log('====================================');
        console.log('buttonTitle====>', btnDetails);
        console.log('====================================');
        if (btnDetails) {
          // return (
          //   <Text>hi</Text>
          //   // <ScreenFooterButton
          //   //   hideGradient
          //   //   title={btnDetails.title}
          //   //   onPress={btnDetails.onPress}>
          //   //   </ScreenFooterButton>
          //   // <View style={[styles.overlayFooter, this.props.overlayFooterStyle]} >
          //   //     <ActionButton primary title={btnDetails.title} onPress={btnDetails.onPress}></ActionButton>
          //   // </View>
          // );
        }
      }

      return null;
    } else {
      buttons = [replayButton, ...menuButtons];
    }

    const actionButton = getActionButton();

    return (
      <Text>hi</Text>
      // <View style={[styles.overlay]}>
      //   <View
      //     style={[
      //       styles.overlayContent,
      //       hasErrors()
      //         ? props.overlayContentWithErrorStyle
      //         : props.overlayContentStyle,
      //     ]}>
      //     {hasErrors() && (
      //       <IconTitleBlock
      //         textColor={AppColors.white}
      //         iconColor={AppColors.white}
      //         style={styles.errorHeader}
      //         iconName={hideErrorIcons() ? undefined : errorIconNames()}
      //         text={errorDisplayText}
      //       />
      //     )}
      //     <View
      //       style={[
      //         styles.overlayButtons,
      //         hasErrors() ? styles.overlayButtonsWithError : null,
      //       ]}>
      //       {buttons.map((b, i) => (
      //         <Text>{b.title}</Text>
      //         // <TouchableOpacity
      //         //   key={'mb' + i}
      //         //   rounded
      //         //   transparent
      //         //   style={styles.overlayButton}
      //         //   onPress={() => b.onPress()}>
      //         //   <Text style={styles.overlayButtonText}>{b.title}</Text>
      //         // </TouchableOpacity>
      //       ))}
      //     </View>
      //   </View>
      //   {
      //     !!actionButton && (
      //       <ScreenFooterButton
      //         hideGradient
      //         title={actionButton.title}
      //         onPress={actionButton.onPress}></ScreenFooterButton>
      //     )

      //     // <View style={[styles.overlayFooter, this.props.overlayFooterStyle]} >
      //     //     <ActionButton primary title={actionButton.title} onPress={actionButton.onPress}></ActionButton>
      //     // </View>
      //   }
      // </View>
    );
  };

  // renderPausedOverlay(): JSX.Element | undefined {
  //   if (!this.state.isPaused) {
  //     return null;
  //   }
  //   if (
  //     this.props.renderStoppedOverlay &&
  //     this.props.renderStoppedOverlay.call
  //   ) {
  //     return this.props.renderStoppedOverlay();
  //   }

  //   return null;
  // }

  // renderPlayOverlay(): JSX.Element | undefined {
  //   if (this.state.isPaused) {
  //     return null;
  //   }
  //   if (
  //     this.isPlaying &&
  //     this.props.renderPlayOverlay &&
  //     this.props.renderPlayOverlay.call
  //   ) {
  //     return this.props.renderPlayOverlay();
  //   }

  //   return null;
  // }

  const renderPlayer = () => {
    return (
      <Video
        source={{
          uri: 'http://d23dyxeqlo5psv.cloudfront.net/big_buck_bunny.mp4',
        }} // Can be a URL or a local file.
        ref={videoRef}
        style={{height: 200, width: 200}}
        // resizeMode={'cover'}
        // rate={1.0} // 0 is paused, 1 is normal.
        // // volume={this.volume} // 0 is muted, 1 is normal.
        // muted={false} // Mutes the audio entirely.
        // paused={isPauseded}
        // ignoreSilentSwitch={'ignore'}
        // playWhenInactive={playWhenInactive}
        // onLoad={onLoad()}
        // onEnd={onEnd()}
        // onError={onError()}
        // onProgress={onProgress()}
        // style={[styles.video]}
      />

      // <TouchableOpacity
      //   disabled={!pausable() || isPauseded()}
      //   style={[styles.container, props.style]}
      //   onPress={() => togglePause()}>
      //   {

      //   }
      //   {/* {renderPausedOverlay()} */}
      //   {/* {renderPlayOverlay()} */}
      //   {/* {renderActions()} */}
      //   {/* {renderLoading()} */}
      //   {
      //     <View style={getVolumeStyle()}>
      //       {/* <Slider
      //         style={{flex: 1, height: 54}}
      //         value={volume}
      //         onValueChange={_.debounce(value => {
      //           volume = value;
      //         })}
      //         thumbTintColor={AppColors.blue}
      //         minimumTrackTintColor={AppColors.blue}
      //         maximumTrackTintColor={AppColors.white}
      //         trackStyle={{height: 2}}
      //         thumbStyle={{
      //           alignItems: 'center',
      //           justifyContent: 'center',
      //           width: 24,
      //           height: 24,
      //           borderRadius: 12,
      //         }}
      //         thumbImage={require('./Images/player/volume.png')}
      //       /> */}
      //     </View>
      //   }
      // </TouchableOpacity>
    );
  };

  // if (hasError) {
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
