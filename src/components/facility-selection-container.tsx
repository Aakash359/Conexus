import React from 'react';
import {StyleSheet, View, FlatList, ActivityIndicator} from 'react-native';
import {
  IconTitleBlock,
  FacilitySelectionItem,
  ScreenFooterButton,
} from '../components';

import {FacilityListHeaderItem} from '../components/facility-list-header-item';
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

const FacilitySelectionContainer = (props: FacilitySelectionContainerProps) => {
  const {
    showNoData,
    noDataText,
    noDataIconName,
    facilityHeaderCaption,
    refreshing,
    showLoading,
    onFacilityChosen,
    showNewQuestionButton,
    overrideFacilities,
  } = props;

  const showNoDataItems = (boolean: any) => {
    return showNoData;
  };

  const noDataTextItem = (string: any) => {
    return noDataText || '';
  };

  const noDataIconNames = () => {
    return noDataIconName || 'cn-info';
  };

  const facilityHeaderCaptions = () => {
    return facilityHeaderCaption || '';
  };

  const refreshings = () => {
    return refreshing;
  };

  const onFacilityChosens = (selectedFacilityId: string) => {
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

  const selectedFacilityId = () => {
    // return this.props.userStore.selectedFacilityId;
  };

  const showLoadings = () => {
    return !!showLoading;
  };
  const showNewQuestionButtons = () => {
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
        onRefresh={() => this.onRefresh(selectedFacilityId)}
        renderItem={({item, index}) => {
          return (
            <IconTitleBlock
              key={item.id}
              iconName={this.noDataIconName}
              text={this.noDataText}
            />
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
      {/* {showFacilitySelector && (
        <FacilityListHeaderItem
          key={'facility-selection-header'}
          caption={facilityHeaderCaption}
          overrideFacilities={overrideFacilities}
          facilityChosen={onFacilityChosens(selectedFacilityId)}
        />
      )} */}
      {showLoading && (
        <ActivityIndicator color={AppColors.blue} style={{flex: 1}} />
      )}
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
