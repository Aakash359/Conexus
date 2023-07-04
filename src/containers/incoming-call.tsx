import React, { useEffect } from 'react';
import { SafeAreaView, StatusBar, StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { useSelector } from 'react-redux'
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';

import CallService from '../services/connectycubeServices/call-service';
import { getUserById, showToast } from '../common/utils'


interface ICallProps {
  isIncoming?: boolean;
  title?: string;
  subTitle?: string;
  photo?: string;
  // videoStore: VideoStore;
}

export default function IncomingCall({ navigation }) {

  const callSession = useSelector(store => store.activeCall.session);
  const isCallAccepted = useSelector(store => store.activeCall.isAccepted);
  const initiatorName = getUserById(callSession?.initiatorID)?.full_name;
  const icomingCallText = `${initiatorName} is calling`;

  useEffect(() => {
    // hide screen if call rejected/canceled
    if (!callSession) {
      console.log("[IncomingCallScreen][useEffect] Call is ended");
      // 
      navigateBack()
      showToast("Call is ended")
    }
  }, [callSession]);

  useEffect(() => {
    if (isCallAccepted) {
      navigateBack();
      navigation.push('VideoScreen', {});
    }
  }, [isCallAccepted]);

  const acceptCall = async () => {
    await CallService.acceptCall();
  }

  const rejectCall = () => {
    CallService.rejectCall();

    navigateBack();
  }

  function navigateBack() {
    navigation.pop();
  }
  // ringer: Sound;
  // timeout: any;

  // componentWillMount() {
  //   // deviceStore.disableScreenTimeout(true)
  //   this.ringer = new Sound(
  //     `ringtone${Platform.OS === 'ios' ? '.caf' : '.mp3'}`,
  //     Sound.MAIN_BUNDLE,
  //     error => {
  //       if (error) {
  //         log.info('failed to load the sound', error);
  //         return;
  //       }
  //       this.ringer.play();
  //     },
  //   );
  // }


  // componentDidMount() {
  //   timer.setTimeout(
  //     this,
  //     'End Call After 30 sec',
  //     () => {
  //       this.close();
  //       this.ringer.stop();
  //     },
  //     30000,
  //   );
  // }
  // componentWillUnmount() {
  //   this.ringer.stop();
  // }
  // close = () => {
  //   timer.clearTimeout(this);
  //   this.ringer.stop();
  //   // Actions.pop()
  // };
  // answer = () => {
  //   this.close();
  // };
  // render() {
  //   let photo = this.props.photo;
  //   let title = this.props.title;
  //   let subTitle = this.props.subTitle;
  return (
    // <View style={styles.screen}>
    //   <View style={styles.callHeader}>
    //     <View style={styles.avatarContainer}>
    //       <Avatar source={photo} size={94} />
    //     </View>
    //     <H1 style={styles.h1}>{title}</H1>
    //     <H3 style={styles.h3}>{subTitle}</H3>
    //   </View>
    //   <View style={styles.incomingCallButtons}>
    //     <TouchableOpacity onPress={this.close} style={styles.ignoreBtn}>
    //       <Circle size={70} color={variables.red}>
    //         <Icon
    //           name="ios-call"
    //           color="white"
    //           style={StyleSheet.flatten(styles.ignoreIcon)}
    //         />
    //       </Circle>
    //     </TouchableOpacity>
    //     <TouchableOpacity onPress={this.answer} style={styles.answerBtn}>
    //       <Circle size={70} color={variables.green}>
    //         <Icon
    //           name="ios-call"
    //           color="white"
    //           style={StyleSheet.flatten(styles.answerIcon)}
    //         />
    //       </Circle>
    //     </TouchableOpacity>
    //   </View>
    // </View>
    <SafeAreaView style={{ flex: 1, backgroundColor: 'black' }}>
      <StatusBar backgroundColor="black" barStyle="light-content" />
      <View style={styles.container}>
        {initiatorName && <Text style={styles.incomingCallText}>{icomingCallText}</Text>}
        <View style={styles.containerButtons}>
          <TouchableOpacity
            style={[styles.buttonAcceptCall]}
            onPress={acceptCall}>
            <MaterialIcon name={'call'} size={32} color="white" />
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.buttonRejectCall]}
            onPress={rejectCall}>
            <MaterialIcon name={'call-end'} size={32} color="white" />
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}
// }
// const styles = StyleSheet.create({
//   screen: {
//     flex: 1,
//     backgroundColor: '#4C4C4C',
//   },
//   background: {
//     flex: 1,
//     // resizeMode: 'contain',
//     // backgroundColor: variables.green
//   },
//   avatarContainer: {
//     alignSelf: 'center',
//     marginTop: 100,
//     width: 102,
//     height: 102,
//     borderRadius: 51,
//     alignItems: 'center',
//     justifyContent: 'center',
//     borderWidth: 6,
//     borderColor: 'rgba(255,255,255,.87)',
//   },
//   callHeader: {
//     flex: 2,
//     width: windowDimensions.width,
//     flexDirection: 'column',
//     alignItems: 'center',
//     justifyContent: 'flex-start',
//   },
//   h1: {
//     marginTop: 20,
//     color: variables.white,
//     fontWeight: '500',
//     fontSize: 24,
//     padding: 0,
//   },
//   h3: {
//     color: variables.white,
//     fontWeight: '400',
//     fontSize: 18,
//     padding: 0,
//   },
//   closeBtn: {},
//   ignoreIcon: {
//     color: variables.white,
//     fontSize: 40,
//     transform: [{ rotate: '133deg' }],
//     marginLeft: -3,
//   },
//   answerBtn: {},
//   answerIcon: {
//     color: variables.white,
//     fontSize: 40,
//     marginTop: 3,
//   },
//   ignoreBtn: {},
//   incomingCallButtons: {
//     flex: 1,
//     width: windowDimensions.width,
//     justifyContent: 'space-around',
//     alignItems: 'center',
//     flexDirection: 'row',
//     // backgroundColor: variables.red
//   },
// });


const styles = StyleSheet.create({
  container: {
    flex: 1,
    ...StyleSheet.absoluteFill,
    justifyContent: 'space-around',
    alignItems: 'stretch',
  },
  containerButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  incomingCallText: {
    fontSize: 20,
    color: 'white',
    textAlign: 'center',
  },
  buttonAcceptCall: {
    height: 50,
    width: 50,
    borderRadius: 25,
    // marginHorizontal: 25,
    // marginTop: 50,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'green',
  },
  buttonRejectCall: {
    height: 50,
    width: 50,
    borderRadius: 25,
    // marginHorizontal: 25,
    // marginTop: 50,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'red',
  },
});


