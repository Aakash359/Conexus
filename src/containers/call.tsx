import React, {ReactElement} from 'react';
import {Icon, Button} from 'native-base';
import {Text, StyleSheet, View, TouchableOpacity} from 'react-native';
// import { Publisher, Subscriber } from 'react-native-opentok'

import {Field, Avatar, Circle} from '../components';
import {windowDimensions} from '../common';
import variables from '../theme';

import Styles from '../theme/styles';
// import { inject } from 'mobx-react'
// import { observer } from 'mobx-react'
import {videoStore, VideoStore} from '../stores/videoStore';
// import { Actions } from 'react-native-router-flux'
import {ScreenType} from '../common/constants';
import {logger} from 'react-native-logs';

interface ICallProps {
  sessionId?: string;
  token?: string;
  videoStore: VideoStore;
}
const log = logger.createLogger();
// @inject('videoStore')
// @observer
export class Call extends React.Component<ICallProps, {}> {
  // publisher: Publisher
  componentWillMount() {
    log.info('SCENE', this.props);
  }
  componentDidMount() {
    log.info('SCENE', 'Mounted Call');
  }
  constructor(props: ICallProps, context: any) {
    super(props, context);
  }

  componentWillUnmount() {
    // this.publisher = null
  }

  endCall = () => {
    // this.publisher.switchCamera()
    // Actions.pop()
    this.props.videoStore.disconnect();
  };
  render() {
    const {sessionId, token} = this.props.videoStore;
    log.info('SESSIONID', sessionId);
    return (
      <View style={styles.screen}>
        {/* <Subscriber style={styles.subscriber}
                    sessionId={sessionId}
                    onSubscribeStop={() => { log.info('stopped') }}
                /> */}
        {/* <Publisher style={styles.publisher}
                    ref={(r) => this.publisher = r}
                    sessionId={sessionId}
                    onPublishStart={() => { log.info('started') }}
                /> */}
        <View style={styles.callButtons}>
          <Circle size={80} color={variables.red} style={styles.endCallBtn}>
            <TouchableOpacity onPress={this.endCall}>
              <Circle size={60} color={variables.red}>
                <Icon
                  style={styles.callIcon}
                  name="call"
                  ios="ios-call"
                  android="md-call"
                />
              </Circle>
            </TouchableOpacity>
          </Circle>
        </View>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  screen: {
    ...windowDimensions,
    backgroundColor: 'black',
  },
  subscriber: {
    flex: 1,
    ...windowDimensions,
  },
  callIcon: {
    color: variables.white,
    transform: [{rotate: '133deg'}],
  },
  publisher: {
    position: 'absolute',
    width: windowDimensions.width / 4,
    height: windowDimensions.height / 8,
    bottom: 15,
    right: 15,
    zIndex: 2,
  },
  callInfo: {
    position: 'absolute',
    width: windowDimensions.width,
    height: windowDimensions.height / 8,
    top: 0,
    left: 0,
    zIndex: 3,
    backgroundColor: 'transparent',
  },
  disconnected: {
    ...windowDimensions,
    alignItems: 'center',
  },
  endCallBtn: {
    borderColor: variables.white,
    borderWidth: 5,
    backgroundColor: 'transparent',
    height: 80,
    width: 80,
  },
  ignoreBtn: {
    flex: 1,
  },
  callButtons: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    height: windowDimensions.height / 3,
    width: windowDimensions.width,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default Call;
