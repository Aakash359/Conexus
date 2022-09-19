import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  RefreshControl,
  Alert,
} from 'react-native';
import {AppColors, AppFonts, AppSizes} from '../../theme';
import {ScreenType, showYesNoAlert, windowDimensions} from '../../common';
import {
  QuestionSectionModel,
  FacilityQuestionsStore,
  FacilityModel,
} from '../../stores/facility/';
import {UserStore} from '../../stores/';
import {FacilitySelectionItem} from '../../components';
import {Avatar} from '../../components/avatar';
import Icon from 'react-native-vector-icons/SimpleLineIcons';
import {ActionButton} from '../../components/action-button';
import {logger} from 'react-native-logs';
import {TouchableOpacity} from 'react-native-gesture-handler';
import NavigationService from '../../navigation/NavigationService';
import AddQuestion from './AddQuestion';
import FacilitySelectionContainer from '../../components/facility-selection-container';
import {facilityQuestionsService} from '../../services/InterviewQuestions/facilityQuestionsService';

export interface InterviewQuestionsProps {
  needId?: string;
  onSave?: () => any;
}

export interface InterviewQuestionsState {
  loading: boolean;
  refreshing: boolean;
}

const InterviewQuestions = (
  props: InterviewQuestionsProps,
  state: InterviewQuestionsState,
) => {
  const [loading, setLoading] = useState(false);
  const [section, setSection] = useState([]);
  const [facility, setFacility] = useState({});
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    load();
    setFacility(facility);
  }, []);

  const selectedFacilityId = () => {
    return this.props.userStore.selectedFacilityId;
  };

  const selectedFacility = () => {
    return this.props.facilityQuestionsStore.facilities.find(
      i => i.facilityId === this.selectedFacilityId,
    );
  };

  // const showNoData = (): boolean => {
  //   if (refreshing) {
  //     return false;
  //   }

  //   return this.sections.length === 0;
  // };

  const showQuestionButton = (): boolean => {
    return showQuestionButton;
  };

  // const showLoading = (): boolean => {
  //   const {facilityQuestionsStore} = this.props;
  //   if (this.state.refreshing) {
  //     return false;
  //   }
  //   return facilityQuestionsStore.loading;
  // };

  // const sections = () => {
  //   const facility = this.selectedFacility;

  //   if (facility) {
  //     return facility.questionSections;
  //   }

  //   return [];
  // };

  const facilities = (): any => {
    return {
      facilityId: facility.facilityId,
      facilityName: facility.facilityName,
      photoUrl: facility.facPhotoUrl || '',
    };
  };

  const load = async (refreshing: boolean = false) => {
    if (refreshing) {
      setRefreshing(true);
    } else {
      setRefreshing(false);
    }
    try {
      const {data} = await facilityQuestionsService();
      let sectionData = data.filter((i: any) => !!i);
      setFacility(sectionData?.[0]);
      setSection(sectionData?.[0]?.questionSections);
      setRefreshing(false);
    } catch (error) {
      console.log('Error', error);
      setRefreshing(false);
      showYesNoAlert({
        title: `We're Sorry`,
        message: 'An error occurred while loading available questions.',
        onYes: () => load(refreshing),
        yesTitle: 'Retry',
        noTitle: 'Canel',
      });
    }
  };

  const forceUpdate = () => {};

  const showSection = (section: any) => {
    NavigationService.navigate('InterviewQuestionDetail', {
      questionSectionId: section.sectionId,
      title: section.sectionTitle,
      sectionFacilityID: facility,
      sections: section,
      props: props,
      onSave() {
        forceUpdate();
      },
    });
  };

  const renderSection = ({item, index}) => {
    const questionCount = item.questions.length + item.defaultQuestions.length;
    const section = item as typeof QuestionSectionModel.Type;
    return (
      <TouchableOpacity
        key={`${section.sectionId}-${index}`}
        style={styles.listItem}
        onPress={() => showSection(section)}
      >
        <View style={styles.listWrapperView}>
          <View style={StyleSheet.flatten([styles.itemSection, styles.body])}>
            <Text style={AppFonts.listItemTitleTouchable}>
              {item.sectionTitle}
            </Text>
            <Text
              style={AppFonts.listItemDescription}
            >{`${questionCount} question${questionCount > 1 ? 's' : ''}`}</Text>
          </View>
          <Icon
            name="arrow-right"
            size={18}
            color={AppColors.mediumGray}
            style={{right: 15}}
          />
        </View>
      </TouchableOpacity>
    );
  };

  const showNewQuestion = () => {
    NavigationService.navigate('AddQuestion', {
      questionId: '0',
      initialUnitId: '',
      // needId: needId,
      onSave: () => {
        forceUpdate();
      },
    });
  };

  return (
    <>
      <FacilitySelectionContainer
        noDataText="No Questions Available"
        facilityHeaderCaption="Showing questions for"
        refreshing={refreshing}
        onRefresh={() => load(true)}
        // onFacilityChosen={(facilityId: string) => this.forceUpdate()}
        expectOverrideFacilities={true}
        // overrideFacilities={facilities()}
        showNewQuestionButton={true}
        needId={props.needId}
      />
      <FlatList
        style={styles.list}
        refreshControl={
          <RefreshControl
            tintColor={AppColors.blue}
            colors={[AppColors.blue]}
            refreshing={refreshing}
            onRefresh={() => load(true)}
          />
        }
        ListFooterComponent={() => {
          return <View key="spacer" style={{height: 120}} />;
        }}
        renderItem={renderSection}
        data={section}
      />
      <View style={styles.footer}>
        <ActionButton
          title="ADD QUESTION"
          loading={loading}
          customTitleStyle={styles.title}
          onPress={showNewQuestion}
          customStyle={styles.addQuestionBtn}
        />
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  list: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: AppColors.baseGray,
    width: AppSizes.screen.width,
  },
  title: {
    fontSize: 14,
    color: AppColors.white,
    fontFamily: AppFonts.family.fontFamily,
  },
  footer: {
    right: 10,
    left: 10,
    position: 'absolute',
    bottom: 20,
  },
  addQuestionBtn: {
    alignSelf: 'center',
    width: windowDimensions.width * 0.5,
  },
  listWrapperView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  listItem: {
    backgroundColor: AppColors.white,
    borderBottomWidth: 1,
    borderBottomColor: AppColors.lightBlue,
  },

  body: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    left: 20,
    paddingTop: 8,
    paddingBottom: 8,
  },
});

export default InterviewQuestions;
