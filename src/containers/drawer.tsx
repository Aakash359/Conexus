import React from 'react';
// import {inject, observer} from 'mobx-react';
import {Button} from 'native-base';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ViewProperties,
} from 'react-native';
// import {Actions} from 'react-native-router-flux';
// import codePush from 'react-native-code-push'
import _ from 'lodash';
import {logger} from 'react-native-logs';
import {callPhone} from '../common';
import {ScreenType} from '../common/constants';
import {Avatar, Circle, ConexusIcon, ConexusIconButton} from '../components';
import {UserStore} from '../stores/userStore';
import variables from '../theme';
import {AppColors, AppFonts} from '../theme';

export const CONEXUS_DRAWER_WIDTH = 300;
export const AVATAR_ICON_SIZE = 45;

interface Props extends ViewProperties {
  userStore?: UserStore;
}

interface State {
  tempScene: string;
  version: string;
}
const log = logger.createLogger();
// @inject('userStore')
// @observer
export class Drawer extends React.Component<Props, State> {
  get activeMenuItem(): string {
    switch (this.state.tempScene || Actions.prevScene.toString()) {
      case ScreenType.FACILITIES.CATALOG:
        return ScreenType.FACILITIES.CATALOG;

      case ScreenType.MESSAGE_CENTER.CONVERSATION_LIST:
        return ScreenType.MESSAGE_CENTER.CONVERSATION_LIST;

      case ScreenType.MESSAGE_CENTER.NURSE_CONVERSATION_LIST:
        return ScreenType.MESSAGE_CENTER.NURSE_CONVERSATION_LIST;

      case ScreenType.MESSAGE_CENTER.CONVERSATION:
        return ScreenType.MESSAGE_CENTER.CONVERSATION;

      default:
        return this.props.userStore.homeView;
    }
  }

  constructor(props: Props, state: State) {
    super(props, state);
    const homeView = this.props.userStore.homeView;

    this.state = {
      tempScene: undefined,
      version: '',
    };

    // Actions.drawerOpen = _.wrap((drawerOpen: () => any) => {
    //   this.forceUpdate();
    //   //drawerOpen();
    // }, Actions.drawerOpen);
  }
  componentWillMount() {
    // codePush.getUpdateMetadata().then((metadata) => {
    //     log.info("META", metadata)
    //     if (metadata)
    //         this.setState({ version: `${metadata.appVersion}.${metadata.label}` })
    //     else
    //         this.setState({ version: `#${metadata.appVersion}` })
    // })
  }
  _renderMenuItem(title: string, selected: boolean, onPress: () => any) {
    return selected ? (
      <Button primary style={styles.menuButton} onPress={onPress}>
        <Text style={styles.menuButtonTextInverse}>{title}</Text>
      </Button>
    ) : (
      <Button transparent style={styles.menuButton} onPress={onPress}>
        <Text style={styles.menuButtonText}>{title}</Text>
      </Button>
    );
  }

  _handleMenuItemSelection(screenName: string, parameters: any = {}) {
    this.setState({
      tempScene: screenName,
    });

    // Actions[screenName](parameters);

    setTimeout(() => {
      this.setState({tempScene: undefined});
    }, 500);
  }

  _callAgent() {
    const selectedFacility = this.props.userStore.selectedFacility;

    const args = {
      number: selectedFacility.manager.acctManagerPhone,
      prompt: false,
    };

    if (!!args.number) {
      callPhone(args).catch(console.error);
    }
  }

  _sendAgentMessage() {
    // Actions.drawerClose();
    setTimeout(
      Actions[ScreenType.FACILITIES.AGENT_MESSAGE_MODAL].bind(this),
      400,
    );
  }

  _sendAppFeedback() {
    // Actions.drawerClose();
    // setTimeout(
    //   Actions[ScreenType.FACILITIES.APP_FEEDBACK_MODAL].bind(this),
    //   400,
    // );
  }

  render() {
    const user = this.props.userStore.user;
    const selectedFacility = this.props.userStore.selectedFacility;
    const homeView = this.props.userStore.homeView;
    const isFacilityUser = this.props.userStore.isFacilityUser;
    log.info('Version: ', this.state.version);
    return (
      <View key="drawer-root" style={styles.container}>
        <View key="header" style={styles.closeRow}>
          <ConexusIcon
            name="cn-logo"
            size={80}
            color={AppColors.blue}
            style={styles.logo}
            onPress={() => this.forceUpdate()}
          />
          <Button
            style={styles.closeButton}
            transparent
            // onPress={Actions.drawerClose}
          >
            <ConexusIcon
              name="cn-x"
              color={AppColors.blue}
              size={18}
              style={styles.closeIcon}
            />
          </Button>
        </View>

        {!!user && (
          <View key="items-container" style={styles.itemsContainer}>
            {isFacilityUser &&
              this._renderMenuItem(
                'Review Candidates',
                this.activeMenuItem === homeView,
                this._handleMenuItemSelection.bind(this, homeView),
              )}
            {!isFacilityUser &&
              this._renderMenuItem(
                'Review Interviews',
                this.activeMenuItem === homeView,
                this._handleMenuItemSelection.bind(this, homeView),
              )}
            {isFacilityUser &&
              this._renderMenuItem(
                'Interview Questions',
                this.activeMenuItem === ScreenType.FACILITIES.CATALOG,
                this._handleMenuItemSelection.bind(
                  this,
                  ScreenType.FACILITIES.CATALOG,
                ),
              )}
            {isFacilityUser &&
              this._renderMenuItem(
                'Message Center',
                this.activeMenuItem ===
                  ScreenType.MESSAGE_CENTER.CONVERSATION_LIST,
                this._handleMenuItemSelection.bind(
                  this,
                  ScreenType.MESSAGE_CENTER.CONVERSATION_LIST,
                ),
              )}
            {!isFacilityUser &&
              this._renderMenuItem(
                'Message Center',
                this.activeMenuItem ===
                  ScreenType.MESSAGE_CENTER.NURSE_CONVERSATION_LIST,
                this._handleMenuItemSelection.bind(
                  this,
                  ScreenType.MESSAGE_CENTER.NURSE_CONVERSATION_LIST,
                ),
              )}
            {/* {this._renderMenuItem('Device Information', activeMenuItem === ScreenType.DEVICE_INFO_LIGHTBOX, this._handleMenuItemSelection.bind(this, ScreenType.DEVICE_INFO_LIGHTBOX))} */}
          </View>
        )}

        {!!selectedFacility && (
          <View
            key="acccount-manager-container"
            style={[styles.avatarRow, {paddingRight: 6}]}>
            <Avatar
              source={selectedFacility.manager.acctManagerPhotoUrl}
              size={AVATAR_ICON_SIZE}
              style={styles.avatar}
            />
            <View style={styles.avatarRowTextContainer}>
              <Text style={styles.avatarRowIntoTitle}>
                Your account manager is
              </Text>
              <Text style={styles.avatarRowTitle}>
                {selectedFacility.manager.acctManagerName}
              </Text>
            </View>
            <View style={[styles.avatarRowActionContainer, {paddingTop: 12}]}>
              {!!selectedFacility.manager.acctManagerPhone && (
                <ConexusIconButton
                  iconName="cn-phone"
                  iconSize={16}
                  onPress={this._callAgent.bind(this)}
                  style={styles.avatarRowActionItem}
                />
              )}
              <ConexusIconButton
                iconName="cn-chat-bubble-1"
                iconSize={16}
                onPress={this._sendAgentMessage.bind(this)}
                style={styles.avatarRowActionItem}
              />
            </View>
          </View>
        )}

        {!!selectedFacility && (
          <TouchableOpacity
            key="app-feedback-container"
            style={[styles.avatarRow]}
            onPress={this._sendAppFeedback.bind(this)}>
            <Circle size={AVATAR_ICON_SIZE} color={AppColors.blue}>
              <ConexusIcon
                name="cn-chat-bubble-1"
                size={24}
                color={AppColors.white}
                style={styles.avatar}
              />
            </Circle>
            <View style={styles.avatarRowTextContainer}>
              <Text style={styles.avatarRowTitleTouchable}>Send Feedback</Text>
            </View>
          </TouchableOpacity>
        )}

        {!!user && (
          <TouchableOpacity
            key="account-preferences-container"
            style={[styles.avatarRow, {paddingRight: 6, paddingBottom: 24}]}
            // onPress={() => {
            //   Actions.drawerClose();
            //   Actions[ScreenType.PROFILE]();
            // }}
          >
            <Avatar
              source={user.photoUrl}
              size={AVATAR_ICON_SIZE}
              style={styles.avatar}
            />
            <View style={styles.avatarRowTextContainer}>
              <Text style={styles.avatarRowTitleTouchable}>
                Account Preferences
              </Text>
            </View>
            <View style={[styles.avatarRowActionContainer]}>
              <ConexusIcon
                name="cn-cog"
                size={16}
                color={AppColors.blue}
                style={styles.avatarRowActionItem}
              />
            </View>
          </TouchableOpacity>
        )}
        <View style={styles.versionRow}>
          <Text style={styles.versionText}>Ver: {this.state.version}</Text>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    backgroundColor: variables.white,
  },
  logo: {
    flex: 1,
    padding: 30,
  },
  closeRow: {
    paddingTop: 16,
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  closeButton: {
    marginTop: 20,
    marginRight: 20,
  },
  closeIcon: {},
  itemsContainer: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'flex-start',
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 32,
  },
  menuButton: {
    width: '100%',
    height: 42,
    marginBottom: 8,
  },

  menuButtonText: {
    ...AppFonts.drawerItemButtonText,
    textAlign: 'center',
    paddingLeft: 8,
    position: 'relative',
    top: 2,
  },

  menuButtonTextInverse: {
    ...AppFonts.drawerItemButtonTextInverse,
    textAlign: 'center',
    paddingLeft: 8,
    position: 'relative',
    top: 2,
  },
  versionRow: {
    position: 'relative',
    zIndex: 10,
    bottom: 2,
    right: 2,
    backgroundColor: AppColors.baseGray,
  },
  versionText: {
    ...AppFonts.bodyTextXtraXtraSmall,
    textAlign: 'right',
    color: AppColors.darkBlue,
    marginBottom: 10,
  },
  avatarRow: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: AppColors.baseGray,
    borderColor: AppColors.lightBlue,
    borderTopWidth: 1,
  },

  avatarRowTextContainer: {
    paddingLeft: 12,
  },

  avatarRowIntoTitle: {
    ...AppFonts.bodyTextXtraXtraSmall,
  },

  avatar: {},

  avatarRowTitleTouchable: {
    fontFamily: variables.titleFontfamily,
    fontSize: 16,
    fontWeight: '500',
    color: variables.blue,
  },
  avatarRowTitle: {
    fontFamily: variables.titleFontfamily,
    fontSize: 16,
    fontWeight: '500',
    color: variables.darkBlue,
  },

  avatarRowActionContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
  },

  avatarRowActionItem: {
    padding: 16,
    alignSelf: 'flex-end',
  },
});

export default Drawer;
