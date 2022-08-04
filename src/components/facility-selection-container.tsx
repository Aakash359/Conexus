import React from 'react';
import {StyleSheet, View, FlatList, ActivityIndicator} from 'react-native';
import {
  FacilityListHeaderItem,
  IconTitleBlock,
  FacilitySelectionItem,
  ScreenFooterButton,
} from '../components';
// import {inject} from 'mobx-react';
import {AppColors} from '../theme';
import {UserStore, FacilityModel} from '../stores';
import {logger} from 'react-native-logs';
// import {Actions} from 'react-native-router-flux';
import {ScreenType, StoreType} from '../common';

interface FacilitySelectionContainerProps {
  showLoading?: boolean;
  showNoData: boolean;
  noDataText: string;
  noDataIconName?: string;
  facilityHeaderCaption?: string;
  refreshing?: boolean;
  onRefresh?: () => {};
  onFacilityChosen?: (facilityId: string) => any;
  userStore?: UserStore;
  expectOverrideFacilities?: boolean;
  overrideFacilities?: FacilitySelectionItem[];
  showNewQuestionButton?: boolean;
  needId?: string;
}

interface FacilitySelectionContainerState {}
const log = logger.createLogger();
// @inject(StoreType.USER)
const FacilitySelectionContainer = (props: FacilitySelectionContainerProps) => {
  // const { showNoData } = props

  const showNoData = (boolean: any) => {
    return showNoData;
  };

  const noDataText = (string: any) => {
    return noDataText || '';
  };

  const noDataIconName = () => {
    return noDataIconName || 'cn-info';
  };

  const facilityHeaderCaption = () => {
    return facilityHeaderCaption || '';
  };

  const refreshing = () => {
    return refreshing;
  };

  const onFacilityChosen = (selectedFacilityId: string) => {
    const {onFacilityChosen} = props;

    if (onFacilityChosen && onFacilityChosen.call) {
      return onFacilityChosen;
    }

    return (selectedFacilityId: string) => {};
  };

  const onRefresh = (selectedFacilityId: string) => {
    const {onRefresh} = props;

    if (onRefresh && onRefresh.call) {
      return onRefresh;
    }

    return function (selectedFacilityId: string) {};
  };

  // const selectedFacilityId= ()=>{
  //   return this.props.userStore.selectedFacilityId;
  // }

  const showLoading = () => {
    return !!showLoading;
  };
  const showNewQuestionButton = () => {
    return !!showNewQuestionButton;
  };
  const showFacilitySelector = () => {
    const {expectOverrideFacilities} = props;
    if (expectOverrideFacilities) {
      const {overrideFacilities} = props;
      return overrideFacilities.length > 0;
    }

    // return this.props.userStore.user.userFacilities.length > 1;
  };

  const renderEmpty = () => {
    log.info('Show button', this.showNewQuestionButton);
    log.info('Props', this.props);
    return (
      <FlatList
        contentContainerStyle={[style.containerCenter, {marginBottom: 200}]}
        refreshControl={<ActivityIndicator color={AppColors.blue} />}
        data={[{id: '1'}]}
        refreshing={this.refreshing}
        onRefresh={() => this.onRefresh(this.selectedFacilityId)}
        renderItem={({item, index}) => {
          return (
            //<Container style={style.containerNoQuestions}>
            <IconTitleBlock
              key={item.id}
              iconName={this.noDataIconName}
              text={this.noDataText}
            />
            //    {this.showNewQuestionButton && <ScreenFooterButton style={style.containerNoQuestions} title="Add Question" onPress={this.showNewQuestion.bind(this)} />}
            //</Container>
          );
        }}
      />
    );
  };

  const showNewQuestion = () => {
    const {needId} = props;
    log.info(`NeedID: ${needId}`);
    // Actions[ScreenType.FACILITIES.CATALOG_QUESTION]({
    //   questionId: '0',
    //   initialUnitId: '',
    //   needId: needId,
    //   onSave: () => {
    //     this.forceUpdate();
    //   },
    // });
  };

  return (
    <View style={style.container}>
      {/* {props.showFacilitySelector && (
        <FacilityListHeaderItem
          key={'facility-selection-header'}
          caption={this.facilityHeaderCaption}
          overrideFacilities={this.props.overrideFacilities}
          facilityChosen={this.onFacilityChosen.bind(
            this,
            this.selectedFacilityId,
          )}
        />
      )}
      {this.showLoading && (
        <ActivityIndicator color={AppColors.blue} style={{flex: 1}} />
      )} */}
      {/* {!this.showLoading &&
          this.showNewQuestionButton &&
          this.showNoData &&
          this.props.children}
        {!this.showLoading && this.showNoData && this.renderEmpty()}
        {!this.showLoading && !this.showNoData && this.props.children} */}
    </View>
  );
};

const style = StyleSheet.create({
  containerCenter: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  container: {
    flex: 1,
  },
  containerNoQuestions: {
    paddingTop: 60,
  },
});

export default FacilitySelectionContainer;
