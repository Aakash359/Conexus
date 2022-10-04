import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  Text,
  View,
  Alert,
  Image,
} from 'react-native';
import variables, {AppColors} from '../../../theme';
import {AppFonts} from '../../../theme';
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
  const {candidate, index, showAll, candidatesCount, showAllHighlight} = props;

  const [subViewed, setSubViewed] = useState(false);

  useEffect(() => {
    setSubViewed(props.candidate.viewedSubmission);
  });

  const renderItem = (item: any) => {
    return (
      <TouchableOpacity
        activeOpacity={1}
        onPress={() =>
          NavigationService.navigate('HcpDetailView', {
            submissionId: item.submissionId,
            candidate: item,
            onClose: () => {
              props.updateViewed(item.submissionId);
            },
          })
        }
      >
        <View
          key={item.userId}
          style={StyleSheet.flatten([
            styles.listItem,
            !!!item.viewedSubmission ? styles.unviewed : {},
          ])}
        >
          <View style={styles.itemSection}>
            {item.photoUrl ? (
              <Image
                source={{
                  uri: item.photoUrl,
                }}
                style={styles.circleStyle}
              />
            ) : (
              <Image
                source={require('../../../components/Images/bg.png')}
                style={styles.circleStyle}
              />
            )}
            <Text style={(AppFonts.listItemTitleTouchable, styles.title)}>
              {item.display.title}
            </Text>
          </View>
          <View style={StyleSheet.flatten([styles.itemSection, styles.body])}>
            {!!item.display.description && (
              <Text style={StyleSheet.flatten(AppFonts.listItemDescription)}>
                {item.display.description}
              </Text>
            )}
          </View>
          {/* {!!item.photoLabel && (
            <View style={styles.itemSection}>
              <BubbleLabel
                height={18}
                textStyle={{
                  fontSize: 12,
                }}
                style={{
                  width: 48,
                  borderWidth: 0,
                  backgroundColor: '#36D8A3',
                }}
                title={item.photoLabel}
              />
            </View>
          )} */}
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

  return candidate.map(renderItem);
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
  circleStyle: {
    width: 50,
    height: 50,
    alignSelf: 'center',
    borderRadius: 50 / 2,
    borderWidth: 2,
    borderColor: AppColors.imageColor,
  },
  title: {
    fontSize: 18,
    alignSelf: 'center',
    width: '55%',
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
    paddingVertical: 2,
    marginTop: 5,
    bottom: -2,
    alignContent: 'center',
    flexDirection: 'row',
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
