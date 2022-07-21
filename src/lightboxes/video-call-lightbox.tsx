import React from 'react';
import {
  StyleSheet,
  View,
  Animated,
  TouchableOpacity,
  Easing,
  InteractionManager,
  LayoutAnimation,
} from 'react-native';
import {H3, H1, Header, Icon} from 'native-base';
import {
  ActionButton,
  Avatar,
  KeepAwake,
  Circle,
  ScreenFooterButton,
} from '../components';
import {UserStore, VideoStore, VideoType, DeviceStore} from '../stores';
import {logger} from 'react-native-logs';
import {AppFonts, AppColors, AppSizes} from '../theme';
import {ConexusLightbox} from './base-lightbox';
// import { Publisher, Subscriber } from 'react-native-opentok'
import {ScreenType} from '../common';
import InCallManager from 'react-native-incall-manager';
import {onPatch} from 'mobx-state-tree';
import {IDisposer} from 'mobx-state-tree/dist/utils';
const log = logger.createLogger();
interface VideoCallLightboxProps {
  userStore?: UserStore;
  videoStore?: VideoStore;
  deviceStore?: DeviceStore;
  isOutgoing?: boolean;
  autoAnswer?: boolean;
}

interface VideoCallLightboxState {
  isIncoming?: boolean;
  answer?: boolean;
  status?: string;
  didBothPartiesConnect?: boolean;
  h?: number;
  w?: number;
  mt?: number;
  ml?: number;
}

export class VideoCallLightbox extends React.Component<
  VideoCallLightboxProps,
  VideoCallLightboxState
> {
  // _publisher: Publisher
  _frameValue: Animated.Value;
  _disposePatchListener: IDisposer;
  _timeout: number;

  constructor(props: VideoCallLightboxProps, state: VideoCallLightboxState) {
    super(props, state);
    this.state = {
      answer:
        props.videoStore.isAutoAnswer ||
        props.autoAnswer ||
        props.isOutgoing ||
        false,
      isIncoming: !props.videoStore.isOutgoing,
      status: '',
      didBothPartiesConnect: false,
      h: AppSizes.screen.height,
      w: AppSizes.screen.width,
      mt: 0,
      ml: 0,
    };
  }
  componentWillMount() {
    log.info('VideoStoreLightbox', 'componentWillMount');

    this._disposePatchListener = onPatch(
      this.props.videoStore,
      (patch, old) => {
        this.initCall();
      },
    );

    if (this.props.videoStore.isOutgoing) {
      this.props.videoStore.connectSession();
      InCallManager.start({media: 'video', ringback: '_DEFAULT_'});
    } else if (this.props.videoStore.isAutoAnswer) {
      this._answer();
    } else {
      InCallManager.startRingtone();
    }
    InCallManager.setKeepScreenOn(true);
    InCallManager.setForceSpeakerphoneOn(true);

    this._timeout = setTimeout(() => {
      this._disconnect();
    }, 60 * 1000);
  }

  componentWillReceiveProps(props) {
    log.info('props changed', props, this.props);
  }
  componentWillUnmount() {
    log.info('VideoStoreLightbox', 'componentWillUnmount');
    this._disposePatchListener();
    clearTimeout(this._timeout);

    this.props.videoStore.disconnect();

    InCallManager.setKeepScreenOn(false);
    InCallManager.setForceSpeakerphoneOn(null);
    InCallManager.stop();
  }

  _disconnect() {
    log.info('VideoStoreLightbox', '_disconnect');
    InCallManager.stopRingtone();
    this.props.videoStore
      .endCall(this.props.userStore.user.userId)
      .then(results => {
        log.info(results);
        if (this.props.deviceStore.isInBackground) {
          this.props.deviceStore.setInBackgroundMode(false);
        } else {
          // if (Actions.currentScene === ScreenType.CALL) {
          //     Actions.pop()
          // }
        }
      });
  }
  _answer() {
    log.info('VideoStoreLightbox', '_answer');
    this.props.videoStore.setInCall(true);
    this.forceUpdate();

    if (!this.props.isOutgoing) {
      this.props.videoStore.connectSession();
      InCallManager.stopRingtone();
      InCallManager.start({media: 'video'});
      InCallManager.setKeepScreenOn(true);
      InCallManager.setForceSpeakerphoneOn(true);
    }
    this.initCall();
  }

  initCall() {
    let {isPublishing, isSubscribed, inCall, isAutoAnswer} =
      this.props.videoStore;
    let {isIncoming, answer, status} = this.state;

    log.info(
      'VideoCallLightbox:initCall',
      !this.state.didBothPartiesConnect,
      isAutoAnswer,
      inCall,
      isPublishing,
      isSubscribed,
    );
    if (!this.state.answer && this.props.videoStore.isAutoAnswer) {
      this.setState({answer: true});
      this._answer();
    }
    if (!this.state.didBothPartiesConnect && isPublishing && isSubscribed) {
      this.setState({didBothPartiesConnect: true});
      clearTimeout(this._timeout);

      if (this.props.isOutgoing) {
        InCallManager.stopRingback();
      }

      log.info(
        'VideoCallLightbox:startAnimating',
        !this.state.didBothPartiesConnect,
        inCall,
        isPublishing,
        isSubscribed,
      );
      const cWidth = Math.floor(AppSizes.screen.width * 0.25);
      const cHeight = Math.floor(cWidth * 1.25);
      this.setState({h: cHeight, w: cWidth, mt: 20, ml: 10});
    }
  }
  renderCallWaiting() {
    let {photo, title, subTitle, name} = this.props.videoStore.caller;
    let {inCall} = this.props.videoStore;
    let {isIncoming, answer, status} = this.state;
    return (
      <Animated.View
        style={StyleSheet.flatten([
          styles.callWaitingScreen,
          !answer && {backgroundColor: 'black'},
        ])}>
        <View style={styles.callHeader}>
          <View style={styles.avatarContainer}>
            <Avatar source={photo} size={94} />
          </View>
          <H1 style={styles.h1}>{name}</H1>
          <H3 style={styles.h3}>{title}</H3>
          {!!status && <H3 style={styles.statusText}>{status}</H3>}
        </View>
        {isIncoming && !inCall && (
          <View style={styles.callButtons}>
            <TouchableOpacity onPress={this._disconnect.bind(this)}>
              <Circle size={70} color={AppColors.red}>
                <Icon
                  name="ios-call"
                  color="white"
                  style={StyleSheet.flatten(styles.ignoreIcon)}
                />
              </Circle>
            </TouchableOpacity>
            <TouchableOpacity onPress={this._answer.bind(this)}>
              <Circle size={70} color={AppColors.green}>
                <Icon
                  name="ios-call"
                  color="white"
                  style={StyleSheet.flatten(styles.answerIcon)}
                />
              </Circle>
            </TouchableOpacity>
          </View>
        )}
      </Animated.View>
    );
  }
  renderPublisher() {
    let {sessionId, setIsSubscribed, setIsPublishing} = this.props.videoStore;
    const {h, w, mt, ml, didBothPartiesConnect} = this.state;
    log.info('renderPublisher', this.state);
    return (
      <Animated.View
        style={[
          styles.publisherContainter,
          {
            height: h,
            width: w,
            marginTop: mt,
            marginLeft: ml,
            zIndex: didBothPartiesConnect ? 99 : 10,
          },
        ]}>
        {/* <Publisher style={styles.publisher} ref={(r) => this._publisher = r} sessionId={sessionId}
                    onPublishStart={() => {
                        setIsPublishing(true)
                    }}
                    onPublishEnd={() => {
                        setIsPublishing(false)
                    }}
                />  */}
      </Animated.View>
    );
  }
  render() {
    let {
      sessionId,
      isConnected,
      setIsSubscribed,
      setIsPublishing,
      inCall,
      isPublishing,
      isSubscribed,
      caller,
    } = this.props.videoStore;
    const {answer, isIncoming, didBothPartiesConnect} = this.state;
    log.info('render', inCall, isPublishing, isSubscribed);
    return !!caller ? (
      <ConexusLightbox
        style={styles.lightbox}
        verticalPercent={1}
        horizontalPercent={1}>
        {isConnected && (
          <View
            style={{
              flex: 1,
              ...StyleSheet.absoluteFillObject,
              backgroundColor: 'black',
            }}>
            {/* <Subscriber style={styles.subscriber}
                            sessionId={sessionId}

                            onSubscribeStart={() => {
                                setIsSubscribed(true)
                            }}
                            onSubscribeStop={() => {
                                setIsSubscribed(false)
                            }}
                        /> */}
            {didBothPartiesConnect && (
              <View style={styles.inCallButtons}>
                <ActionButton
                  primary
                  style={styles.endCallButton}
                  title="End Call"
                  onPress={this._disconnect.bind(this)}></ActionButton>
              </View>
            )}
          </View>
        )}
        {isConnected && this.renderPublisher()}
        {!didBothPartiesConnect && this.renderCallWaiting()}
        {answer && !didBothPartiesConnect && (
          <ScreenFooterButton
            title="Cancel"
            onPress={this._disconnect.bind(this)}
            danger
            hideGradient={true}
          />
        )}
      </ConexusLightbox>
    ) : null;
  }
}

const styles = StyleSheet.create({
  lightbox: {
    flex: 1,
    backgroundColor: 'transparent', // AppColors.green
  },
  callWaitingScreen: {
    position: 'absolute',
    ...StyleSheet.absoluteFillObject,
    flex: 1,
    backgroundColor: 'rgba(52, 52, 52, 0.8)',
    zIndex: 20,
  },
  content: {
    position: 'absolute',
    ...StyleSheet.absoluteFillObject,
    zIndex: 0,
  },
  lightboxFooter: {
    backgroundColor: '#F0FAFF',
    borderTopColor: AppColors.lightBlue,
    borderTopWidth: 1,
    paddingVertical: 20,
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  candidateName: {
    ...AppFonts.bodyTextLarge,
  },
  subscriber: {
    position: 'absolute',
    zIndex: 1,
    flex: 1,
    ...StyleSheet.absoluteFillObject,
    alignSelf: 'stretch',
    alignItems: 'stretch',
    backgroundColor: 'black',
  },
  inCallButtons: {
    position: 'absolute',
    zIndex: 8,
    flex: 1,
    ...StyleSheet.absoluteFillObject,
    alignSelf: 'stretch',
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
    backgroundColor: 'transparent',
    paddingBottom: 50,
  },
  endCallButton: {
    alignSelf: 'center',
    zIndex: 2,
  },
  publisherContainter: {
    position: 'absolute',
    zIndex: 10,
  },
  publisher: {
    flex: 1,
  } as any,
  background: {
    flex: 1,
    // resizeMode: 'contain',
    // backgroundColor: variables.green
  },
  avatarContainer: {
    alignSelf: 'center',
    marginTop: 100,
    width: 102,
    height: 102,
    borderRadius: 51,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 6,
    borderColor: 'rgba(255,255,255,.87)',
  },
  callHeader: {
    flex: 2,
    width: AppSizes.screen.width,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  h1: {
    marginTop: 20,
    color: AppColors.white,
    fontWeight: '500',
    fontSize: 24,
    padding: 0,
  },
  h3: {
    color: AppColors.white,
    fontWeight: '400',
    fontSize: 18,
    padding: 0,
  },
  statusText: {
    color: AppColors.white,
    fontWeight: '400',
    fontSize: 18,
    marginTop: 20,
  },
  ignoreIcon: {
    color: AppColors.white,
    fontSize: 40,
    transform: [{rotate: '133deg'}],
    marginLeft: -3,
  },
  answerIcon: {
    color: AppColors.white,
    fontSize: 40,
    marginTop: 3,
  },
  callButtons: {
    flex: 1,
    width: AppSizes.screen.width,
    justifyContent: 'space-around',
    alignItems: 'center',
    flexDirection: 'row',
    // backgroundColor: variables.red
  },
});
