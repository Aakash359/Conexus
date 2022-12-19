import React, {useState, useEffect} from 'react';
import {Text, StyleSheet, Image, View, Alert, ToastAndroid} from 'react-native';
import {useDispatch} from 'react-redux';
import {windowDimensions} from '../../common';
import {useNavigation} from '@react-navigation/native';
import Styles from '../../theme/styles';
import NavigationService from '../../navigation/NavigationService';
import variable, {AppColors} from '../../theme';
import {ActionButton} from '../../components/action-button';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {logoutRequest} from '../../redux/actions/userAction';
import theme from '../../theme';
import {getProfileService} from '../../services/ApiServices';

interface ProfileState {
  avatar: any;
  authToken: string;
}

const SafeAreaView = require('react-native').SafeAreaView;

const Profile: React.FC<ProfileState> = () => {
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();
  const [profileData, setProfileData] = useState({});
  const dispatch = useDispatch();

  useEffect(() => {
    navigation.addListener('focus', () => {
      getProfile();
    });
  }, []);

  const getProfile = async () => {
    try {
      const {data} = await getProfileService();
      setProfileData(data);
    } catch (error) {
      console.log('Error', error);
    }
  };

  const renderTitle = () => {
    if (profileData != {})
      return (
        <Text style={[Styles.cnxProfileViewSubtitleText, style.subTitleText]}>
          {profileData?.title}
        </Text>
      );
  };

  const onPressLogout = async () => {
    setLoading(true);
    await AsyncStorage.removeItem('authToken');
    const payload = {
      authToken: '',
    };
    setTimeout(() => {
      setLoading(false);
      dispatch(logoutRequest(payload));
      ToastAndroid.show('Logged out successfully!', ToastAndroid.SHORT);
    }, 1500);
  };

  const openEditProfile = (profileData: {error: any; user: any}) => {
    NavigationService.navigate('EditProfile', profileData);
  };

  return (
    <SafeAreaView style={style.container}>
      <View style={style.avatarContainer}>
        <View style={style.profileCircle}>
          <Image
            style={style.image}
            source={{
              uri: profileData.photoUrl,
            }}
          />
        </View>
      </View>
      <View style={style.detailsContainer}>
        <Text style={[Styles.cnxProfileViewTitleText, style.titleText]}>
          {profileData?.firstName} {profileData?.lastName}
        </Text>
        {renderTitle()}
        <View style={style.editView}>
          <ActionButton
            title="EDIT"
            customStyle={style.editEnable}
            customTitleStyle={{color: AppColors.blue, fontSize: 15}}
            onPress={() => openEditProfile(profileData)}
          />
        </View>
      </View>

      <View style={style.footer}>
        <ActionButton
          textColor={variable.blue}
          customTitleStyle={loading ? style.loadingTitle : style.title}
          customStyle={loading ? style.loadingBtn : style.logoutBtn}
          loading={loading}
          title="LOGOUT"
          onPress={() => onPressLogout()}
        />
      </View>
    </SafeAreaView>
  );
};

const style = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AppColors.baseGray,
  },
  editView: {
    marginTop: 30,
  },
  loadingBtn: {
    backgroundColor: AppColors.blue,
    width: windowDimensions.width * 0.5,
    justifyContent: 'center',
    alignSelf: 'center',
    height: 45,
    borderRadius: 28,
  },
  logoutBtn: {
    width: windowDimensions.width * 0.5,
    backgroundColor: AppColors.blue,
    justifyContent: 'center',
    alignSelf: 'center',
    height: 45,
    borderRadius: 28,
  },
  loadingTitle: {
    width: 0,
  },
  title: {
    color: theme.white,
    width: '100%',
    fontSize: 18,
    textAlign: 'center',
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
    justifyContent: 'center',
    backgroundColor: AppColors.white,
    height: 40,
    width: windowDimensions.width * 0.4,
    borderColor: AppColors.gray,
    borderWidth: 0.5,
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
