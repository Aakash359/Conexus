import React from 'react';
import {StyleSheet, View, Text} from 'react-native';
import NavigationService from '../../../navigation/NavigationService';
import variables from '../../../theme';
import {Field} from '../../../components';
import {windowDimensions} from '../../../common';
import {ScreenType, StoreType} from '../../../common/constants';
import {ConexusIcon} from '../../../components/conexus-icon';
import {AppColors, AppFonts} from '../../../theme';
import {Alert, TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const SafeAreaView = require('react-native').SafeAreaView;
interface SelectAccountProps {
  accountType: string;
}
interface SelectAccountState {
  accountType: string;
}
const SelectAccount = () => {
  // export class SelectAccount extends React.Component<
  //   SelectAccountProps,
  //   SelectAccountState
  // > {

  // constructor(props: SelectAccountProps, context?: any) {
  //   super(props, context);
  //   this.state = {
  //     accountType: '-1',
  //   };
  // }
  // setDefaultState() {
  //   this.setState({
  //     accountType: '-1',
  //   });
  // }
  // handleChange(value: string) {
  //   this.setState({
  //     accountType: value,
  //   });
  // }
  // componentWillMount() {
  //   this.setDefaultState();
  // }
  const requestFacilityAccount = () => {
    // Actions[ScreenType.REQUEST_ACCOUNT]({userType: '1'});
    NavigationService.navigate('RequestAccount', {userType: '1'});
  };
  const requestCandidateAccount = () => {
    NavigationService.navigate('RequestAccount', {userType: '0'});
    // Actions[ScreenType.REQUEST_ACCOUNT]({userType: '0'});
  };

  return (
    <SafeAreaView style={[{flex: 1, backgroundColor: 'white'}]}>
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
          {/* <View style={style.picker} >
                                <Picker style={{height:40, backgroundColor:AppColors.white}}
                                    selectedValue={this.state.accountType}
                                    onValueChange={(itemValue, itemIndex) => {
                                        Actions[ScreenType.REQUEST_ACCOUNT]({ userType: itemValue})
                                    }
                                    }>
                                    <Picker.Item label='I am a ...' value="-1" />
                                    <Picker.Item label='Job Candidate' value="0" />
                                    <Picker.Item label='Facility' value="1" />
                                </Picker>
                            </View> */}
          <View style={style.picker}>
            <Text style={style.iam}>I am a...</Text>
          </View>
          <TouchableOpacity onPress={requestFacilityAccount}>
            <View style={style.btnContainer}>
              <Text style={style.facility}>FACILITY</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={requestCandidateAccount}>
            <View
              style={[style.btnContainer, {backgroundColor: AppColors.blue}]}>
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
    marginBottom: 5,
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
