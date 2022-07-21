import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  KeyboardAvoidingView,
  ScrollView,
  Button,
  Text,
  View,
  Alert,
  TouchableOpacity,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {signUp} from '../../../services/auth';
import variables from '../../../theme';
import {Field} from '../../../components/field';
import {windowDimensions} from '../../../common';
import {ScreenType, StoreType} from '../common/constants';
import {logger} from 'react-native-logs';
import {ConexusIcon} from '../components/conexus-icon';
import {AppColors, AppFonts} from '../../../theme';
import NavigationService from '../../../navigation/NavigationService';

const SafeAreaView = require('react-native').SafeAreaView;
const eMailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;

interface RequestAccountProps {
  firstName?: string;
  lastName?: string;
  company?: string;
  title?: string;
  eMail?: string;
  phoneNumber?: string;
  howHeard?: string;
  userType: string;
}

const log = logger.createLogger();

const RequestAccount: React.FC<RequestAccountProps> = props => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [company, setCompany] = useState('');
  const [title, setTitle] = useState('');
  const [eMail, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [howHeard, setHowHeard] = useState('');
  const [userType, setUserType] = useState(props.userType || '-1');

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

  const submitAccount = async () => {
    if (
      firstName &&
      firstName.length &&
      lastName &&
      lastName.length &&
      company &&
      company.length &&
      title &&
      title.length &&
      eMail.match(eMailRegex) &&
      phoneNumber &&
      phoneNumber.length &&
      howHeard &&
      howHeard.length
    ) {
      const payload = {
        firstName,
        lastName,
        company,
        title,
        eMail,
        phoneNumber,
        howHeard,
        isFacility: userType == '1',
      };
      try {
        setLoading(true);
        // setError(false);
        const {data} = await signUp(payload);
        console.log('Data====>', data);
        NavigationService.navigate('LoginScreen');
        if (data.success) {
          console.log('Yes yanah tak Aa raha hai');

          // setLoading(false);

          // onLogin(data, `email`);
        } else {
          setLoading(false);
          setError(data.message);
        }
      } catch (e) {
        console.log('Data====>', e);
        setLoading(false);
      }
    } else {
      Alert.alert('error');
      // onEmailBlur();
      // onPasswordBlur();
    }
  };

  return (
    <SafeAreaView style={[{flex: 1, backgroundColor: AppColors.white}]}>
      <ScrollView keyboardShouldPersistTaps="always">
        <KeyboardAvoidingView behavior="position" style={style.rootContainer}>
          <View style={style.content}>
            <View style={style.form}>
              {/* <ConexusIcon
                name="cn-logo"
                size={70}
                color={AppColors.blue}
                style={style.logo}
              /> */}
              <Icon
                name="leaf"
                size={100}
                color={AppColors.blue}
                style={style.logo}
              />
              <View style={style.field}>
                <Field
                  placeholder="First Name"
                  autoCapitalize="words"
                  onTextChange={setFirstName}
                  value={firstName}
                />
              </View>
              <View style={style.field}>
                <Field
                  placeholder="Last Name"
                  autoCapitalize="words"
                  onTextChange={setLastName}
                  value={lastName}
                />
              </View>
              {/* {this.props.userType == '1' && ( */}
              <View style={style.field}>
                <Field
                  placeholder="Company"
                  autoCapitalize="words"
                  onTextChange={setCompany}
                  value={company}
                />
              </View>
              {/* )} */}
              {/* {this.props.userType == '1' && ( */}
              <View style={style.field}>
                <Field
                  placeholder="Title"
                  autoCapitalize="words"
                  onTextChange={setTitle}
                  value={title}
                />
              </View>
              {/* )} */}
              <View style={style.field}>
                <Field
                  placeholder="E-Mail"
                  autoCapitalize="none"
                  onTextChange={setEmail}
                  value={eMail}
                  returnKeyType={'none'}
                />
              </View>
              <View style={style.field}>
                <Field
                  placeholder="Phone Number"
                  autoCapitalize="none"
                  keyboardType="phone-pad"
                  onTextChange={setPhoneNumber}
                  value={phoneNumber}
                />
              </View>
              <View style={style.field}>
                <Field
                  placeholder="How did you hear about us?"
                  autoCapitalize="words"
                  onTextChange={setHowHeard}
                  value={howHeard}
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
              onPress={submitAccount}>
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
    paddingVertical: 2,
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
