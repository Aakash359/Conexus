import React from 'react';
import {
  StyleSheet,
  KeyboardAvoidingView,
  Picker,
  ScrollView,
  Button,
  Text,
  View,
  TouchableOpacity,
} from 'react-native';

import variables from '../theme';
import {Field} from '../components/field';
import {windowDimensions} from '../common';
import {ScreenType, StoreType} from '../common/constants';
import {logger} from 'react-native-logs';
import {UserStore} from '../stores/userStore';
import {ConexusIcon} from '../components/conexus-icon';
import {AppColors, AppFonts} from '../theme';
import {Alert} from 'react-native';
const SafeAreaView = require('react-native').SafeAreaView;

interface RequestAccountProps {
  firstName?: string;
  lastName?: string;
  company?: string;
  title?: string;
  eMail?: string;
  phoneNumber?: string;
  howHeard?: string;
  userStore: UserStore;
  userType: string;
}
interface RequestAccountState {
  firstName: string;
  lastName: string;
  company: string;
  title: string;
  eMail: string;
  phoneNumber: string;
  howHeard: string;
  userType: string;
}
const log = logger.createLogger();
// @inject(StoreType.USER)
// @observer
const RequestAccount = () => {
  // constructor(props: RequestAccountProps, context?: any) {
  //   super(props, context);
  //   this.state = {
  //     firstName: '',
  //     lastName: '',
  //     company: '',
  //     title: '',
  //     eMail: '',
  //     phoneNumber: '',
  //     howHeard: '',
  //     userType: props.userType || '-1',
  //   };
  // }
  // setDefaultState() {
  //   this.setState({
  //     firstName: '',
  //     lastName: '',
  //     company: '',
  //     title: '',
  //     eMail: '',
  //     phoneNumber: '',
  //     howHeard: '',
  //     userType: this.props.userType || '-1',
  //   });
  // }

  // handleChange(name, value: any) {
  //   const v = value.nativeEvent as any;
  //   var stateObject = function () {
  //     var returnObj = {};
  //     returnObj[name] = value;
  //     return returnObj;
  //   };
  //   this.setState(stateObject);
  // }

  // componentWillMount() {
  //   this.setDefaultState();
  //   const {userStore} = this.props;
  // }

  // submitAccount = () => {
  //   const {userStore} = this.props;
  //   log.info('submit new account');
  //   const o = {
  //     firstName: this.state.firstName,
  //     lastName: this.state.lastName,
  //     company: this.state.company,
  //     title: this.state.title,
  //     eMail: this.state.eMail,
  //     phoneNumber: this.state.phoneNumber,
  //     howHeard: this.state.howHeard,
  //     isFacility: this.state.userType == '1',
  //   };

  // userStore.register(o).then(nextViewName => {
  //   log.info('Register container', nextViewName);
  //   if (nextViewName) {
  //     Alert.alert(
  //       'Thank You',
  //       'Thank you for your request. A Conexus Account Manager will be in touch with you shortly',
  //     );
  //     Actions[ScreenType.LOGIN]();
  //   }
  // });

  return (
    <SafeAreaView style={[{flex: 1, backgroundColor: AppColors.white}]}>
      <ScrollView keyboardShouldPersistTaps="always">
        <KeyboardAvoidingView behavior="position" style={style.rootContainer}>
          <View style={style.content}>
            <View style={style.form}>
              <ConexusIcon
                name="cn-logo"
                size={70}
                color={AppColors.blue}
                style={style.logo}
              />
              <View style={style.field}>
                <Field
                  placeholder="First Name"
                  autoCapitalize="none"
                  returnKeyType="go"
                  // onChange={this.handleChange.bind(this, 'firstName')}
                  last
                  inverse
                />
              </View>
              <View style={style.field}>
                <Field
                  placeholder="Last Name"
                  autoCapitalize="none"
                  returnKeyType="go"
                  // onChange={this.handleChange.bind(this, 'lastName')}
                  last
                  inverse
                />
              </View>
              {this.props.userType == '1' && (
                <View style={style.field}>
                  <Field
                    placeholder="Company"
                    autoCapitalize="none"
                    returnKeyType="go"
                    // onChange={handleChange('company')}
                    last
                    inverse
                  />
                </View>
              )}
              {this.props.userType == '1' && (
                <View style={style.field}>
                  <Field
                    placeholder="Title"
                    autoCapitalize="none"
                    returnKeyType="go"
                    // onChange={handleChange( 'title')}
                    last
                    inverse
                  />
                </View>
              )}
              <View style={style.field}>
                <Field
                  placeholder="E-Mail"
                  autoCapitalize="none"
                  returnKeyType="go"
                  // onChange={handleChange('eMail')}
                  last
                  inverse
                />
              </View>
              <View style={style.field}>
                <Field
                  placeholder="Phone Number"
                  autoCapitalize="none"
                  keyboardType="phone-pad"
                  returnKeyType="go"
                  // onChange={this.handleChange.bind(this, 'phoneNumber')}
                  last
                  inverse
                />
              </View>
              <View style={style.field}>
                <Field
                  placeholder="How did you hear about us?"
                  autoCapitalize="none"
                  returnKeyType="go"
                  // onChange={this.handleChange.bind(this, 'howHeard')}
                  last
                  inverse
                />
              </View>
            </View>
            <TouchableOpacity
              // disabled={
              //   !!!this.state.firstName ||
              //   !!!this.state.lastName ||
              //   !!!this.state.eMail ||
              //   !!!this.state.phoneNumber ||
              //   !!!this.state.howHeard
              // }
              onPress={this.submitAccount}>
              <View style={style.btn}>
                <Text style={style.submit}>SUBMIT</Text>
              </View>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </ScrollView>
    </SafeAreaView>
  );
};

const style = StyleSheet.create({
  hidden: {
    display: 'none',
  },
  rootContainer: {
    flex: 1,
    display: 'flex',
    justifyContent: 'flex-start',
  },
  field: {
    marginTop: 5,
  },
  submit: {
    justifyContent: 'center',
    fontSize: AppFonts.bodyTextLargeSize,
    alignSelf: 'center',
    color: AppColors.white,
  },
  picker: {
    backgroundColor: AppColors.white,
    borderRadius: 6,
    height: 40,
    flex: 0,
    width: 200,
  },
  content: {
    display: 'flex',
    justifyContent: 'space-around',
    paddingLeft: variables.contentPadding * 4,
    paddingRight: variables.contentPadding * 4,
  },

  logo: {
    alignSelf: 'center',
    marginBottom: 5,
  },

  title: {
    marginTop: variables.contentPadding * 2,
    marginBottom: variables.contentPadding * 2,
    textAlign: 'center',
  },

  btn: {
    alignSelf: 'center',
    justifyContent: 'center',
    borderRadius: 25,
    backgroundColor: AppColors.gray,
    height: windowDimensions.height * 0.06,
    width: windowDimensions.width * 0.5,
  },

  form: {
    paddingTop: 10,
    paddingBottom: 24,
    justifyContent: 'space-around',
  },

  container: {
    flex: 1,
    alignItems: 'stretch',
  },
});

export default RequestAccount;
