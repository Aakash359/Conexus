import React, {useState, useEffect} from 'react';
import {Text, StyleSheet, View, TouchableOpacity} from 'react-native';
import {Publisher, Subscriber} from 'react-native-opentok';
import Icon from 'react-native-vector-icons/Ionicons';
import {Field, Avatar, Circle} from '../../components';
import {windowDimensions} from '../../common';
import variables from '../../theme';

import Styles from '../../theme/styles';

// import {videoStore, VideoStore} from '../stores/videoStore';
// import {ScreenType} from '../common/constants';

interface ICallProps {
  sessionId?: string;
  token?: string;
}

const VideoCalling = (props: ICallProps) => {
  // const publisher: Publisher;

  const {sessionId, token} = props?.route?.params;

  console.log('Aakash====>', sessionId, token);

  // componentWillUnmount() {
  //   // this.publisher = null
  // }

  const endCall = () => {
    // publisher.switchCamera()
    this.props.videoStore.disconnect();
  };

  return (
    <View style={styles.screen}>
      <Subscriber
        style={styles.subscriber}
        sessionId={sessionId}
        onSubscribeStop={() => {
          console.log('stopped');
        }}
      />
      <Publisher
        style={styles.publisher}
        // ref={r => (publisher = r)}
        sessionId={sessionId}
        onPublishStart={() => {
          console.log('started');
        }}
      />
      <View style={styles.callButtons}>
        <Circle size={80} color={variables.red} style={styles.endCallBtn}>
          <TouchableOpacity
          // onPress={() => endCall()}
          >
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
};

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

export default VideoCalling;
