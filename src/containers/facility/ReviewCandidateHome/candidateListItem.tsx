import React, {useEffect, useState} from 'react';
import {Alert, View, StyleSheet, Text} from 'react-native';
import {PositionModel, CandidateModel} from '../../../stores';
import {ViewHeader} from '../../../components/view-header';

import {CandidateComparisonList} from './candidateComparisonList';
import CandidateItem from './candidateItem';

interface CandidateListItemItemProps {
  position: any;
  first?: boolean;
}

interface CandidateListItemItemState {
  showAll: boolean;
  comparing: boolean;
  position: any;
}

export const CandidateListItem = (
  props: CandidateListItemItemProps,
  state: CandidateListItemItemState,
) => {
  const position = props?.position;
  const [showAll, setShowAll] = useState(false);
  const [comparing, setComparing] = useState(false);

  const renderPositions = (item: any) => {
    let position = item;
    return (
      <>
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
        {comparing
          ? renderCandidateComparingList(position)
          : renderStandardList(position)}
      </>
    );
  };

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
  const renderStandardList = (position: any) => {
    let showAllHighlight = position.candidates.find(
      (candidate: {viewedSubmission: any}, ind: number) => {
        return ind > 2 && !candidate.viewedSubmission;
      },
    );

    return position.candidates.map(
      (candidate: {submissionId: any}, index: number) => (
        <CandidateItem
          positions={position}
          key={`${candidate.submissionId}-${index}`}
          candidate={candidate}
          candidatesCount={position.candidates.length}
          index={index}
          showAllHighlight={!!showAllHighlight}
          showAll={showAll}
          // onMorePress={showAlls()}
          updateViewed={(s: string) => setViewedSubmission(s)}
        />
      ),
    );
  };

  const renderCandidateComparingList = (position: any) => {
    return (
      <CandidateComparisonList
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

  return <View key={position.needId}>{position.map(renderPositions)}</View>;
};
