import React from 'react';

import {
  View,
  ViewProperties,
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
// import Video from 'react-native-video'
import {ActionButton, IconTitleBlock, ScreenFooterButton} from '../components';
import _ from 'lodash';
import InCallManager from 'react-native-incall-manager';
import SystemSetting from 'react-native-system-setting';
import Slider from 'react-native-slider';

const isAndroid = Platform.OS === 'android';

const log = logger.createLogger();

export interface ConexusVideoPlayerProps extends ViewProperties {
  mediaUrl: string;
  actionButton?: (() => ConexusVideoActionButton) | ConexusVideoActionButton;
  menuButtons?: ConexusVideoActionButton[];
  autoPlay?: boolean;
  pausable?: boolean;
  showActionsOnEnd?: boolean;

  activityIndicator?: () => any;

  onEnd?: () => any;
  onLoad?: () => any;
  onError?: (error) => any;

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

export class ConexusVideoPlayer extends React.Component<
  ConexusVideoPlayerProps,
  ConexusVideoPlayerState
> {
  get pausable(): boolean {
    return this.props.pausable;
  }

  get isPaused(): boolean {
    return this.state.isPaused;
  }

  get loaded(): boolean {
    return this.state.loaded;
  }

  get isPlaying(): boolean {
    return this.loaded && !this.isPaused && !this.hasError && !this.hasEnded;
  }

  get hasEnded(): boolean {
    return this.state.hasEnded;
  }

  get hasError(): boolean {
    return this.state.hasError;
  }

  get autoPlay(): boolean {
    return this.props.autoPlay;
  }

  get mediaUrl(): string {
    return this.props.mediaUrl;
  }

  get hidePlayer(): boolean {
    return !this.props.mediaUrl || this.hasError;
  }

  get playWhenInactive(): boolean {
    return this.props.playWhenInactive;
  }

  get replayTitle(): string {
    return this.props.replayTitle || 'Replay';
  }

  get hideErrors(): boolean {
    return this.props.hideErrors;
  }

  get hideErrorIcon(): boolean {
    return !!this.props.hideErrorIcon;
  }

  get errorIconName(): string {
    return this.props.errorIconName || 'cn-info';
  }

  get errorDisplayText(): string {
    return (
      this.props.errorDisplayText || `This video is currently unavailable.`
    );
  }

  get volume(): number {
    return this.state.volume;
  }
  set volume(value: number) {
    SystemSetting.setVolume(value, {
      playSound: false,
      showUI: false,
      type: 'music',
    });
    this.setState({volume: value});
  }

  get defaultState(): ConexusVideoPlayerState {
    return {
      loaded: false,
      isPaused: false,
      hasEnded: false,
      hasError: false,
    };
  }

  volumeListener = SystemSetting.addVolumeListener(
    _.debounce(data => {
      const volume = isAndroid ? data['music'] : data.value;
      this.setState({volume: data.value});
    }, 200),
  );

  constructor(
    props: ConexusVideoPlayerProps,
    context: ConexusVideoPlayerState,
  ) {
    super(props, context);
    this.state = {...this.defaultState};
  }

  // _player: Video

  componentDidMount() {
    SystemSetting.getVolume().then(volume => {
      this.setState({volume});
    });
  }

  componentWillMount() {
    // Force audio to play via the primary speaker
    if (Platform.OS === 'android') {
      InCallManager.start({media: 'audio'});
      InCallManager.setForceSpeakerphoneOn(true);
    }
  }

  componentWillUnmount() {
    InCallManager.setKeepScreenOn(false);
    InCallManager.setForceSpeakerphoneOn(null);
    InCallManager.stop();

    SystemSetting.removeVolumeListener(this.volumeListener);
  }

  getVolumeStyle(): ViewStyle {
    const location = this.props.volumeLocation;

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
  }

  replaying: boolean = false;

  replay() {
    if (this.replaying) {
      return;
    }

    try {
      this.replaying = true;
      const loaded = this.state.loaded; // Preserve this value

      this.setState({isPaused: true}, () => {
        if (this._player) {
          log.info('Replay');
          this._player.seek(0);

          this.setState({...this.defaultState, loaded}, () => {
            log.info('replayed', this.state);
          });
        }
      });
    } finally {
      this.replaying = false;
    }
  }

  getActionButton(): ConexusVideoActionButton {
    const {actionButton} = this.props;
    if (actionButton && _.isFunction(actionButton)) {
      return actionButton();
    } else if (actionButton && !!actionButton['title']) {
      return actionButton as ConexusVideoActionButton;
    }

    return undefined;
  }

  onEnd() {
    log.info('onEnd');

    setTimeout(() => {
      this.setState({hasEnded: true});
      log.info('onEnd', 'SetState', this.state);

      if (this.props.onEnd) {
        log.info('OnEnd', 'Calling this.props.onEnd');
        this.props.onEnd();
      }
    }, 0);
  }
  onError(error) {
    log.info('OnError', error);

    setTimeout(() => {
      this.setState({hasError: true});

      if (this.props.onError) {
        this.props.onError(error);
      }
    }, 0);
  }

  onLoad(event) {
    log.info('onLoad', event);

    setTimeout(() => {
      this.setState({loaded: true, isPaused: !this.autoPlay});
      this._player.seek(0);
      log.info('onLoad', 'setState', this.state);
    }, 0);
  }

  progress: number = 0;
  onProgress(event) {
    this.progress = event.currentTime;
  }

  togglePause() {
    log.info('togglePause', this.state);

    if (!this.pausable || !this._player) {
      return;
    }

    this.setState({isPaused: !this.isPaused});
    log.info('togglePause', 'setState', this.state);
  }

  renderLoading() {
    if (this.loaded) {
      return null;
    }

    let indicator = (
      <ActivityIndicator
        color={this.props.loadingColor || AppColors.blue}
        style={{flex: 1}}
      />
    );

    if (this.props.activityIndicator && this.props.activityIndicator.call) {
      indicator = this.props.activityIndicator();
    }

    return <View style={[styles.container]}>{indicator}</View>;
  }

  renderActions() {
    if (this.replaying) {
      return null;
    }

    if (!this.props.showActionsOnEnd && this.state.hasEnded) {
      return null;
    }

    let buttons = [];
    let overlayHeaderText = '';

    const replayButton = {
      title: this.replayTitle,
      onPress: () => this.replay(),
    };
    const menuButtons = this.props.menuButtons || [];

    if (this.hasError) {
      overlayHeaderText = this.errorDisplayText;
      replayButton.title = 'Retry';
      buttons = [replayButton, ...menuButtons.filter(i => i.showOnError)];
    } else if (this.isPaused) {
      // Add Play to the top of the list
      buttons = [{title: 'Play', onPress: () => this.togglePause()}];

      if (this.progress > 0) {
        buttons.push(replayButton);
      }

      buttons = [...buttons, ...menuButtons];
    } else if (!this.loaded || this.isPlaying) {
      if (this.isPlaying && this.props.showActionButtonWhilePlaying) {
        const btnDetails = this.getActionButton();

        if (btnDetails) {
          return (
            <ScreenFooterButton
              hideGradient
              title={btnDetails.title}
              onPress={btnDetails.onPress}></ScreenFooterButton>
            // <View style={[styles.overlayFooter, this.props.overlayFooterStyle]} >
            //     <ActionButton primary title={btnDetails.title} onPress={btnDetails.onPress}></ActionButton>
            // </View>
          );
        }
      }

      return null;
    } else {
      buttons = [replayButton, ...menuButtons];
    }

    const actionButton = this.getActionButton();

    return (
      <View style={[styles.overlay]}>
        <View
          style={[
            styles.overlayContent,
            this.hasError
              ? this.props.overlayContentWithErrorStyle
              : this.props.overlayContentStyle,
          ]}>
          {this.hasError && (
            <IconTitleBlock
              textColor={AppColors.white}
              iconColor={AppColors.white}
              style={styles.errorHeader}
              iconName={this.hideErrorIcon ? undefined : this.errorIconName}
              text={this.errorDisplayText}
            />
          )}
          <View
            style={[
              styles.overlayButtons,
              this.hasError ? styles.overlayButtonsWithError : null,
            ]}>
            {buttons.map((b, i) => (
              <Button
                key={'mb' + i}
                rounded
                transparent
                style={styles.overlayButton}
                onPress={b.onPress.bind(this)}>
                <Text style={styles.overlayButtonText}>{b.title}</Text>
              </Button>
            ))}
          </View>
        </View>
        {
          !!actionButton && (
            <ScreenFooterButton
              hideGradient
              title={actionButton.title}
              onPress={actionButton.onPress}></ScreenFooterButton>
          )

          // <View style={[styles.overlayFooter, this.props.overlayFooterStyle]} >
          //     <ActionButton primary title={actionButton.title} onPress={actionButton.onPress}></ActionButton>
          // </View>
        }
      </View>
    );
  }

  renderPausedOverlay(): JSX.Element | undefined {
    if (!this.state.isPaused) {
      return null;
    }
    if (
      this.props.renderStoppedOverlay &&
      this.props.renderStoppedOverlay.call
    ) {
      return this.props.renderStoppedOverlay();
    }

    return null;
  }

  renderPlayOverlay(): JSX.Element | undefined {
    if (this.state.isPaused) {
      return null;
    }
    if (
      this.isPlaying &&
      this.props.renderPlayOverlay &&
      this.props.renderPlayOverlay.call
    ) {
      return this.props.renderPlayOverlay();
    }

    return null;
  }

  renderPlayer() {
    return (
      <TouchableOpacity
        disabled={!this.pausable || this.isPaused}
        style={[styles.container, this.props.style]}
        onPress={this.togglePause.bind(this)}>
        {/* {
                !this.hidePlayer &&
                    <Video source={{ uri: this.mediaUrl }}   // Can be a URL or a local file.
                        ref={ref => (this._player = ref)}
                        resizeMode={'cover'}
                        rate={1.0}                           // 0 is paused, 1 is normal.
                        volume={this.volume}                 // 0 is muted, 1 is normal.
                        muted={false}                        // Mutes the audio entirely.
                        paused={this.isPaused}
                        ignoreSilentSwitch={"ignore"}
                        playWhenInactive={this.playWhenInactive}
                        onLoad={this.onLoad.bind(this)}
                        onEnd={this.onEnd.bind(this)}
                        onError={this.onError.bind(this)}
                        onProgress={this.onProgress.bind(this)}
                        style={[styles.video]}
                    />
                } */}
        {this.renderPausedOverlay()}
        {this.renderPlayOverlay()}
        {this.renderActions()}
        {this.renderLoading()}
        {!this.hidePlayer && !!this.props.volumeLocation && (
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
        )}
      </TouchableOpacity>
    );
  }

  render() {
    if (this.hasError) {
      return this.renderActions();
    }

    return this.renderPlayer();
  }
}

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
