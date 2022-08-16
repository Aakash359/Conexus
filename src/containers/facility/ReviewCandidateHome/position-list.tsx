import React, {useEffect, useState} from 'react';
import {View, FlatList, ActivityIndicator, Text, Alert} from 'react-native';
// import {FacilityModel} from '../../../stores';
import {PositionListItem} from './position-list-item';
import {AppColors} from '../../../theme';

export interface PositionListProps {
  submissions: any;
  refreshing: boolean;
  selectedFacilityId: string;
  onRefresh?: () => {};
}

export const PositionList = (props: PositionListProps) => {
  const {submissions, onRefresh, selectedFacilityId, refreshing} = props;

  console.log('Submission', submissions, selectedFacilityId);

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

  const getPositionsByFacilityId = (facilityId: string, submissions: any) => {
    const facility = submissions.find(i => {
      return i.facilityId.toString() === facilityId;
    });

    if (facility) {
      return facility.positions || [];
    }
    return [];
  };

  const positions = getPositionsByFacilityId(selectedFacilityId, submissions);

  return (
    <FlatList
      key="position-list"
      onRefresh={onRefresh}
      // refreshControl={<ActivityIndicator color={AppColors.blue} />}
      refreshing={refreshing}
      renderItem={({item, index}) => (
        <PositionListItem
          key={`${item.needId}-${index}`}
          position={item}
          first={index === 0}
        />
      )}
      ListFooterComponent={() => {
        return <View key="submission-list-footer" style={{height: 120}}></View>;
      }}
      data={positions}
    />
  );
};
