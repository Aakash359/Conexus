import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  View,
  Platform,
  Text,
  Alert,
} from 'react-native';
import {AppFonts, AppColors} from '../theme';
import BubbleLabel from './bubble-label';

export type TabDetails = {
  id: string;
  title: string;
  badge?: string;
  badgeColor?: string;
  badgeTextColor?: string;
};

interface TabBarProps {
  tabs: TabDetails[];
  selectedTabId?: string;
  onTabSelection: (selectedTab: TabDetails) => any;
}

interface TabBarState {
  selectedTab: TabDetails;
}

export const TabBar = (props: TabBarProps) => {
  const {tabs, style, selectedTabId, onTabSelection} = props;

  const [selectedTab, setSelectedTab] = useState(
    tabs.find(i => i.id === selectedTabId) || tabs[0],
  );

  //       this.props.tabs[0],)

  // constructor(props, state) {
  //   super(props, state);

  //   this.state = {
  //     selectedTab:
  //       this.props.tabs.find(i => i.id === this.props.selectedTabId) ||
  //       this.props.tabs[0],
  //   };
  // }

  // useEffect(()=>{
  //   const {tabs} = props;
  //   setSelectedTab(selectTab: tabs.find((i: { id: any; }) => i.id === selectedTabId) ||tabs[0])
  // },[])

  // componentWillReceiveProps(newProps: TabBarProps) {
  //   this.setState({
  //     selectedTab:
  //       newProps.tabs.find(i => i.id === newProps.selectedTabId) ||
  //       newProps.tabs[0],
  //   });
  // }

  const selectTab = (tab: TabDetails) => {
    setSelectedTab(tab);
    // props.onTabSelection(tab);
  };

  // const renderButton = (tab: TabDetails) => {
  //   const Selected = selectedTab === tab;

  //   return (
  //     <TouchableOpacity
  //       key={tab.id}
  //       style={Selected ? styles.buttonSelected : styles.button}
  //       onPress={selectTab(tab)}
  // >
  //       <View style={{flex: 1, alignItems: 'center', flexDirection: 'row'}}>
  //         <Text
  //           style={Selected ? styles.buttonSelectedText : styles.buttonText}>
  //           {tab.title}
  //         </Text>
  //         {!!tab.badge && (
  //           <BubbleLabel
  //             height={16}
  //             title={tab.badge}
  //             style={StyleSheet.flatten([
  //               styles.badge,
  //               {
  //                 width: tab.badge.length === 1 ? 16 : 24,
  //                 backgroundColor: tab.badgeColor || AppColors.green,
  //               },
  //             ])}
  //             textStyle={StyleSheet.flatten([
  //               styles.badgeText,
  //               {color: tab.badgeTextColor || AppColors.white},
  //             ])}
  //           />
  //         )}
  //       </View>
  //     </TouchableOpacity>
  //   );
  // };

  const tabElements = tabs.map(tab => {
    const Selected = selectedTab === tab;
    return (
      <>
        <TouchableOpacity
          key={tab.id}
          style={Selected ? styles.buttonSelected : styles.button}
          onPress={tab => selectTab(tab)}>
          <View style={{flex: 1, alignItems: 'center', flexDirection: 'row'}}>
            <Text
              style={Selected ? styles.buttonSelectedText : styles.buttonText}>
              {tab.title}
            </Text>
            {/* {!!tab.badge && ( */}
            <BubbleLabel
              height={16}
              title={tab.badge}
              style={StyleSheet.flatten([
                styles.badge,
                {
                  width: 24,
                  backgroundColor: tab.badgeColor || AppColors.green,
                },
              ])}
              textStyle={StyleSheet.flatten([
                styles.badgeText,
                {color: tab.badgeTextColor || AppColors.white},
              ])}
            />
            {/* )} */}
          </View>
        </TouchableOpacity>
      </>
    );
  });

  return (
    <View style={StyleSheet.flatten([styles.container, style])}>
      {tabElements}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderTopWidth: 1,
    borderColor: AppColors.lightBlue,
    flexDirection: 'row',
    alignItems: 'stretch',
  },

  button: {
    flex: 1,
    borderBottomWidth: 3.5,
    borderBottomColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },

  buttonSelected: {
    flex: 1,
    borderBottomWidth: 3.5,
    borderBottomColor: AppColors.blue,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },

  buttonText: {
    flex: 1,
    ...AppFonts.bodyTextMedium,
    color: AppColors.darkBlue,
    opacity: 0.8,
    borderBottomWidth: 0,
    borderBottomColor: 'transparent',
    textAlign: 'center',
  },

  buttonSelectedText: {
    flex: 1,
    ...AppFonts.bodyTextMedium,
    color: AppColors.darkBlue,
    borderBottomWidth: 0,
    borderBottomColor: 'transparent',
    textAlign: 'center',
  },

  badge: {
    position: 'absolute',
    top: -9,
    right: -9,
    borderWidth: 0,
  },

  badgeText: {
    ...AppFonts.buttonTextSmall,
    backgroundColor: 'transparent',
    position: 'relative',
    top: Platform.OS === 'android' ? 0 : 1,
    fontSize: 11,
    lineHeight: 13,
    fontWeight: '700',
  },
});
