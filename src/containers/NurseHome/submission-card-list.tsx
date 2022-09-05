import React from 'react';
import {StyleSheet, View, ViewProperties, Platform} from 'react-native';

import {AppSizes, AppColors} from '../../theme';
import {NurseSubmissionModel} from '../../stores';
import {IndicatorViewPager, PagerDotIndicator} from 'rn-viewpager';
import {ActionButton} from '../../components';
import {CardHeader, CardInfoLine} from './position-card';
import {CachedImage} from 'react-native-cached-image';

interface SubmissionCardListProps extends ViewProperties {
  style?: any;
  submissions: typeof NurseSubmissionModel.Type[];
  onSubmissionAction(submissionId: string, actionType: string);
}

export class SubmissionCardList extends React.Component<
  SubmissionCardListProps,
  any
> {
  _renderCards() {
    const {submissions, onSubmissionAction} = this.props;

    const views = submissions.map((submission, index) => {
      let imageSource = {uri: submission.facilityImage};

      return (
        <View
          key={`${submission.submissionId}-${index}`}
          style={[styles.nurseCardContainer]}>
          <View
            style={[
              styles.card,
              getRowShadows(),
              index === 0 ? {marginLeft: 0} : {},
            ]}>
            <CardHeader
              title={submission.display.title}
              description={submission.display.description}
            />
            <View style={[styles.facilityImageContainer]}>
              <CachedImage
                source={imageSource}
                resizeMode="cover"
                style={[styles.facilityImage]}
              />
            </View>
            <View style={styles.cardFooter}>
              <CardInfoLine
                title={submission.position.display.title}
                description={submission.position.display.description}
              />
              <CardInfoLine
                description={submission.vendorName}
                info={
                  submission.questionCount.toString() +
                  ' question' +
                  (submission.questionCount > 1 ? 's' : '')
                }
              />
              <View style={{height: 8}} />
              <View style={styles.actionFooter}>
                <ActionButton
                  primary
                  title={submission.actionText}
                  onPress={() =>
                    onSubmissionAction(
                      submission.submissionId,
                      submission.actionType,
                    )
                  }
                />
              </View>
            </View>
          </View>
        </View>
      );
    });

    return views;
  }

  _renderDotIndicator() {
    const {submissions} = this.props;
    const length = submissions.length;

    return (
      <PagerDotIndicator
        dotStyle={styles.pagerDot}
        selectedDotStyle={styles.pagerDotSelected}
        pageCount={length < 15 ? length : 15}
        hideSingle={true}
      />
    );
  }

  render() {
    const {style} = this.props;

    return (
      <IndicatorViewPager
        style={[styles.pager, style]}
        indicator={this._renderDotIndicator()}>
        {this._renderCards()}
      </IndicatorViewPager>
    );
  }
}

const styles = StyleSheet.create({
  pager: {
    height: 440,
    width: AppSizes.screen.width - 40,
    marginLeft: 20,
  },

  pagerDot: {
    backgroundColor: AppColors.white,
    borderWidth: 1,
    borderColor: 'rgba(52,170,224,.4)',
    width: 13,
    height: 13,
    borderRadius: 13,
  },

  pagerDotSelected: {
    backgroundColor: AppColors.blue,
    borderWidth: 1,
    borderColor: AppColors.blue,
    width: 13,
    height: 13,
    borderRadius: 13,
  },

  nurseCardContainer: {},

  card: {
    flex: 1,
    backgroundColor: AppColors.white,
    marginBottom: 40,
    borderRadius: 6,
    marginRight: 10,
    marginLeft: 10,
  },

  facilityImageContainer: {
    flex: 1,
    overflow: 'hidden',
  },

  facilityImage: {
    flex: 1,
    width: '100%',
    height: '100%',
  },

  cardFooter: {
    paddingVertical: 10,
    borderRadius: 6,
  },

  actionFooter: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 80,
    paddingTop: 15,
    backgroundColor: '#FFF',
    borderTopColor: AppColors.lightBlue,
    borderTopWidth: 1,
  },
});

const getRowShadows = () => {
  return Platform.OS === 'android'
    ? {
        elevation: 2,
        marginHorizontal: 30,
      }
    : {
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 0.8},
        shadowOpacity: 0.1,
        shadowRadius: 1,
      };
};
