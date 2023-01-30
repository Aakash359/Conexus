import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  RefreshControl,
  Alert,
  Image,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import {AppColors, AppFonts, AppSizes} from '../../theme';
import {ScreenType, showYesNoAlert, windowDimensions} from '../../common';
import {
  QuestionSectionModel,
  FacilityQuestionsStore,
  FacilityModel,
} from '../../stores/facility/';
import Icon from 'react-native-vector-icons/SimpleLineIcons';
import Icons from 'react-native-vector-icons/Ionicons';
import {ActionButton} from '../../components/action-button';
import {TouchableOpacity} from 'react-native-gesture-handler';
import NavigationService from '../../navigation/NavigationService';
import {InterViewFacilityChooseModal} from '../../components/Modals/InterViewFacilityChooseModal';
import {facilityQuestionsService} from '../../services/ApiServices';

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
  const [refreshing, setRefreshing] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    load();
  }, []);

  const showQuestionButton = (): boolean => {
    return showQuestionButton;
  };

  const load = async (refreshing: boolean = false) => {
    try {
      setRefreshing(true);
      const {data} = await facilityQuestionsService();
      let sectionData = data.filter((i: any) => !!i);
      const facilityData = sectionData.map((i: any) => i);
      setSection(facilityData);
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

  const showSection = (section: any) => {
    NavigationService.navigate('InterviewQuestionDetail', {
      questionSectionId: section.sectionId,
      title: section.sectionTitle,
      // sectionFacilityID: facility,
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
        activeOpacity={0.8}
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
      unitId: section ? section.sectionId : '',
      needId: props.needId ? props.needId : '',
    });
  };

  const chooseFacility = (i: any) => {
    return (
      <InterViewFacilityChooseModal
        facilityHeaderData={i}
        onRequestClose={() => setModalVisible(false)}
        onClose={() => setModalVisible(false)}
        // onSelectUnit={value => setUnitValue(value)}
      />
    );
  };

  const renderEmptyList = (section: any) => {
    return (
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          backgroundColor: AppColors.baseGray,
        }}
        refreshControl={
          <RefreshControl
            tintColor={AppColors.blue}
            colors={[AppColors.blue]}
            refreshing={refreshing}
            onRefresh={() => load(true)}
          />
        }
      >
        <View
          style={{
            alignItems: 'center',
            marginTop: 250,
          }}
        >
          <Icons name="information-circle" style={styles.cnxNoDataIcon} />
          <Text style={styles.cnxNoDataMessageText}>
            No Interview Questions Available
          </Text>
        </View>
        <View style={styles.footer}>
          <ActionButton
            title="ADD QUESTION"
            loading={loading}
            customTitleStyle={styles.title}
            onPress={() => showNewQuestion()}
            customStyle={styles.addQuestionBtn}
          />
        </View>
      </ScrollView>
    );
  };

  return (
    <>
      {section.length > 0
        ? section.map(i => (
            <>
              <TouchableOpacity
                style={styles.root}
                activeOpacity={0.8}
                onPress={() => setModalVisible(true)}
              >
                <Image
                  source={{uri: i.facPhotoUrl}}
                  style={styles.circleStyle}
                />

                <View style={styles.textWrapper}>
                  <Text style={styles.caption}>showing question for</Text>
                  <Text style={styles.title}>{i.facilityName}</Text>
                </View>
                <View style={styles.chooser}>
                  <Icon
                    name="arrow-down"
                    size={18}
                    color={AppColors.white}
                    style={{alignSelf: 'center'}}
                  />
                </View>
              </TouchableOpacity>

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
                data={i.questionSections}
              />
              {refreshing && (
                <ActivityIndicator
                  style={{
                    flex: 1,
                    justifyContent: 'center',
                  }}
                />
              )}
              {modalVisible && chooseFacility(i)}
              <View style={styles.footer}>
                <ActionButton
                  title="ADD QUESTION"
                  loading={loading}
                  customTitleStyle={styles.title}
                  onPress={(section: any) => showNewQuestion(section)}
                  customStyle={styles.addQuestionBtn}
                />
              </View>
            </>
          ))
        : renderEmptyList(section)}
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
  cnxNoDataMessageText: {
    color: AppColors.darkBlue,
  },
  root: {
    backgroundColor: AppColors.blue,
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'center',
    height: 56,
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  circleStyle: {
    width: 38,
    height: 38,
    bottom: 4,
    borderRadius: 38 / 2,
    borderWidth: 2,
    borderColor: AppColors.imageColor,
  },
  icon: {
    paddingTop: 2,
  },
  textWrapper: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'flex-start',
    paddingLeft: 16,
  },
  caption: {
    ...AppFonts.bodyTextXtraSmall,
    color: AppColors.white,
    zIndex: 1,
  },
  title: {
    ...AppFonts.bodyTextLarge,
    fontWeight: '700',
    color: AppColors.white,
    position: 'relative',
    top: -2,
  },
  chooser: {
    alignSelf: 'flex-end',
    paddingBottom: 6,
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
  cnxNoDataIcon: {
    fontSize: 64,
    color: AppColors.blue,
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
