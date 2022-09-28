import React from 'react';
import {View, FlatList, ActivityIndicator} from 'react-native';
import {CandidateListItem} from './candidateListItem';

export interface CandidateListProps {
  submissions: any;
  refreshing: boolean;
  selectedFacilityId: string;
  onRefresh?: () => {};
}

export const CandidateList = (props: CandidateListProps) => {
  const {submissions, onRefresh, refreshing} = props;

  return (
    <FlatList
      key="position-list"
      onRefresh={() => onRefresh}
      // refreshControl={<ActivityIndicator color={AppColors.blue} />}
      refreshing={refreshing}
      renderItem={({item, index}) => (
        <CandidateListItem
          key={`${item.needId}-${index}`}
          position={item}
          first={index === 0}
        />
      )}
      ListFooterComponent={() => {
        return <View key="submission-list-footer" style={{height: 120}}></View>;
      }}
      data={submissions}
    />
  );
};
