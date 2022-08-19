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
import Toast from 'react-native-toast-message';
import Icon from 'react-native-vector-icons/Ionicons';
import {signUp} from '../../../services/authService';
import variables from '../../../theme';
import {Field} from '../../../components/field';
import {windowDimensions} from '../../../common';
import {ScreenType, StoreType} from '../common/constants';
import {logger} from 'react-native-logs';
import {ConexusIcon} from '../components/conexus-icon';
import {AppColors, AppFonts} from '../../../theme';
import NavigationService from '../../../navigation/NavigationService';
import {ActionButton} from '../../../components/action-button';

const SafeAreaView = require('react-native').SafeAreaView;
const eMailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;

interface RequestAccountProps {
  route: any;
  firstName?: string;
  lastName?: string;
  company?: string;
  title?: string;
  eMail?: string;
  phoneNumber?: string;
  howHeard?: string;
  userType: string;
}

const RequestAccount: React.FC<RequestAccountProps> = props => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [emailError, setEmailError] = useState(false);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [company, setCompany] = useState('');
  const [title, setTitle] = useState('');
  const [eMail, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [howHeard, setHowHeard] = useState('');
  const [userType, setUserType] = useState(props.route.params.userType || '-1');

  useEffect(() => {
    setDefaultState();
  }, []);

  const setDefaultState = () => {
    setUserType(props.userType || '-1');
  };

  const onEmailBlur = () => {
    if (
      eMail &&
      eMail.length &&
      (eMail.match(eMailRegex) || eMail.length == 10)
    ) {
      setEmailError(false);
    } else {
      setEmailError(true);
    }
  };
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
        const {data} = await signUp(payload);
        if (data.Success) {
          setLoading(false);
          NavigationService.goBack();
          Alert.alert(
            'Registered Successfully',
            'Thank you for your request. A Conexus Account Manager will be in touch with you shortly',
          );
          Toast.show({
            type: 'success',
            text2: data.description,
            visibilityTime: 2000,
            autoHide: true,
          });
          // onLogin(data, `email`);
        } else {
          setLoading(false);
          console.log('Error', data);
          Alert.alert('Error', data.description);
          Toast.show({
            type: 'error',
            text2: data.description,
            visibilityTime: 2000,
            autoHide: true,
          });
        }
      } catch (e) {
        setLoading(false);
        console.log('Error', error);
        // Alert.alert(error?.response?.data?.error?.description);
        Toast.show({
          type: 'error',
          text2: 'Something went wrong!',
          visibilityTime: 2000,
          autoHide: true,
        });
      }
    } else {
      onEmailBlur();
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
                {error ? <Text style={style.errorTxt}>{error}</Text> : null}
              </View>
              <View style={style.field}>
                <Field
                  placeholder="Last Name"
                  autoCapitalize="words"
                  onTextChange={setLastName}
                  value={lastName}
                />
                {error ? <Text style={style.errorTxt}>{error}</Text> : null}
              </View>
              {props.route.params.userType == '1' && (
                <View style={style.field}>
                  <Field
                    placeholder="Company"
                    autoCapitalize="words"
                    onTextChange={setCompany}
                    value={company}
                  />
                  {error ? <Text style={style.errorTxt}>{error}</Text> : null}
                </View>
              )}
              {props.route.params.userType == '1' && (
                <View style={style.field}>
                  <Field
                    placeholder="Title"
                    autoCapitalize="words"
                    onTextChange={setTitle}
                    value={title}
                  />
                  {error ? <Text style={style.errorTxt}>{error}</Text> : null}
                </View>
              )}
              <View style={style.field}>
                <Field
                  placeholder="E-Mail"
                  autoCapitalize="none"
                  onTextChange={setEmail}
                  value={eMail}
                  returnKeyType={'none'}
                />
                {error ? <Text style={style.errorTxt}>{error}</Text> : null}
              </View>
              <View style={style.field}>
                <Field
                  placeholder="Phone Number"
                  autoCapitalize="none"
                  keyboardType="phone-pad"
                  maxLength={12}
                  onTextChange={setPhoneNumber}
                  value={phoneNumber}
                />
                {error ? <Text style={style.errorTxt}>{error}</Text> : null}
              </View>
              <View style={style.field}>
                <Field
                  placeholder="How did you hear about us?"
                  autoCapitalize="words"
                  onTextChange={setHowHeard}
                  value={howHeard}
                />
                {error ? <Text style={style.errorTxt}>{error}</Text> : null}
              </View>
            </View>
            <ActionButton
              textColor={variables.blue}
              title="SUBMIT"
              loading={loading}
              disabled={
                firstName &&
                lastName &&
                company &&
                title &&
                eMail &&
                phoneNumber &&
                howHeard
                  ? loading
                  : 'false'
              }
              onPress={submitAccount}
              customTitleStyle={{color: AppColors.white, fontSize: 18}}
              customStyle={
                firstName &&
                lastName &&
                company &&
                title &&
                eMail &&
                phoneNumber &&
                howHeard
                  ? style.submitEnable
                  : style.submitDisable
              }
            />
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
  errorTxt: {
    fontSize: 12,
    color: AppColors.red,
    // fontFamily: AppFonts.h3,
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
  submitEnable: {
    alignSelf: 'center',
    width: windowDimensions.width * 0.5,
    backgroundColor: AppColors.blue,
  },
  submitDisable: {
    alignSelf: 'center',
    width: windowDimensions.width * 0.5,
    backgroundColor: AppColors.gray,
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
