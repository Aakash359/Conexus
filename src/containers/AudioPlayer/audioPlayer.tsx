import React, {useState, useEffect, useRef} from 'react';
import {
  StyleSheet,
  View,
  Animated,
  Text,
  Alert,
  ActivityIndicator,
  Platform,
} from 'react-native';
import Slider from 'react-native-slider';
import {AppColors, AppFonts, AppSizes} from '../theme';
import {ConexusIconButton, Avatar} from '../components';
import {ConexusLightbox} from '../lightboxes';
import SystemSetting from 'react-native-system-setting';
// import { Actions } from 'react-native-router-flux'
// import Video from 'react-native-video'
import {logger} from 'react-native-logs';
const log = logger.createLogger();
interface AudioPlayerProps extends ViewProperties {
  audioUrl: string;
  avatarUrl?: string;
  avatarTitle?: string;
  avatarDescription?: string;
  style: any;
}

interface AudioPlayerState {
  volume: number;
  loading: boolean;
  duration: number;
  currentTime: number;
  seeking: boolean;
  error: boolean;
  seekerValue: number;
  paused: boolean;
}

const AudioPlayer = (props: AudioPlayerProps, state: AudioPlayerState) => {
  const player: Video = null;
  const [volume, setVolume] = useState(1);
  const [loading, setLoading] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [seeking, setSeeking] = useState(0);
  const [error, setError] = useState(false);
  const [seekerValue, setSeekerValue] = useState(0);
  const [paused, setPaused] = useState(false);

  const {audioUrl, avatarUrl, style, avatarTitle, avatarDescription} = props;

  //   const volume = (): number => {
  //     return state.volume;
  //   };
  const volume = (value: number) => {
    SystemSetting.setVolume(value);
    setVolume(value);
  };

  const seekerValue = (): number => {
    return state.seekerValue;
  };

  //   const seekerValues(value: number) {
  //     this.setState({seekerValue: value});
  //   }

  const volumeListener = SystemSetting.addVolumeListener(data => {
    setVolume(data.value);
  });

  const togglePlay = () => {
    setPaused(!paused);
  };

  useEffect(() => {
    SystemSetting.getVolume().then(volume => {
      setVolume(volume);
    });
    SystemSetting.removeVolumeListener(volumeListener);
  }, []);

  // Media Events

  const onMediaLoadStart = () => {
    setLoading(true);
  };

  const onMediaLoad = (data: {duration: number} = {duration: 0}) => {
    const duration = data.duration;
    setDuration(duration);
    setLoading(false);
  };

  const onMediaProgress = (data: {currentTime: number} = {currentTime: 0}) => {
    const currentTime = data.currentTime;
    setCurrentTime(currentTime);
  };

  const onMediaEnd = () => {
    player.seek(0);
    setPaused(true);
    // Actions.pop()
  };

  const onMediaError = err => {
    log.info('AudioPlaybackError', err);
    Alert.alert(
      'Playback Failure',
      'An error while playing the selected audio.',
    );
    // Actions.pop()
  };

  return (
    <ConexusLightbox hideHeader closeable height={300} horizontalPercent={0.8}>
      <View style={[style, styles.container]}>
        {!!avatarUrl && (
          <Avatar
            style={{width: 60, marginBottom: 8, marginTop: 20}}
            size={60}
            source={avatarUrl}
          ></Avatar>
        )}
        {!!avatarTitle && (
          <Text
            style={{
              ...AppFonts.bodyTextXtraLarge,
              color: AppColors.blue,
              marginTop: 8,
            }}
          >
            {avatarTitle}
          </Text>
        )}
        {!!avatarDescription && (
          <Text
            style={{
              ...AppFonts.bodyTextXtraSmall,
              color: AppColors.black,
              marginTop: 4,
              marginBottom: 10,
            }}
          >
            {avatarDescription}
          </Text>
        )}
        {loading && (
          <ActivityIndicator
            color={AppColors.blue}
            size="large"
            style={{marginTop: 24, height: 50}}
          />
        )}
        {!loading && (
          <ConexusIconButton
            iconName={paused ? 'cn-play' : 'cn-pause'}
            style={{margin: 12, marginTop: 14}}
            iconSize={34}
            color={AppColors.blue}
            onPress={() => togglePlay()}
          />
        )}
        {!!loading && Platform.OS === 'ios' && (
          <View
            style={{
              marginTop: 12,
              marginBottom: 12,
              height: 48,
              width: 160,
              zIndex: 1,
            }}
          ></View>
        )}

        {!loading && Platform.OS === 'ios' && (
          <Slider
            style={{marginTop: 12, marginBottom: 12, height: 48, width: 160}}
            value={volume}
            onValueChange={value => {
              volume = value;
            }}
            thumbTintColor={AppColors.blue}
            minimumTrackTintColor={AppColors.blue}
            maximumTrackTintColor={AppColors.baseGray}
            trackStyle={{height: 2}}
            thumbStyle={{
              alignItems: 'center',
              justifyContent: 'center',
              width: 20,
              height: 20,
            }}
            thumbImage={require('../components/Images/player/volume.png')}
          />
        )}

        {/* <Video
                        {...this.props}
                        ref={player => this.player = player}
                        ignoreSilentSwitch={"ignore"}
                        resizeMode={'cover'}
                        volume={this.state.volume}
                        paused={this.state.paused}
                        rate={1}
                        onLoadStart={this._onMediaLoadStart.bind(this)}
                        onProgress={this._onMediaProgress.bind(this)}
                        onError={this._onMediaError.bind(this)}
                        onLoad={this._onMediaLoad.bind(this)}
                        onEnd={this._onMediaEnd.bind(this)}
                        style={{ height: 0, width: 0, opacity: 0 }}
                        source={{ uri: this.props.audioUrl }}
                    /> */}
      </View>
    </ConexusLightbox>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,.8)',
    padding: 20,
  },

  playerCard: {},
});
