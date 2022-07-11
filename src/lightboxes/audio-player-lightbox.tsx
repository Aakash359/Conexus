
import React, { Component } from 'react'
import { observer } from 'mobx-react'
import { ViewProperties, ViewStyle, StyleSheet, View, Animated, Text, Alert, ActivityIndicator, Platform } from 'react-native'
import Slider from "react-native-slider"
import { AppColors, AppFonts, AppSizes } from '../theme'
import { ConexusIconButton, Avatar } from '../components'
import { ConexusLightbox } from '../lightboxes'
import SystemSetting from 'react-native-system-setting'
import { Actions } from 'react-native-router-flux'
// import Video from 'react-native-video'
import { logger } from 'react-native-logs'
const log = logger.createLogger()
interface AudioPlayerProps extends ViewProperties {
    audioUrl: string,
    avatarUrl?: string,
    avatarTitle?: string,
    avatarDescription?: string
}

interface AudioPlayerState {
    volume: number,
    loading: boolean,
    duration: number,
    currentTime: number,
    seeking: boolean,
    error: boolean,
    seekerValue: number,
    paused: boolean
}

@observer
export class AudioPlayerLightbox extends Component<AudioPlayerProps, AudioPlayerState> {
    // player: Video = null

    get volume(): number {
        return this.state.volume
    }
    set volume(value: number) {
        SystemSetting.setVolume(value)
        this.setState({ volume: value })
    }

    get seekerValue(): number {
        return this.state.seekerValue
    }
    set seekerValue(value: number) {
        this.setState({ seekerValue: value })
    }

    volumeListener = SystemSetting.addVolumeListener((data) => {
        this.setState({ volume: data.value })
    })

    constructor(props, state) {
        super(props, state);

        this.state = {
            volume: 1,
            loading: true,
            duration: 0,
            currentTime: 0,
            seeking: false,
            error: false,
            seekerValue: 0,
            paused: false
        }
    }

    togglePlay() {
        this.setState({ paused: !this.state.paused })
    }

    componentWillMount() {

    }

    componentDidMount() {
        SystemSetting.getVolume()
            .then((volume) => {
                this.setState({ volume })
            })
    }

    componentWillUnmount() {
        SystemSetting.removeVolumeListener(this.volumeListener)
    }



    // Media Events

    _onMediaLoadStart() {
        this.setState({ loading: true });
    }

    _onMediaLoad(data: { duration: number } = { duration: 0 }) {
        const duration = data.duration;
        this.setState({ duration, loading: false });
    }

    _onMediaProgress(data: { currentTime: number } = { currentTime: 0 }) {
        const currentTime = data.currentTime;

        //this.seekerValue = currentTime / this.state.duration
        this.setState({ currentTime });
    }

    _onMediaEnd() {
        this.player.seek(0)
        this.setState({ paused: true })
        Actions.pop()
    }


    _onMediaError(err) {
        log.info('AudioPlaybackError', err)
        Alert.alert('Playback Failure', 'An error while playing the selected audio.')
        Actions.pop()
    }


    render() {
        const {audioUrl, avatarUrl, avatarTitle, avatarDescription} = this.props;
        const {loading} = this.state

        return (
            <ConexusLightbox hideHeader closeable height={300} horizontalPercent={0.8}>
                <View style={[this.props.style, styles.container]}>
                    {!!avatarUrl && <Avatar style={{ width: 60, marginBottom: 8, marginTop: 20 }} size={60} source={avatarUrl}></Avatar>}
                    {!!avatarTitle && <Text style={{...AppFonts.bodyTextXtraLarge, color: AppColors.blue, marginTop: 8}}>{avatarTitle}</Text>}
                    {!!avatarDescription && <Text style={{...AppFonts.bodyTextXtraSmall, color: AppColors.black, marginTop: 4, marginBottom: 10}}>{avatarDescription}</Text>}
                    {loading && <ActivityIndicator color={AppColors.blue} size="large" style={{ marginTop: 24, height: 50 }} />}
                    {!loading && <ConexusIconButton iconName={this.state.paused ? 'cn-play' : 'cn-pause'} style={{ margin: 12, marginTop: 14 }} iconSize={34} color={AppColors.blue} onPress={this.togglePlay.bind(this)} /> }
                    {!!loading && Platform.OS === 'ios' && <View style={{ marginTop: 12, marginBottom: 12, height: 48, width: 160, zIndex: 1 }}></View>}
                    
                    {!loading && Platform.OS === 'ios' && <Slider
                        style={{ marginTop: 12, marginBottom: 12, height: 48, width: 160 }}
                        value={this.state.volume}
                        onValueChange={value => {
                            this.volume = value
                        }}
                        thumbTintColor={AppColors.blue}
                        minimumTrackTintColor={AppColors.blue}
                        maximumTrackTintColor={AppColors.baseGray}
                        trackStyle={{ height: 2 }}
                        thumbStyle={{ alignItems: 'center', justifyContent: 'center', width: 20, height: 20 }}
                        thumbImage={require('../components/Images/player/volume.png')}
                    />}

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
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,.8)',
        padding: 20,
    },

    playerCard: {

    }
});