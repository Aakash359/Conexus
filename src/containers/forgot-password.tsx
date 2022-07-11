import React from 'react';
import {
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Button,
  Text,
  View,
  TouchableOpacity,
} from 'react-native';
import variables from '../theme';
import {Field} from '../components/field';
import {windowDimensions} from '../common';
import Styles from '../theme/styles';
import {Actions} from 'react-native-router-flux';
import {observer, inject} from 'mobx-react';
import {UserStore} from '../stores/userStore';
import {ConexusIcon} from '../components/conexus-icon';
import {AppColors, AppFonts} from '../theme';

interface ForgotPasswordProps {
  username?: string;
  userStore?: UserStore;
}
interface ForgotPasswordState {
  username: string;
}

@inject('userStore')
@observer
export class ForgotPassword extends React.Component<
  ForgotPasswordProps,
  ForgotPasswordState
> {
  constructor(props: ForgotPasswordProps, context?: any) {
    super(props, context);
    this.state = {username: props.username || ''};
  }

  handleChange(name: any, value: any) {
    this.setState({
      username: value.nativeEvent.text,
    });
  }
  render() {
    const recoverPasswordFn = () => {
      this.props.userStore
        .recoverPassword(this.state.username)
        .then(Actions.pop);
    };

    return (
      <ScrollView
        contentContainerStyle={style.rootContainer}
        keyboardShouldPersistTaps="always">
        <KeyboardAvoidingView behavior="position" style={style.rootContainer}>
          <View
            style={StyleSheet.flatten([
              Styles.cnxWhiteHeader,
              {paddingTop: 56},
            ])}>
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
                autoCapitalize="none"
                returnKeyType="go"
                value={this.state.username}
                onSubmitEditing={recoverPasswordFn}
                onChange={this.handleChange.bind(this, 'username')}
                last
                inverse
              />
            </View>

            <TouchableOpacity
              onPress={this.loginFn}
              disabled={
                !!!this.state.username ||
                this.props.userStore.isRecoveringPassword
              }
              onPress={recoverPasswordFn}>
              <View style={style.btnContainer}>
                <Text style={style.signIn}>SIGN IN</Text>
              </View>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </ScrollView>
    );
  }
}

const style = StyleSheet.create({
  rootContainer: {
    flex: 1,
    display: 'flex',
    justifyContent: 'flex-start',
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
    marginTop: variables.contentPadding * 2,
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
