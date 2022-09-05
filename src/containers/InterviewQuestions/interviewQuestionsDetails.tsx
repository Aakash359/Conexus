import React, {useState, useEffect} from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  View,
  RefreshControl,
  ScrollView,
  Alert,
  FlatList,
  Text,
} from 'react-native';
import {AppColors, AppSizes} from '../../theme';
import {TabDetails} from '../../components';
import {ViewHeader} from '../../components/view-header';
import {showYesNoAlert} from '../../common';
import {useSelector} from '../../redux/reducers/index';
import Styles from '../../theme/styles';
import SortableList from 'react-native-sortable-list';
import {ActionButton} from '../../components/action-button';
import {AppFonts} from '../../theme';
import {windowDimensions} from '../../common/window-dimensions';
import Icon from 'react-native-vector-icons/Ionicons';
import {needQuestionsService} from '../../services/InterviewQuestions/needQuestionsService';
import _ from 'lodash';
import SortableQuestionRow from './sortable-question-row';
import NavigationService from '../../navigation/NavigationService';
import {
  deleteInterviewQuestionsService,
  deleteNeedInterviewQuestionsService,
} from '../../services/InterviewQuestions';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';

const Tab = createMaterialTopTabNavigator();

export interface InterviewQuestionDetailProps {
  questionSectionId: string;
  needId: string;
  sectionTitleOverride?: string;
  facilityQuestionsStore: any;
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
  [key: string]: any;
};

const InterviewQuestionDetail = (
  props: InterviewQuestionDetailProps,
  state: InterviewQuestionDetailState,
) => {
  const [silentRefreshing, setSilentRefreshing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState([]);
  const [needQuestionList, setNeedQuestionList] = useState([]);
  const [loadingError, setLoadingError] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const userInfo = useSelector(state => state.userReducer);
  const propsData = [props?.route?.params] ? [props?.route?.params] : {};
  const {needId, sectionTitleOverride, questionSectionId} = propsData?.[0];
  const {sectionFacilityID, sections, onSave} = propsData?.[0] || {};
  const {facilityId} = sectionFacilityID ? sectionFacilityID : {};
  const [selectedTabId, setSelectedTabID] = useState(
    needId ? 'other' : 'default',
  );
  const newOrder: Array<string> = [];
  const facilityID = userInfo?.user?.userFacilities?.[0]?.facilityId;

  // const onSaved = () => {
  //   return onSave || function () {};
  // };

  useEffect(() => {
    loadNeedQuestions();
  }, []);

  const findQuestionSection = (facilityID: string, sectionId: string): any => {
    const facility = facilityID === facilityId;
    if (facility) {
      return facility.questionSections.find(
        (section: {sectionId: string}) => section.sectionId === sectionId,
      );
    }

    return null;
  };

  const section = (): any => {
    if (needId) {
      return needQuestionList;
    }
    return findQuestionSection(questionSectionId, facilityID);
  };

  const loadNeedQuestions = async (refreshing: boolean = false) => {
    setLoading(true);
    setLoadingError(false);
    try {
      const {data} = await needQuestionsService(needId);
      let questions = _.orderBy(data, ['displayOrder'], ['asc']);

      setNeedQuestionList(questions);
      setRefreshing(false);
      setLoading(false);
    } catch (error) {
      console.log('Load questions error', error);
      setRefreshing(false);
      setLoading(false);
    }
  };

  const showableQuestions = (): any => {
    if (!section) {
      return [];
    }
    let questions = [];

    if (needId) {
      questions = needQuestionList || [];
    } else {
      questions = showDefault() ? sections?.defaultQuestions : needQuestionList;
    }
    return questions.filter((q: {[x: string]: any}) => !q['deleted']);
  };

  //   onQuestionClose() {
  //     if (!this.section && !this.props.needId) {
  //       // return Actions.pop();
  //     }
  //   }

  const newQuestion = () => {
    if (refreshing || silentRefreshing) {
      return;
    }
    NavigationService.navigate('AddQuestion', {
      title: 'Add Question',
      //     questionId: '0',
      //     initialUnitId: this.section ? this.section.sectionId : '',
      //     needId: this.props.needId,
      //     onClose: this.onQuestionClose.bind(this),
      //     onSave: () => {
      //         this.onSave()
      //         this.forceUpdate()
      //     }
    });

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

  const openQuestion = (
    questionId: string,
    needId: string,
    unitId: string,
    questionText: string,
    questionHasUrl: string,
    unitName: string,
  ) => {
    if (refreshing || silentRefreshing) {
      return;
    }
    NavigationService.navigate('AddQuestion', {
      title: 'Modify Question',
      questionId: questionId,
      unitName: unitName,
      questionText: questionText,
      initialUnitId: unitId,
      needId: needId,
      questionHasUrl: questionHasUrl,
      sections: sections ? sections : {},

      // onClose: this.onQuestionClose.bind(this),
    });
  };

  const playQuestion = (questionId: string, needId: string, question: any) => {
    if (refreshing || silentRefreshing) {
      return;
    }
    // const question = this.props.facilityQuestionsStore.findQuestion(
    //   this.props.userStore.selectedFacilityId,
    //   questionId,
    // );

    // if (!question) {
    //   return Alert.alert('Question Not Available');
    // }
    NavigationService.navigate('VideoPlayer', {
      videoUrl: question.tokBoxArchiveUrl,
    });

    // Actions[ScreenType.FACILITIES.QUESTION_PLAYBACK_LIGHTBOX]({ videoUrl: question.tokBoxArchiveUrl })
  };

  const deleteNeedQuestion = async (
    questionId: string,
    needId: string,
    facilityId: string,
  ) => {
    const tryDelete = async (
      questionId: string,
      needId: string,
      facilityId: string,
    ) => {
      console.log('Okk===>', needId, questionId, facilityId);
      setRefreshing(true);
      setLoading(true);
      try {
        const needPayload = {
          facilityId: facilityId,
          id: questionId,
          needId: needId,
          deleted: true,
        };
        const {data} = await deleteNeedInterviewQuestionsService(needPayload);
        setRefreshing(false);
        loadNeedQuestions();
        setLoading(false);
        console.log('interview Question Deleted response====>', data);
      } catch (error) {
        console.log('Load questions error', error);
        setRefreshing(false);
        setLoading(false);
        showYesNoAlert({
          onNo: () => {},
          onYes: () => tryDelete(questionId, needId, facilityId),
          noTitle: 'Cancel',
          title: 'Delete Error',
          message: 'An error occurred while deleting the question.',
        });
      }
    };
    showYesNoAlert({
      onNo: () => {},
      onYes: () => tryDelete(questionId, needId, facilityId),
      yesStyle: {color: AppColors.red},
      yesTitle: 'Delete',
      noTitle: 'Cancel',
      title: 'Are you sure?',
      message: 'This action can not be undone.',
    });
  };

  const deleteInterviewQuestion = async (questionId: string) => {
    const tryDelete = async (questionId: string) => {
      try {
        const interviewQuestionPayload = {
          questionId: questionId,
        };
        const {data} = await deleteInterviewQuestionsService(
          interviewQuestionPayload,
        );
        onSaved();
        setRefreshing(false);
        setLoading(false);
        console.log('interview Question Deleted response====>', data);
      } catch (error) {
        console.log('Load questions error', error);
        setRefreshing(false);
        setLoading(false);
        showYesNoAlert({
          onNo: () => {},
          onYes: () => tryDelete(questionId),
          noTitle: 'Cancel',
          title: 'Delete Error',
          message: 'An error occurred while deleting the question.',
        });
      }
    };
    showYesNoAlert({
      onNo: () => {},
      onYes: () => tryDelete(questionId),
      yesStyle: {color: AppColors.red},
      yesTitle: 'Delete',
      noTitle: 'Cancel',
      title: 'Are you sure?',
      message: 'This action can not be undone.',
    });
  };

  const toggleEditing = () => {
    setEditing(!editing);
  };

  const renderUnitHeader = () => {
    let sectionData = sections ? sections : {};
    const questionCount = needQuestionList.length;
    const description = `${questionCount} question${
      questionCount === 0 || questionCount > 1 ? 's' : ''
    }`;
    const actionText = editing ? 'FINISH' : 'EDIT';
    return (
      <ViewHeader
        first
        title={
          sectionTitleOverride || props?.route?.params?.sections?.sectionTitle
        }
        // description={description}
        titleStyle={{color: AppColors.white}}
        descriptionStyle={{color: AppColors.white}}
        style={{backgroundColor: AppColors.blue, borderBottomWidth: 0}}
        actionStyle={{borderWidth: 0}}
        actionText={actionText}
        onActionPress={toggleEditing}
      />
    );
  };

  // const getQuestionsBadge = (questions: any, defaultQuestions: boolean) => {
  //   const count = questions.filter(
  //     q => q.defaultFlag === defaultQuestions,
  //   ).length;
  //   return count.toString();
  // };

  // const renderTabs = () => {
  //   const tabs = [
  //     {
  //       id: 'default',
  //       title: 'Default Questions',
  //       // badge: showDefault() ? ''
  //       //   : getQuestionsBadge(sections.defaultQuestions, true),
  //     },
  //     {
  //       id: 'other',
  //       title: 'Other Questions',
  //       // badge: showDefault() ? getQuestionsBadge(this.section.questions, false)
  //       //   : '',
  //     },
  //   ];

  //   return (
  //     <TabBar
  //       style={styles.tabBar}
  //       tabs={tabs}
  //       selectedTabId={selectedTabId}
  //       onTabSelection={() => onTabSelection(tabs)}
  //     />
  //   );
  // };

  const DefaultQuestions = (route: any) => {
    return (
      <ScrollView
        style={{flex: 1, backgroundColor: AppColors.baseGray}}
        refreshControl={
          <RefreshControl
            tintColor={AppColors.blue}
            colors={[AppColors.blue]}
            refreshing={refreshing}
            onRefresh={() => refreshSection(false)}
          />
        }>
        {showableQuestions().length > 0 && renderSortableList(route)}
      </ScrollView>
    );
  };
  const OtherQuestions = (route: any) => {
    return (
      <View style={{flex: 1, backgroundColor: AppColors.baseGray}}>
        <ScrollView
          style={{flex: 1, backgroundColor: AppColors.baseGray}}
          refreshControl={
            <RefreshControl
              tintColor={AppColors.blue}
              colors={[AppColors.blue]}
              refreshing={refreshing}
              onRefresh={() => refreshSection(false)}
            />
          }>
          {showableQuestions().length > 0 && renderSortableList(route)}
        </ScrollView>
      </View>
    );
  };

  const showDefault = () => {
    return selectedTabId === 'default';
  };

  const renderTabs = () => {
    return (
      <Tab.Navigator
        screenOptions={{
          headerShown: true,
          tabBarShowLabel: true,
          tabBarStyle: {backgroundColor: AppColors.white},
          tabBarLabelStyle: {fontWeight: 'bold'},
          tabBarActiveTintColor: AppColors.blue,
          tabBarInactiveTintColor: AppColors.mediumGray,
        }}>
        <Tab.Screen
          name="DefaultQuestions"
          component={route => DefaultQuestions(route)}
          options={{
            title: 'Default Questions',
          }}
        />
        <Tab.Screen
          name="OtherQuestions"
          component={route => OtherQuestions(route)}
          options={{
            title: 'Other Questions',
          }}
        />
      </Tab.Navigator>
    );
  };

  const refreshSection = (silent = false) => {
    setRefreshing(!silent);
    setSilentRefreshing(silent);
    loadNeedQuestions();
  };

  // const onChangeOrder = (rowMap: RowMap, newOrder: string[]) => {
  //   const newOrders: Array<string> = ([] = newOrder);
  // };

  // const onReleaseRow = (rowMap: RowMap, rowKey) => {
  //   log.info('Row Released');

  //   const currentIndex = parseInt(rowKey);
  //   const newIndex = newOrder.findIndex(v => v === rowKey);

  //   this.setState({saving: true});

  //   this.showDefault
  //     ? this.section.moveDefaultQuestion(currentIndex, newIndex)
  //     : this.section.moveQuestion(currentIndex, newIndex);

  //   this.setState({saving: false});
  // };

  const renderSortableList = (route: any) => {
    const rowMap: RowMap = {};
    const rowOrder: Array<string> = [];

    if (needId) {
      needQuestionList.forEach(
        (question: {deleted: any}, index: string | number) => {
          if (!question.deleted) {
            rowMap[index] = question;
            rowOrder.push(index.toString());
          }
        },
      );
    } else {
      if (route?.route?.name == 'DefaultQuestions') {
        sections?.defaultQuestions.forEach(
          (question: {deleted: any}, index: string | number) => {
            if (!question.deleted) {
              rowMap[index] = question;
              rowOrder.push(index.toString());
            }
          },
        );
      } else {
        sections?.questions.forEach(
          (question: {deleted: any}, index: string | number) => {
            if (!question.deleted) {
              rowMap[index] = question;
              rowOrder.push(index.toString());
            }
          },
        );
      }
    }
    const questions = showableQuestions;

    let rowData = Object.values(rowMap);

    return (
      <FlatList
        style={{flex: 1, backgroundColor: AppColors.baseGray}}
        sortingEnabled={editing}
        refreshControl={
          <RefreshControl
            tintColor={AppColors.blue}
            colors={[AppColors.blue]}
            refreshing={refreshing}
            onRefresh={() => refreshSection(false)}
          />
        }
        renderItem={({item, index, active}) => {
          var paddingBottom =
            index + 1 === questions.length
              ? AppSizes.conexusFooterButtonHeight + 20
              : 0;
          var question: any = item;
          console.log('Question===>', question);

          return (
            <SortableQuestionRow
              marginBottom={paddingBottom}
              allowDeleteQuestion={true}
              text={item.text}
              videoUrl={item.tokBoxArchiveUrl}
              onDeleteQuestion={() =>
                needId
                  ? deleteNeedQuestion(question.id, needId, question.facilityId)
                  : deleteInterviewQuestion(question.id)
              }
              onOpenQuestion={() =>
                openQuestion(
                  question.id,
                  question.needId,
                  question.unitId,
                  question.text,
                  question.tokBoxArchiveUrl,
                  question.unitName,
                )
              }
              onPlayQuestion={() =>
                playQuestion(question.id, question.needId, question)
              }
              dragActive={active}
              editing={editing}
            />
          );
        }}
        data={rowData}
      />
    );
  };

  const renderEmptyList = () => {
    return (
      <ScrollView
        style={{flex: 1, backgroundColor: AppColors.baseGray}}
        refreshControl={
          <RefreshControl
            tintColor={AppColors.blue}
            colors={[AppColors.blue]}
            refreshing={refreshing}
            onRefresh={() => refreshSection(false)}
          />
        }>
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

  const renderLoadingContainer = () => {
    return (
      <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
        <ActivityIndicator color={AppColors.blue}></ActivityIndicator>
      </View>
    );
  };

  const renderLoadingErrorContainer = () => {
    return (
      <View
        style={StyleSheet.flatten([
          {paddingBottom: 220},
          Styles.cnxNoDataMessageContainer,
        ])}>
        <Icon name="information-circle" style={Styles.cnxNoDataIcon} />
        <Text style={Styles.cnxNoDataMessageText}>
          An error occurred while loading.
        </Text>
      </View>
    );
  };

  if (loading) {
    return renderLoadingContainer();
  }

  if (loadingError) {
    renderLoadingErrorContainer();
  }

  return (
    <View style={{flex: 1}}>
      {renderUnitHeader()}
      {!needId && renderTabs()}
      {showableQuestions().length == 0 && renderEmptyList()}

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
