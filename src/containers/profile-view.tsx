import React from 'react';
import {Text, StyleSheet, View} from 'react-native';

import {Avatar, ActionButton, ScreenFooterButton} from '../components';
import {windowDimensions} from '../common';
import Styles from '../theme/styles';
import {UserStore} from '../stores';
import {ScreenType} from '../common/constants';
// import { Actions } from 'react-native-router-flux';

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

  return (
    <View>
      <View style={style.avatarContainer}>
        {/* <Avatar source={photoUrl} size={90} /> */}
      </View>
      <View style={style.detailsContainer}>
        <Text style={[Styles.cnxProfileViewTitleText, style.titleText]}>
          {/* {firstName} {lastName} */}
        </Text>
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
