import React, {useState} from 'react';
import {
  Text,
  StyleSheet,
  TouchableOpacity,
  View,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Modal,
  Image,
  Keyboard,
  PermissionsAndroid,
  Platform,
} from 'react-native';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import Icon from 'react-native-vector-icons/Ionicons';
import variables, {AppColors} from '../../theme';
import {showApiErrorAlert} from '../../common';
import {windowDimensions} from '../../common';
import {ActionButton} from '../../components/action-button';
import {Field} from '../../components/field';
import NavigationService from '../../navigation/NavigationService';
import {updateProfile, uploadPhoto} from '../../services/ApiServices';
import {Strings} from '../../common/Strings';

interface EditProfileProps {
  firstName: string;
  onTouchOutside: Function;
  lastName: string;
  title: string;
  showTitle: boolean;
  phoneNumber: string;
  route: any;
  params: any;
}
const {
  CAMERA_PERMISSION,
  APP_NEED_CAMERA,
  PHOTO_SAVING_ERROR,
  STORAGE_PERMISSION,
  WRITE_PERMISSION,
  VALIDATE_FIRST_NAME,
  VALIDATE_LAST_NAME,
  VALIDATE_TITLE,
  VALIDATE_PHONE_NO,
  PROFILE_UPDATED,
  CHOOSE_PROFILE_PHOTO,
  FIRST_NAME,
  LAST_NAME,
  PHONE_NUMBER,
  SAVE,
  TITLE,
} = Strings;

const SafeAreaView = require('react-native').SafeAreaView;

const EditProfile = (props: EditProfileProps) => {
  const userInfo = props.route.params;
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState(userInfo?.photoUrl || '');
  const [errors, setErrors] = useState('');
  const [cameraModal, setCameraModal] = useState(false);
  const [inputs, setInputs] = useState({
    firstName: userInfo?.firstName,
    lastName: userInfo?.lastName || '',
    title: userInfo.title || '',
    phoneNumber: userInfo?.phoneNumber || '',
  });

  const requestCameraPermission = async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.CAMERA,
          {
            title: CAMERA_PERMISSION,
            message: APP_NEED_CAMERA,
          },
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } catch (err) {
        console.warn(err);
        return false;
      }
    } else return true;
  };

  const requestExternalWritePermission = async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
          {
            title: STORAGE_PERMISSION,
            message: WRITE_PERMISSION,
          },
        );
        // If WRITE_EXTERNAL_STORAGE Permission is granted
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } catch (err) {
        console.warn(err);
        alert('Write permission error', err);
      }
      return false;
    } else return true;
  };

  const openGallery = async (type: string) => {
    let options = {
      mediaType: type,
      maxWidth: 300,
      maxHeight: 550,
      quality: 1,
      includeBase64: true,
    };
    setLoading(true);
    let response = await launchImageLibrary(options);
    let ext = response?.assets?.[0]?.type.split('/')[1] || 'jpg';
    const payload = {
      base64Image: response?.assets?.[0]?.base64,
      fileExt: ext,
    };
    console.log('image payload', payload);
    if (response.didCancel) {
      Alert.alert('User cancelled camera picker');
      setLoading(false);
      setCameraModal(false);
      return;
    } else if (response.errorCode == 'camera_unavailable') {
      Alert.alert('Camera not available on device');
      setCameraModal(false);
      setLoading(false);
      return;
    } else if (response.errorCode == 'permission') {
      Alert.alert('Permission not satisfied');
      setCameraModal(false);
      setLoading(false);
      return;
    } else if (response.errorCode == 'others') {
      Alert.alert(response.errorMessage);
      setCameraModal(false);
      setLoading(false);
      return;
    }
    try {
      const data = await uploadPhoto(payload);
      console.log('image payload', data);
      setImageUrl(response?.assets?.[0]?.uri);
      setCameraModal(false);
      setLoading(false);
    } catch (error) {
      console.log('Error', error);
      setCameraModal(false);
      setLoading(false);
      showApiErrorAlert({
        defaultTitle: error?.response?.data?.statusText,
        defaultDescription: PHOTO_SAVING_ERROR,
        error: error,
        loggerTitle: EDIT_PROFILE_COMPONENT_NAME,
        loggerName: 'selectImage',
      });
    }
  };

  const openCamera = async (type: any) => {
    let options = {
      mediaType: type,
      maxWidth: 300,
      maxHeight: 550,
      quality: 1,
      includeBase64: true,
    };
    let isCameraPermitted = await requestCameraPermission();
    let isStoragePermitted = await requestExternalWritePermission();
    if (isCameraPermitted && isStoragePermitted) {
      let response = await launchCamera(options);

      let ext = response?.assets?.[0]?.type.split('/')[1] || 'jpg';
      const payload = {
        base64Image: response?.assets?.[0]?.base64,
        fileExt: ext,
      };
      console.log('image payload', payload);
      if (response.didCancel) {
        Alert.alert('User cancelled camera picker');
        setLoading(false);
        setCameraModal(false);
        return;
      } else if (response.errorCode == 'camera_unavailable') {
        Alert.alert('Camera not available on device');
        setCameraModal(false);
        setLoading(false);
        return;
      } else if (response.errorCode == 'permission') {
        Alert.alert('Permission not satisfied');
        setCameraModal(false);
        setLoading(false);
        return;
      } else if (response.errorCode == 'others') {
        Alert.alert(response.errorMessage);
        setCameraModal(false);
        setLoading(false);
        return;
      }
      try {
        const data = await uploadPhoto(payload);
        console.log('image payload', data);
        setImageUrl(response?.assets?.[0]?.uri);
        setCameraModal(false);
        setLoading(false);
      } catch (error) {
        console.log('Error', error);
        setCameraModal(false);
        setLoading(false);
        showApiErrorAlert({
          defaultTitle: error?.response?.data?.statusText,
          defaultDescription: PHOTO_SAVING_ERROR,
          error: error,
          loggerTitle: EDIT_PROFILE_COMPONENT_NAME,
          loggerName: 'selectImage',
        });
      }
    }
  };

  const handleOnchange = (text: any, input: any) => {
    setInputs((prevState: any) => ({...prevState, [input]: text}));
  };
  const handleError = (error: any, input: any) => {
    setErrors((prevState: any) => ({...prevState, [input]: error}));
  };

  const validate = () => {
    Keyboard.dismiss();
    let isValid = true;
    if (!inputs.firstName) {
      handleError(VALIDATE_FIRST_NAME, 'firstName');
      isValid = false;
    }
    if (!inputs.lastName) {
      handleError(VALIDATE_LAST_NAME, 'lastName');
      isValid = false;
    }
    if (!inputs.title) {
      handleError(VALIDATE_TITLE, 'title');
      isValid = false;
    }
    if (!inputs.phoneNumber) {
      handleError(VALIDATE_PHONE_NO, 'phoneNumber');
      isValid = false;
    }
    if (isValid) {
      saveProfile();
    }
  };

  const saveProfile = async () => {
    const payload = {
      userId: userInfo?.userId,
      imageUrl: inputs.imageUrl,
      firstName: inputs.firstName,
      lastName: inputs.lastName,
      title: inputs.title,
      phoneNumber: inputs.phoneNumber,
    };
    try {
      setLoading(true);
      const {data} = await updateProfile(payload);
      NavigationService.goBack();
      Alert.alert(PROFILE_UPDATED);
    } catch (error) {
      setLoading(false);
      console.log('Error', error);
      Alert.alert(error?.response?.statusText, error?.response?.data?.Message);
    }
  };

  return (
    <SafeAreaView style={style.container}>
      <ScrollView keyboardShouldPersistTaps="handled">
        <KeyboardAvoidingView behavior="position" style={style.rootContainer}>
          <View style={style.detailsContainer}>
            <View style={style.avatarContainer}>
              {imageUrl ? (
                <View style={style.profileCircle}>
                  <Image
                    style={style.image}
                    source={{
                      uri: imageUrl,
                    }}
                  />
                </View>
              ) : (
                <View style={style.profileCircle}>
                  <Image
                    style={style.image}
                    source={require('../../components/Images/bg.png')}
                  />
                </View>
              )}

              <TouchableOpacity
                onPress={() => setCameraModal(true)}
                activeOpacity={1}
              >
                <Text style={style.changePhotoButton}>
                  {CHOOSE_PROFILE_PHOTO}
                </Text>
              </TouchableOpacity>
            </View>

            <View style={style.top} />
            <Field
              placeholder={FIRST_NAME}
              autoCapitalize="words"
              returnKeyType="done"
              value={inputs.firstName}
              onTextChange={(text: any) => handleOnchange(text, 'firstName')}
              onFocus={() => handleError(null, 'firstName')}
              error={errors.firstName}
              customStyle={{
                backgroundColor: AppColors.white,
                marginHorizontal: -10,
                marginRight: 1,
                borderRadius: 5,
              }}
            />
            <View style={style.top} />
            <Field
              placeholder={LAST_NAME}
              autoCapitalize="words"
              returnKeyType="done"
              value={inputs.lastName}
              onTextChange={(text: any) => handleOnchange(text, 'lastName')}
              onFocus={() => handleError(null, 'lastName')}
              error={errors.lastName}
              customStyle={{
                backgroundColor: AppColors.white,
                marginHorizontal: -10,
                marginRight: 1,
                borderRadius: 5,
              }}
            />
            <View style={style.top} />
            <Field
              placeholder={TITLE}
              autoCapitalize="words"
              returnKeyType="done"
              value={inputs.title}
              onTextChange={(text: any) => handleOnchange(text, 'title')}
              onFocus={() => handleError(null, 'title')}
              error={errors.title}
              customStyle={{
                backgroundColor: AppColors.white,
                marginHorizontal: -10,
                marginRight: 1,
                borderRadius: 5,
              }}
            />
            <View style={style.top} />
            <Field
              placeholder={PHONE_NUMBER}
              autoCapitalize="none"
              keyboardType={'number-pad'}
              returnKeyType="done"
              maxLength={15}
              value={inputs.phoneNumber}
              onTextChange={(text: any) => handleOnchange(text, 'phoneNumber')}
              onFocus={() => handleError(null, 'phoneNumber')}
              error={errors.phoneNumber}
              customStyle={{
                backgroundColor: AppColors.white,
                marginHorizontal: -10,
                marginRight: 1,
                borderRadius: 5,
              }}
            />
            <View style={style.footer}>
              <ActionButton
                loading={loading}
                title={SAVE}
                customStyle={style.btnEnable}
                style={{marginTop: 40}}
                onPress={validate}
              />
            </View>
          </View>
        </KeyboardAvoidingView>
      </ScrollView>
      {cameraModal && (
        <Modal
          visible={cameraModal}
          onTouchOutside={() => {
            setCameraModal(false);
          }}
          animationType="slide"
          transparent={true}
          onRequestClose={() => {
            setCameraModal(false);
          }}
        >
          <TouchableOpacity
            style={style.modalContainer}
            activeOpacity={1}
            onPress={() => {
              setCameraModal(false);
            }}
          >
            <View style={style.alertContainer}>
              <Text style={style.buttonHeader}>Select profile photo</Text>
              <TouchableOpacity
                style={style.buttonContainer}
                onPress={() => openCamera('photo')}
                activeOpacity={0.8}
              >
                <Icon
                  name="md-camera-outline"
                  size={30}
                  color={AppColors.blue}
                />
                <Text style={style.buttonText}>Take picture</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={style.buttonContainer}
                onPress={() => openGallery('photo')}
                activeOpacity={0.8}
              >
                <Icon name="image-outline" size={30} color={AppColors.blue} />
                <Text style={style.buttonText}>Select from Gallery</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        </Modal>
      )}
    </SafeAreaView>
  );
};

const style = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    backgroundColor: AppColors.baseGray,
  },
  buttonHeader: {
    fontSize: 20,
    marginLeft: 20,
    fontWeight: 'bold',
  },
  modalContainer: {
    backgroundColor: 'rgba(0,0,0,0.4)',
    height: '100%',
    width: '100%',
    justifyContent: 'flex-end',
  },
  profileCircle: {
    height: 100,
    flexDirection: 'row',
    alignSelf: 'center',
    width: 100,
    borderColor: AppColors.blue,
    borderRadius: 100 / 2,
  },
  image: {
    position: 'absolute',
    alignSelf: 'center',
    marginTop: 0,
    borderWidth: 2,
    borderColor: AppColors.blue,
    width: 100,
    height: 100,
    borderRadius: 100 / 2,
  },
  buttonContainer: {
    flexDirection: 'row',
    height: 45,
    width: '90%',
    alignSelf: 'center',
    alignItems: 'center',
    borderWidth: 1,
    paddingLeft: 10,
    borderRadius: 10,
    borderColor: AppColors.lightBlue,
    marginTop: 20,
  },
  buttonText: {
    marginLeft: 20,
    fontSize: 16,
  },
  alertContainer: {
    paddingBottom: 15,
    backgroundColor: AppColors.white,
    justifyContent: 'center',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    height: 220,
  },
  form: {
    paddingTop: 10,
    paddingBottom: 24,
    justifyContent: 'space-around',
  },
  rootContainer: {
    flex: 1,
    display: 'flex',
    justifyContent: 'flex-start',
  },
  ContainerCss: {
    backgroundColor: AppColors.white,
    paddingHorizontal: 15,
  },
  top: {
    marginTop: 10,
  },
  btnEnable: {
    alignSelf: 'center',
    width: windowDimensions.width * 0.5,
  },
  footer: {
    justifyContent: 'flex-end',
    marginTop: 50,
  },
  saveButton: {
    width: windowDimensions.width * 0.75,
    alignSelf: 'center',
  },
  avatarContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 48,
  },
  detailsContainer: {
    display: 'flex',
    justifyContent: 'space-around',
    paddingLeft: variables.contentPadding * 4,
    paddingRight: variables.contentPadding * 4,
  },

  footerContainer: {
    justifyContent: 'center',
    alignItems: 'center',

    paddingBottom: 36,
  },

  changePhotoButton: {
    marginTop: 10,
    marginLeft: 40,
    justifyContent: 'center',
    marginBottom: 36,
    width: 200,
    color: AppColors.blue,
  },
});

export default EditProfile;
