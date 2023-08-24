import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  KeyboardAvoidingView,
  Text,
  Alert,
  View,
  Platform,
  Keyboard,
  TouchableOpacity,
  Image,
  ScrollView,
} from 'react-native';
import NavigationService from '../../../navigation/NavigationService';
import {ActionButton} from '../../../components/action-button';
import Toast from 'react-native-toast-message';
import variables from '../../../theme';
import {Field, Passwordfield} from '../../../components/field';
import {windowDimensions} from '../../../common';
import theme, {AppFonts, AppColors} from '../../../theme';
import {useDispatch} from 'react-redux';
import {loginRequest} from '../../../redux/actions/userAction';
import {getStoredUser} from '../../../redux/actions/userAction';
import Icon from 'react-native-vector-icons/MaterialIcons';
const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
const SafeAreaView = require('react-native').SafeAreaView;

// Prod Credentials
// Email : kbujarski@trshealthcare.com
// Password: temp

// Dev/Testing Credentials
// 1- Email : kbujarski@trshealthcare.com
// Password: temp

// 1- Email : dorothy_drones@armc.net
// Password: temp

// 1- Email : leanne.weyrick@gmail.com
// Password: temp

// 2- Email : appletester@conexussolutions.com
// Password: travel

const LoginScreen = () => {
  const [loading, setLoading] = useState(false);
  const [hidePassword, setHidePassword] = useState(true);
  const [errors, setErrors] = useState('');
  const [inputs, setInputs] = useState({
    email: '',
    password: '',
  });
  const dispatch = useDispatch();

  const handleOnchange = (text: any, input: any) => {
    setInputs((prevState: any) => ({...prevState, [input]: text}));
  };
  const handleError = (error: any, input: any) => {
    setErrors((prevState: any) => ({...prevState, [input]: error}));
  };
  const setPasswordVisibility = () => {
    setHidePassword(!hidePassword);
  };

  const validate = () => {
    Keyboard.dismiss();
    let isValid = true;
    if (!inputs.email) {
      handleError('Please enter email', 'email');
      isValid = false;
    } else if (!inputs.email.match(emailRegex)) {
      handleError('Please enter a valid email', 'email');
      isValid = false;
    }
    if (!inputs.password) {
      handleError('Please input password', 'password');
      isValid = false;
    } else if (inputs.password.length < 4) {
      handleError('Min password length of 4', 'password');
      isValid = false;
    }

    if (isValid) {
      signInFn();
    }
  };

  const signInFn = async () => {
    {
      try {
        const data = {
          username: inputs.email,
          password: inputs.password,
          App: true,
        };
        setLoading(true);
        setTimeout(() => {
          setLoading(false);
          dispatch(loginRequest(data));
        }, 1000);
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
    }
  };

  const forgotPasswordFn = () => {
    NavigationService.navigate('ForgotPassword');
  };
  const requestAccount = () => {
    NavigationService.navigate('SelectAccount');
  };

  return (
    <SafeAreaView style={style.splash}>
      <ScrollView keyboardShouldPersistTaps="handled">
        <KeyboardAvoidingView behavior="position" keyboardVerticalOffset={-130}>
          <View style={style.content}>
            <View style={style.form}>
              <Image
                style={style.logo}
                source={require('../../../components/Images/conexus-logo.jpg')}
              />
              <Text style={style.title}>Sign-In</Text>
              <View style={style.field}>
                <Field
                  placeholder="Email Address"
                  autoCapitalize="none"
                  onTextChange={(text: any) => handleOnchange(text, 'email')}
                  onFocus={() => handleError(null, 'email')}
                  error={errors.email}
                  customStyle={{fontSize: 16}}
                  returnKeyType="next"
                />
              </View>
              <View style={style.field}>
                <Passwordfield
                  placeholder="Password"
                  autoCapitalize="none"
                  error={errors.password}
                  customStyle={{fontSize: 16}}
                  onSubmit={setPasswordVisibility}
                  hidePassword={hidePassword}
                  onTextChange={(text: any) => handleOnchange(text, 'password')}
                  onFocus={() => handleError(null, 'password')}
                  returnKeyType="done"
                />
              </View>
              <View style={style.forgotPassView}>
                <TouchableOpacity onPress={forgotPasswordFn} activeOpacity={1}>
                  <Text style={style.forgotPass}>FORGOT PASSWORD?</Text>
                </TouchableOpacity>
              </View>
            </View>

            <ActionButton
              textColor={variables.blue}
              customTitleStyle={loading ? style.loadingTitle : style.title}
              customStyle={loading ? style.loadingBtn : style.loginBtn}
              loading={loading}
              title="SIGN IN"
              onPress={validate}
            />

            <TouchableOpacity onPress={requestAccount} activeOpacity={1}>
              <Text style={style.newUser}>
                New to Conexus? Request an account now!
              </Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </ScrollView>
    </SafeAreaView>
  );
};

const style = StyleSheet.create({
  splash: {
    ...windowDimensions,
    flex: 1,
    backgroundColor: AppColors.white,
  },
  loadingBtn: {
    backgroundColor: AppColors.blue,
    justifyContent: 'center',
    alignSelf: 'center',
    height: 45,
    width: '50%',
    borderRadius: 28,
  },
  forgotPassView: {
    justifyContent: 'flex-end',
    marginTop: 10,
    flexDirection: 'row',
  },

  loginBtn: {
    backgroundColor: AppColors.blue,
    justifyContent: 'center',
    alignSelf: 'center',
    height: 45,
    width: '100%',
    borderRadius: 28,
  },
  loadingTitle: {
    width: 0,
  },
  title: {
    color: theme.white,
    width: '100%',
    fontSize: 18,
    textAlign: 'center',
  },
  field: {
    marginTop: 10,
  },
  signIn: {
    color: AppColors.white,
    fontSize: AppFonts.bodyTextLargeSize,
    textAlign: 'center',
    fontFamily: AppFonts.family.fontFamily,
  },
  button: {
    justifyContent: 'flex-end',
    marginTop: 150,
  },
  forgotPass: {
    fontSize: 12,
    textAlign: 'center',
    color: AppColors.blue,
  },
  newUser: {
    textAlign: 'center',
    color: AppColors.blue,
  },
  logo: {
    alignSelf: 'center',
    height: 100,
    width: 100,
  },
  content: {
    display: 'flex',
    ...windowDimensions,
    justifyContent: 'space-around',
    paddingLeft: variables.contentPadding * 4,
    paddingRight: variables.contentPadding * 4,
  },

  form: {
    justifyContent: 'space-around',
  },
});

export default LoginScreen;
