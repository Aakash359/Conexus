import React from 'react';
import {observer, inject} from 'mobx-react';
import {Icon, Root} from 'native-base';
import {StyleSheet, DeviceEventEmitter, TouchableOpacity} from 'react-native';
import {
  Drawer,
  Lightbox,
  Modal,
  Overlay,
  Router,
  Scene,
  Stack,
  Tabs,
  Actions,
} from 'react-native-router-flux';
import {onPatch} from 'mobx-state-tree';

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
  ReviewContainer,
  SchedulingContainer,
  ScheduleAvailabilityContainer,
} from '../containers/facility';

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

@inject('userStore', 'conversationStore', 'deviceStore')
@observer
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
        wrapBy={observer}
        backAndroidHandler={this.backHandler}>
        <Overlay key="overlay" component={undefined}>
          <Modal
            hideNavBar
            key="modal"
            backButtonTintColor={AppColors.blue}
            component={undefined}>
            <Stack key="root">
              <Scene
                key="login"
                component={Login}
                title="Login"
                hideNavBar={true}
              />
              {/* <Lightbox key="root"> */}
              <Scene
                key="register"
                component={ForgotPassword}
                title="Register"
              />
              <Scene
                key={ScreenType.FORGOT_PASSWORD}
                backButtonTintColor={AppColors.blue}
                component={ForgotPassword}
                navigationBarStyle={style.navigationBarStyleTransparent}
                backTitle="Sign In"
                hideNavBar={true}
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
                // hideNavBar={true}
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
                key={ScreenType.REQUEST_ACCOUNT}
                backButtonTintColor={AppColors.blue}
                title="Request Account"
                titleStyle={style.titleStyle}
                back
                backTitle="Type"
                component={RequestAccount}
                navigationBarStyle={style.navigationBarStyleWhite}
              />
              <Scene
                key={ScreenType.NURSES.HOME}
                title="Positions"
                backButtonTintColor={AppColors.blue}
                component={NurseHome}
                navigationBarStyle={style.navigationBarStyleElevated}
                renderRightButton={this.renderMessageCenterButton.bind(this)}
              />
              {/* <Drawer
                hideNavBar
                key={ScreenType.DRAWER}
                contentComponent={DrawerContent}
                drawerIcon={menuicon}
                drawerWidth={CONEXUS_DRAWER_WIDTH}
                component={undefined}>
                <Scene key="drawer-scenes" component={undefined}></Scene>
              </Drawer> */}
              {/* </Lightbox> */}
            </Stack>
          </Modal>
        </Overlay>
      </Router>
    );

    // this._router = (
    // <Root key="root">
    // <Router key="router" wrapBy={observer} backAndroidHandler={this.backHandler}>
    //   <Overlay key="overlay" component={undefined}>
    //     <Modal hideNavBar key="modal" backButtonTintColor={AppColors.blue} component={undefined}>
    //       {/* <Lightbox key="root">
    //         <Scene key="root-scenes" component={undefined}>
    //           <Scene key={ScreenType.LOGIN} backButtonTintColor={AppColors.blue} component={Login} navigationBarStyle={style.navigationBarStyleTransparent} title="" />
    //           <Scene key={ScreenType.FORGOT_PASSWORD} backButtonTintColor={AppColors.blue} component={ForgotPassword} navigationBarStyle={style.navigationBarStyleTransparent} backTitle="Sign In" />
    //           <Scene key={ScreenType.WALKTHROUGH} backButtonTintColor={AppColors.blue} component={EditProfile} />
    //           <Scene key={ScreenType.PROFILE} backButtonTintColor={AppColors.blue} title="Your Profile" titleStyle={style.titleStyle} back backTitle="Back" component={Profile} navigationBarStyle={style.navigationBarStyleWhite} />
    //           <Scene key={ScreenType.PROFILE_EDIT} backButtonTintColor={AppColors.blue} title="Edit Your Profile" titleStyle={style.titleStyle} back backTitle="Back" component={EditProfile} navigationBarStyle={style.navigationBarStyleWhite} />
    //           <Scene key={ScreenType.REQUEST_ACCOUNT} backButtonTintColor={AppColors.blue} title='Request Account' titleStyle={style.titleStyle} back backTitle="Type" component={RequestAccount} navigationBarStyle={style.navigationBarStyleWhite} />
    //           <Scene key={ScreenType.SELECT_ACCOUNT} backButtonTintColor={AppColors.blue} title='Account Type' titleStyle={style.titleStyle} back backTitle="Login" component={SelectAccount} navigationBarStyle={style.navigationBarStyleWhite} />
    //           <Drawer
    //             hideNavBar
    //             key={ScreenType.DRAWER}
    //             contentComponent={DrawerContent}
    //             drawerIcon={menuicon}
    //             drawerWidth={CONEXUS_DRAWER_WIDTH}
    //             component={undefined}>
    //             <Scene key="drawer-scenes" component={undefined}>
    //               <Scene hideNavBar panHandlers={null} component={undefined} key="drawer-container">
    //                 <Tabs
    //                   key="tabbar"
    //                   swipeEnabled
    //                   showLabel={true}
    //                   tabBarPosition="bottom"
    //                   tabBarStyle={{ backgroundColor: AppColors.white }}
    //                   tabStyle={{ backgroundColor: 'white' }}
    //                   labelStyle={{ ...AppFonts.tabLabelText }}
    //                   activeTintColor={AppColors.blue}
    //                   inactiveBackgroundColor="rgba(255, 255, 255, 1)">

    //                   <Stack
    //                     key="review_tab"
    //                     title="Positions"
    //                     tabBarLabel="Review"
    //                     icon={({ focused }) => { return (<ConexusIcon color={getTabIconColor(focused)} size={16} name="cn-review" />) }}>
    //                     <Scene
    //                       key={ScreenType.FACILITIES.REVIEW_HOME}
    //                       backButtonTintColor={AppColors.blue}
    //                       component={ReviewContainer}
    //                       title="Review Candidates"
    //                       renderRightButton={this.renderMessageCenterButton.bind(this)}
    //                     />
    //                   </Stack>
    //                    <Stack
    //                     key="requests_tab"
    //                     tabBarLabel="Positions"
    //                     icon={({ focused }) => { return (<ConexusIcon color={getTabIconColor(focused)} size={16} name="cn-person-add" />) }}>
    //                     <Scene
    //                       key={ScreenType.FACILITIES.REQUESTS_HOME}
    //                       backButtonTintColor={AppColors.blue}
    //                       component={NeedsContainer}
    //                       title="Positions"
    //                       renderRightButton={this.renderMessageCenterButton.bind(this)}
    //                     />
    //                   </Stack>

    //                 </Tabs>
    //               </Scene>

    //               <Scene key={ScreenType.MESSAGE_CENTER.CONVERSATION} title="Conversation" back backButtonTintColor={AppColors.blue} component={ConversationContainer} navigationBarStyle={style.navigationBarStyleElevated} />
    //               <Scene key={ScreenType.FACILITIES.CATALOG_SECTION} back backButtonTintColor={AppColors.blue} title="Interview Questions" component={CatalogSectionContainer} navigationBarStyle={style.navigationBarStyleElevated} />
    //               <Scene key={ScreenType.FACILITIES.CATALOG_QUESTION} back backButtonTintColor={AppColors.blue} title="Add a Question" component={CatalogQuestionContainer} navigationBarStyle={style.navigationBarStyleElevated} />
    //               <Scene key={ScreenType.NURSES.HOME} title="Positions" backButtonTintColor={AppColors.blue} component={NurseHome} navigationBarStyle={style.navigationBarStyleElevated} renderRightButton={this.renderMessageCenterButton.bind(this)} />
    //               <Scene key={ScreenType.FACILITIES.CATALOG} backButtonTintColor={AppColors.blue} title="Interview Questions" component={CatalogContainer} navigationBarStyle={style.navigationBarStyleElevated} renderRightButton={this.renderMessageCenterButton.bind(this)} />
    //               <Scene key={ScreenType.MESSAGE_CENTER.CONVERSATION_LIST} backButtonTintColor={AppColors.blue} title="Message Center" component={FacilityMessageCenterContainer} navigationBarStyle={style.navigationBarStyleElevated} />
    //               <Scene key={ScreenType.MESSAGE_CENTER.NURSE_CONVERSATION_LIST} backButtonTintColor={AppColors.blue} title="Message Center" component={NurseMessageCenterContainer} navigationBarStyle={style.navigationBarStyleElevated} />
    //               <Scene key={ScreenType.FACILITIES.HCP_DETAIL} backButtonTintColor={AppColors.blue} component={HcpDetailContainer} title="" hideNavBar navigationBarStyle={style.navigationBarStyleElevated} />
    //             </Scene>
    //           </Drawer>
    //         </Scene>
    //         <Scene key={ScreenType.AUDIO_PLAYER_LIGHTBOX} component={AudioPlayerLightbox} />
    //         <Scene key={ScreenType.FACILITIES.MAKE_OFFER_LIGHTBOX} component={MakeOfferLightbox} />
    //         <Scene key={ScreenType.ANSWER_RATINGS_LIGHTBOX} component={AnswerRatingsLightbox} />
    //         <Scene key={ScreenType.VIDEO_RECORDER_LIGHTBOX} component={VideoRecorderLightbox} />
    //         <Scene key={ScreenType.NURSES.INTERVIEW} hideNavBar={true} component={NurseInterview} />
    //         <Scene key={ScreenType.FACILITIES.RECORD_QUESTION} component={CatalogVideoContainer} />
    //         <Scene key={ScreenType.FACILITIES.QUESTION_PLAYBACK_LIGHTBOX} component={VideoPlaybackLightbox} />
    //         <Scene key={ScreenType.HCP_PHONE_CALL_LIGHTBOX} component={HcpPhoneCallLightbox} />
    //         <Scene key={ScreenType.CONTENT_LIGHTBOX} component={ContentLightbox} />
    //         <Scene key={ScreenType.RADIO_LIST_LIGHTBOX} component={RadioListLightbox} />
    //         <Scene key={ScreenType.YES_NO_LIGHTBOX} component={YesNoLightbox} />
    //         <Scene key={ScreenType.CONTACT_CANDIDATE_LIGHTBOX} component={ContactCandidateLightbox} />
    //         <Scene key={ScreenType.DEVICE_INFO_LIGHTBOX} component={DeviceInfoLightbox} />
    //         <Scene key={ScreenType.CALL} component={VideoCallLightbox} />
    //       </Lightbox> */}

    //                     <Scene
    //                       key={ScreenType.FACILITIES.SCHEDULING.SCHEDULE_AVAILABILITY}
    //                       component={ScheduleAvailabilityContainer}
    //                       title="Schedule Availability"
    //                     />
    //       <Scene key={ScreenType.CONTENT_LIST_MODAL} component={ContentListModal} />
    //       <Scene key={ScreenType.FACILITIES.AGENT_MESSAGE_MODAL} component={AgentMessageModal} />
    //       <Scene key={ScreenType.FACILITIES.APP_FEEDBACK_MODAL} component={AppFeedbackModal} />
    //       <Scene key={ScreenType.IMAGE_GALLERY}
    //         component={ImageGallery} navigationBarStyle={style.navigationBarStyleWhite}
    //         title="Profile Viewer"
    //       />
    //     </Modal>

    //   </Overlay>
    // </Router>
    // </Root>)

    // return this._router
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
