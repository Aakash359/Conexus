import React from 'react';
import {
  ViewProperties,
  StyleSheet,
  View,
  Text,
  FlatList,
  RefreshControl,
} from 'react-native';
// import { Actions } from 'react-native-router-flux'
import {AppFonts, AppColors, AppSizes} from '../../../theme';
import {ScreenType, showYesNoAlert} from '../../../common';
import {
  QuestionSectionModel,
  FacilityQuestionsStore,
  FacilityModel,
} from '../../../stores/facility/';
import {UserStore} from '../../../stores/';
import {
  FacilitySelectionContainer,
  FacilitySelectionItem,
} from '../../../components';
import {ScreenFooterButton} from '../../../components';
import {logger} from 'react-native-logs';

const log = logger.createLogger();

export interface CatalogContainerProps extends ViewProperties {
  facilityQuestionsStore: typeof FacilityQuestionsStore.Type;
  userStore: UserStore;
  needId?: string;
  onSave?: () => any;
}

export interface CatalogContainerState {
  loading: boolean;
  refreshing: boolean;
}

const CatalogContainer: React.FC<CatalogContainerProps> = ({}) => {
  // get selectedFacilityId() {
  //   return this.props.userStore.selectedFacilityId;
  // }

  // get selectedFacility() {
  //   return this.props.facilityQuestionsStore.facilities.find(
  //     i => i.facilityId === this.selectedFacilityId,
  //   );
  // }

  // get showNoData(): boolean {
  //   const {facilityQuestionsStore} = this.props;
  //   if (this.state.refreshing || facilityQuestionsStore.loading) {
  //     return false;
  //   }

  //   return this.sections.length === 0;
  // }
  // get showQuestionButton(): boolean {
  //   return this.showQuestionButton;
  // }
  // get showLoading(): boolean {
  //   const {facilityQuestionsStore} = this.props;
  //   if (this.state.refreshing) {
  //     return false;
  //   }
  //   return facilityQuestionsStore.loading;
  // }

  // get sections() {
  //   const facility = this.selectedFacility;

  //   if (facility) {
  //     return facility.questionSections;
  //   }

  //   return [];
  // }

  // get facilities(): FacilitySelectionItem[] {
  //   const {facilityQuestionsStore} = this.props;
  //   if (this.state.refreshing || facilityQuestionsStore.loading) {
  //     return [];
  //   }

  //   return facilityQuestionsStore.facilities.map(
  //     (f: typeof FacilityModel.Type) => {
  //       return {
  //         facilityId: f.facilityId,
  //         facilityName: f.facilityName,
  //         photoUrl: f.facPhotoUrl || '',
  //       };
  //     },
  //   );
  // }

  // constructor(props, state) {
  //   super(props, state);

  //   this.state = {
  //     loading: false,
  //     refreshing: false,
  //   };
  // }

  // componentWillMount() {
  //   this.load();
  // }

  // private load(refreshing: boolean = false) {
  //   const {facilityQuestionsStore, needId} = this.props;

  //   if (refreshing) {
  //     this.setState({refreshing: true});
  //   } else {
  //     this.setState({loading: true});
  //   }

  //   facilityQuestionsStore
  //     .load(needId || '')
  //     .then(() => {
  //       log.info(
  //         'FacilityQuestionStore Loaded',
  //         facilityQuestionsStore.facilities,
  //       );
  //       this.setState({refreshing: false, loading: false});
  //     })
  //     .catch(error => {
  //       log.info(error);
  //       showYesNoAlert({
  //         title: `We're Sorry`,
  //         message: 'An error occurred while loading available questions.',
  //         onYes: this.load.bind(this, refreshing),
  //         yesTitle: 'Retry',
  //         noTitle: 'Canel',
  //       });
  //       this.setState({refreshing: false, loading: false});
  //     });
  // }

  // showSection(section: typeof QuestionSectionModel.Type) {
  //   // Actions[ScreenType.FACILITIES.CATALOG_SECTION]({
  //   //     questionSectionId: section.sectionId,
  //   //     title: section.sectionTitle,
  //   //     onSave() {
  //   //         this.forceUpdate()
  //   //     }
  //   // })
  // }

  // renderSection({item, index}) {
  //   const questionCount = item.questions.length + item.defaultQuestions.length;
  //   const section = item as typeof QuestionSectionModel.Type;

  //   return (
  //     <ListItem
  //       key={`${section.sectionId}-${index}`}
  //       style={styles.listItem}
  //       onPress={this.showSection.bind(this, section)}>
  //       <Body style={StyleSheet.flatten([styles.itemSection, styles.body])}>
  //         <Text style={AppFonts.listItemTitleTouchable}>
  //           {item.sectionTitle}
  //         </Text>
  //         <Text
  //           style={AppFonts.listItemDescription}>{`${questionCount} question${
  //           questionCount > 1 ? 's' : ''
  //         }`}</Text>
  //       </Body>
  //       <Right>
  //         <Icon name="arrow-forward" />
  //       </Right>
  //     </ListItem>
  //   );
  // }

  // showNewQuestion() {
  //   const {needId} = this.props;

  //   // Actions[ScreenType.FACILITIES.CATALOG_QUESTION]({
  //   //     questionId: '0',
  //   //     initialUnitId: '',
  //   //     needId: needId,
  //   //     onSave: () => {
  //   //         this.forceUpdate()
  //   //     }
  //   // })
  // }

  // log.info(`Logging FCS: ${this.props.needId}`);
  return (
    <Text>hi</Text>
    // <FacilitySelectionContainer
    //   // showNoData={this.showNoData}
    //   // showLoading={this.showLoading}
    //   noDataText="No Questions Available"
    //   facilityHeaderCaption="Showing questions for"
    //   // refreshing={this.state.refreshing}
    //   // onRefresh={this.load.bind(this, true)}
    //   // onFacilityChosen={(facilityId: string) => this.forceUpdate()}
    //   expectOverrideFacilities={true}
    //   // overrideFacilities={this.facilities}
    //   showNewQuestionButton={true}
    //   // needId={this.props.needId}
    // >
    /* {!this.showNoData && (
        <FlatList
          style={styles.list}
          refreshControl={
            <RefreshControl
              tintColor={AppColors.blue}
              colors={[AppColors.blue]}
              // refreshing={this.state.refreshing}
              // onRefresh={this.load.bind(this, true)}
            />
          }
          ListFooterComponent={() => {
            return <View key="spacer" style={{height: 120}} />;
          }}
          // renderItem={this.renderSection.bind(this)}
          // data={this.sections}
        />
      )} */
    /* <ScreenFooterButton
          title="Add Question"
          onPress={this.showNewQuestion.bind(this)}
        /> */
    /* </FacilitySelectionContainer> */
  );
};

const styles = StyleSheet.create({
  list: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: AppColors.baseGray,
    width: AppSizes.screen.width,
  },
  listItem: {
    backgroundColor: AppColors.white,
    borderBottomWidth: 1,
    borderBottomColor: AppColors.lightBlue,
  },
  itemSection: {
    borderWidth: 0,
    borderBottomWidth: 0,
  },
  body: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    paddingTop: 8,
    paddingBottom: 8,
  },
});

export default CatalogContainer;
