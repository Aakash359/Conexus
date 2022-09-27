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
} from 'react-native';
import NavigationService from '../../../navigation/NavigationService';
import {ActionButton} from '../../../components/action-button';
import Toast from 'react-native-toast-message';
import variables from '../../../theme';
import {Field} from '../../../components/field';
import {windowDimensions} from '../../../common';
import {AppFonts, AppColors} from '../../../theme';
import {useDispatch} from 'react-redux';
import {loginRequest} from '../../../redux/actions/userAction';
import AsyncStorage from '@react-native-async-storage/async-storage';

const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
const SafeAreaView = require('react-native').SafeAreaView;

// Prod Credentials
// Email : kbujarski@trshealthcare.com
// Password: temp

// Dev/Testing Credentials
// Email : kbujarski@trshealthcare.com
// Password: temp

const LoginScreen = () => {
  const [loading, setLoading] = useState(false);
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

  const saveToken = async () => {
    await AsyncStorage.setItem('authToken', userInfo?.user?.authToken);
  };

  const getToken = async () => {
    let token = await AsyncStorage.getItem('authToken');
  };

  useEffect(() => {}, []);

  const validate = () => {
    Keyboard.dismiss();
    let isValid = true;
    if (!inputs.email) {
      handleError('Please enter email', 'email');
      isValid = false;
    }
    // else if (!inputs.email.match(emailRegex)) {
    //   handleError('Please enter a valid email', 'email');
    //   isValid = false;
    // }// code commented for temporary purpose uncomment this after getting valid email
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
              <Field
                placeholder="Password"
                autoCapitalize="none"
                secureTextEntry={true}
                error={errors.password}
                customStyle={{fontSize: 16}}
                onTextChange={(text: any) => handleOnchange(text, 'password')}
                onFocus={() => handleError(null, 'password')}
                returnKeyType="done"
              />
            </View>
            <TouchableOpacity onPress={forgotPasswordFn} activeOpacity={1}>
              <Text style={style.forgotPass}>FORGOT PASSWORD?</Text>
            </TouchableOpacity>
            {/* {this.props.deviceStore.isDebugEnabled
              ? this.renderEnvironentToggle()
              : null} */}
          </View>
          <ActionButton
            textColor={variables.blue}
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
    </SafeAreaView>
  );
};

const style = StyleSheet.create({
  splash: {
    ...windowDimensions,
    flex: 1,
    backgroundColor: AppColors.white,
  },
  errorTxt: {
    fontSize: 12,
    color: AppColors.red,
  },
  field: {
    marginTop: 10,
  },
  btnContainer: {
    marginTop: 20,
    backgroundColor: AppColors.blue,
    borderRadius: 22,
    justifyContent: 'center',
    paddingHorizontal: 10,
    height: 45,
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
    marginTop: 10,
    fontSize: 12,
    textAlign: 'right',
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
  title: {
    marginTop: variables.contentPadding * 2,
    marginBottom: variables.contentPadding * 2,
    textAlign: 'center',
    fontSize: 25,
    fontWeight: 'bold',
  },
  form: {
    justifyContent: 'space-around',
  },
  switch: {
    position: 'relative',
    top: Platform.OS === 'android' ? 3 : 0,
  },
  switchLabel: {
    paddingLeft: 8,
  },
  switchField: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: 18,
    marginBottom: 18,
  },
});

export default LoginScreen;
