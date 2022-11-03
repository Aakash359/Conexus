import React, {useState, createRef} from 'react';
import {
  StyleSheet,
  View,
  Platform,
  Text,
  Image,
  ScrollView,
} from 'react-native';
import {AppFonts, AppColors, AppSizes} from '../../theme';
import Styles from '../../theme/styles';
import Tabs from '../../components/customTab';
// import {TabBar, TabDetails, Avatar, IconTitleBlock} from '../../components';
import {NurseSubmissionsStore, NurseSubmissionModel} from '../../stores';
import IconTitleBlock from '../../components/icon-title-block';

interface PastSubmissionsTabListProps {
  nurseHomeData?: any;
  style: any;
}

interface PastSubmissionsTabListState {
  selectedTab: any;
  navigation: any;
}

const completedTabId = 'completed';
const closedTabId = 'closed';

const PastSubmissionsTabList = (
  props: PastSubmissionsTabListProps,
  state: PastSubmissionsTabListState,
) => {
  const [loading, setLoading] = useState(false);
  const {style, submissionData, navigation} = props;
  console.log('nurseHomeData====>', submissionData);

  const VirtualInterView = () => {
    return (
      <View
      // style={{flex: 1, backgroundColor: AppColors.baseGray, marginTop: 40}}
      >
        {/* {loadingSummary && renderLoading(100)}
         <ConexusContentList
           style={styles.contentList}
           data={candidate.submissionSummary}
         /> */}
      </View>
    );
  };

  const Summary = () => {
    return (
      <View
      // style={{flex: 1, backgroundColor: AppColors.baseGray, marginTop: 40}}
      >
        {/* {loadingSummary && renderLoading(100)}
         <ConexusContentList
           style={styles.contentList}
           data={candidate.submissionSummary}
         /> */}
      </View>
    );
  };

  const NURSE_TAB = [
    {
      name: 'Completed',
      key: 'completed',
      component: Summary,
      ref: createRef(),
      idx: 0,
    },
    {
      name: 'Closed',
      key: 'closed',
      component: VirtualInterView,
      ref: createRef(),
      idx: 1,
    },
  ];

  const renderTabs = (completedLength: number, closedLength: number) => {
    // if (!tabs.filter(i => i.id === selectedTab.id)) {
    //   selectedTab = tabs[0];
    //   setSelectedTab(selectedTab);
    // }
    return (
      <Tabs
        style={styles.tabBar}
        data={NURSE_TAB.map(_ => ({..._}))}
        navigation={navigation}
      />
    );
  };

  const renderSubmissions = (completed: any, closed: any) => {
    let showTopBorder = true;
    const tab = NURSE_TAB.map((i: any) => i.key);
    // submissions = selectedTab.id === completedTabId ? completed : closed;
    showTopBorder = false;

    const noDataMessage =
      tab?.[0] == 'completed'
        ? 'You have not completed any interviews.'
        : 'You have no closed interviews.';
    return (
      <ScrollView
        style={[
          {backgroundColor: AppColors.white, ...getRowShadows()},
          showTopBorder ? styles.blueBorderTop : {},
        ]}
      >
        {!submissionData.length && (
          <IconTitleBlock
            style={styles.emptyBlock}
            color={AppColors.blue}
            text={noDataMessage}
          />
        )}
        {submissionData.length &&
          submissionData.map((item: any, index: number) => (
            <>
              <View
                key={item.submissionId.toString() + index}
                style={styles.listItem}
              >
                <View style={styles.wrapperView}>
                  <View style={styles.body}>
                    <Text style={[{...AppFonts.listItemTitle}]}>
                      {item.display.title}
                    </Text>
                    <Text style={[{...AppFonts.listItemDescription}]}>
                      {item.display.description}
                    </Text>
                  </View>
                  <Image
                    source={{
                      uri: item.facilityImage,
                    }}
                    style={styles.circleStyle}
                  />
                </View>
              </View>
            </>
          ))}
      </ScrollView>
    );
  };

  const completedInterviews = () => {
    return submissionData.filter((i: any) => {
      return (
        i.interviewStatus === 'Completed' || i.interviewStatus === 'Complete'
      );
    });
  };

  const closedInterviews = () => {
    return submissionData.filter((i: any) => {
      return i.interviewStatus === 'Closed';
    });
  };
  const completed = completedInterviews();
  const closed = closedInterviews();

  if (completed.length || closed.length) {
    return (
      <View style={[styles.container, style]}>
        {renderTabs(completed.length, closed.length)}
        {renderSubmissions(completed, closed)}
      </View>
    );
  }

  return <View />;
  // }
};

const styles = StyleSheet.create({
  container: {
    minHeight: AppSizes.screen.height * 0.75,
  },
  header: {
    textAlign: 'center',
    paddingTop: 38,
    paddingBottom: 24,
    ...AppFonts.bodyTextMedium,
    color: AppColors.darkBlue,
  },
  blueBorderTop: {
    borderTopColor: AppColors.blue,
    borderTopWidth: 4,
  },
  wrapperView: {
    flexDirection: 'row',
  },
  tabBar: {
    marginTop: 18,
    backgroundColor: AppColors.white,
    borderTopColor: AppColors.lightBlue,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderBottomColor: AppColors.lightBlue,
  },
  circleStyle: {
    width: 40,
    height: 40,
    marginLeft: 100,
    alignSelf: 'center',
    borderRadius: 40 / 2,
    borderWidth: 2,
    borderColor: AppColors.imageColor,
  },
  listItem: {
    backgroundColor: AppColors.white,
    borderBottomWidth: 0.5,
    borderBottomColor: AppColors.lightBlue,
  },
  body: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    paddingTop: 8,
    justifyContent: 'center',
    alignSelf: 'center',
    paddingHorizontal: 10,
    paddingBottom: 8,
    borderWidth: 0,
    borderBottomWidth: 0,
  },
  emptyBlock: {
    paddingVertical: 80,
  },
});
const getRowShadows = () => {
  return Platform.OS === 'android'
    ? {
        elevation: 2,
      }
    : {
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 0.8},
        shadowOpacity: 0.1,
        shadowRadius: 1,
      };
};

export default PastSubmissionsTabList;
