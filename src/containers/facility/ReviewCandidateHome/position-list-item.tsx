import React, {useEffect, useState} from 'react';
import {Alert, View, StyleSheet, Text} from 'react-native';
import {PositionModel, CandidateModel} from '../../../stores';
import {ViewHeader} from '../../../components/view-header';
import {CandidateItem} from './candidate-item';
import {PositionComparisonList} from './position-comparison-list';

interface PositionListItemProps {
  position: any;
  first?: boolean;
}

interface PositionListItemState {
  showAll: boolean;
  comparing: boolean;
  position: any;
}

export const PositionListItem = (
  props: PositionListItemProps,
  state: PositionListItemState,
) => {
  const posit = Object.assign({}, props.position);

  const [showAll, setShowAll] = useState(false);
  const [comparing, setComparing] = useState(false);
  const [position, setPosition] = useState(posit);
  console.log('Position====>', position);

  useEffect(() => {
    if (position) {
      setPosition(position);
    }
  });

  const showAlls = () => {
    setShowAll(true);
  };

  const setViewedSubmission = (subId: string) => {
    // this.setState(currentState => ({
    //     ...currentState,
    //     position: {
    //         ...currentState.position,
    //         candidates: currentState.position.candidates.map((c) => ({
    //             ...c,
    //             viewedSubmission: (c.submissionId === subId ? true : c.viewedSubmission)
    //         }))
    //     }
    // }))
  };
  const renderStandardList = () => {
    // let showAllHighlight = position.candidates.find((cand, ind: number) => {
    //   return ind > 2 && !cand.viewedSubmission;
    // });

    return position.candidates.map(
      (candidate: {submissionId: any}, index: number) => (
        <CandidateItem
          positions={position}
          key={`${candidate.submissionId}-${index}`}
          candidate={candidate}
          candidatesCount={position.candidates.length}
          index={index}
          // showAllHighlight={!!showAllHighlight}
          showAll={showAll}
          // onMorePress={showAlls()}
          // updateViewed={(s: string) => this.setViewedSubmission(s)}
        />
      ),
    );
  };

  const renderComparingList = () => {
    return (
      <PositionComparisonList
        position={position}
        updateViewed={(s: string) => setViewedSubmission(s)}
      />
    );
  };

  const defaultStyle = StyleSheet.create({
    comparing: {
      fontSize: 12,
    },
  });

  return (
    <View key={position.needId.toString()}>
      {position.candidates.length > 0 && (
        <ViewHeader
          title={position.display.title}
          description={position.display.description}
          first={props.first}
          actionTextStyle={!comparing ? defaultStyle.comparing : {}}
          actionText={comparing ? 'LIST' : 'COMPARE'}
          onActionPress={() => setComparing(!comparing)}
        />
      )}
      {!comparing ? renderComparingList() : null}
    </View>
  );
};
