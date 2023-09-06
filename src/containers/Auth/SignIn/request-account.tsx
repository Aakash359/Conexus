import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  KeyboardAvoidingView,
  ScrollView,
  Text,
  View,
  Alert,
  Image,
} from 'react-native';
import Toast from 'react-native-toast-message';
import variables from '../../../theme';
import {Field} from '../../../components/field';
import {windowDimensions} from '../../../common';
import {AppColors} from '../../../theme';
import NavigationService from '../../../navigation/NavigationService';
import {ActionButton} from '../../../components/action-button';
import {signUp} from '../../../services/ApiServices';
import {Strings} from '../../../common/Strings';
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

const {
  REGISTERED,
  REGISTERED_NOTIFY,
  FIRST_NAME,
  LAST_NAME,
  COMPANY,
  TITLE,
  E_MAIL,
  PHONE_NUMBER,
  HOW_KNOW,
  SUBMIT,
  API_ERROR,
} = Strings;

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
          Alert.alert(REGISTERED, REGISTERED_NOTIFY);
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
          text2: API_ERROR,
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
      <ScrollView keyboardShouldPersistTaps="handled">
        <KeyboardAvoidingView behavior="position" style={style.rootContainer}>
          <View style={style.content}>
            <View style={style.form}>
              <Image
                style={style.logo}
                source={require('../../../components/Images/conexus-logo.jpg')}
              />
              <View style={style.field}>
                <Field
                  placeholder={FIRST_NAME}
                  autoCapitalize="words"
                  onTextChange={setFirstName}
                  value={firstName}
                />
                {error ? <Text style={style.errorTxt}>{error}</Text> : null}
              </View>
              <View style={style.field}>
                <Field
                  placeholder={LAST_NAME}
                  autoCapitalize="words"
                  onTextChange={setLastName}
                  value={lastName}
                />
                {error ? <Text style={style.errorTxt}>{error}</Text> : null}
              </View>
              {props.route.params.userType == '1' && (
                <View style={style.field}>
                  <Field
                    placeholder={COMPANY}
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
                    placeholder={TITLE}
                    autoCapitalize="words"
                    onTextChange={setTitle}
                    value={title}
                  />
                  {error ? <Text style={style.errorTxt}>{error}</Text> : null}
                </View>
              )}
              <View style={style.field}>
                <Field
                  placeholder={E_MAIL}
                  autoCapitalize="none"
                  onTextChange={setEmail}
                  value={eMail}
                />
                {error ? <Text style={style.errorTxt}>{error}</Text> : null}
              </View>
              <View style={style.field}>
                <Field
                  placeholder={PHONE_NUMBER}
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
                  placeholder={HOW_KNOW}
                  autoCapitalize="words"
                  onTextChange={setHowHeard}
                  value={howHeard}
                />
                {error ? <Text style={style.errorTxt}>{error}</Text> : null}
              </View>
            </View>
            <ActionButton
              textColor={variables.blue}
              title={SUBMIT}
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
    height: 80,
    width: 80,
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
