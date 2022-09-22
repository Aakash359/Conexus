import React from 'react';
import {View, Text, Image, TouchableOpacity, StyleSheet} from 'react-native';
import {
  DrawerContentScrollView,
  DrawerItemList,
} from '@react-navigation/drawer';
import {AppColors} from '.././theme';
import Icons from 'react-native-vector-icons/Feather';
import NavigationService from '../navigation/NavigationService';
import {useSelector} from '../redux/reducers/index';

export const AVATAR_ICON_SIZE = 45;

const CustomDrawer = props => {
  const userInfo = useSelector(state => state.userReducer);
  const openProfile = () => {
    NavigationService.navigate('Profile');
  };

  const openFeedback = () => {
    NavigationService.navigate('AppFeedback');
  };
  const openChouaeLea = () => {
    NavigationService.navigate('AgentMessage');
  };
  return (
    <View style={{flex: 1}}>
      <DrawerContentScrollView
        {...props}
        contentContainerStyle={{marginTop: 50}}
      >
        <Image
          style={styles.logo}
          source={require('../components/Images/conexus-logo.jpg')}
        />
        <View style={styles.headerContainer}>
          <DrawerItemList {...props} />
        </View>
      </DrawerContentScrollView>
      <View style={styles.footerContainer}>
        <TouchableOpacity
          onPress={openChouaeLea}
          style={{paddingVertical: 15}}
          activeOpacity={0.8}
        >
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Image
              style={styles.image}
              source={require('../components/Images/bg.png')}
            />
            <View style={styles.chaoWrapper}>
              <Text
                style={[
                  styles.text,
                  {
                    fontSize: 8,
                    marginRight: 20,
                    color: AppColors.mediumGray,
                    fontFamily: 'Roboto-Medium',
                  },
                ]}
              >
                Your Account Manager is
              </Text>
              <Text style={[styles.text, {color: AppColors.mediumGray}]}>
                {userInfo?.user?.userFacilities?.[0]?.manager?.acctManagerName}
              </Text>
            </View>
            <Icons
              style={{
                justifyContent: 'flex-end',
                marginLeft: 60,
                color: AppColors.blue,
              }}
              name="message-square"
              size={22}
            />
          </View>
        </TouchableOpacity>
        <View style={[styles.footerContainer]} />
        <TouchableOpacity
          onPress={openFeedback}
          style={{paddingVertical: 20}}
          activeOpacity={0.8}
        >
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <View style={styles.circle}>
              <Icons
                style={{
                  marginTop: 15,
                  fontSize: 35,
                  color: AppColors.white,
                  bottom: 5,
                }}
                name="message-square"
                size={22}
              />
            </View>
            <Text style={[styles.text]}>Send Feedback</Text>
          </View>
        </TouchableOpacity>
        <View style={[styles.footerContainer, {padding: 10}]} />
        <TouchableOpacity
          onPress={openProfile}
          style={{paddingVertical: 15}}
          activeOpacity={0.8}
        >
          <View
            style={{flexDirection: 'row', alignItems: 'center', bottom: 10}}
          >
            <Image
              style={styles.image}
              source={{
                uri: userInfo?.user?.photoUrl,
              }}
            />
            <View style={styles.iconWrapper}>
              <Text style={[styles.text]}>Account Preference</Text>
              <Icons
                style={{color: AppColors.blue, marginLeft: 10, marginTop: 2}}
                name="settings"
                size={22}
              />
            </View>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    marginTop: 24,
  },
  chaoWrapper: {
    flexDirection: 'column',
  },
  iconWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  circle: {
    position: 'absolute',
    flexDirection: 'row',
    justifyContent: 'center',
    marginLeft: 5,
    width: 50,
    height: 50,
    borderRadius: 50 / 2,
    backgroundColor: AppColors.blue,
  },
  account: {
    fontSize: 18,
    marginTop: -30,
    fontFamily: 'Roboto-Medium',
    marginLeft: 70,
    fontWeight: 'bold',
    color: AppColors.blue,
  },
  image: {
    position: 'absolute',
    marginLeft: 5,
    width: 50,
    height: 50,
    borderRadius: 50 / 2,
  },
  headerContainer: {
    flex: 1,
    backgroundColor: AppColors.white,
    paddingTop: 10,
  },
  footerContainer: {
    padding: 2,
    paddingHorizontal: 10,
    borderTopWidth: 1,
    borderTopColor: '#ccc',
    backgroundColor: AppColors.baseGray,
  },
  text: {
    fontSize: 18,
    fontFamily: 'Roboto-Medium',
    marginLeft: 70,
    fontWeight: 'bold',
    color: AppColors.blue,
  },
  logo: {
    alignSelf: 'flex-start',
    color: AppColors.blue,
    left: 15,
    bottom: 10,
    height: 100,
    width: 100,
  },
});

export default CustomDrawer;
