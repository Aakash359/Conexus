import React, {useState, useEffect} from 'react';
import {Text, StyleSheet, View, SafeAreaView} from 'react-native';
import styles from '../../components/Style';
import {Field, Avatar, Circle} from '../../components';
import {windowDimensions} from '../../common';
import variables from '../../theme';

// import {videoStore, VideoStore} from '../stores/videoStore';
// import {ScreenType} from '../common/constants';

interface ICallProps {
  sessionId?: string;
  token?: string;
}

const VideoCalling = (props: ICallProps) => {
  //    const _rtcEngine?: RtcEngine =RtcEngine
  //  const  _rtmEngine?: RtmEngine =RtmEngine
  const [appId, setAppId] = useState('6245dc6f8d804e11a18866e45b54f11c');
  const [sendEnabled, setSendEnabled] = useState(false);
  const [token, setToken] = useState(null);
  const [channelName, setChannelName] = useState('');
  const [inCall, setInCall] = useState(false);
  const [input, setInput] = useState('');
  const [inLobby, setInLobby] = useState(false);
  const [peerIds, setPeerIds] = useState([]);
  const [seniors, setSeniors] = useState([]);
  const [myUsername, setMyUsername] = useState('' + new Date().getTime());
  const [rooms, setRooms] = useState({});

  useEffect(() => {});

  return (
    <SafeAreaView style={styles.max}>
      <View style={styles.spacer}>
        <Text>hi</Text>
      </View>
    </SafeAreaView>
  );
};

// const styles = StyleSheet.create({
//   screen: {
//     ...windowDimensions,
//     backgroundColor: 'black',
//   },
//   subscriber: {
//     flex: 1,
//     ...windowDimensions,
//   },
//   callIcon: {
//     color: variables.white,
//     transform: [{rotate: '133deg'}],
//   },
//   publisher: {
//     position: 'absolute',
//     width: windowDimensions.width / 4,
//     height: windowDimensions.height / 8,
//     bottom: 15,
//     right: 15,
//     zIndex: 2,
//   },
//   callInfo: {
//     position: 'absolute',
//     width: windowDimensions.width,
//     height: windowDimensions.height / 8,
//     top: 0,
//     left: 0,
//     zIndex: 3,
//     backgroundColor: 'transparent',
//   },
//   disconnected: {
//     ...windowDimensions,
//     alignItems: 'center',
//   },
//   endCallBtn: {
//     borderColor: variables.white,
//     borderWidth: 5,
//     backgroundColor: 'transparent',
//     height: 80,
//     width: 80,
//   },
//   ignoreBtn: {
//     flex: 1,
//   },
//   callButtons: {
//     position: 'absolute',
//     bottom: 0,
//     left: 0,
//     height: windowDimensions.height / 3,
//     width: windowDimensions.width,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
// });

export default VideoCalling;
