import React, {useState} from 'react';
import {
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Text,
  View,
  TouchableOpacity,
  Alert,
  Keyboard,
  Image,
} from 'react-native';
import variables from '../../../theme';
import {Field} from '../../../components/field';
import {windowDimensions} from '../../../common';
import Styles from '../../../theme/styles';
import {AppColors, AppFonts} from '../../../theme';
import NavigationService from '../../../navigation/NavigationService';
import {ActionButton} from '../../../components/action-button';
import Icon from 'react-native-vector-icons/Ionicons';
import {forgotPassword} from '../../../services/ApiServices';
import {Strings} from '../../../common/Strings';

interface ForgotPasswordProps {
  username?: string;
  onPress: Function;
}

const {EMPTY_EMAIL_USERNAME, EMAIL_USERNAME, RECOVER_NOW} = Strings;
const SafeAreaView = require('react-native').SafeAreaView;

const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;

const ForgotPassword = () => {
  const [inputs, setInputs] = useState({
    email: '',
  });
  const [loading, setLoading] = useState(false);
  const [isRecoveringPassword, setIsRecoveringPassword] = useState(false);
  const [errors, setErrors] = useState('');

  const handleOnchange = (text: any, input: any) => {
    setInputs((prevState: any) => ({...prevState, [input]: text}));
  };
  const handleError = (error: any, input: any) => {
    setErrors((prevState: any) => ({...prevState, [input]: error}));
  };

  const validate = () => {
    Keyboard.dismiss();
    let isValid = true;
    if (!inputs.email) {
      handleError(EMPTY_EMAIL_USERNAME, 'email');
      isValid = false;
    }
    // else if (!inputs.email.match(emailRegex)) {
    //   handleError('Please enter a valid email', 'email');
    //   isValid = false;
    // }// code commented for temporary purpose uncomment this after getting valid email
    if (isValid) {
      recoverPasswordFn();
    }
  };

  const recoverPasswordFn = async () => {
    try {
      setLoading(true);
      setIsRecoveringPassword(true);
      const {data} = await forgotPassword({
        username: inputs.email,
      });
      Alert.alert(data.description);
      setIsRecoveringPassword(false);
      setLoading(false);
      NavigationService.navigate('LoginScreen');
    } catch (error) {
      setLoading(false);
      setIsRecoveringPassword(false);
      console.log('Error', error);
      Alert.alert(error?.response?.data?.error?.description);
    }
  };
  const goBack = () => {
    NavigationService.goBack();
  };

  return (
    <SafeAreaView style={[{flex: 1, backgroundColor: AppColors.baseGray}]}>
      <ScrollView
        contentContainerStyle={style.rootContainer}
        keyboardShouldPersistTaps="handled"
      >
        <KeyboardAvoidingView behavior="position" style={style.rootContainer}>
          <View
            style={StyleSheet.flatten([
              Styles.cnxWhiteHeader,
              {paddingTop: 20},
            ])}
          >
            <TouchableOpacity onPress={goBack}>
              <Icon
                name="arrow-back"
                size={28}
                color={AppColors.blue}
                style={style.backArrow}
              />
            </TouchableOpacity>
            <Image
              style={style.logo}
              source={require('../../../components/Images/conexus-logo.jpg')}
            />
            <Text style={style.title}>Sign In</Text>
          </View>
          <View style={style.content}>
            <View style={style.form}>
              <Field
                placeholder={EMAIL_USERNAME}
                onTextChange={(text: any) => handleOnchange(text, 'email')}
                onFocus={() => handleError(null, 'email')}
                error={errors.email}
                returnKeyType="go"
                customStyle={{
                  backgroundColor: AppColors.white,
                  marginHorizontal: -10,
                  marginRight: 1,
                  borderRadius: 5,
                }}
              />
            </View>

            <ActionButton
              textColor={variables.blue}
              title={RECOVER_NOW}
              loading={loading}
              disabled={
                inputs.email ? {loading, isRecoveringPassword} : 'false'
              }
              onPress={validate}
              customStyle={inputs.email ? style.btnEnable : style.btnDisable}
            />
            {/* <TouchableOpacity
            // disabled={
            //   !!!this.state.username ||
            //   this.props.userStore.isRecoveringPassword
            // }
            onPress={recoverPasswordFn}>
            <View style={style.btnContainer}>
              <Text style={style.signIn}>RECOVER NOW</Text>
            </View>
          </TouchableOpacity> */}
          </View>
        </KeyboardAvoidingView>
      </ScrollView>
    </SafeAreaView>
  );
};

const style = StyleSheet.create({
  rootContainer: {
    flex: 1,
    display: 'flex',
    // backgroundColor: AppColors.lightBlue,
    justifyContent: 'flex-start',
  },
  errorTxt: {
    fontSize: 12,
    color: AppColors.red,
    // fontFamily: AppFonts.h3,
  },
  btnEnable: {
    alignSelf: 'center',
    width: windowDimensions.width * 0.5,
  },
  btnDisable: {
    backgroundColor: AppColors.gray,
    alignSelf: 'center',
    width: windowDimensions.width * 0.5,
  },
  signIn: {
    color: AppColors.white,
    fontSize: AppFonts.bodyTextLargeSize,
    textAlign: 'center',
    fontFamily: AppFonts.family.fontFamily,
  },
  content: {
    display: 'flex',
    justifyContent: 'space-around',
    marginTop: 18,
    paddingLeft: variables.contentPadding * 4,
    paddingRight: variables.contentPadding * 4,
  },
  logo: {
    alignSelf: 'center',
    height: 100,
    width: 100,
  },
  backArrow: {
    justifyContent: 'flex-start',
    marginLeft: 18,
  },
  title: {
    marginBottom: variables.contentPadding * 2,
    textAlign: 'center',
    fontSize: 25,
    fontWeight: 'bold',
  },

  form: {
    paddingTop: 18,
    paddingBottom: 24,
    justifyContent: 'space-around',
  },
});

export default ForgotPassword;
