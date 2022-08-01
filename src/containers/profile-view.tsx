import React, {useState} from 'react';
import {Text, StyleSheet, Image, View, Alert} from 'react-native';
import {Avatar} from '../components/avatar';
import {windowDimensions} from '../common';
import Styles from '../theme/styles';
import NavigationService from '../navigation/NavigationService';
import variable, {AppColors} from '../theme';
import {ActionButton} from '../components/action-button';
import {useSelector} from '../redux/reducers/index';
import {useDispatch} from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {UserModel} from '../redux/actions/userAction';

interface ProfileState {
  avatar: any;
}

const Profile: React.FC<ProfileState> = () => {
  const [loading, setLoading] = useState(false);
  const userInfo = useSelector(state => state.userReducer);
  const renderTitle = () => {
    const userInfo = useSelector(state => state.userReducer);
    console.log('UserInfo====>', userInfo);

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

  const onPressLogout = async () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      AsyncStorage.clear();
      NavigationService.navigate('LoginScreen');
      return {
        status: 'success',
        message: 'You are logged out',
      };
    }, 1500);
  };

  const openEditProfile = (userInfo: {error: any; user: UserModel}) => {
    NavigationService.navigate('EditProfile', userInfo);
  };

  return (
    <View style={style.container}>
      <View style={style.avatarContainer}>
        <View style={style.profileCircle}>
          <Image
            style={style.image}
            source={{
              uri: userInfo?.user?.photoUrl,
            }}
          />
        </View>
      </View>
      <View style={style.detailsContainer}>
        <Text style={[Styles.cnxProfileViewTitleText, style.titleText]}>
          {userInfo?.user?.firstName} {userInfo?.user?.lastName}
        </Text>
        {renderTitle()}
        <View style={style.editView}>
          <ActionButton
            title="EDIT"
            customStyle={style.editEnable}
            customTitleStyle={{color: AppColors.blue, fontSize: 15}}
            onPress={() => openEditProfile(userInfo)}
          />
        </View>
      </View>

      <View style={style.footer}>
        <ActionButton
          textColor={variable.blue}
          loading={loading}
          title="LOGOUT"
          customStyle={style.btnEnable}
          onPress={onPressLogout}
        />
      </View>
    </View>
  );
};

const style = StyleSheet.create({
  container: {
    flex: 1,
  },
  editView: {
    marginTop: 30,
  },
  profileCircle: {
    height: 100,
    flexDirection: 'row',
    alignSelf: 'center',
    width: 100,
    borderColor: AppColors.blue,
    borderRadius: 100 / 2,
  },
  image: {
    position: 'absolute',
    alignSelf: 'center',
    marginTop: 0,
    borderWidth: 2,
    borderColor: AppColors.blue,
    width: 100,
    height: 100,
    borderRadius: 100 / 2,
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
  titleText: {
    marginBottom: 3,
  },
  subTitleText: {},
});

export default Profile;
