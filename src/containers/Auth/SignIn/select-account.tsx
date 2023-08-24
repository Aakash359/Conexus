import React, {useState, useEffect} from 'react';
import {StyleSheet, View, Text, Image} from 'react-native';
import NavigationService from '../../../navigation/NavigationService';
import variables from '../../../theme';
import {windowDimensions} from '../../../common';
import {AppColors, AppFonts} from '../../../theme';
import {TouchableOpacity} from 'react-native';

const SafeAreaView = require('react-native').SafeAreaView;

const SelectAccount = () => {
  const [accountType, setAccountType] = useState(-1);

  useEffect(() => {
    setAccountType(-1);
  });
  const requestFacilityAccount = () => {
    NavigationService.navigate('RequestAccount', {userType: '1'});
  };
  const requestCandidateAccount = () => {
    NavigationService.navigate('RequestAccount', {userType: '0'});
  };

  return (
    <SafeAreaView style={[{flex: 1, backgroundColor: 'white'}]}>
      <View style={style.content}>
        <View style={style.form}>
          <Image
            style={style.logo}
            source={require('../../../components/Images/conexus-logo.jpg')}
          />
          <View style={style.picker}>
            <Text style={style.iam}>I am a...</Text>
          </View>
          <TouchableOpacity
            onPress={requestFacilityAccount}
            activeOpacity={0.8}
          >
            <View style={style.btnContainer}>
              <Text style={style.facility}>FACILITY</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={requestCandidateAccount}
            activeOpacity={0.8}
          >
            <View
              style={[style.btnContainer, {backgroundColor: AppColors.blue}]}
            >
              <Text style={style.facility}>JOB CANDIDATE</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const style = StyleSheet.create({
  btn: {
    alignSelf: 'center',
    width: windowDimensions.width * 0.75,
  },
  iam: {
    fontSize: 30,
    fontWeight: 'bold',
  },
  btnContainer: {
    marginTop: 20,
    backgroundColor: AppColors.blue,
    borderRadius: 22,
    justifyContent: 'center',
    paddingHorizontal: 10,
    height: 45,
  },
  facility: {
    color: AppColors.white,
    fontSize: AppFonts.bodyTextLargeSize,
    textAlign: 'center',
    fontFamily: AppFonts.family.fontFamily,
  },
  hidden: {
    display: 'none',
  },
  rootContainer: {
    flex: 1,
    display: 'flex',
    justifyContent: 'flex-start',
  },
  field: {
    padding: 5,
    height: 40,
  },
  picker: {
    backgroundColor: AppColors.white,
    borderRadius: 6,
    height: 40,
    flex: 0,
    width: 200,
    marginTop: 15,
    alignSelf: 'center',
    justifyContent: 'space-around',
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

export default SelectAccount;
