import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  ActivityIndicator,
  Alert,
} from 'react-native';
import {FacilitySelectionItem, ScreenFooterButton} from '../components';

import {useSelector} from '../redux/reducers/index';
import {AppColors} from '../theme';
import {UserStore, FacilityModel} from '../stores';
import {logger} from 'react-native-logs';
// import {Actions} from 'react-native-router-flux';
import {ScreenType, StoreType} from '../common';
import FacilityListHeaderItem from './facility-list-header-item';
import IconTitleBlock from './icon-title-block';

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
  overrideFacilities?: any;
  showNewQuestionButton?: boolean;
  needId?: string;
}

const FacilitySelectionContainer = (props: FacilitySelectionContainerProps) => {
  const userInfo = useSelector(state => state.userReducer);
  const {overrideFacilities} = props;

  const showNoData = (boolean: any) => {
    return props.showNoData;
  };

  const noDataText = (string: any) => {
    return props.noDataText || '';
  };

  const noDataIconName = () => {
    return props.noDataIconName || 'cn-info';
  };

  const facilityHeaderCaption = () => {
    return props.facilityHeaderCaption || '';
  };

  const refreshing = () => {
    return props.refreshing;
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

    return function(selectedFacilityId: string) {};
  };

  const selectedFacilityId = () => {
    return props.userStore.selectedFacilityId;
  };

  const showLoading = () => {
    return !!props.showLoading;
  };

  const showNewQuestionButton = () => {
    return !!props.showNewQuestionButton;
  };

  const showFacilitySelector = () => {
    const {expectOverrideFacilities} = props;
    if (expectOverrideFacilities) {
      const {overrideFacilities} = props;
      return overrideFacilities;
    }

    return props.userInfo?.user?.userFacilities?.length > 1;
  };

  const renderEmpty = () => {
    return (
      <FlatList
        contentContainerStyle={[styles.containerCenter, {marginBottom: 200}]}
        refreshControl={<ActivityIndicator color={AppColors.blue} />}
        data={[{id: '1'}]}
        // refreshing={refreshing}
        onRefresh={() => onRefresh(selectedFacilityId)}
        renderItem={({item, index}) => {
          return (
            <IconTitleBlock
              key={item.id}
              iconName={noDataIconName()}
              text={noDataText()}
            />
          );
        }}
      />
    );
  };

  // const showNewQuestion = () => {
  //   const {needId} = props;
  //   log.info(`NeedID: ${needId}`);
  //   // Actions[ScreenType.FACILITIES.CATALOG_QUESTION]({
  //   //   questionId: '0',
  //   //   initialUnitId: '',
  //   //   needId: needId,
  //   //   onSave: () => {
  //   //     this.forceUpdate();
  //   //   },
  //   // });
  // };

  return (
    <View style={styles.container}>
      {showFacilitySelector() && (
        <FacilityListHeaderItem
          key={'facility-selection-header'}
          caption={facilityHeaderCaption()}
          overrideFacilities={overrideFacilities}
          facilityChosen={() => onFacilityChosen(selectedFacilityId)}
        />
      )}
      {/* {showLoading() && (
        <ActivityIndicator
          color={AppColors.blue}
          style={{flex: 1, justifyContent: 'center', alignSelf: 'center'}}
        />
      )} */}
      {/* {!showLoading &&
        showNewQuestionButton() &&
        showNoData() &&
        props.children} */}
      {/* {renderEmpty()} */}
      {/* {!showLoading && !showNoData() && props.children} */}
    </View>
  );
};

const styles = StyleSheet.create({
  containerCenter: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  container: {},
  containerNoQuestions: {
    paddingTop: 60,
  },
});

export default FacilitySelectionContainer;
