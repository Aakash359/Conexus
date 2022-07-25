import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Button,
  Text,
  View,
  TouchableOpacity,
} from 'react-native';
import variables from '../../../theme';
import {Field} from '../../../components/field';
import {windowDimensions} from '../../../common';
import Toast from 'react-native-toast-message';
import Styles from '../../../theme/styles';
import {forgotPassword} from '../../../services/auth';
import {ConexusIcon} from '../../../components/conexus-icon';
import {AppColors, AppFonts} from '../../../theme';
import NavigationService from '../../../navigation/NavigationService';
import {showApiErrorAlert} from '../../../common';
import {ActionButton} from '../../../components/action-button';
import Icon from 'react-native-vector-icons/Ionicons';
import {Alert} from 'react-native';
import {TouchableHighlight} from 'react-native-gesture-handler';

interface ForgotPasswordProps {
  username?: string;
  onPress: Function;
}
interface ForgotPasswordState {
  username: string;
  onPress: () => void;
}
const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [emailError, setEmailError] = useState(false);

  const onEmailBlur = () => {
    if (
      email &&
      email.length &&
      (email.match(emailRegex) || email.length == 10)
    ) {
      setEmailError(false);
    } else {
      setEmailError(true);
    }
  };
  // handleChange(name: any, value: any) {
  //   this.setState({
  //     username: value.nativeEvent.text,
  //   });
  // }

  const recoverPasswordFn = async () => {
    if (email && email.length) {
      try {
        setLoading(true);
        const {data} = await forgotPassword({
          username: email,
        });
        console.log('Data====>', data);
        NavigationService.navigate('ReviewCandidateHomeScreen');
        if (data.success) {
          setLoading(false);
          Toast.show({
            type: 'success',
            text2: data.message,
            visibilityTime: 2000,
            autoHide: true,
          });
          // onLogin(data, `email`);
        } else {
          setLoading(false);
          setError(data.message);
        }
      } catch (error) {
        showApiErrorAlert({
          defaultTitle: 'Password Recovery Error',
          defaultDescription:
            'An unexpected error occurred while recovering your password. Please try again.',
          loggerName: 'UserStore',
          loggerTitle: 'recoverPassword',
          error: error,
        });
        setLoading(false);
      }
    } else {
      onEmailBlur();
      // onEmailBlur();
      // onPasswordBlur();
    }
  };
  const goBack = () => {
    NavigationService.goBack();
  };

  return (
    <ScrollView
      contentContainerStyle={style.rootContainer}
      keyboardShouldPersistTaps="always">
      <KeyboardAvoidingView behavior="position" style={style.rootContainer}>
        <View
          style={StyleSheet.flatten([Styles.cnxWhiteHeader, {paddingTop: 20}])}>
          <TouchableOpacity onPress={goBack}>
            <Icon
              name="arrow-back"
              size={28}
              color={AppColors.blue}
              style={style.backArrow}
            />
          </TouchableOpacity>
          {/* <ConexusIcon
            name="cn-logo"
            size={100}
            color={AppColors.blue}
            style={style.logo}
          /> */}
          <Icon
            name="leaf"
            size={100}
            color={AppColors.blue}
            style={style.logo}
          />
          <Text style={style.title}>Sign In</Text>
        </View>
        <View style={style.content}>
          <View style={style.form}>
            <Field
              placeholder="Email Address"
              onTextChange={setEmail}
              value={email}
              showError={emailError}
              returnKeyType="go"
              customStyle={{
                backgroundColor: AppColors.white,
                marginHorizontal: -10,
                marginRight: 1,
                borderRadius: 5,
              }}
            />
            {error ? <Text style={style.errorTxt}>{error}</Text> : null}
          </View>

          <ActionButton
            textColor={variables.blue}
            title="RECOVER NOW"
            loading={loading}
            disabled={email ? loading : 'false'}
            onPress={recoverPasswordFn}
            customStyle={email ? style.btnEnable : style.btnDisable}
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
  );
};

const style = StyleSheet.create({
  rootContainer: {
    flex: 1,
    display: 'flex',
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
