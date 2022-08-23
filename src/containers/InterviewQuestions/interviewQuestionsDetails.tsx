import React, {useState, useEffect} from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  View,
  RefreshControl,
  ScrollView,
  Alert,
  Text,
} from 'react-native';
import {AppColors, AppSizes} from '../../theme';
import {TabDetails} from '../../components';
import {TabBar} from '../../components/tab-bar';
import {ViewHeader} from '../../components/view-header';
import {SortableQuestionRow} from './sortable-question-row';
import {
  FacilityQuestionsStore,
  QuestionSectionModel,
  QuestionModel,
} from '../../../stores/facility';
import {showYesNoAlert} from '../../common';
import Styles from '../../theme/styles';
import SortableList from 'react-native-sortable-list';
import {ActionButton} from '../../components/action-button';
import {AppFonts} from '../../theme';
import {windowDimensions} from '../../common/window-dimensions';
import Tab from '../../theme/components/Tab';
import Icon from 'react-native-vector-icons/Ionicons';

export interface InterviewQuestionDetailProps {
  questionSectionId: string;
  needId: string;
  sectionTitleOverride?: string;
  facilityQuestionsStore: any;
  userStore?: UserStore;
  onSave?: () => any;
}

export interface InterviewQuestionDetailState {
  selectedTabId: string;
  editing: boolean;
  refreshing: boolean;
  silentRefreshing: boolean;
  saving: boolean;
  loading: boolean;
  loadingError: boolean;
}

type RowMap = {
  [key: string]: typeof QuestionModel.Type;
};

const InterviewQuestionDetail = (
  props: InterviewQuestionDetailProps,
  state: InterviewQuestionDetailState,
) => {
  const {questionSectionId, sections, needId} = props?.route.params;
  const [silentRefreshing, setSilentRefreshing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState([]);
  const [loadingError, setLoadingError] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedTabId, setSelectedTabID] = useState(
    needId ? 'other' : 'default',
  );

  //   const onSave=()=> {
  //     return onSave || function () {};
  //   }

  const section = (): any => {
    const {questionSectionId, needId} = props;

    // if (needId) {
    //   return facilityQuestionsStore.needSection;
    // }

    return questionSectionId;
  };

  //   const showableQuestions=(): any=> {

  //     // if (!section) {
  //     //   return [];
  //     // }

  //     // let questions = [];

  //     // if (needId) {
  //     //   questions = section.questions || [];
  //     // } else {
  //     //   questions = this.showDefault
  //     //     ? this.section.defaultQuestions
  //     //     : this.section.questions;
  //     // }

  //     // return questions.filter(q => !q['deleted']);
  //   }

  const showDefault = () => {
    return selectedTabId === 'default';
  };

  //   get defaultListContentHeight() {
  //     return AppSizes.screen.height - AppSizes.navbarHeight;
  //   }

  //   constructor(
  //     props: CatalogSectionContainerProps,
  //     state: CatalogSectionContainerState,
  //   ) {
  //     super(props, state);

  //     this.state = {
  //       editing: false,
  //       selectedTabId: !!props.needId ? 'other' : 'default',
  //       refreshing: false,
  //       silentRefreshing: false,
  //       saving: false,
  //       loading: false,
  //       loadingError: false,
  //     };
  //   }

  //   componentWillMount() {
  //     if (this.props.needId) {
  //       this.props.facilityQuestionsStore.reset();
  //     }
  //   }

  //   componentDidMount() {
  //     if (this.props.needId) {
  //       this.loadNeedQuestions();
  //     }
  //   }

  //   loadNeedQuestions() {
  //     this.props.facilityQuestionsStore.reset();
  //     this.setState({loading: true, loadingError: false});

  //     this.props.facilityQuestionsStore
  //       .load(this.props.needId)
  //       .then(() => {
  //         this.setState({loading: false, loadingError: false});
  //       })
  //       .catch(error => {
  //         log.info('Load questions error', error);
  //         this.setState({loading: false, loadingError: true});
  //       });
  //   }

  //   onQuestionClose() {
  //     if (!this.section && !this.props.needId) {
  //       // return Actions.pop();
  //     }
  //   }

  const newQuestion = () => {
    const {refreshing, silentRefreshing} = this.state;

    if (refreshing || silentRefreshing) {
      return;
    }

    // Actions[ScreenType.FACILITIES.CATALOG_QUESTION]({
    //     title: 'Add Question',
    //     questionId: '0',
    //     initialUnitId: this.section ? this.section.sectionId : '',
    //     needId: this.props.needId,
    //     onClose: this.onQuestionClose.bind(this),
    //     onSave: () => {
    //         this.onSave()
    //         this.forceUpdate()
    //     }
    // })
  };

  //   openQuestion(questionId: string, needId: string, unitId: string) {
  //     const {refreshing, silentRefreshing} = this.state;

  //     if (refreshing || silentRefreshing) {
  //       return;
  //     }

  //     // Actions[ScreenType.FACILITIES.CATALOG_QUESTION]({
  //     //     title: 'Modify Question',
  //     //     questionId: questionId,
  //     //     initialUnitId: unitId,
  //     //     needId: needId,
  //     //     onClose: this.onQuestionClose.bind(this),
  //     //     onSave: () => {
  //     //         this.onSave()
  //     //         this.forceUpdate()
  //     //     }
  //     // })
  //   }

  //   playQuestion(questionId: string, needId: string) {
  //     const {refreshing, silentRefreshing} = this.state;

  //     if (refreshing || silentRefreshing) {
  //       return;
  //     }

  //     var question = this.props.facilityQuestionsStore.findQuestion(
  //       this.props.userStore.selectedFacilityId,
  //       questionId,
  //     );

  //     if (!question) {
  //       return Alert.alert('Question Not Available');
  //     }

  //     // Actions[ScreenType.FACILITIES.QUESTION_PLAYBACK_LIGHTBOX]({ videoUrl: question.tokBoxArchiveUrl })
  //   }

  //   deleteQuestion(questionId: string, needId: string) {
  //     const {facilityQuestionsStore} = this.props;

  //     const tryDelete = () => {
  //       facilityQuestionsStore.deleteQuestion(questionId, needId).then(
  //         () => {
  //           this.onSave();
  //           this.forceUpdate();
  //           facilityQuestionsStore.load(needId).then(() => {
  //             this.onSave();

  //             if (!this.section && !this.props.needId) {
  //               // return Actions.pop();
  //             }

  //             this.forceUpdate();
  //           });
  //         },
  //         error => {
  //           log.info('Delete error', error);

  //           showYesNoAlert({
  //             onNo: () => {},
  //             onYes: tryDelete.bind(this),
  //             yesTitle: 'Retry',
  //             noTitle: 'Cancel',
  //             title: 'Delete Error',
  //             message: 'An error occurred while deleting the question.',
  //           });
  //         },
  //       );
  //     };

  //     showYesNoAlert({
  //       onNo: () => {},
  //       onYes: tryDelete.bind(this),
  //       yesStyle: {color: AppColors.red},
  //       yesTitle: 'Delete',
  //       noTitle: 'Cancel',
  //       title: 'Are you sure?',
  //       message: 'This action can not be undone.',
  //     });
  //   }

  const toggleEditing = () => {
    setEditing(!editing);
  };

  const onTabSelection = (tab: TabDetails) => {
    console.log('Tab===>', tab);

    // setSelectedTabID(Tab.id)
  };

  const renderUnitHeader = () => {
    const questionCount =
      sections.questions.length + sections.defaultQuestions.length;
    const description = `${questionCount} question${
      questionCount === 0 || questionCount > 1 ? 's' : ''
    }`;
    const actionText = editing ? 'Finished' : 'Edit';

    return (
      <ViewHeader
        first
        title={
          props.sectionTitleOverride ||
          props?.route?.params?.sections?.sectionTitle
        }
        description={description}
        titleStyle={{color: AppColors.white}}
        descriptionStyle={{color: AppColors.white}}
        style={{backgroundColor: AppColors.blue, borderBottomWidth: 0}}
        actionStyle={{borderWidth: 0}}
        actionText={questionCount > 0 ? actionText : ''}
        onActionPress={toggleEditing}
      />
    );
  };

  const getQuestionsBadge = (questions: any, defaultQuestions: boolean) => {
    const count = questions.filter(
      q => q.defaultFlag === defaultQuestions,
    ).length;
    return count.toString();
  };

  const renderTabs = () => {
    const tabs = [
      {
        id: 'default',
        title: 'Default Questions',
        // badge: showDefault() ? ''
        //   : getQuestionsBadge(sections.defaultQuestions, true),
      },
      {
        id: 'other',
        title: 'Other Questions',
        // badge: showDefault() ? getQuestionsBadge(this.section.questions, false)
        //   : '',
      },
    ];

    return (
      <TabBar
        style={styles.tabBar}
        tabs={tabs}
        selectedTabId={selectedTabId}
        onTabSelection={() => onTabSelection(tabs)}
      />
    );
  };

  //   refreshSection(silent = false) {
  //     this.setState({refreshing: !silent, silentRefreshing: silent}, () => {
  //       this.props.facilityQuestionsStore.load(this.props.needId).then(
  //         () => {
  //           if (!this.section && !this.props.needId) {
  //             // Actions.pop()
  //           } else {
  //             this.setState({refreshing: false, silentRefreshing: false});
  //           }
  //         },
  //         err => {
  //           this.setState({refreshing: false, silentRefreshing: false});
  //         },
  //       );
  //     });
  //   }

  const rowOrder: Array<string> = [];
  //   newOrder: Array<string> = [];
  //   onChangeOrder(rowMap: RowMap, newOrder: string[]) {
  //     this.newOrder = newOrder;
  //     log.info('New Order: ', newOrder);
  //   }

  //  const onReleaseRow=(rowMap: RowMap, rowKey)=> {
  //     log.info('Row Released');

  //     const currentIndex = parseInt(rowKey);
  //     const newIndex = this.newOrder.findIndex(v => v === rowKey);

  //     this.setState({saving: true});

  //     this.showDefault
  //       ? this.section.moveDefaultQuestion(currentIndex, newIndex)
  //       : this.section.moveQuestion(currentIndex, newIndex);

  //     this.setState({saving: false});
  //   }

  // const renderSortableList = () => {
  //   const rowMap: RowMap = {};
  //   rowOrder = [];

  //   // const questions = showableQuestions;

  //   // this.showableQuestions.forEach((question, index) => {
  //   //   if (!question.deleted) {
  //   //     // This
  //   //     rowMap[index] = question;
  //   //     this.rowOrder.push(index.toString());
  //   //   }
  //   // });

  //   return (
  //     <SortableList
  //       style={{flex: 1}}
  //       sortingEnabled={editing}
  //       // refreshControl={
  //       //   <RefreshControl
  //       //     tintColor={AppColors.blue}
  //       //     colors={[AppColors.blue]}
  //       //     refreshing={refreshing}
  //       //     onRefresh={this.refreshSection.bind(this, false)}
  //       //   />
  //       // }
  //       onChangeOrder={this.onChangeOrder.bind(this, rowMap)}
  //       onReleaseRow={this.onReleaseRow.bind(this, rowMap)}
  //       data={rowMap}
  //       renderRow={({data, active, index}) => {
  //         var paddingBottom =
  //           index + 1 === questions.length
  //             ? AppSizes.conexusFooterButtonHeight + 20
  //             : 0;
  //         var question: typeof QuestionModel.Type = data;

  //         return (
  //           // <SortableQuestionRow
  //           //   marginBottom={paddingBottom}
  //           //   allowDeleteQuestion={true}
  //           //   text={data.text}
  //           //   videoUrl={data.tokBoxArchiveUrl}
  //           //   onDeleteQuestion={this.deleteQuestion.bind(
  //           //     this,
  //           //     question.id,
  //           //     question.needId,
  //           //   )}
  //           //   onOpenQuestion={this.openQuestion.bind(
  //           //     this,
  //           //     question.id,
  //           //     question.needId,
  //           //     question.unitId,
  //           //   )}
  //           //   onPlayQuestion={this.playQuestion.bind(
  //           //     this,
  //           //     question.id,
  //           //     question.needId,
  //           //   )}
  //           //   dragActive={active}
  //           //   editing={editing}
  //           // />
  //         );
  //       }}
  //     />
  //   );
  // };

  const renderEmptyList = () => {
    return (
      <ScrollView
        style={{flex: 1}}
        // refreshControl={
        //   <RefreshControl
        //     tintColor={AppColors.blue}
        //     colors={[AppColors.blue]}
        //     refreshing={refreshing}
        //     onRefresh={refreshSection(false)}
        //   />
        // }
      >
        <View
          style={StyleSheet.flatten([
            {paddingBottom: 220},
            Styles.cnxNoDataMessageContainer,
          ])}>
          <Icon name="information-circle" style={Styles.cnxNoDataIcon} />
          <Text style={Styles.cnxNoDataMessageText}>
            No Questions Available
          </Text>
        </View>
      </ScrollView>
    );
  };

  //   const renderLoadingContainer=()=> {
  //     return (
  //       <Container>
  //         <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
  //           <ActivityIndicator color={AppColors.blue}></ActivityIndicator>
  //         </View>
  //       </Container>
  //     );
  //   }

  //   const renderLoadingErrorContainer =()=> {
  //     return (
  //       <Container>
  //         <View
  //           style={StyleSheet.flatten([
  //             {paddingBottom: 220},
  //             Styles.cnxNoDataMessageContainer,
  //           ])}>
  //           <Icon name="information-circle" style={Styles.cnxNoDataIcon} />
  //           <Text style={Styles.cnxNoDataMessageText}>
  //             An error occured while loading.
  //           </Text>
  //         </View>
  //       </Container>
  //     );
  //   }

  // if (loading) {
  //   return renderLoadingContainer();
  // }

  // if (loadingError) {
  //   renderLoadingErrorContainer();
  // }

  return (
    <View style={{flex: 1}}>
      {!!questionSectionId && renderUnitHeader()}
      {!!sections && renderTabs()}
      {renderEmptyList()}
      {/* {renderSortableList()} */}
      {!editing && (
        <View style={styles.footer}>
          <ActionButton
            title="ADD QUESTION"
            loading={loading}
            customTitleStyle={styles.title}
            onPress={newQuestion}
            customStyle={styles.addQuestionBtn}
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  tabBar: {
    height: 62,
    borderTopWidth: 0,
    borderBottomWidth: 1,
    borderBottomColor: AppColors.lightBlue,
    backgroundColor: AppColors.white,
  },
  footer: {
    right: 10,
    left: 10,
    position: 'absolute',
    bottom: 20,
  },
  title: {
    fontSize: 14,
    color: AppColors.white,
    fontFamily: AppFonts.family.fontFamily,
  },
  addQuestionBtn: {
    alignSelf: 'center',
    width: windowDimensions.width * 0.5,
  },
});

export default InterviewQuestionDetail;