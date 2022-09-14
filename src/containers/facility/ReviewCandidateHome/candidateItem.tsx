import React, {useEffect, useState} from 'react';
import {StyleSheet, TouchableOpacity, Text, View, Alert} from 'react-native';
import {Avatar} from '../../../components/avatar';
import variables, {AppColors} from '../../../theme';
import {ScreenType} from '../../../common/constants';
import {CandidateModel} from '../../../stores/facility';
import {AppFonts} from '../../../theme';
import {logger} from 'react-native-logs';
import {BubbleLabel} from '../../../components/bubble-label';
import {PositionModel} from '../../../stores/index';
import NavigationService from '../../../navigation/NavigationService';

export interface CandidateItemProps {
  candidate: any;
  candidatesCount: number;
  index: number;
  showAll: boolean;
  showAllHighlight: boolean;
  positions: any;
  updateViewed: (s: string) => any;
  onMorePress: () => any;
}

export interface CandidateItemState {
  subViewed: boolean;
}

const CandidateItem = (props: CandidateItemProps) => {
  const {
    candidate,
    index,
    showAll,
    positions,
    candidatesCount,
    showAllHighlight,
  } = props;

  const [subViewed, setSubViewed] = useState(false);

  useEffect(() => {
    setSubViewed(props.candidate.viewedSubmission);
  });

  const renderItem = () => {
    return (
      <TouchableOpacity
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
        <View
          key={candidate.userId}
          style={StyleSheet.flatten([
            styles.listItem,
            !!!candidate.viewedSubmission ? styles.unviewed : {},
          ])}
        >
          <View style={styles.itemSection}>
            <Avatar
              size={48}
              source={candidate.photoUrl}
              style={{alignSelf: 'center', top: 3}}
            />
            <Text style={(AppFonts.listItemTitleTouchable, styles.title)}>
              {candidate.display.title}
            </Text>
          </View>
          <View style={StyleSheet.flatten([styles.itemSection, styles.body])}>
            {!!candidate.display.description && (
              <Text style={StyleSheet.flatten(AppFonts.listItemDescription)}>
                {candidate.display.description}
              </Text>
            )}
          </View>
          {!!candidate.photoLabel && (
            <View style={styles.itemSection}>
              <BubbleLabel
                height={18}
                textStyle={{fontSize: 12}}
                style={{width: 48, borderWidth: 0, backgroundColor: '#36D8A3'}}
                title={candidate.photoLabel}
              />
            </View>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  const renderShowMore = () => {
    return (
      <View
        key="show-more"
        style={StyleSheet.flatten([styles.listItem])}
        // onPress={this.props.onMorePress}
      >
        <View
          style={StyleSheet.flatten([
            styles.itemSection,
            styles.body,
            styles.showMoreBody,
          ])}
        >
          <Text
            style={StyleSheet.flatten([
              AppFonts.bodyTextNormalTouchable,
              showAllHighlight ? styles.buttonHighlight : {},
            ])}
          >
            Show All {candidatesCount} Candidates
          </Text>
        </View>
      </View>
    );
  };

  if (!showAll && index === 3) {
    return;
    renderShowMore();
  } else if (!showAll && index > 3) {
    return null;
  }

  return renderItem();
};

const styles = StyleSheet.create({
  listItem: {
    backgroundColor: variables.white,
    paddingLeft: 16,
    paddingRight: 8,
    borderTopWidth: 0.5,
    borderBottomColor: AppColors.gray,
    borderTopColor: AppColors.gray,
    borderRightColor: AppColors.gray,
  },
  title: {
    textAlignVertical: 'center',
    top: 3,
    fontSize: 18,
    color: AppColors.blue,
    marginLeft: 18,
  },
  buttonHighlight: {
    backgroundColor: AppColors.blue,
    color: AppColors.white,
    borderRadius: 6,
    padding: 5,
  },
  unviewed: {
    borderLeftColor: AppColors.white,
    borderLeftWidth: 5,
    paddingLeft: 11,
  },
  itemSection: {
    borderWidth: 0,
    paddingVertical: 5,
    paddingBottom: 4,
    flexDirection: 'row',
    borderBottomWidth: 0,
  },
  body: {
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
  showMoreBody: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default CandidateItem;
