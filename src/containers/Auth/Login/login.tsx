import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  KeyboardAvoidingView,
  Text,
  ImageBackground,
  View,
  Platform,
  TouchableOpacity,
} from 'react-native';
import NavigationService from '../../../navigation/NavigationService';
import {loginWithPass} from '../../../services/auth';
import {ActionButton} from '../../../components/action-button';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import {Switch} from 'native-base';
// import {observer, inject} from 'mobx-react';
// import {logger} from 'react-native-logs';
// import {Actions} from 'react-native-router-flux';
// import {Images} from '../components';
// import {ConexusIcon} from '../components/conexus-icon';
// import {setConexusApiEnvironment, getConexusApiEnvironment} from '../services';
// import {UserStore} from '../stores/userStore';
// import {ScreenType, StoreType} from '../common/constants';
import variables from '../../../theme';
import {Field} from '../../../components/field';
import {windowDimensions} from '../../../common';
import {AppFonts, AppColors} from '../../../theme';
import Icon from 'react-native-vector-icons/Ionicons';

const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
const SafeAreaView = require('react-native').SafeAreaView;

interface LoginState {
  username: string;
  password: string;
  displayMode: 'login' | 'splash';
  busy: boolean;
}

// // Email : kbujarski@trshealthcare.com
// //Password: temp

// const LOGIN_LAST_USER_STORAGE_KEY = '@LOGIN_LAST_USER';
// const log = logger.createLogger();
// @inject(StoreType.USER, StoreType.DEVICE)
// @observer
// export class Login extends React.Component<LoginProps, LoginState> {
//   setDefaultState(displayMode: 'login' | 'splash' = 'splash'): Promise<any> {
//     this.setState({
//       username: '',
//       password: '',
//       displayMode,
//       busy: false,
//     });

//     return AsyncStorage.getItem(LOGIN_LAST_USER_STORAGE_KEY).then(value => {
//       return new Promise((resolve, reject) => {
//         this.setState({username: value || '', password: ''}, resolve);
//       });
//     });
//   }

//   get isDevEnvironment(): boolean {
//     return getConexusApiEnvironment() === 'dev';
//   }

//   constructor(props: LoginProps, context?: any) {
//     super(props, context);

//     this.state = {
//       username: '',
//       password: '',
//       displayMode: 'splash',
//       busy: false,
//     };
//   }

//   toggleEnvironment() {
//     if (getConexusApiEnvironment() === 'dev') {
//       setConexusApiEnvironment('prod');
//     } else {
//       setConexusApiEnvironment('dev');
//     }

//     this.forceUpdate();
//   }

// componentWillMount() {
//   const {userStore, deviceStore} = this.props;

//   if (Actions.currentScene === ScreenType.CALL) {
//     return;
//   }

//   this.setDefaultState().then(() => {
//     if (!this.state.username) {
//       this.setState({displayMode: 'login'});
//       return Promise.resolve();
//     }
//     return userStore.tryLoadFromCache().then(
//       (nextViewName: string) => {
//         if (nextViewName === ScreenType.LOGIN) {
//           this.setState({displayMode: 'login'});
//         } else if (nextViewName) {
//           if (Actions.currentScene !== ScreenType.CALL) {
//             Actions[nextViewName]();
//           }
//           // deviceStore.checkPermissions();
//         }
//       },
//       error => {
//         log.info('LoginContainer', 'tryLoadFromCache: No Login Data', error);
//         this.setState({displayMode: 'login'});
//       },
//     );
//   });
// }

//   handleChange(name, value) {
//     const newState = Object.assign({}, this.state);
//     newState[name] = value.nativeEvent.text;
//     this.setState(newState);
//   }

//   requestAccount = () => {
//     Actions[ScreenType.SELECT_ACCOUNT]();
//   };
//   renderSplash() {
//     return (
//       <ImageBackground
//         source={require('../components/Images/splash.png')}
//         style={style.splash}
//       />
//     );
//   }

//   renderEnvironentToggle() {
//     return (
//       <View style={{flexDirection: 'row'}}>
//         <Switch
//           style={[style.switch]}
//           value={this.isDevEnvironment}
//           onValueChange={this.toggleEnvironment.bind(this)}
//         />

//         <TouchableOpacity onPress={this.toggleEnvironment.bind(this)}>
//           <Text style={style.switchLabel}>
//             {this.isDevEnvironment ? 'Devopment' : 'Production'} Environment
//           </Text>
//         </TouchableOpacity>
//       </View>
//     );
//   }
//   renderLogin() {
//     const {userStore} = this.props;

//     return (
//       <SafeAreaView style={[{backgroundColor: 'white'}]}>
//         <KeyboardAvoidingView behavior="position" keyboardVerticalOffset={-190}>
//           <View style={style.content}>
//             <View style={style.form}>
//               <ConexusIcon
//                 name="cn-logo"
//                 size={100}
//                 color={AppColors.blue}
//                 style={style.logo}
//               />
//               <Text style={style.title}>Sign-In</Text>
//               <View style={style.field}>
//                 <Field
//                   placeholder="Email Address"
//                   autoCapitalize="none"
//                   autoCorrect={false}
//                   returnKeyType="next"
//                   inverse
//                   value={this.state.username}
//                   onChange={this.handleChange.bind(this, 'username')}
//                 />
//               </View>
//               <View style={style.field}>
//                 <Field
//                   placeholder="Password"
//                   secureTextEntry
//                   autoCapitalize="none"
//                   returnKeyType="go"
//                   value={this.state.password}
//                   onSubmitEditing={this.loginFn}
//                   onChange={this.handleChange.bind(this, 'password')}
//                   last
//                   inverse
//                 />
//               </View>
//               <TouchableOpacity onPress={this.forgotPasswordFn}>
//                 <Text style={style.forgotPass}>Forgot password?</Text>
//               </TouchableOpacity>
//               {this.props.deviceStore.isDebugEnabled
//                 ? this.renderEnvironentToggle()
//                 : null}
//             </View>
//             <TouchableOpacity onPress={this.loginFn}>
//               <View style={style.btnContainer}>
//                 <Text style={style.signIn}>SIGN IN</Text>
//               </View>
//             </TouchableOpacity>

//             <TouchableOpacity onPress={this.requestAccount}>
//               <Text style={style.newUser}>
//                 New to Conexus? Request an account now!
//               </Text>
//             </TouchableOpacity>
//           </View>
//         </KeyboardAvoidingView>
//       </SafeAreaView>
//     );
//   }

//   render() {
//     return this.state.displayMode === 'splash'
//       ? this.renderSplash()
//       : this.renderLogin();
//   }
// }

const LoginScreen: React.FC<LoginState> = ({
  username = '',
  displayMode,
  busy = false,
}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [emailError, setEmailError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [error, setError] = useState('');

  const signInFn = async () => {
    if (
      email &&
      email.length &&
      email.match(emailRegex) &&
      password &&
      password.length
    ) {
      try {
        setLoading(true);
        setError(false);
        const {data} = await loginWithPass({
          username: email,
          password: password,
          App: true,
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
        console.log('error====>', error);
        setLoading(false);
      }
    } else {
      onEmailBlur();
      onPasswordBlur();
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

  const onPasswordBlur = () => {
    if (password && password.length && password.length > 3) {
      setPasswordError(false);
    } else {
      setPasswordError(true);
    }
  };

  const forgotPasswordFn = () => {
    NavigationService.navigate('ForgotPassword');
  };
  const requestAccount = () => {
    NavigationService.navigate('SelectAccount');
  };

  return (
    <SafeAreaView style={[{backgroundColor: 'white'}]}>
      <KeyboardAvoidingView behavior="position" keyboardVerticalOffset={-190}>
        <View style={style.content}>
          <View style={style.form}>
            <Icon
              name="leaf"
              size={100}
              color={AppColors.blue}
              style={style.logo}
            />
            <Text style={style.title}>Sign-In</Text>
            <View style={style.field}>
              <Field
                placeholder="Email Id"
                onTextChange={setEmail}
                value={email}
                // showError={emailError}
                returnKeyType="next"
                // onBlur={onEmailBlur}
                // errorMessage={'Invalid email'}
              />
              {error ? <Text style={style.errorTxt}>{error}</Text> : null}
            </View>
            <View style={style.field}>
              <Field
                placeholder="Password"
                secureTextEntry={true}
                value={password}
                // errorMessage={'Invalid Password'}
                // showError={passwordError}
                // onBlur={onPasswordBlur}
                onTextChange={setPassword}
                returnKeyType="done"
              />
            </View>
            <TouchableOpacity onPress={forgotPasswordFn}>
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
            onPress={signInFn}
          />
          {/* <TouchableOpacity onPress={signInFn}>
            <View style={style.btnContainer}>
              <Text style={style.signIn}>SIGN IN</Text>
            </View>
          </TouchableOpacity> */}

          <TouchableOpacity onPress={requestAccount}>
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
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorTxt: {
    fontSize: 12,
    color: AppColors.red,
    // fontFamily: AppFonts.h3,
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
