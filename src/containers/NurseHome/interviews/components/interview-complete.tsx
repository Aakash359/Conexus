import React from 'react';
import {View, StyleSheet, Platform} from 'react-native';
import {Text} from 'native-base';
import {ScreenFooterButton} from '../../../../components';
// import { observer } from 'mobx-react'
// import { Actions } from 'react-native-router-flux'
import {AppFonts, AppColors} from '../../../../theme';
import {NurseSubmissionModel} from '../../../../stores';
import {CardHeader, CardInfoLine} from './../../position-card';
import {CachedImage} from 'react-native-cached-image';

interface InterviewCompleteProps {
  onClose?: () => any;
  submission: typeof NurseSubmissionModel.Type;
}

interface InterviewCompleteState {}

export class InterviewComplete extends React.Component<
  InterviewCompleteProps,
  InterviewCompleteState
> {
  constructor(props: InterviewCompleteProps, state: InterviewCompleteState) {
    super(props, state);

    this.state = {};
  }

  render() {
    const {submission} = this.props;
    let imageSource = {uri: submission.facilityImage};

    return (
      <View style={{flex: 1, padding: 20, backgroundColor: AppColors.baseGray}}>
        <Text style={styles.header}>
          Thank you for completing this virtual interview!
        </Text>
        <Text style={[styles.bodyText, {paddingTop: 12}]}>
          Your responses will be reviewed in consideration for the following
          position:
        </Text>

        <View style={[styles.card, getRowShadows()]}>
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
            <CardInfoLine description={submission.vendorName} info="" />
          </View>
        </View>

        <Text style={[styles.bodyText, {paddingTop: 8}]}>
          The facility will review your responses and may reach out to you for a
          live interview.
        </Text>
        <Text style={[styles.bodyText, {paddingTop: 18}]}>
          If you experienced issues during the virtual interview, please contact
          your staffing agency.
        </Text>

        <ScreenFooterButton
          title="Close"
          // onPress={() => Actions.pop()}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  header: {
    marginTop: 8,
    paddingHorizontal: 20,
    textAlign: 'center',
    ...AppFonts.bodyTextXtraXtraLarge,
    color: AppColors.blue,
    fontWeight: '700',
    marginBottom: 8,
  },

  bodyText: {
    ...AppFonts.bodyTextNormal,
    textAlign: 'center',
    paddingHorizontal: 20,
  },

  card: {
    backgroundColor: AppColors.white,
    borderRadius: 6,
    marginHorizontal: 10,
    marginVertical: 20,
  },

  facilityImageContainer: {
    overflow: 'hidden',
    height: 160,
  },

  facilityImage: {
    flex: 1,
    width: '100%',
    height: 160,
  },

  cardFooter: {
    paddingVertical: 8,
    borderRadius: 6,
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
