import React, {useEffect, useState} from 'react';
import {View, FlatList, ActivityIndicator, Text, Alert} from 'react-native';
import {AppColors} from '../../../theme';
import {CandidateListItem} from './candidateListItem';

export interface CandidateListProps {
  submissions: any;
  refreshing: boolean;
  selectedFacilityId: string;
  onRefresh?: () => {};
}

export const CandidateList = (props: CandidateListProps) => {
  const {submissions, onRefresh, selectedFacilityId, refreshing} = props;

  // const getFacilitySelectionItem = (
  //   facilityId: string,
  //   submissions: typeof FacilityModel.Type[],
  // ) => {
  //   const facility = submissions.find(i => {
  //     return i.facilityId.toString() === facilityId;
  //   });

  //   if (facility) {
  //     return {
  //       value: facility.facilityId.toString(),
  //       title: facility.facilityName,
  //     };
  //   }
  //   return null;
  // };

  // const getFacilitySelectionItems = (
  //   submissions: typeof FacilityModel.Type[],
  // ) => {
  //   return submissions.map(i => {
  //     return {
  //       value: i.facilityId.toString(),
  //       title: i.facilityName,
  //     };
  //   });
  // };

  // const getPositionsByFacilityId = (facilityId: string, submissions: any) => {
  //   const facility = submissions.map(
  //     (i: {facilityId: {toString: () => string}}) => {
  //       return i.facilityId.toString() === facilityId;
  //     },
  //   );
  //   console.log('posirions===>', facility);
  //   if (facility) {
  //     return facility.positions || [];
  //   }
  //   return [];
  // };

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
