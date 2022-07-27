import React from 'react';
import {Text, StyleSheet, TouchableOpacity, View} from 'react-native';

import {Avatar, ActionButton, ScreenFooterButton} from '../components';
import {windowDimensions} from '../common';
import Styles from '../theme/styles';
import NavigationService from '../navigation/NavigationService';

interface ProfileState {
  avatar: any;
}

const Profile: React.FC<ProfileState> = ({avatar}) => {
  // renderTitle() {
  //   if (this.props.userStore.user) {
  //     let {title} = this.props.userStore.user;

  //     if (title) {
  //       return (
  //         <Text style={[Styles.cnxProfileViewSubtitleText, style.subTitleText]}>
  //           {title}
  //         </Text>
  //       );
  //     }
  //   }

  //   return <View />;
  // }

  // let {firstName, lastName, photoUrl} = this.props.userStore.user || {
  //   firstName: '',
  //   lastName: '',
  //   photoUrl: '',
  // };

  const openEditProfile = () => {
    alert('HI');
    NavigationService.navigate('EditProfile');
  };

  return (
    <View>
      <TouchableOpacity onPress={openEditProfile}>
        <Text>hi</Text>
      </TouchableOpacity>

      <View style={style.avatarContainer}>
        {/* <Avatar source={photoUrl} size={90} /> */}
      </View>
      <View style={style.detailsContainer}>
        {/* {this.renderTitle()} */}
        {/* <ActionButton smallSecondary title="Edit" 
                    // onPress={Actions[ScreenType.PROFILE_EDIT]
                    // } 
                    style={style.editButton} /> */}
      </View>
      {/* <ScreenFooterButton
        title="Logout"
        // onPress={this.props.userStore.logout}
      /> */}
    </View>
  );
};

const style = StyleSheet.create({
  logoutBtn: {
    width: windowDimensions.width * 0.75,
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
