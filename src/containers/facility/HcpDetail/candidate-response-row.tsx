import React from 'react';
import {StyleSheet, View, TouchableOpacity, Text} from 'react-native';
import {AppFonts, AppColors} from '../../../theme';
import {Circle} from '../../../components';
import Icon from 'react-native-vector-icons/FontAwesome5';
import Icons from 'react-native-vector-icons/Ionicons';
export interface CandidateResponseRowProps {
  response: any;
  onPlayResponse: () => any;
}

export const CandidateResponseRow = (props: CandidateResponseRowProps) => {
  const {onPlayResponse, response} = props;

  const openResponse = () => {
    //Actions[ScreenType.FACILITIES.QUESTION_DETAIL_EDIT]({ question });
  };

  const playResponse = () => {
    if (onPlayResponse && !!onPlayResponse.call) {
      onPlayResponse();
    }
  };

  const renderRatingIcon = (rating: -1 | 0 | 1) => {
    return (
      <Circle
        size={24}
        color={rating === 1 ? AppColors.green : AppColors.red}
        style={styles.ratingCircle}
      >
        {rating === 1 && (
          <Icons
            style={styles.ratingIcon}
            name="thumbs-up"
            size={10}
            color={AppColors.white}
          />
        )}
        {rating === -1 && (
          <Icons
            style={styles.ratingIcon}
            name="thumbs-down"
            size={10}
            color={AppColors.white}
          />
        )}
      </Circle>
    );
  };

  const renderPlayIcon = () => {
    return (
      <Icons
        style={styles.circle}
        name={'play-circle-outline'}
        color={AppColors.blue}
        size={50}
      />
    );
  };

  return (
    <TouchableOpacity style={[styles.item]} onPress={() => playResponse()}>
      <View>
        {renderPlayIcon()}
        {response.feedbackResponse !== 0 &&
          renderRatingIcon(response.feedbackResponse as -1 | 0 | 1)}
      </View>
      <View style={{flex: 1, overflow: 'hidden'}}>
        <Text style={styles.text}>{response.questionText}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  item: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: AppColors.white,
    padding: 15,
    marginTop: 8,
    marginBottom: 4,
    marginHorizontal: 8,
    borderRadius: 6,
    borderBottomWidth: 1,
    borderBottomColor: AppColors.lightBlue,
  },

  text: {
    ...AppFonts.bodyTextMediumTouchable,
  },

  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 46,
    height: 46,
    marginRight: 12,
  },

  circle: {
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignContent: 'center',
    alignSelf: 'center',
  },

  playIcon: {
    margin: 16,
    width: 24,
    height: 24,
    position: 'relative',
    left: 6,
  },
  ratingCircle: {
    position: 'absolute',
    bottom: -2,
    right: -3,
    borderWidth: 2,
    borderColor: AppColors.white,
  },
  ratingIcon: {},
});
