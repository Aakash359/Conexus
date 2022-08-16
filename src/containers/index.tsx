import React from 'react';
// import {Icon, Root} from 'native-base';
import {StyleSheet, DeviceEventEmitter, TouchableOpacity} from 'react-native';
// import {
//   Drawer,
//   Lightbox,
//   Modal,
//   Overlay,
//   Router,
//   Scene,
//   Stack,
//   Tabs,
//   Actions,
// } from 'react-native-router-flux';
// import Drawer from 'react-native-drawer';
// import {onPatch} from 'mobx-state-tree';

import {ScreenType} from '../common/constants';
import {ConexusIcon, Circle} from '../components';
import {ContentListModal} from '../containers/content-list-modal';
import {
  CONEXUS_DRAWER_WIDTH,
  Drawer as DrawerContent,
} from '../containers/drawer';
import {UserStore, ConversationStore, DeviceStore} from '../stores';

import {
  AgentMessageModal,
  AppFeedbackModal,
  HcpDetailContainer,
  CatalogQuestionContainer,
  CatalogSectionContainer,
  CatalogContainer,
  NeedsContainer,
  // ReviewContainer,
  SchedulingContainer,
  ScheduleAvailabilityContainer,
} from '../containers/facility';
import {ReviewContainer} from '../containers/facility/review/review-container';
import {
  ConversationContainer,
  FacilityMessageCenterContainer,
  NurseMessageCenterContainer,
} from './message-center';

import {ForgotPassword} from '../containers/forgot-password';
import {ImageGallery} from '../containers/image-gallery';
import {IncomingCall} from '../containers/incoming-call';
import {Login} from '../containers/login';
import {NurseHome, NurseInterview} from '../containers/nurse';
import {EditProfile} from '../containers/profile-edit';
import {Profile} from '../containers/profile-view';
import {RequestAccount} from '../containers/request-account';
import {SelectAccount} from '../containers/select-account';
import {
  ContactCandidateLightbox,
  RadioListLightbox,
  YesNoLightbox,
  DeviceInfoLightbox,
  ContentLightbox,
  HcpPhoneCallLightbox,
  VideoPlaybackLightbox,
  VideoRecorderLightbox,
  VideoCallLightbox,
  AnswerRatingsLightbox,
  MakeOfferLightbox,
  AudioPlayerLightbox,
} from '../lightboxes';

import variables, {AppColors, AppFonts} from '../theme';
import {CatalogVideoContainer} from './facility/question-catalog/catalog-video-container';
import {logger} from 'react-native-logs';

interface IAppRouterProps {
  userStore?: UserStore;
  conversationStore?: typeof ConversationStore.Type;
  deviceStore?: DeviceStore;
}
interface IAppRouterState {}
const getTabIconColor = (focused: boolean) => {
  return focused ? AppColors.blue : AppColors.darkBlue;
};

const preventBackButtonScenes = [
  ScreenType.CALL,
  ScreenType.FACILITIES.REVIEW_HOME,
  ScreenType.NURSES.HOME,
  ScreenType.LOGIN,
  ScreenType.NURSES.INTERVIEW,
];
const log = logger.createLogger();

export class AppRouter extends React.Component<
  IAppRouterProps,
  IAppRouterState
> {
  constructor(props: IAppRouterProps, state: IAppRouterState) {
    super(props, state);

    this.state = {};
    onPatch(props.conversationStore, patch => {
      if (patch.path === '/unreadCount') {
        this.forceUpdate();
      }
    });
  }

  backHandler() {
    if (preventBackButtonScenes.indexOf(Actions.currentScene) > -1) {
      log.info('Prevent back handler for scene ' + Actions.currentScene);
      return false;
    }
    log.info('Allow back handler for scene ' + Actions.currentScene);
    Actions.pop();
    return true;
  }

  renderMessageCenterButton() {
    const userStore = this.props.userStore;
    const conversationStore = this.props.conversationStore;
    const action = userStore.isFacilityUser
      ? ScreenType.MESSAGE_CENTER.CONVERSATION_LIST
      : ScreenType.MESSAGE_CENTER.NURSE_CONVERSATION_LIST;

    return (
      <TouchableOpacity
        style={{marginRight: 12, padding: 12}}
        onPress={Actions[action]}>
        {/* <ConexusIcon color={AppColors.blue} size={20} name="cn-chat-bubble-2" /> */}
        {conversationStore.unreadCount > 0 && (
          <Circle
            size={8}
            color={AppColors.red}
            style={{position: 'absolute', right: 12, top: 20}}
          />
        )}
      </TouchableOpacity>
    );
  }

  _router: any = null;

  renderDefaultRouter() {
    const menuicon = () => (
      <Icon
        name="menu"
        color={AppColors.blue}
        ios="ios-menu"
        android="md-menu"
      />
    );
    if (this._router) {
      return this._router;
    }

    return (
      <Router
        key="router"
        // wrapBy={observer}
        backAndroidHandler={this.backHandler}>
        <Overlay key="overlay" component={undefined}>
          <Modal
            hideNavBar
            key="modal"
            backButtonTintColor={AppColors.blue}
            component={undefined}>
            {/* <Lightbox key="root"> */}
            <Scene
              key={ScreenType.LOGIN}
              backButtonTintColor={AppColors.blue}
              component={Login}
              hideNavBar={true}
              navigationBarStyle={style.navigationBarStyleTransparent}
              title=""
            />
            <Scene
              key={ScreenType.FORGOT_PASSWORD}
              backButtonTintColor={AppColors.blue}
              component={ForgotPassword}
              navigationBarStyle={style.navigationBarStyleTransparent}
              titleStyle={style.titleStyle}
              back
              backTitle="Sign In"
            />
            <Scene
              key={ScreenType.WALKTHROUGH}
              backButtonTintColor={AppColors.blue}
              component={EditProfile}
            />
            <Scene
              key={ScreenType.PROFILE}
              backButtonTintColor={AppColors.blue}
              title="Your Profile"
              titleStyle={style.titleStyle}
              back
              backTitle="Back"
              component={Profile}
              navigationBarStyle={style.navigationBarStyleWhite}
            />
            <Scene
              key={ScreenType.PROFILE_EDIT}
              backButtonTintColor={AppColors.blue}
              title="Edit Your Profile"
              titleStyle={style.titleStyle}
              back
              backTitle="Back"
              component={EditProfile}
              navigationBarStyle={style.navigationBarStyleWhite}
            />
            <Scene
              key={ScreenType.SELECT_ACCOUNT}
              backButtonTintColor={AppColors.blue}
              title="Account Type"
              titleStyle={style.titleStyle}
              back
              backTitle="Login"
              component={SelectAccount}
              navigationBarStyle={style.navigationBarStyleWhite}
            />
            <Scene
              key={ScreenType.REQUEST_ACCOUNT}
              backButtonTintColor={AppColors.blue}
              title="Request Account"
              titleStyle={style.titleStyle}
              back
              backTitle="Type"
              component={RequestAccount}
              navigationBarStyle={style.navigationBarStyleWhite}
            />
            <Drawer
              hideNavBar
              key={ScreenType.DRAWER}
              contentComponent={DrawerContent}
              drawerIcon={menuicon}
              drawerWidth={CONEXUS_DRAWER_WIDTH}
              component={undefined}>
              <Scene
                key="tabbar"
                swipeEnabled
                showLabel={true}
                tabBarPosition="bottom"
                tabBarStyle={{backgroundColor: AppColors.white}}
                tabStyle={{backgroundColor: 'white'}}
                labelStyle={{...AppFonts.tabLabelText}}
                activeTintColor={AppColors.blue}
                inactiveBackgroundColor="rgba(255, 255, 255, 1)">
                <Stack
                  key="review_tab"
                  title="Positions"
                  tabBarLabel="Review"
                  icon={({focused}) => {
                    return (
                      <ConexusIcon
                        color={getTabIconColor(focused)}
                        size={16}
                        name="cn-review"
                      />
                    );
                  }}>
                  <Scene
                    key={ScreenType.FACILITIES.REVIEW_HOME}
                    backButtonTintColor={AppColors.blue}
                    component={ReviewContainer}
                    title="Review Candidates"
                    renderRightButton={this.renderMessageCenterButton.bind(
                      this,
                    )}
                  />
                </Stack>
              </Scene>

              {/* <Scene key="drawer-scenes" component={undefined}> */}
              {/* <Tabs
                    key="tabbar"
                    swipeEnabled
                    showLabel={true}
                    tabBarPosition="bottom"
                    tabBarStyle={{backgroundColor: AppColors.white}}
                    tabStyle={{backgroundColor: 'white'}}
                    labelStyle={{...AppFonts.tabLabelText}}
                    activeTintColor={AppColors.blue}
                    inactiveBackgroundColor="rgba(255, 255, 255, 1)"
                    >
                      <Stack
                        key="review_tab"
                        title="Positions"
                        tabBarLabel="Review"
                        icon={({focused}) => {
                          return (
                            <ConexusIcon
                              color={getTabIconColor(focused)}
                              size={16}
                              name="cn-review"
                            />
                          );
                        }}>
                        <Scene
                          key={ScreenType.FACILITIES.REVIEW_HOME}
                          backButtonTintColor={AppColors.blue}
                          component={ReviewContainer}
                          title="Review Candidates"
                          renderRightButton={this.renderMessageCenterButton.bind(
                            this,
                          )}
                        />
                      </Stack>
                    </Tabs> */}
              {/* </Scene> */}
            </Drawer>
            {/* </Lightbox> */}
          </Modal>
        </Overlay>
      </Router>
    );
  }
  render() {
    return this.props.deviceStore.isInBackground ? (
      <VideoCallLightbox />
    ) : (
      this.renderDefaultRouter()
    );
  }
}

const style = StyleSheet.create({
  titleStyle: {
    color: '#556F7B',
  },
  navigationBarStyleWhite: {
    backgroundColor: variables.white,
  },
  navigationBarStyleElevated: {
    backgroundColor: variables.white,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 0.8},
    shadowOpacity: 0.12,
    shadowRadius: 2,
  },
  navigationBarStyleTransparent: {
    backgroundColor: 'transparent',
    borderWidth: 0,
    borderBottomWidth: 0,
    borderBottomColor: 'transparent',
    borderTopColor: 'transparent',
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    elevation: 0,
    borderColor: 'transparent',
    shadowColor: 'transparent',
    shadowOffset: null,
    shadowOpacity: null,
    shadowRadius: null,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
  },
});
