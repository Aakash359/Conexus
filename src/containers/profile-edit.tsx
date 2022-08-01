import React, {useState, useEffect} from 'react';
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
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';
import ImagePicker from 'react-native-image-crop-picker';
import Icon from 'react-native-vector-icons/Ionicons';
import {uploadPhoto, updateProfile} from '../services/auth';
import variables, {AppColors} from '../theme';
import {OrderedMap} from 'immutable';
import {showApiErrorAlert, creatInputChangeHandler} from '../common';
import {UserStore} from '../stores';
import {windowDimensions} from '../common';
import {useSelector} from '../redux/reducers/index';
import {logger} from 'react-native-logs';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {ActionButton} from '../components/action-button';
import {Field} from '../components/field';
import {Avatar} from '../components/avatar';
import NavigationService from '../navigation/NavigationService';

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

const SafeAreaView = require('react-native').SafeAreaView;
export const EDIT_PROFILE_COMPONENT_NAME = 'EditProfileComponent';

const EditProfile = (props: EditProfileProps) => {
  const userInfo = props.route.params;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [firstNameError, setFirstNameError] = useState(false);
  const [imageUrl, setImageUrl] = useState(userInfo?.user?.photoUrl || '');
  const [firstName, setFirstName] = useState(userInfo.user?.firstName || '');
  const [lastName, setLastName] = useState(userInfo?.user?.lastName || '');
  const [lastNameError, setLastNameError] = useState(false);
  const [title, setTitle] = useState(userInfo?.user?.title || '');
  const [titleError, setTitleError] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState(
    userInfo?.user?.phoneNumber || '',
  );
  const [phoneError, setPhoneError] = useState(false);
  const [cameraModal, setCameraModal] = useState(false);

  console.log('userInfo===>', userInfo);

  const onFirstNameBlur = () => {
    if (firstName && firstName.length) {
      setFirstNameError(false);
    } else {
      setFirstNameError(true);
    }
  };
  const onLastNameBlur = () => {
    if (lastName && lastName.length) {
      setLastNameError(false);
    } else {
      setLastNameError(true);
    }
  };
  const onTitleBlur = () => {
    if (title && title.length) {
      setTitleError(false);
    } else {
      setTitleError(true);
    }
  };

  const onPhoneBlur = () => {
    if (phoneNumber && phoneNumber.length == 10) {
      setPhoneError(false);
    } else {
      setPhoneError(true);
    }
  };

  const openGallery = async () => {
    ImagePicker.openPicker({
      width: 300,
      height: 400,
      cropping: true,
      includeBase64: true,
      freeStyleCropEnabled: true,
      mediaType: 'photo',
      compressImageQuality: 0.8,
      cropperToolbarWidgetColor: '#FFFFFF',
      cropperToolbarColor: '#D3D3D3',
    })
      .then(async (image: any, mimeType: string = 'image/jpg') => {
        let ext = mimeType.split('/')[1] || 'jpg';
        if (ext === 'jpeg') {
          ext = 'jpg';
        }
        const payload = {
          base64Image: image.data,
          fileExt: ext,
        };
        const data = await uploadPhoto(payload);
        console.log('PhotoMil Gyi', data);

        let imageUrl = `data:${image.mime};base64,${image.data}`;
        console.log('received base64 image', data, imageUrl);
        setCameraModal(false);
      })
      .catch(error => {
        console.log('Error====>', error);
        showApiErrorAlert({
          defaultTitle: error?.response?.data?.statusText,
          defaultDescription:
            'An unexpected error occurred while saving your profile photo. Please try again.',
          error: error,
          loggerTitle: EDIT_PROFILE_COMPONENT_NAME,
          loggerName: 'selectImage',
        });
        setCameraModal(false);
      });
  };

  const openCamera = async () => {
    // let token = userInfo.user?.authToken;
    console.log('P===>', userInfo.user?.authToken);
    ImagePicker.openCamera({
      width: 300,
      height: 400,
      cropping: true,
      includeBase64: true,
      freeStyleCropEnabled: true,
      mediaType: 'photo',
      compressImageQuality: 0.8,
      cropperToolbarWidgetColor: '#FFFFFF',
      cropperToolbarColor: '#D3D3D3',
    })
      .then(async (image: any, mimeType: string = 'image/jpg') => {
        let ext = mimeType.split('/')[1] || 'jpg';
        if (ext === 'jpeg') {
          ext = 'jpg';
        }
        const payload = {
          base64Image: image.data,
          fileExt: ext,
          token: userInfo.user?.authToken,
        };
        const data = await uploadPhoto(payload);
        let imageUrl = `data:${image.mime};base64,${image.data}`;
        console.log('received base64 image', data, imageUrl);
        setCameraModal(false);
      })
      .catch(error => {
        console.log('Error', error);
        showApiErrorAlert({
          defaultTitle: error?.response?.data?.statusText,
          defaultDescription:
            'An unexpected error occurred while saving your profile photo. Please try again.',
          error: error,
          loggerTitle: EDIT_PROFILE_COMPONENT_NAME,
          loggerName: 'selectImage',
        });

        // SetCameraModal(false);
      });
  };

  // selectImage = (useCamera: boolean) => {
  // logger.group(EDIT_PROFILE_COMPONENT_NAME, 'selectImage', (log: (...any) => {}) => {
  // log.info('Picking image');

  // ImagePicker[useCamera ? 'openCamera' : 'openPicker']({
  //     width: 300,
  //     height: 400,
  //     cropping: true,
  //     includeBase64: true
  // }).then((image: any) => {
  //     log.info('Image picked. Saving...')
  //     userService.savePhoto(image.data, image.mime)
  //         .then(result => {
  //             log.info('Image save complete, setting user store image');
  //             // Instead of loading the server photo we just sent, we simply construct a data url
  //             const photoUrl = `data:${image.mime};base64,${image.data}`
  //             this.props.userStore.setUserImage(photoUrl)
  //         })
  //         .catch(error => {
  //             showApiErrorAlert({
  //                 defaultTitle: 'Show Profile Error',
  //                 defaultDescription: 'An unexpected error occurred while saving your profile photo. Please try again.',
  //                 error: error,
  //                 loggerTitle: EDIT_PROFILE_COMPONENT_NAME,
  //                 loggerName: 'selectImage'
  //             });
  //         });
  // })
  // });
  // };

  const saveProfile = async () => {
    if (
      firstName &&
      firstName.length &&
      lastName &&
      lastName.length &&
      title &&
      title.length &&
      phoneNumber &&
      phoneNumber.length
    ) {
      const payload = {
        firstName: firstName,
        lastName: lastName,
        title: title,
        phoneNumber: phoneNumber,
        token: `Bearer ${await AsyncStorage.getItem('userToken')}`,
      };
      try {
        setLoading(true);
        let token = `Bearer ${await AsyncStorage.getItem('userToken')}`;
        const {data} = await updateProfile(payload);
        console.log('Updated Profile===>', data);

        NavigationService.goBack();
        Alert.alert(
          'Registered Successfully',
          'Thank you for your request. A Conexus Account Manager will be in touch with you shortly',
        );
        Toast.show({
          type: 'success',
          text2: data.description,
          visibilityTime: 2000,
          autoHide: true,
        });
      } catch (error) {
        setLoading(false);
        console.log('Error', error);
        Alert.alert(
          error?.response?.statusText,
          error?.response?.data?.Message,
        );
        Toast.show({
          type: 'error',
          text2: error?.response?.data?.Message,
          visibilityTime: 2000,
          autoHide: true,
        });
      }
    } else {
      onFirstNameBlur();
      onLastNameBlur();
      onTitleBlur();
      onPhoneBlur();
    }

    // const {deviceStore, userStore} = this.props;
    // if (userStore.isAuthenticating) {
    //   log.info('LoginContainer', 'Already logging in...aborting');
    //   return;
    // }
    // userStore
    //   .login({username: this.state.username, password: this.state.password})
    //   .then(nextViewName => {
    //     // deviceStore.checkPermissions();
    //     return AsyncStorage.setItem(
    //       LOGIN_LAST_USER_STORAGE_KEY,
    //       this.state.username,
    //     ).then(() => {
    //       log.info('LoginContainer', 'NextViewName: ' + nextViewName);
    //       if (nextViewName) {
    //         Actions[nextViewName]();
    //       } else {
    //         this.setDefaultState('login');
    //       }
    //     });
    //   });
  };

  return (
    <SafeAreaView style={style.container}>
      <ScrollView keyboardShouldPersistTaps="always">
        <KeyboardAvoidingView behavior="position" style={style.rootContainer}>
          <View style={style.detailsContainer}>
            <View style={style.avatarContainer}>
              <View style={style.profileCircle}>
                <Image
                  style={style.image}
                  source={{
                    uri: imageUrl,
                  }}
                />
              </View>

              <TouchableOpacity onPress={() => setCameraModal(true)}>
                <Text style={style.changePhotoButton}>
                  CHOOSE PROFILE PHOTO
                </Text>
              </TouchableOpacity>
            </View>

            <View style={style.top} />
            <Field
              placeholder="First Name"
              autoCapitalize="none"
              returnKeyType="done"
              value={firstName}
              onBlur={() => onFirstNameBlur()}
              customStyle={{
                backgroundColor: AppColors.white,
                marginHorizontal: -10,
                marginRight: 1,
                borderRadius: 5,
              }}
              onTextChange={(text: string) => setFirstName(text)}
            />
            <View style={style.top} />
            <Field
              placeholder="Last Name"
              autoCapitalize="none"
              returnKeyType="done"
              value={lastName}
              onBlur={() => onLastNameBlur()}
              customStyle={{
                backgroundColor: AppColors.white,
                marginHorizontal: -10,
                marginRight: 1,
                borderRadius: 5,
              }}
              onTextChange={(text: string) => setLastName(text)}
            />
            <View style={style.top} />
            <Field
              placeholder="Title"
              autoCapitalize="none"
              returnKeyType="done"
              value={title}
              showError={titleError}
              errorMessage={'Please enter the title'}
              customStyle={{
                backgroundColor: AppColors.white,
                marginHorizontal: -10,
                marginRight: 1,
                borderRadius: 5,
              }}
              onTextChange={(text: string) => setTitle(text)}
              onBlur={() => onTitleBlur()}
            />
            <View style={style.top} />
            <Field
              placeholder="Phone Number"
              autoCapitalize="none"
              keyboardType={'number-pad'}
              returnKeyType="done"
              onBlur={() => onPhoneBlur()}
              value={phoneNumber}
              showError={phoneError}
              errorMessage={'Invalid Phone Number'}
              customStyle={{
                backgroundColor: AppColors.white,
                marginHorizontal: -10,
                marginRight: 1,
                borderRadius: 5,
              }}
              onTextChange={(text: string) => setPhoneNumber(text)}
            />
            <View style={style.footer}>
              <ActionButton
                primary
                title="Save"
                customStyle={style.btnEnable}
                style={{marginTop: 40}}
                onPress={saveProfile}
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
          }}>
          <TouchableOpacity
            style={style.modalContainer}
            activeOpacity={1}
            onPress={() => {
              setCameraModal(false);
            }}>
            <View style={style.alertContainer}>
              <Text style={style.buttonHeader}>Select profile photo</Text>
              <TouchableOpacity
                style={style.buttonContainer}
                onPress={openCamera}>
                <Icon
                  name="md-camera-outline"
                  size={30}
                  color={AppColors.blue}
                />
                <Text style={style.buttonText}>Take picture</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={style.buttonContainer}
                onPress={openGallery}>
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
