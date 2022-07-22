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
import Styles from '../../../theme/styles';
import {forgotPassword} from '../../../services/auth';
import {ConexusIcon} from '../../../components/conexus-icon';
import {AppColors, AppFonts} from '../../../theme';
import NavigationService from '../../../navigation/NavigationService';
import {showApiErrorAlert} from '../../../common';

interface ForgotPasswordProps {
  username?: string;
}
interface ForgotPasswordState {
  username: string;
}

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  // handleChange(name: any, value: any) {
  //   this.setState({
  //     username: value.nativeEvent.text,
  //   });
  // }

  const recoverPasswordFn = async () => {
    if (email && email.length) {
      try {
        setLoading(true);
        // setError(false);
        const {data} = await forgotPassword({
          username: email,
        });
        console.log('Data====>', data);
        NavigationService.navigate('ReviewCandidateHomeScreen');
        if (data.success) {
          setLoading(false);

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
      alert('password');
      // onEmailBlur();
      // onPasswordBlur();
    }
  };

  return (
    <ScrollView
      contentContainerStyle={style.rootContainer}
      keyboardShouldPersistTaps="always">
      <KeyboardAvoidingView behavior="position" style={style.rootContainer}>
        <View
          style={StyleSheet.flatten([Styles.cnxWhiteHeader, {paddingTop: 56}])}>
          <ConexusIcon
            name="cn-logo"
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
              returnKeyType="go"
            />
          </View>

          <TouchableOpacity
            // disabled={
            //   !!!this.state.username ||
            //   this.props.userStore.isRecoveringPassword
            // }
            onPress={recoverPasswordFn}>
            <View style={style.btnContainer}>
              <Text style={style.signIn}>RECOVER NOW</Text>
            </View>
          </TouchableOpacity>
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
  btnContainer: {
    backgroundColor: AppColors.gray,
    borderRadius: 22,
    marginHorizontal: 50,
    justifyContent: 'center',
    height: 45,
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
  title: {
    marginBottom: variables.contentPadding * 2,
    textAlign: 'center',
    fontSize: 25,
    fontWeight: 'bold',
  },

  btn: {
    alignSelf: 'center',
    width: windowDimensions.width * 0.5,
  },

  form: {
    paddingTop: 18,
    paddingBottom: 24,
    justifyContent: 'space-around',
  },
});

export default ForgotPassword;
