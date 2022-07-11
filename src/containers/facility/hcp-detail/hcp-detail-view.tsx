import React from 'react';
import {
  StyleSheet,
  ScrollView,
  RefreshControl,
  ActivityIndicator,
  FlatList,
  Alert,
} from 'react-native';
import {Text, View, Icon} from 'native-base';
import {observer, inject} from 'mobx-react';
import {Actions} from 'react-native-router-flux';
import {ScreenType} from '../../../common/constants';
import {logger} from 'react-native-logs';
import {FacilitySubmissionsStore} from '../../../stores/facility';
import {AnswerRatingItem} from '../../../lightboxes';
import {windowDimensions} from '../../../common';
import variables from '../../../theme';
import Styles from '../../../theme/styles';
import {AppFonts, AppSizes, AppColors} from '../../../theme';

import {
  CandidateModel,
  loadCandidateBySubmissionId,
  CandidateResponseModel,
} from '../../../stores/facility';
import {
  ConexusIconButton,
  ConexusContentList,
  ActionButton,
  Avatar,
  TabBar,
  TabDetails,
  ScreenFooterButton,
} from '../../../components';
import {CandidateResponseRow} from './candidate-response-row';
import {ImageCacheManager} from 'react-native-cached-image';

export interface HcpDetailProps {
  submissionId: string;
  candidate?: typeof CandidateModel.Type;
  facilitySubmissionsStore: typeof FacilitySubmissionsStore.Type;
  onClose?: () => any;
}

export interface HcpDetailState {
  refreshing: boolean;
  loadingSummary: boolean;
  candidate?: typeof CandidateModel.Type;
  selectedTab?: TabDetails;
}

const tabs = [
  {id: 'summary', title: 'Summary'},
  {id: 'interviews', title: 'Virtual Interviews'},
];

const imageCacheManager = ImageCacheManager();
const preloadResumeCount = 3;
const log = logger.createLogger();
@inject('facilitySubmissionsStore')
@observer
export class HcpDetailContainer extends React.Component<
  HcpDetailProps,
  HcpDetailState
> {
  get responses(): typeof CandidateResponseModel.Type[] {
    const {candidate} = this.state;

    if (!candidate) {
      return [];
    }

    const result = [];

    candidate.sections.forEach(section => {
      section.questions.forEach(question => {
        if (question.answerVideoUrl || question.answerAudioPath) {
          result.push(question);
        }
      });
    });

    return result;
  }

  constructor(props, state) {
    super(props, state);
    this.state = {
      refreshing: false,
      loadingSummary: false,
      candidate: CandidateModel.create(this.props.candidate),
      selectedTab: tabs[0],
    };
  }

  _refreshCandidate(refreshing: boolean = false) {
    this.setState({refreshing: refreshing, loadingSummary: true});

    loadCandidateBySubmissionId(this.props.submissionId).then(
      (candidate: typeof CandidateModel.Type) => {
        this.setState({refreshing: false, candidate, loadingSummary: false});
        this._preloadResumePages();
      },
      () => {
        //TODO HANDLE ERROR
        this.setState({
          refreshing: false,
          candidate: null,
          loadingSummary: false,
        });
      },
    );
  }

  _loadCandidate() {
    this.setState({refreshing: true, loadingSummary: true});

    loadCandidateBySubmissionId(this.props.submissionId).then(
      (candidate: typeof CandidateModel.Type) => {
        this.setState({refreshing: false, candidate, loadingSummary: false});
        this._preloadResumePages();
      },
      () => {
        this.setState({
          refreshing: false,
          candidate: null,
          loadingSummary: false,
        });
      },
    );
  }

  _preloadResumePages() {
    const {candidate} = this.state;
    let i = 0;

    const promises = [];

    if (candidate) {
      while (i < preloadResumeCount && i < candidate.resumePages.pageCount) {
        promises.push(
          new Promise((resolve, reject) => {
            log.info(
              'Pre-loading candidate resume image: ' +
                candidate.resumePages.images[i],
            );
            return imageCacheManager
              .downloadAndCacheUrl(candidate.resumePages.images[i])
              .then(resolve, reject);
          }),
        );
        i += 1;
      }

      return Promise.all(promises);
    }

    return Promise.resolve();
  }

  componentDidMount() {
    const {candidate} = this.state;
    log.info('VIEWED HCP');
    this.state.candidate.setViewed(candidate.submissionId);
    if (!candidate) {
      this._loadCandidate();
    } else if (
      !candidate.resumePages.pageCount ||
      !candidate.submissionSummary ||
      !candidate.submissionSummary.length
    ) {
      this.setState({candidate, loadingSummary: true});
      this._refreshCandidate();
    }
  }

  componentWillUnmount() {
    if (this.props.onClose && this.props.onClose.call) {
      this.props.onClose();
    }
  }

  getAnswerPlaylist(): AnswerRatingItem[] {
    const responses = this.responses;

    var answers = responses.map(response => {
      return {
        id: response.questionId,
        videoUrl: response.answerVideoUrl,
        audioUrl: response.answerAudioPath,
        questionText: response.questionText,
        rating: response.feedbackResponse as -1 | 0 | 1,
        saveResponse: (questionId: string, rating: -1 | 0 | 1) => {
          return this.state.candidate
            .saveFeedbackResponse(questionId, rating)
            .then(() => {
              return new Promise((resolve, reject) => {
                this.forceUpdate(resolve);
              });
            });
        },
      };
    });
    return answers;
  }

  showContactCandidateLightbox() {
    Actions[ScreenType.CONTACT_CANDIDATE_LIGHTBOX]({
      candidate: this.state.candidate,
      onMessageSendCallback: this.state.candidate.setConversationId.bind(this),
    });
  }

  showAnswers(initialIndex = 0) {
    const answerPlaylist = this.getAnswerPlaylist();

    if (answerPlaylist.length === 0) {
      Alert.alert(
        'Interviews Unavailable',
        'The answers for the specified interview questions are currently unavailable.',
      );
    } else {
      if (answerPlaylist[initialIndex].audioUrl) {
        this.playAudioAnswer(initialIndex);
      } else {
        this.showInterviewRatingsLightBox(initialIndex);
      }
    }
  }

  showInterviewRatingsLightBox(initialIndex = 0) {
    const answerPlaylist = this.getAnswerPlaylist();

    Actions[ScreenType.ANSWER_RATINGS_LIGHTBOX]({
      initialIndex,
      answers: answerPlaylist,
      title: this.state.candidate.display.title,
    });
  }

  playAudioAnswer(index = 0) {
    const {candidate} = this.state;
    const answerPlaylist = this.getAnswerPlaylist();
    const answer = answerPlaylist[index];
    const avatarTitle = `${candidate.firstName} ${candidate.lastName}`;
    const avatarDescription = answer.questionText;
    const parms = {
      audioUrl: answer.audioUrl,
      avatarUrl: candidate.photoUrl,
      avatarTitle,
      avatarDescription,
    };

    Actions[ScreenType.AUDIO_PLAYER_LIGHTBOX](parms);
  }

  showNotInterestedLightbox() {
    const {facilitySubmissionsStore} = this.props;
    const {candidate} = this.state;

    Actions[ScreenType.YES_NO_LIGHTBOX]({
      yesTitle: "I'm Not Interested",
      yesDanger: true,
      noTitle: 'Cancel',
      title: "Are you sure you're not interested in this candidate?",
      onAnswer: (result: boolean) => {
        if (result) {
          this.setState({candidate: null}); // Shows loading

          candidate
            .saveNotInterested()
            .then(facilitySubmissionsStore.load)
            .then(() => Actions.pop())
            .catch(() => Actions.pop());
        }
      },
    });
  }

  showMakeOfferLightbox() {
    const {facilitySubmissionsStore} = this.props;
    const {candidate} = this.state;

    Actions[ScreenType.FACILITIES.MAKE_OFFER_LIGHTBOX]({
      photoUrl: candidate.photoUrl,
      photoLabel: candidate.photoLabel,
      candidateTitle: candidate.display.title,
      candidateDescription: candidate.display.description,
      startDate: candidate.startDate,
      onSubmit: (result: {startDate: string}) => {
        if (result) {
          log.info('HcpDetailView', 'saveOffer');
          candidate.setStartDate(result.startDate);

          candidate
            .saveMakeOffer()
            .then(facilitySubmissionsStore.load)
            .catch(error => {
              log.info('HcpDetailView', 'saveOffer', 'error', error);
            });
        }
      },
    });
  }

  private _renderQuestions() {
    const responses = [];
    const {candidate} = this.state;

    candidate.sections.forEach(section => {
      section.questions.forEach(response => {
        responses.push(response);
      });
    });

    if (!responses.length) {
      return (
        <View
          style={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'flex-start',
            paddingTop: 40,
            paddingBottom: 80,
          }}>
          <Icon name="information-circle" style={Styles.cnxNoDataIcon} />
          <Text style={Styles.cnxNoDataMessageText}>
            No Responses Available
          </Text>
        </View>
      );
    }

    return (
      <FlatList
        style={{paddingBottom: 220}}
        data={responses}
        renderItem={({item, index}) => (
          <CandidateResponseRow
            response={item}
            onPlayResponse={this.showAnswers.bind(this, index)}
          />
        )}
      />
    );
  }

  private _renderActionHeader() {
    const {candidate, selectedTab} = this.state;

    return (
      <View style={headerStyle.rootView}>
        <View style={StyleSheet.flatten([headerStyle.actionRowView])}>
          <ActionButton
            disabled={candidate.resumePages.pageCount === 0}
            onPress={() =>
              Actions.push(ScreenType.IMAGE_GALLERY, {
                images: candidate.resumePages.images,
                title: candidate.display.title,
                initialRenderCount: preloadResumeCount,
              })
            }
            smallSecondary
            title="View Profile"
            style={headerStyle.viewProfileButton}
          />
        </View>
        <View style={headerStyle.actionRowView}>
          <ConexusIconButton
            onPress={this.showNotInterestedLightbox.bind(this)}
            iconName="cn-person-remove"
            iconSize={20}
            title="Not Interested"
          />
          <ConexusIconButton
            disabled={!candidate || !candidate.conversationAllowed}
            onPress={this.showMakeOfferLightbox.bind(this)}
            iconName="cn-money-bag"
            iconSize={20}
            title="Make Offer"
          />
        </View>
        <TabBar
          selectedTabId={selectedTab.id}
          tabs={tabs}
          onTabSelection={tab => this.setState({selectedTab: tab})}
          style={{flex: 1}}
        />
      </View>
    );
  }

  private _renderCandidate() {
    const {candidate, loadingSummary, selectedTab} = this.state;

    return (
      <View style={{flex: 1}}>
        <ScrollView
          refreshControl={
            <RefreshControl
              refreshing={this.state.refreshing}
              onRefresh={this._refreshCandidate.bind(this, true)}
            />
          }
          style={styles.rootView}
          contentContainerStyle={styles.rootViewContent}>
          <View style={styles.headerViews}>
            <ConexusIconButton
              style={styles.closeButton}
              iconSize={18}
              iconName="cn-x"
              onPress={() => Actions.pop()}
            />
            <Avatar
              style={{width: 108, marginBottom: 8}}
              size={108}
              source={candidate.photoUrl}
              title={candidate.photoLabel}></Avatar>
            <Text style={AppFonts.bodyTextXtraLarge}>
              {candidate.display.title}
            </Text>
            {!!candidate.display.description && (
              <Text style={AppFonts.bodyTextXtraSmall}>
                {candidate.display.description}
              </Text>
            )}
            {this._renderActionHeader()}
          </View>

          {!loadingSummary && selectedTab === tabs[0] && (
            <ConexusContentList
              style={styles.contentList}
              data={candidate.submissionSummary}></ConexusContentList>
          )}
          {!loadingSummary &&
            selectedTab === tabs[1] &&
            this._renderQuestions()}
          {loadingSummary && this._renderLoading(100)}
        </ScrollView>
        {!!candidate && candidate.conversationAllowed && (
          <ScreenFooterButton
            title="Contact"
            onPress={this.showContactCandidateLightbox.bind(this)}
          />
        )}
      </View>
    );
  }

  private _renderLoading(paddingTop: number = 0) {
    return (
      <ActivityIndicator
        color={AppColors.blue}
        style={{flex: 1, alignSelf: 'center', paddingTop}}
      />
    );
  }

  render() {
    const {candidate} = this.state;

    if (!candidate) {
      return this._renderLoading();
    } else {
      return this._renderCandidate();
    }
  }
}

const styles = StyleSheet.create({
  rootView: {
    width: windowDimensions.width,
    backgroundColor: variables.baseGray,
  },

  closeButton: {
    position: 'absolute',
    right: 12,
    top: 44,
  },

  headerViews: {
    paddingTop: AppSizes.navbarHeight,
    backgroundColor: variables.white,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderColor: variables.lightBlue,
    width: windowDimensions.width,
  },

  rootViewContent: {
    flexDirection: 'column',
    width: windowDimensions.width,
    justifyContent: 'flex-start',
  },

  actionHeader: {
    marginTop: 12,
  },

  contentList: {
    marginTop: 1,
    paddingBottom: 120,
  },
});

const headerStyle = StyleSheet.create({
  viewProfileButton: {
    height: 33,
    marginTop: 18,
  },

  rootView: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'stretch',
    alignSelf: 'stretch',
  },

  actionRowView: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 18,
  },
});
