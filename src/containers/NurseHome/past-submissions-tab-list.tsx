import React, {useState, useEffect} from 'react';
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

const tabs = [
  {id: completedTabId, title: 'Completed'},
  {id: closedTabId, title: 'Closed'},
];

const PastSubmissionsTabList = (
  props: PastSubmissionsTabListProps,
  state: PastSubmissionsTabListState,
) => {
  const [loading, setLoading] = useState(false);
  const [selectedTab, setSelectedTab] = useState(tabs[0]);
  const {style, nurseHomeData, navigation} = props;

  const renderTabs = (completedLength: number, closedLength: number) => {
    if (!tabs.filter(i => i.id === selectedTab.id)) {
      selectedTab = tabs[0];
      setSelectedTab(selectedTab);
    }

    if (selectedTab) {
      return null;
      <Tabs
        style={styles.tabBar}
        selectedTabId={selectedTab.id}
        data={tabs}
        navigation={navigation}
        onTabSelection={tab => this.setState({selectedTab: tab})}
      />;
    }
    return {};
  };

  const renderSubmissions = (completed: any, closed: any) => {
    let submissions: any;
    let showTopBorder = true;

    submissions = selectedTab.id === completedTabId ? completed : closed;
    showTopBorder = false;

    const noDataMessage =
      selectedTab.id === completedTabId
        ? 'You have not completed any interviews.'
        : 'You have no closed interviews.';
    return (
      <ScrollView
        style={[
          {backgroundColor: AppColors.white, ...getRowShadows()},
          showTopBorder ? styles.blueBorderTop : {},
        ]}
      >
        {!submissions.length && (
          <IconTitleBlock
            style={styles.emptyBlock}
            color={AppColors.blue}
            text={noDataMessage}
          />
        )}
        {submissions.length &&
          submissions.map((item: any, index: number) => (
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
    return nurseHomeData.filter((i: any) => {
      return (
        i.interviewStatus === 'Completed' || i.interviewStatus === 'Complete'
      );
    });
  };

  const closedInterviews = () => {
    return nurseHomeData.filter((i: any) => {
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
