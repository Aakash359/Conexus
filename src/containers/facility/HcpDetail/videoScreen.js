import React, { useEffect } from 'react';
import { SafeAreaView, StatusBar } from 'react-native';
import { useSelector } from 'react-redux'
import ConnectyCube from 'react-native-connectycube';
import VideoGrid from '../../../components/generics/videoGrid';
import CallService from '../../../services/connectycubeServices/call-service';
import VideoToolBar from '../../../components/generics/videoToolbar';
import Loader from '../../../components/generics/loader';


export default function VideoScreen ({ navigation }) {
  const streams = useSelector(store => store.activeCall.streams);
  const callSession = useSelector(store => store.activeCall.session);
  const isEarlyAccepted = useSelector(store => store.activeCall.isEarlyAccepted);

  const isVideoCall = callSession?.callType === ConnectyCube.videochat.CallType.VIDEO;

  useEffect(() => {
    console.log("[VideoScreen] useEffect streams.length", streams.length)
    // stop call if all opponents are left
    if (streams.length <= 1) {
      stopCall()
    }
  }, [streams]);

  function navigateBack() {
    navigation.pop();

    Toast("Call is ended")
  }

  function stopCall(){
    CallService.stopCall();

    navigateBack()
  }

  function muteCall(isAudioMuted) {
    CallService.muteMicrophone(isAudioMuted);
  }

  function switchCamera() {
    CallService.switchCamera();
  };

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: 'black'}}>
      <StatusBar backgroundColor="black" barStyle="light-content" />
      <VideoGrid streams={streams} />
      {isEarlyAccepted && <Loader text="connecting.." />}
      <VideoToolBar
        displaySwitchCam={isVideoCall}
        onSwitchCamera={switchCamera}
        onStopCall={stopCall}
        onMute={muteCall}
        canSwitchCamera={CallService.mediaDevices.length > 1}
      />
    </SafeAreaView>
  );
}