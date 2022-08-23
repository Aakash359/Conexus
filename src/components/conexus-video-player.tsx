import React, {useState, useEffect} from 'react';
import {
  View,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  Platform,
  ViewStyle,
  Text,
  Button,
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
}

const ConexusVideoPlayer = (
  props: ConexusVideoPlayerProps,
  state: ConexusVideoPlayerState,
) => {
  const {volumeLocation, mediaUrl} = props;
  const [volume, setVolume] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [hasEnded, setHasEnded] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  const player = Video;
  const progress: number = 0;
  const pausable = (): boolean => {
    return props.pausable;
  };

  const isPauseded = (): boolean => {
    return isPaused;
  };

  // get loaded(): boolean {
  //   return this.state.loaded;
  // }

  // get isPlaying(): boolean {
  //   return this.loaded && !this.isPaused && !this.hasError && !this.hasEnded;
  // }

  // get hasEnded(): boolean {
  //   return this.state.hasEnded;
  // }

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

  // get replayTitle(): string {
  //   return this.props.replayTitle || 'Replay';
  // }

  // get hideErrors(): boolean {
  //   return this.props.hideErrors;
  // }

  // get hideErrorIcon(): boolean {
  //   return !!this.props.hideErrorIcon;
  // }

  // get errorIconName(): string {
  //   return this.props.errorIconName || 'cn-info';
  // }

  // get errorDisplayText(): string {
  //   return (
  //     this.props.errorDisplayText || `This video is currently unavailable.`
  //   );
  // }

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

  // getVolumeStyle(): ViewStyle {
  //   const location = this.props.volumeLocation;

  //   if (location === 'top-right') {
  //     return {
  //       position: 'absolute',
  //       zIndex: 101,
  //       right: 0,
  //       width: 150,
  //       top: 0,
  //       padding: 10,
  //       flexDirection: 'row',
  //       backgroundColor: 'transparent',
  //     };
  //   }

  //   return {
  //     position: 'absolute',
  //     zIndex: 101,
  //     left: 0,
  //     width: 150,
  //     top: 0,
  //     padding: 10,
  //     flexDirection: 'row',
  //     backgroundColor: 'transparent',
  //   };
  // }

  // replaying: boolean = false;

  // replay() {
  //   if (this.replaying) {
  //     return;
  //   }

  //   try {
  //     this.replaying = true;
  //     const loaded = this.state.loaded; // Preserve this value

  //     this.setState({isPaused: true}, () => {
  //       if (this._player) {
  //         log.info('Replay');
  //         this._player.seek(0);

  //         this.setState({...this.defaultState, loaded}, () => {
  //           log.info('replayed', this.state);
  //         });
  //       }
  //     });
  //   } finally {
  //     this.replaying = false;
  //   }
  // }

  // getActionButton(): ConexusVideoActionButton {
  //   const {actionButton} = this.props;
  //   if (actionButton && _.isFunction(actionButton)) {
  //     return actionButton();
  //   } else if (actionButton && !!actionButton['title']) {
  //     return actionButton as ConexusVideoActionButton;
  //   }

  //   return undefined;
  // }

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
      player.seek(0);
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

  // renderActions() {
  //   if (this.replaying) {
  //     return null;
  //   }

  //   if (!this.props.showActionsOnEnd && this.state.hasEnded) {
  //     return null;
  //   }

  //   let buttons = [];
  //   let overlayHeaderText = '';

  //   const replayButton = {
  //     title: this.replayTitle,
  //     onPress: () => this.replay(),
  //   };
  //   const menuButtons = this.props.menuButtons || [];

  //   if (this.hasError) {
  //     overlayHeaderText = this.errorDisplayText;
  //     replayButton.title = 'Retry';
  //     buttons = [replayButton, ...menuButtons.filter(i => i.showOnError)];
  //   } else if (this.isPaused) {
  //     // Add Play to the top of the list
  //     buttons = [{title: 'Play', onPress: () => this.togglePause()}];

  //     if (this.progress > 0) {
  //       buttons.push(replayButton);
  //     }

  //     buttons = [...buttons, ...menuButtons];
  //   } else if (!this.loaded || this.isPlaying) {
  //     if (this.isPlaying && this.props.showActionButtonWhilePlaying) {
  //       const btnDetails = this.getActionButton();

  //       if (btnDetails) {
  //         return (
  //           <ScreenFooterButton
  //             hideGradient
  //             title={btnDetails.title}
  //             onPress={btnDetails.onPress}></ScreenFooterButton>
  //           // <View style={[styles.overlayFooter, this.props.overlayFooterStyle]} >
  //           //     <ActionButton primary title={btnDetails.title} onPress={btnDetails.onPress}></ActionButton>
  //           // </View>
  //         );
  //       }
  //     }

  //     return null;
  //   } else {
  //     buttons = [replayButton, ...menuButtons];
  //   }

  //   const actionButton = this.getActionButton();

  //   return (
  //     <View style={[styles.overlay]}>
  //       <View
  //         style={[
  //           styles.overlayContent,
  //           this.hasError
  //             ? this.props.overlayContentWithErrorStyle
  //             : this.props.overlayContentStyle,
  //         ]}>
  //         {this.hasError && (
  //           <IconTitleBlock
  //             textColor={AppColors.white}
  //             iconColor={AppColors.white}
  //             style={styles.errorHeader}
  //             iconName={this.hideErrorIcon ? undefined : this.errorIconName}
  //             text={this.errorDisplayText}
  //           />
  //         )}
  //         <View
  //           style={[
  //             styles.overlayButtons,
  //             this.hasError ? styles.overlayButtonsWithError : null,
  //           ]}>
  //           {buttons.map((b, i) => (
  //             <Button
  //               key={'mb' + i}
  //               rounded
  //               transparent
  //               style={styles.overlayButton}
  //               onPress={b.onPress.bind(this)}>
  //               <Text style={styles.overlayButtonText}>{b.title}</Text>
  //             </Button>
  //           ))}
  //         </View>
  //       </View>
  //       {
  //         !!actionButton && (
  //           <ScreenFooterButton
  //             hideGradient
  //             title={actionButton.title}
  //             onPress={actionButton.onPress}></ScreenFooterButton>
  //         )

  //         // <View style={[styles.overlayFooter, this.props.overlayFooterStyle]} >
  //         //     <ActionButton primary title={actionButton.title} onPress={actionButton.onPress}></ActionButton>
  //         // </View>
  //       }
  //     </View>
  //   );
  // }

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
      <TouchableOpacity
        // disabled={!pausable() || isPauseded()}
        style={[styles.container, props.style]}
        onPress={togglePause}>
        {!hidePlayer && (
          <Video
            source={{uri: mediaUrl}} // Can be a URL or a local file.
            ref={(ref: any) => (player = ref)}
            resizeMode={'cover'}
            rate={1.0} // 0 is paused, 1 is normal.
            // volume={volume} // 0 is muted, 1 is normal.
            muted={false} // Mutes the audio entirely.
            paused={isPauseded}
            ignoreSilentSwitch={'ignore'}
            playWhenInactive={playWhenInactive}
            onLoad={onLoad()}
            onEnd={onEnd()}
            onError={onError()}
            onProgress={onProgress()}
            style={[styles.video]}
          />
        )}
        {/* {this.renderPausedOverlay()}
        {this.renderPlayOverlay()}
        {this.renderActions()}
        {this.renderLoading()} */}
        {/* {!hidePlayer && !!volumeLocation && (
          <View style={this.getVolumeStyle()}>
            <Slider
              style={{flex: 1, height: 54}}
              value={this.state.volume}
              onValueChange={_.debounce(value => {
                this.volume = value;
              })}
              thumbTintColor={AppColors.blue}
              minimumTrackTintColor={AppColors.blue}
              maximumTrackTintColor={AppColors.white}
              trackStyle={{height: 2}}
              thumbStyle={{
                alignItems: 'center',
                justifyContent: 'center',
                width: 24,
                height: 24,
                borderRadius: 12,
              }}
              thumbImage={require('./Images/player/volume.png')}
            />
          </View>
        )} */}
      </TouchableOpacity>
    );
  };

  // if (this.hasError) {
  //   return this.renderActions();
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
