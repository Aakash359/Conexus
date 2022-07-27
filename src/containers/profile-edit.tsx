import React, {useState, useEffect} from 'react';
import {Text, StyleSheet, TouchableOpacity, View} from 'react-native';
// import ImagePicker from 'react-native-image-crop-picker'
import variables from '../theme';

import {showApiErrorAlert, creatInputChangeHandler} from '../common';
import {UserStore} from '../stores';
import {windowDimensions} from '../common';
// import { userService } from '../services';
import {logger} from 'react-native-logs';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {ActionButton} from '../components/action-button';
import {Field} from '../components/field';

interface EditProfileProps {
  userStore: UserStore;
}

interface EditProfileState {
  firstName: string;
  lastName: string;
  title: string;
  showTitle: boolean;
  phoneNumber: string;
}
const log = logger.createLogger();
export const EDIT_PROFILE_COMPONENT_NAME = 'EditProfileComponent';

const EditProfile: React.FC<EditProfileProps> = ({}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [emailError, setEmailError] = useState(false);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [company, setCompany] = useState('');
  const [title, setTitle] = useState('');
  const [showTitle, setShowTitle] = useState('');
  const [eMail, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [howHeard, setHowHeard] = useState('');

  // constructor(props, state) {
  //   super(props, state);
  //   this.state = {
  //     firstName: props.userStore.user.firstName,
  //     lastName: props.userStore.user.lastName,
  //     title: props.userStore.user.title,
  //     showTitle: props.userStore.isFacilityUser,
  //     phoneNumber: props.userStore.user.phoneNumber,
  //   };
  // }

  const promptImageLocation = () => {
    const self = this;

    ActionSheet.show(
      {
        options: ['Photo Library', 'Camera', 'Cancel'],
        cancelButtonIndex: 2,
        destructiveButtonIndex: 2,
        title: 'Select photo from',
      },
      // buttonIndex => {
      //   self.selectImage(buttonIndex.toString() === '1');
      // },
    );
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

  const saveProfile = () => {
    // this.props.userStore.saveProfile(this.state);
  };

  return (
    <View>
      <KeyboardAwareScrollView style={style.rootContainer}>
        <View style={style.avatarContainer}>
          {/* <Avatar
            // source={this.props.userStore.user.photoUrl}
            size={90}
            onClick={promptImageLocation}
          /> */}
          <ActionButton
            textColor={variables.blue}
            title="Choose Profile Photo"
            onPress={promptImageLocation}
            style={style.changePhotoButton}
          />
        </View>
        <View style={style.detailsContainer}>
          <Field
            placeholder="First Name"
            autoCapitalize="none"
            returnKeyType="done"
            inverse
            value={firstName}
            onChange={creatInputChangeHandler('firstName')}
          />
          <Field
            placeholder="Last Name"
            autoCapitalize="none"
            returnKeyType="done"
            value={lastName}
            onChange={creatInputChangeHandler('lastName')}
            inverse
          />
          {showTitle ? (
            <Field
              placeholder="Title"
              autoCapitalize="none"
              returnKeyType="done"
              value={title}
              onChange={creatInputChangeHandler('title')}
              inverse
            />
          ) : null}
          {/* <PhoneNumberField
              placeholder="Phone Number"
              keyboardType="phone-pad"
              value={phoneNumber}
              onChange={creatInputChangeHandler('phoneNumber')}
              inverse
            /> */}
        </View>
        <ActionButton
          primary
          title="Save"
          style={{marginTop: 40}}
          // disabled={this.props.userStore.isSavingProfile}
          onPress={saveProfile}
        />
      </KeyboardAwareScrollView>
    </View>
  );
};

const style = StyleSheet.create({
  saveButton: {
    width: windowDimensions.width * 0.75,
    alignSelf: 'center',
  },

  rootContainer: {
    flex: 1,
    flexDirection: 'column',
  },

  avatarContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 48,
  },
  detailsContainer: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
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
    marginBottom: 36,
    width: 200,
  },
});

export default EditProfile;
