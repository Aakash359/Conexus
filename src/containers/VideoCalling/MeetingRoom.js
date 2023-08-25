import React, {useRef, useEffect, useState} from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Alert,
  Dimensions,
} from 'react-native';
import {
  TwilioVideoLocalView,
  TwilioVideoParticipantView,
  TwilioVideo,
} from 'react-native-twilio-video-webrtc';

// import {videoStore, VideoStore} from '../stores/videoStore';
// import {ScreenType} from '../common/constants';

const dimensions = Dimensions.get('window');

const MeetingRoom = (navigation) => {
  const twilioVideo = useRef(null);
  const {token, roomName} = navigation.route.params;
  const [status, setStatus] = useState('disconnected');
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [videoTracks, setVideoTracks] = useState(new Map());

  useEffect(() => {
    twilioVideo.current.connect({
      roomName: roomName,
      accessToken: token,
    });
    setStatus('connecting');
    return () => {
      _onEndButtonPress();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const _onEndButtonPress = () => {
    twilioVideo.current && twilioVideo.current.disconnect();
    setStatus('disconnected');
    setIsAudioEnabled(true);
    setStatus(new Map());
  };

  const _onMuteButtonPress = () => {
    twilioVideo.current
      .setLocalAudioEnabled(!isAudioEnabled)
      .then(isEnabled => setIsAudioEnabled(isEnabled));
  };

  const _onFlipButtonPress = () => {
    twilioVideo.current.flipCamera();
  };

  return (
    <View style={styles.callContainer}>
      {(status === 'connected' || status === 'connecting') && (
        <View style={styles.callWrapper}>
          {status === 'connected' && (
            <View style={styles.remoteGrid}>
              {Array.from(videoTracks, ([trackSid, trackIdentifier]) => (
                <TwilioVideoParticipantView
                  style={styles.remoteVideo}
                  key={trackSid}
                  trackIdentifier={trackIdentifier}
                />
              ))}
            </View>
          )}
        </View>
      )}
      <View style={styles.optionsContainer}>
        <TouchableOpacity style={styles.button} onPress={_onEndButtonPress}>
          <Text style={styles.buttonText}>End</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={_onMuteButtonPress}>
          <Text style={styles.buttonText}>
            {isAudioEnabled ? 'Mute' : 'Unmute'}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={_onFlipButtonPress}>
          <Text style={styles.buttonText}>Flip</Text>
        </TouchableOpacity>
      </View>
      <TwilioVideoLocalView
        enabled={status === 'connected'}
        style={styles.localVideo}
      />
      <TwilioVideo
        ref={twilioVideo}
        onRoomDidConnect={() => {
          setStatus('connected');
        }}
        onRoomDidDisconnect={() => {
          setStatus('disconnected');
          setTimeout(() => {
            navigation.navigation.popToTop();
          }, 500);
        }}
        onRoomDidFailToConnect={error => {
          Alert.alert('Error', error.error);
          setStatus('disconnected');
          setTimeout(() => {
            navigation.navigation.popToTop();
          }, 500);
        }}
        onParticipantAddedVideoTrack={({participant, track}) => {
          if (track.enabled) {
            setVideoTracks(
              new Map([
                ...videoTracks,
                [
                  track.trackSid,
                  {
                    participantSid: participant.sid,
                    videoTrackSid: track.trackSid,
                  },
                ],
              ]),
            );
          }
        }}
        onParticipantRemovedVideoTrack={({track}) => {
          const videoTrack = videoTracks;
          videoTrack.delete(track.trackSid);
          setVideoTracks(videoTrack);
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  button: {
    padding: 10,
    backgroundColor: 'blue',
    borderRadius: 5,
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
  },
  callContainer: {
    flex: 1,
  },
  callWrapper: {
    flex: 1,
    justifyContent: 'center',
  },
  remoteGrid: {
    flex: 1,
  },
  remoteVideo: {
    flex: 1,
  },
  localVideo: {
    position: 'absolute',
    right: 5,
    bottom: 50,
    width: dimensions.width / 4,
    height: dimensions.height / 4,
  },
  optionsContainer: {
    position: 'absolute',
    paddingHorizontal: 10,
    left: 0,
    right: 0,
    bottom: 5,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});

export default MeetingRoom;
