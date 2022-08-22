import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  View,
  ScrollView,
  Text,
  TouchableHighlight,
} from 'react-native';
import variables, {AppColors} from '../../../theme';
import {ScreenType} from '../../../common/constants';
import {CandidateModel} from '../../../services/facility/candidate-model';
import {PositionModel} from '../../../services/facility/position-model';
import {ComparisonList} from '../../../components/comparison-list';
import {AppFonts, AppSizes} from '../../../theme';
import {Avatar} from '../../../components/avatar';
import NavigationService from '../../../navigation/NavigationService';

export interface CandidateHeaderItemProps {
  candidate: typeof CandidateModel.Type;
  index: number;
  count: number;
  minHeight?: number;
  sizeChanged: (size: number) => void;
}

export interface CandidateHeaderItemState {
  height: number;
}

export const CandidateHeaderItem = (
  props: CandidateHeaderItemProps,
  state: CandidateHeaderItemState,
) => {
  const [height, setHeight] = useState(0);
  const {candidate, index, count, minHeight, sizeChanged} = props;

  const lastCell = index + 1 === count;
  return (
    <TouchableHighlight
      key={`candidate-${candidate.submissionId}-${index}`}
      onPress={() =>
        Actions[ScreenType.FACILITIES.HCP_DETAIL]({
          submissionId: candidate.submissionId,
          candidate,
        })
      }>
      <View
        onLayout={event => {
          setHeight(event.nativeEvent.layout.height);
          sizeChanged(event.nativeEvent.layout.height);
        }}
        style={StyleSheet.flatten([
          styles.candidateCell,
          lastCell && {borderRightWidth: 0},
          minHeight && {height: minHeight},
        ])}>
        <Avatar
          size={86}
          source={candidate.photoUrl}
          title={candidate.photoLabel}
          titleStyle={{backgroundColor: '#C7D8E0'}}
        />
        {candidate.display.title && (
          <Text style={styles.candidateName}>{candidate.display.title}</Text>
        )}
        <Text
          style={{
            position: 'absolute',
            left: 0,
            bottom: 0,
            zIndex: 2,
            fontSize: 8,
          }}>
          {height}
        </Text>
      </View>
    </TouchableHighlight>
  );
};

interface CandidateComparisonListProps {
  position: typeof PositionModel.Type;
  updateViewed: (s: string) => any;
}

interface CandidateComparisonListState {
  minHeight?: number;
  showAll?: boolean;
  comparing?: boolean;
}

export const CandidateComparisonList = (
  props: CandidateComparisonListProps,
  state: CandidateComparisonListState,
) => {
  const {updateViewed} = props;
  const [showAll, setShowAll] = useState(false);
  const [minHeight, setMinHeight] = useState(0);
  const [comparing, setComparing] = useState(false);

  // const showAll = () => {
  //   setShowAll(true);
  // };
  const {position} = props;

  const getCellWidth = (cellCount: number): number => {
    if (cellCount === 1) {
      return AppSizes.screen.width;
    }

    if (cellCount <= 2) {
      return AppSizes.screen.width / 2;
    }

    if (cellCount === 3) {
      return AppSizes.screen.width / 3;
    }

    return (AppSizes.screen.width * 0.94) / 3; // First 3 items should take up all but 6% of screen width
  };

  const renderCandidateCell = (
    candidate: any,
    index: number,
    count: number,
  ) => {
    const lastCell = index + 1 === count;
    let cellStyle = {width: getCellWidth(count)};

    return (
      <View
        key={`${index}`}
        style={StyleSheet.flatten([
          styles.candidateCell,
          cellStyle,
          lastCell && {borderRightWidth: 0},
          !!!candidate.viewedSubmission && {
            borderBottomWidth: 5,
            borderBottomColor: AppColors.blue,
          },
        ])}>
        {
          <Avatar
            size={86}
            source={candidate.photoUrl}
            title={candidate.photoLabel}
            style={{height: 96}}
            titleStyle={{backgroundColor: '#36D8A3'}}
          />
        }
        {!!candidate.display.title && (
          <Text
            style={styles.candidateName}
            numberOfLines={2}
            ellipsizeMode="tail">
            {candidate.display.title}
          </Text>
        )}
      </View>
    );
  };

  const renderCandidate = (
    candidate: typeof CandidateModel.Type,
    index: number,
    count: number,
  ) => {
    return (
      <View key={`candidate-${candidate.submissionId}-${index}`}>
        <TouchableHighlight
          onPress={
            () =>
              NavigationService.navigate('HcpDetailView', {
                submissionId: candidate.submissionId,
                candidate,
                onClose: () => {
                  props.updateViewed(candidate.submissionId);
                },
              })

            //   Actions[ScreenType.FACILITIES.HCP_DETAIL]({
            //     submissionId: candidate.submissionId,
            //     candidate, onClose: () => {
            //         props.updateViewed(candidate.submissionId)
            //     }
            // })
          }>
          {renderCandidateCell(candidate, index, count)}
        </TouchableHighlight>
        <ComparisonList
          index={index}
          cellWidth={getCellWidth(count)}
          count={count}
          data={candidate.compData}
        />
      </View>
    );
  };
  return (
    <ScrollView horizontal={true} style={{position: 'relative'}}>
      {position.candidates.map((candidate, index) =>
        renderCandidate(candidate, index, position.candidates.length),
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  candidateCell: {
    flexDirection: 'column',
    alignItems: 'center',
    padding: 12,
    paddingTop: 18,
    paddingBottom: 36,
    backgroundColor: 'white',

    borderColor: variables.lightBlue,
    borderRightWidth: 1,
    borderBottomWidth: 1,
    height: 205,
  },
  candidateName: {
    opacity: 0.95,
    textAlign: 'center',
    ...AppFonts.candidateComparison.candidateTitle,
    paddingTop: 8,
  },
});
