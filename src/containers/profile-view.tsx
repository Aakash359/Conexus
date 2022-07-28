import React, {useState, useEffect} from 'react';
import {Text, StyleSheet, TouchableOpacity, View, Alert} from 'react-native';
import {Avatar} from '../components/avatar';
import {windowDimensions} from '../common';
import Styles from '../theme/styles';
import NavigationService from '../navigation/NavigationService';
import ScreenFooterButton from '../components/screen-footer-button';
import variable, {AppColors} from '../theme';
import {ActionButton} from '../components/action-button';
import {loginWithPass} from '../services/auth';
import {useSelector} from '../redux/reducers/index';

interface ProfileState {
  avatar: any;
}

const Profile: React.FC<ProfileState> = ({avatar}) => {
  const [loading, setLoading] = useState(false);

  const userInfo = useSelector(state => state.userReducer);

  console.log('Usergsxb==>', userInfo?.user?.title);

  const renderTitle = () => {
    const userInfo = useSelector(state => state.userReducer);
    if (userInfo) {
      if (userInfo?.user?.title) {
        return (
          <Text style={[Styles.cnxProfileViewSubtitleText, style.subTitleText]}>
            {userInfo?.user?.title}
          </Text>
        );
      }
    }
    return <View />;
  };

  // let {firstName, lastName, photoUrl} = this.props.userStore.user || {
  //   firstName: '',
  //   lastName: '',
  //   photoUrl: '',
  // };

  const openEditProfile = () => {
    NavigationService.navigate('EditProfile');
  };

  return (
    <View style={style.container}>
      {/* <TouchableOpacity onPress={openEditProfile}>
        <Text>hi</Text>
      </TouchableOpacity> */}
      <View style={style.avatarContainer}>
        <Avatar size={90} />
      </View>
      <View style={style.detailsContainer}>
        <Text style={[Styles.cnxProfileViewTitleText, style.titleText]}>
          {userInfo?.user?.firstName} {userInfo?.user?.lastName}
        </Text>
        {renderTitle()}
      </View>
      <View style={style.editFooter}>
        <ActionButton
          loading={loading}
          title="EDIT"
          customStyle={style.editEnable}
          customTitleStyle={{color: AppColors.blue, fontSize: 15}}
        />
      </View>

      <View style={style.footer}>
        <ActionButton
          textColor={variable.blue}
          loading={loading}
          title="LOGOUT"
          customStyle={style.btnEnable}
          // onPress={signInFn}
        />
      </View>
    </View>
  );
};

const style = StyleSheet.create({
  container: {
    flex: 1,
  },
  editFooter: {
    flex: 1,
    // marginTop: 10,
  },
  logoutBtn: {
    width: windowDimensions.width * 0.75,
  },
  editEnable: {
    alignSelf: 'center',
    backgroundColor: AppColors.white,
    height: 40,
    width: windowDimensions.width * 0.4,
    borderColor: AppColors.gray,
    borderWidth: 0.5,
  },
  btnEnable: {
    alignSelf: 'center',
    width: windowDimensions.width * 0.5,
  },
  footer: {
    right: 10,
    left: 10,
    position: 'absolute',
    bottom: 20,
  },

  editButton: {
    marginTop: 36,
  },

  avatarContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 36,
    paddingBottom: 18,
  },
  detailsContainer: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  footerContainer: {
    justifyContent: 'center',
    alignItems: 'center',

    paddingBottom: 36,
  },

  titleText: {
    marginBottom: 3,
  },

  subTitleText: {},
});

export default Profile;
