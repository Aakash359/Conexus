import React from 'react';
import {
  View,
  Text,
  ImageBackground,
  Image,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import {
  DrawerContentScrollView,
  DrawerItemList,
} from '@react-navigation/drawer';
import {ConexusIcon, Avatar} from '../components';
import {AppFonts, AppColors} from '.././theme';
import Ionicons from 'react-native-vector-icons/Ionicons';

export const AVATAR_ICON_SIZE = 45;

const CustomDrawer = props => {
  return (
    <View style={{flex: 1}}>
      <DrawerContentScrollView
        {...props}
        contentContainerStyle={{marginTop: 50}}>
        <ConexusIcon
          name="cn-logo"
          size={50}
          color={AppColors.blue}
          style={{marginRight: 20}}
        />
        <View style={styles.headerContainer}>
          <DrawerItemList {...props} />
        </View>
      </DrawerContentScrollView>
      <View style={styles.footerContainer}>
        <TouchableOpacity onPress={() => {}} style={{paddingVertical: 15}}>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Ionicons name="share-social-outline" size={22} />
            <View style={styles.chaoWrapper}>
              <Text
                style={[
                  styles.text,
                  {
                    fontSize: 8,
                    color: AppColors.mediumGray,
                    fontFamily: 'Roboto-Medium',
                  },
                ]}>
                Your Account Manager is
              </Text>
              <Text style={[styles.text, {color: AppColors.darkGrey}]}>
                Choua Lee
              </Text>
            </View>
            <Ionicons name="exit-outline" size={22} />
          </View>
        </TouchableOpacity>
        <View style={[styles.footerContainer]} />
        <TouchableOpacity onPress={() => {}} style={{paddingVertical: 15}}>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Ionicons name="exit-outline" size={22} />
            <Text style={styles.text}>Send Feedback</Text>
          </View>
        </TouchableOpacity>
        <View style={[styles.footerContainer, {padding: 10}]} />
        <TouchableOpacity onPress={() => {}}>
          <View
            style={{
              flexDirection: 'row',
            }}>
            <Ionicons
              name="exit-outline"
              size={22}
              style={{paddingVertical: 15}}
            />
            <Text style={[styles.text, {marginTop: 0}]}>
              Account Preference
            </Text>
            {/* <Avatar
              // source={selectedFacility.manager.acctManagerPhotoUrl}
              size={AVATAR_ICON_SIZE}
              style={styles.avatar}
            /> */}
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
  headerContainer: {
    flex: 1,
    backgroundColor: AppColors.white,
    paddingTop: 10,
  },
  footerContainer: {
    padding: 2,
    borderTopWidth: 1,
    borderTopColor: '#ccc',
    backgroundColor: AppColors.baseGray,
  },
  text: {
    fontSize: 15,
    fontFamily: 'Roboto-Medium',
    marginLeft: 35,
    fontWeight: 'bold',
    color: AppColors.blue,
  },
  screenTitle: {
    fontSize: 24,
    marginTop: 8,
    fontWeight: 'bold',
  },
});

export default CustomDrawer;
