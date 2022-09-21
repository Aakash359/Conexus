import React, {useState, useEffect, useRef, useMemo} from 'react';
import {
  StyleSheet,
  View,
  Text,
  FlexAlignType,
  ActivityIndicator,
  ViewStyle,
  Alert,
  TouchableOpacity,
} from 'react-native';
import {ActionButton} from '../components';
import Icon from 'react-native-vector-icons/Ionicons';
import {Camera, sortDevices} from 'react-native-vision-camera';
import {AppFonts, AppColors, AppSizes} from '../theme';
import {VideoStore} from '../stores';
import {windowDimensions} from '../common';
import NavigationService from '../navigation/NavigationService';

interface ConexusVideoRecorderProps {
  onRecordComplete?: (archiveId: string, videoUrl: string) => any;
  onRecordError?: (error: any) => any;
  onRecordStart?: () => any;
  style: any;
  text: any;
  recordedData: any;
  onRecordStep?: () => any;
  onErrorStep?: () => any;
  videoStore?: VideoStore;
  onComplete: (success: any, data: any) => any;
}

interface Step {
  stepState?: {[key: string]: any};
  initStep: () => Promise<any>;
  startRender: () => any;
  onComplete: () => any;
}

interface VideoRecorderState {
  currentStep: Step;
}

export const ConexusVideoRecorder = (
  props: ConexusVideoRecorderProps,
  state: VideoRecorderState,
) => {
  const camera = React.useRef(null);
  const [devices, setDevices] = useState([]);
  const [recordingState, setRecordingState] = useState([
    'Default',
    'Starting',
    'Playing',
    'Pausing',
    'Stop',
  ]);

  const getPermisson = async () => {
    const newCameraPermission = await Camera.requestCameraPermission();
    const newMicrophonePermission = await Camera.requestMicrophonePermission();
  };

  const device = useMemo(() => devices.find(d => d.position === 'front'), [
    devices,
  ]);
  const [permissons, setPermissons] = useState(false);
  const {text, recordedData} = props;
  useEffect(() => {
    if (recordingState == 'Playing') {
      setRecordingState('Playing');
    } else {
      setRecordingState('default');
    }
    loadDevices();
    getPermisson();
  }, [recordingState]);

  const loadDevices = async () => {
    try {
      const availableCameraDevices = await Camera.getAvailableCameraDevices();
      const sortedDevices = availableCameraDevices.sort(sortDevices);
      setDevices(sortedDevices);
    } catch (e) {
      console.error('Failed to get available devices!', e);
    }
  };

  const getPermissons = async () => {
    const cameraPermission = await Camera.getCameraPermissionStatus();
    const microphonePermission = await Camera.getMicrophonePermissionStatus();
    if (
      microphonePermission === 'authorized' &&
      cameraPermission === 'authorized'
    ) {
      setPermissons(true);
    }
  };

  const startRecodingHandler = () => {
    camera.current.startRecording(
      {
        flash: 'off',
        onRecordingFinished: (video: any) => recordedData(video),

        onRecordingError: (error: any) => console.error(error, 'video error'),
      },
      setRecordingState('Stop'),
    );
    setRecordingState('Playing');
  };

  const stopRecodingHandler = async () => {
    await camera.current.stopRecording();
    setRecordingState('Stop');
  };

  const onFinished = (archiveId: string, videoUrl: string) => {
    const {videoMessage} = this.props;

    if (videoMessage && !this.videoMessageSendComplete) {
      return this.sendVideoMessage(archiveId, videoUrl);
    }

    if (this.props.onFinished && this.props.onFinished.call) {
      this.props.onFinished(archiveId, videoUrl);
    }

    StatusBar.setHidden(false);
    return Actions.pop();
  };

  if (device == null) {
    return null;
  }

  return (
    <>
      <View style={recorderStyle.headerViews}>
        <Camera
          ref={camera}
          style={StyleSheet.absoluteFill}
          device={device}
          isActive={true}
          video={true}
          audio={false}
          setIsPressingButton={true}
        />
        <Icon
          style={recorderStyle.closeButton}
          name="ios-close-circle-sharp"
          size={27}
          color={AppColors.blue}
          onPress={() => NavigationService.goBack()}
        />

        <Text style={recorderStyle.text}>{text}</Text>
        {recordingState == 'default' && (
          <View style={recorderStyle.footer}>
            <ActionButton
              title="START RECORDING"
              customStyle={
                recordingState == 'default'
                  ? recorderStyle.recordingBtn
                  : [recorderStyle.recordingBtn, recorderStyle.recordingBtnRed]
              }
              customTitleStyle={{color: AppColors.white, fontSize: 15}}
              onPress={() => startRecodingHandler()}
            />
          </View>
        )}
        {recordingState == 'Playing' && (
          <View style={recorderStyle.footer}>
            <ActionButton
              title="STOP RECORDING"
              customStyle={
                recordingState == 'Playing'
                  ? recorderStyle.recordingBtnRed
                  : recorderStyle.recordingBtn
              }
              customTitleStyle={{color: AppColors.white, fontSize: 15}}
              onPress={() => stopRecodingHandler()}
            />
          </View>
        )}

        {recordingState == 'Stop' && (
          <View style={recorderStyle.footer}>
            <ActionButton
              title="SAVE"
              customStyle={
                recordingState == 'Playing'
                  ? recorderStyle.recordingBtnRed
                  : recorderStyle.recordingBtn
              }
              customTitleStyle={{color: AppColors.white, fontSize: 15}}
              onPress={() => saveRecodingHandler()}
            />
          </View>
        )}
      </View>
    </>
  );
};

const absolutePosition = {
  position: 'absolute' as 'absolute' | 'relative',
  left: 0,
  top: 0,
  right: 0,
  bottom: 0,
  height: AppSizes.screen.height,
  width: AppSizes.screen.width,
  alignItems: 'center' as FlexAlignType,
};

const recorderStyle = StyleSheet.create({
  publisher: {
    ...absolutePosition,
  },
  headerViews: {
    flex: 1,
  },
  closeButton: {
    position: 'absolute',
    right: 12,
    top: 12,
  },
  text: {
    marginTop: 80,
    justifyContent: 'center',
    alignSelf: 'center',
    color: AppColors.white,
    fontWeight: 'bold',
  },
  flipCamera: {
    marginTop: 0,
    right: 10,
    alignSelf: 'flex-end',
  },

  footer: {
    right: 10,
    left: 10,
    position: 'absolute',
    bottom: 20,
  },
  recordingBtn: {
    alignSelf: 'center',
    width: windowDimensions.width * 0.5,
  },
  recordingBtnRed: {
    alignSelf: 'center',
    backgroundColor: AppColors.red,
    width: windowDimensions.width * 0.5,
  },
});
