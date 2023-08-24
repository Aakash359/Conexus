import React from 'react';
import {
  StyleSheet,
  View,
  ScrollView,
  Text,
  TouchableHighlight,
  Image,
} from 'react-native';
import variables, {AppColors} from '../../../theme';
import {ComparisonList} from '../../../components/comparison-list';
import {AppFonts, AppSizes} from '../../../theme';
import NavigationService from '../../../navigation/NavigationService';

interface CandidateComparisonListProps {
  position: any;
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
        ])}
      >
        {candidate.photoUrl ? (
          <Image
            source={{uri: candidate.photoUrl}}
            style={styles.circleStyle}
          />
        ) : (
          <Image
            source={require('../../../components/Images/bg.png')}
            style={styles.circleStyle}
          />
        )}
        {!!candidate.display.title && (
          <Text
            style={styles.candidateName}
            numberOfLines={2}
            ellipsizeMode="tail"
          >
            {candidate.display.title}
          </Text>
        )}
      </View>
    );
  };

  const renderCandidate = (candidate: any, index: number, count: number) => {
    return (
      <View key={`candidate-${candidate.submissionId}-${index}`}>
        <TouchableHighlight
          activeOpacity={1}
          onPress={() =>
            NavigationService.navigate('HcpDetailView', {
              submissionId: candidate.submissionId,
              candidate,
              onClose: () => {
                props.updateViewed(candidate.submissionId);
              },
            })
          }
        >
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
  circleStyle: {
    width: 80,
    height: 80,
    borderRadius: 80 / 2,
    borderWidth: 2,
    borderColor: AppColors.imageColor,
  },
  candidateName: {
    opacity: 0.95,
    textAlign: 'center',
    ...AppFonts.candidateComparison.candidateTitle,
    paddingTop: 18,
  },
});
