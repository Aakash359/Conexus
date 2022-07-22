import React from 'react';
// import { Icon } from 'native-base'
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  RefreshControl,
  ActivityIndicator,
  ViewProperties,
} from 'react-native';
// import {Actions} from 'react-native-router-flux';

import Styles from '../../theme/styles';
import {ScreenType} from '../../common/constants';
import {NurseSubmissionsStore} from '../../stores';
import {showYesNoAlert} from '../../common/cancel-retry-alert';
import {AppFonts, AppColors, AppSizes} from '../../theme';
import {SubmissionCardList} from './submission-card-list';
import {PastSubmissionsTabList} from './past-submissions-tab-list';
import {logger} from 'react-native-logs';
const log = logger.createLogger();

interface NurseHomeProps extends ViewProperties {
  nurseSubmissionsStore: NurseSubmissionsStore;
}

interface NurseHomeState {
  refreshing: boolean;
}

export class NurseHome extends React.Component<NurseHomeProps, NurseHomeState> {
  constructor(props, state) {
    super(props, state);

    this.state = {
      refreshing: false,
    };
  }

  componentDidMount() {
    this.load(false);
  }

  // startVirtualInterview(submissionId: string) {
  //   Actions[ScreenType.NURSES.INTERVIEW]({submissionId});
  // }

  _renderLoading() {
    return (
      <View key="loading" style={styles.screen}>
        <ActivityIndicator
          color={AppColors.blue}
          style={StyleSheet.flatten([
            {
              width: AppSizes.screen.width,
              height: AppSizes.screen.height - 200,
            },
          ])}
        />
      </View>
    );
  }

  handleSubmissionAction(submissionId: string, actionType: string) {
    setTimeout(() => {
      switch (actionType.toLowerCase()) {
        case 'schedule':
          showYesNoAlert({
            title: 'Still In Development',
            yesTitle: 'Try Interview Instead',
            noTitle: 'OK',
            onYes: () => {
              this.startVirtualInterview(submissionId);
            },
          });

          break;
        case 'startvi':
          this.startVirtualInterview(submissionId);
          break;
      }
    }, 0);
  }

  _renderSubmissions() {
    const {nurseSubmissionsStore} = this.props;
    const interviewableSubmissions = nurseSubmissionsStore.availableInterviews; //.filter(i => i.questionCount > 0)

    return (
      <View key="submissions" style={{flex: 1}}>
        <Text style={styles.introTitle}>
          You are a candidate for {interviewableSubmissions.length} positions
        </Text>
        <SubmissionCardList
          submissions={interviewableSubmissions}
          onSubmissionAction={this.handleSubmissionAction.bind(this)}
        />
        <PastSubmissionsTabList nurseSubmissionsStore={nurseSubmissionsStore} />
      </View>
    );
  }

  _renderEmpty() {
    const {nurseSubmissionsStore} = this.props;

    return (
      <View>
        <View
          key="empty"
          style={StyleSheet.flatten([
            styles.screen,
            Styles.cnxNoDataMessageContainer,
          ])}>
          {/* <Icon name="information-circle" style={Styles.cnxNoDataIcon} /> */}
          <Text style={Styles.cnxNoDataMessageText}>No current interviews</Text>
        </View>
        <PastSubmissionsTabList nurseSubmissionsStore={nurseSubmissionsStore} />
      </View>
    );
  }

  load(refreshing: boolean = true) {
    this.setState({refreshing: refreshing});

    this.props.nurseSubmissionsStore.load().then(
      () => {
        this.setState({refreshing: false});
      },
      error => {
        log.info(error);
        this.setState({refreshing: false});
      },
    );
  }

  render() {
    const {nurseSubmissionsStore} = this.props;
    const {refreshing} = this.state;
    const interviewableSubmissions = nurseSubmissionsStore.availableInterviews;

    if (
      nurseSubmissionsStore.isLoadingSubmissions &&
      nurseSubmissionsStore.submissions.length === 0
    ) {
      return this._renderLoading();
    }

    return (
      <ScrollView
        style={{flex: 1}}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={this.load.bind(this)}
          />
        }>
        {interviewableSubmissions.length === 0
          ? this._renderEmpty()
          : this._renderSubmissions()}
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    flexDirection: 'column',
    width: AppSizes.screen.width,
  },

  introTitle: {
    ...AppFonts.bodyTextMedium,
    marginVertical: 20,
    textAlign: 'center',
  },
});
