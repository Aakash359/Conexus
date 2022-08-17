import React, {useEffect, useState} from 'react';
import {
  Text,
  Button,
  StyleSheet,
  View,
  FlatList,
  Alert,
  Platform,
  RefreshControl,
  TouchableOpacity,
} from 'react-native';
import {
  FacilityNeedsStore,
  FacilityNeedsModel,
  NeedSummaryModel,
  NeedDetailModel,
  UserStore,
} from '../../../stores';
import {ScreenType} from '../../../common/constants';
import {AppColors, AppFonts} from '../../../theme';
import {ViewHeader} from '../../../components/view-header';
import FacilitySelectionContainer from '../../../components/facility-selection-container';
import {facilityNeedService} from '../../../services/facility/facilityNeedService';
import {ActionButton} from '../../../components/action-button';
import {windowDimensions} from '../../../common/window-dimensions';
import NavigationService from '../../../navigation/NavigationService';

export interface PositionsProps {
  facilityNeedsStore: typeof FacilityNeedsStore.Type;
  userStore: UserStore;
}

export interface PositionState {
  refreshing: boolean;
  expandedNeedId: string;
}

let needsStorePromise: Promise<any>;

const Positions = (props: PositionsProps, state: PositionState) => {
  const mounted: boolean = false;

  const [expandedNeedId, setExpandedNeedId] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [needs, setNeeds] = useState([]);

  const selectedFacility = (): any => {
    const {facilityNeedsStore, userStore} = this.props;

    if (facilityNeedsStore.loading) {
      return null;
    }

    if (userStore.selectedFacilityId) {
      return facilityNeedsStore.facilities.find(
        (i: {facilityId: any}) => i.facilityId === userStore.selectedFacilityId,
      );
    }

    return null;
  };

  const showNoData = (): boolean => {
    const {facilityNeedsStore} = this.props;
    if (this.state.refreshing || facilityNeedsStore.loading) {
      return false;
    }

    return (
      !this.selectedFacility ||
      facilityNeedsStore.loading ||
      this.selectedFacility.needs.length === 0
    );
  };

  const showLoading = (): boolean => {
    const {facilityNeedsStore} = this.props;
    if (this.state.refreshing) {
      return false;
    }
    return facilityNeedsStore.loading;
  };

  useEffect(() => {
    let mounted = true;
    load(false);
  }, []);

  const showNeedQuestions = (need: typeof NeedDetailModel.Type) => {
    NavigationService.navigate('InterviewQuestions');
    // Actions[ScreenType.FACILITIES.CATALOG_SECTION]({
    //     //questionSectionId: section.sectionId,
    //     needId: need.needId,
    //     sectionTitleOverride: need.display.title,
    //     onSave: this.load.bind(this)
    // })
  };

  const toggleExpandedNeedId = (needId: string = '') => {
    if (expandedNeedId === needId) {
      setExpandedNeedId('');
    } else {
      setExpandedNeedId(needId);
    }
  };

  const load = async (refreshing: boolean = false) => {
    // setRefreshing(refreshing);

    if (!needsStorePromise) {
      try {
        const {data} = await facilityNeedService();
        setNeeds(data?.[0]?.needs);
      } catch (error) {
        console.log('Error', error);
        if (mounted) {
          setRefreshing(false);
        } else {
          console.log(
            'NeedContainer',
            'Not mounted so doing nothing after data loaded.',
          );
          Alert.alert(
            'Error',
            'We are having trouble loading needs. Please try again.',
          );
        }
      }
    }
  };

  const renderNeedBodyMetric = (title: string, description: string) => {
    return (
      <View
        key={`need-metric-${title}-${description}`}
        style={{
          paddingHorizontal: 6,
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <Text style={{...AppFonts.bodyTextXtraSmall, paddingBottom: 4}}>
          {title}
        </Text>
        <Text style={{...AppFonts.bodyTextXtraLarge}}>{description}</Text>
      </View>
    );
  };

  const renderNeedBody = (need: any) => {
    return need.stats.map((stat: {title: string; description: string}) =>
      renderNeedBodyMetric(stat.title, stat.description),
    );
  };

  const renderCardButton = (options: {
    id: string;
    title: string;
    onPress: () => any;
    isLastCard: boolean;
    firstButton: boolean;
    lastButton: boolean;
  }) => {
    const paddingBottom = options.isLastCard ? 18 : 0;
    const buttonStyle =
      styles[
        `cardButton${options.firstButton ? 'First' : ''}${
          options.lastButton ? 'Last' : ''
        }`
      ];
    return (
      <View
        key={`need-${options.id}-details`}
        style={[{flex: 1, marginBottom: 6, paddingBottom}]}>
        <ActionButton
          customStyle={styles.editVirtualBtn}
          customTitleStyle={styles.editVirtualBtnTxt}
          title={'EDIT VIRTUAL INTERVIEW'}
          onPress={options.onPress}
        />
      </View>
    );
  };

  //   renderNeed(need: typeof NeedDetailModel.Type, index: number, needs: typeof NeedDetailModel.Type[]) {
  //     const { expandedNeedId } = this.state;

  //     const titleParts = []
  //     !!need.specialty && titleParts.push(need.specialty)
  //     !!need.discipline && titleParts.push(need.discipline)
  //     titleParts.push(need.needId)

  //     const descriptionParts = []
  //     !!need.shift && descriptionParts.push(need.shift)

  //     const expanded = expandedNeedId === need.needId

  //     let paddingBottom = 0;
  //     let result = []

  //     if (!expanded) {
  //         paddingBottom = (index === needs.length - 1 ? 18 : 0)
  //     }

  //     const cardButtons = [];
  //     if (expanded) {
  //         cardButtons.push(this.renderCardButton({
  //             id: need.needId,
  //             title: 'Edit Virtual Interview',
  //             onPress: () => { this.showNeedQuestions(need) },
  //             isLastCard: index === needs.length - 1,
  //             firstButton: true,
  //             lastButton: true
  //         }))
  //     }

  //     const cardStyle = expanded ? [styles.listItemExpanded, { ...getCardShadows() }] : [styles.listItem, { ...getCardShadows() }]

  //     result.push(
  //         <View key={`need-${need.needId}`} style={{ flex: 1, margin: 8, paddingBottom }}>
  //             <TouchableOpacity onPress={this.toggleExpandedNeedId.bind(this, need.needId)} style={cardStyle}>
  //                 <Body style={StyleSheet.flatten([styles.itemSection, styles.body])}>
  //                     <View style={{ flex: 1, alignSelf: 'stretch' }}>
  //                         <Text style={{ ...AppFonts.listItemTitleTouchable, paddingLeft: 0 }}>{need.display.title}</Text>
  //                         <Text style={{ ...AppFonts.listItemDescription, paddingLeft: 0, paddingBottom: 8 }}>{need.display.description}</Text>
  //                         <View style={[styles.listItemBodyDetail]}>
  //                             {this.renderNeedBody(need)}
  //                         </View>
  //                     </View>
  //                 </Body>
  //             </TouchableOpacity>
  //             {cardButtons}
  //         </View>
  //     )

  //     return result
  // }

  const renderNeedSection = (item: undefined, index: undefined) => {
    const needSummary = needs;
    const needSummaryData = needSummary.flatMap(item => item.needDetails);
    const result = needSummaryData.map(item => {
      const expanded = expandedNeedId === item.needId;
      let paddingBottom = 0;
      if (!expanded) {
        paddingBottom = index === needs.length - 1 ? 18 : 0;
      }
      const cardStyle = expanded
        ? [styles.listItemExpanded, {...getCardShadows()}]
        : [styles.listItem, {...getCardShadows()}];

      const cardButtons = [];
      if (expanded) {
        cardButtons.push(
          renderCardButton({
            id: item.needId,
            title: 'Edit Virtual Interview',
            onPress: () => {
              showNeedQuestions(item);
            },
            isLastCard: index === needs.length - 1,
            firstButton: true,
            lastButton: true,
          }),
        );
      }

      return (
        <>
          <View
            key={`need-${item.needId}`}
            style={{flex: 1, margin: 8, paddingBottom}}>
            <TouchableOpacity
              onPress={() => toggleExpandedNeedId(item.needId)}
              style={cardStyle}>
              <View
                style={StyleSheet.flatten([styles.itemSection, styles.body])}>
                <View style={{flex: 1, alignSelf: 'stretch'}}>
                  <Text
                    style={{
                      ...AppFonts.listItemTitleTouchable,
                      paddingLeft: 0,
                    }}>
                    {item.display.title}
                  </Text>
                  <Text
                    style={{
                      ...AppFonts.listItemDescription,
                      paddingLeft: 0,
                      paddingBottom: 8,
                    }}>
                    {item.display.description}
                  </Text>
                  <View style={[styles.listItemBodyDetail]}>
                    {renderNeedBody(item)}
                  </View>
                </View>
              </View>
            </TouchableOpacity>
            {cardButtons}
          </View>
        </>
      );
    });
    return result;
  };

  //   return (
  //     <>
  //       <View
  //         // key={`need-${item.needId}`}
  //         style={{flex: 1, margin: 8}}>
  //         <Text>hi</Text>
  //         {/* <TouchableOpacity
  //           // onPress={toggleExpandedNeedId(item.needId)}
  //           style={cardStyle}>
  //           <View style={StyleSheet.flatten([styles.itemSection, styles.body])}>
  //             <View style={{flex: 1, alignSelf: 'stretch'}}>
  //               <Text
  //                 style={{...AppFonts.listItemTitleTouchable, paddingLeft: 0}}>
  //                 {item.display.title}
  //               </Text>
  //               <Text
  //                 style={{
  //                   ...AppFonts.listItemDescription,
  //                   paddingLeft: 0,
  //                   paddingBottom: 8,
  //                 }}>
  //                 {item.display.description}
  //               </Text>
  //               <View style={[styles.listItemBodyDetail]}>
  //                 {renderNeedBody(item)}
  //               </View>
  //             </View>
  //           </View>
  //         </TouchableOpacity>
  //         {cardButtons}  */}
  //       </View>
  //     </>
  //   );
  // };

  // const {facilityNeedsStore, userStore} = this.props;
  // const facility = facilityNeedsStore
  //   .getSnapshot()
  //   .facilities.find(i => i.facilityId === userStore.selectedFacilityId);
  // const needs = facility ? facility.needs : [] || [];

  return (
    // <FacilitySelectionContainer
    //   // showNoData={showNoData}
    //   // showLoading={showLoading}
    //   noDataText="No Needs Available"
    //   facilityHeaderCaption="Showing needs for"
    //   // refreshing={refreshing}
    //   // onRefresh={this.load.bind(this, true)}
    //   onFacilityChosen={(facilityId: string) => forceUpdate()}>

    // </FacilitySelectionContainer>
    <View style={{flex: 1}}>
      <FlatList
        refreshControl={
          <RefreshControl
            tintColor={AppColors.blue}
            colors={[AppColors.blue]}
            refreshing={refreshing}
            // onRefresh={load(false)}
          />
        }
        renderItem={item => renderNeedSection()}
        data={needs}
      />
    </View>
  );
};

const getCardShadows = () => {
  return Platform.OS === 'android'
    ? {
        elevation: 2,
        //marginHorizontal: 30,
      }
    : {
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 0.8},
        shadowOpacity: 0.1,
        shadowRadius: 1,
      };
};

const cardDefaults = {
  backgroundColor: AppColors.white,
  paddingRight: 8,
  paddingLeft: 6,
  borderRadius: 6,
};

const cardButtonDefaults = {
  flex: 1,
  alignSelf: 'stretch',
  alignItems: 'center',
  justifyContent: 'center',
  borderTopRightRadius: 0,
  borderTopLeftRadius: 0,
  borderBottomLeftRadius: 0,
  borderBottomRightRadius: 0,
  backgroundColor: AppColors.white,
  borderTopWidth: 1,
  borderTopColor: AppColors.baseGray,
  ...getCardShadows(),
};

const styles = StyleSheet.create({
  listItem: {
    ...(cardDefaults as any),
  },
  editVirtualBtn: {
    justifyContent: 'center',
    alignSelf: 'center',
    backgroundColor: AppColors.white,
    height: 45,
    borderRadius: 0,
    borderColor: AppColors.gray,
    borderWidth: 0.5,
  },
  editVirtualBtnTxt: {
    justifyContent: 'center',
    alignSelf: 'center',
    fontSize: 20,
    ...AppFonts.listItemTitleTouchable,
    color: AppColors.blue,
  },
  listItemExpanded: {
    ...(cardDefaults as any),
    borderBottomWidth: 0,
    borderTopLeftRadius: 6,
    borderTopRightRadius: 6,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
  },
  listItemBodyDetail: {
    flex: 1,
    flexDirection: 'row',
    alignSelf: 'stretch',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 8,
    paddingBottom: 16,
  },
  itemSection: {
    borderWidth: 0,
    borderBottomWidth: 0,
  },
  body: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    padding: 0,
  },
  cardButton: {
    ...(cardButtonDefaults as any),
  },
  cardButtonFirst: {
    ...(cardButtonDefaults as any),
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
  },
  cardButtonLast: {
    ...(cardButtonDefaults as any),
    borderTopRightRadius: 0,
    borderTopLeftRadius: 0,
  },
  cardButtonFirstLast: {
    ...(cardButtonDefaults as any),
    borderTopRightRadius: 0,
    borderTopLeftRadius: 0,
  },

  cardButtonText: {
    color: AppColors.blue,
  },
});

export default Positions;
