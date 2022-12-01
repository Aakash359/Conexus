import React, {useEffect, useState} from 'react';
import {
  Text,
  StyleSheet,
  View,
  FlatList,
  Alert,
  Platform,
  RefreshControl,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import {FacilityNeedsStore} from '../../../stores';
import {AppColors, AppFonts} from '../../../theme';
import {ViewHeader} from '../../../components/view-header';
import {facilityNeedService} from '../../../services/Facility/facilityNeedService';
import {ActionButton} from '../../../components/action-button';
import NavigationService from '../../../navigation/NavigationService';

export interface PositionState {
  refreshing: boolean;
  expandedNeedId: string;
}

let needsStorePromise: Promise<any>;

const Positions = (state: PositionState) => {
  const mounted: boolean = false;
  const [loading, setLoading] = useState(false);
  const [expandedNeedId, setExpandedNeedId] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [needs, setNeeds] = useState([]);

  // const selectedFacility = (): any => {
  //   const {facilityNeedsStore, userStore} = this.props;

  //   if (facilityNeedsStore.loading) {
  //     return null;
  //   }

  //   if (userStore.selectedFacilityId) {
  //     return facilityNeedsStore.facilities.find(
  //       (i: {facilityId: any}) => i.facilityId === userStore.selectedFacilityId,
  //     );
  //   }

  //   return null;
  // };

  // const showNoData = (): boolean => {
  //   const {facilityNeedsStore} = this.props;
  //   if (this.state.refreshing || facilityNeedsStore.loading) {
  //     return false;
  //   }

  //   return (
  //     !this.selectedFacility ||
  //     facilityNeedsStore.loading ||
  //     this.selectedFacility.needs.length === 0
  //   );
  // };

  useEffect(() => {
    load(false);
  }, []);

  const load = async () => {
    setLoading(true);
    if (!needsStorePromise) {
      try {
        const {data} = await facilityNeedService();
        setNeeds(data?.[0]?.needs);
        setLoading(false);
      } catch (error) {
        console.log('Error', error);
        if (mounted) {
          setLoading(false);
        } else {
          setLoading(false);
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

  const showNeedQuestions = (item: any) => {
    NavigationService.navigate('InterviewQuestionDetail', {
      needId: item.needId,
      sectionTitle: item.display.title,
      title: 'Interview Questions',
    });
  };

  const toggleExpandedNeedId = (needId: string = '') => {
    if (expandedNeedId === needId) {
      setExpandedNeedId('');
    } else {
      setExpandedNeedId(needId);
    }
  };

  const renderNeedBodyMetric = (title: string, description: string) => {
    return (
      <View
        key={`need-metric-${title}-${description}`}
        style={{
          paddingHorizontal: 15,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
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
    return (
      <View
        key={`need-${options.id}-details`}
        style={[{flex: 1, marginBottom: 6, paddingBottom}]}
      >
        <ActionButton
          customStyle={styles.editVirtualBtn}
          customTitleStyle={styles.editVirtualBtnTxt}
          title={'EDIT VIRTUAL INTERVIEW'}
          onPress={options.onPress}
        />
      </View>
    );
  };

  const renderNeedDetail = (item: any, index: number) => {
    const titleParts = [];
    !!item.specialty && titleParts.push(item.specialty);
    !!item.discipline && titleParts.push(item.discipline);
    titleParts.push(item.needId);
    const descriptionParts = [];
    !!item.shift && descriptionParts.push(item.shift);
    const expanded = expandedNeedId === item.needId;
    let paddingBottom = 0;
    if (!expanded) {
      paddingBottom = index === item.length - 1 ? 18 : 0;
    }
    const cardButtons = [];
    if (expanded) {
      cardButtons.push(
        renderCardButton({
          id: item.needId,
          title: 'Edit Virtual Interview',
          onPress: () => {
            showNeedQuestions(item);
          },
          isLastCard: index === item.length - 1,
          firstButton: true,
          lastButton: true,
        }),
      );
    }
    const cardStyle = expanded
      ? [styles.listItemExpanded, {...getCardShadows()}]
      : [styles.listItem, {...getCardShadows()}];
    return (
      <View
        key={`need-${item.needId}`}
        style={{flex: 1, margin: 8, paddingBottom}}
      >
        <TouchableOpacity
          onPress={() => toggleExpandedNeedId(item.needId)}
          style={cardStyle}
        >
          <View style={StyleSheet.flatten([styles.itemSection, styles.body])}>
            <View
              style={{
                flex: 1,
                alignSelf: 'stretch',
                bottom: 2,
              }}
            >
              <Text
                style={{
                  ...AppFonts.listItemTitleTouchable,
                  paddingLeft: 0,
                }}
              >
                {item.display.title}
              </Text>
              <Text
                style={{
                  ...AppFonts.listItemDescription,
                  paddingLeft: 0,
                  paddingBottom: 8,
                }}
              >
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
    );
  };

  const renderNeedSection = (data: any) => {
    const {item, index} = data;

    return (
      <View key={index}>
        <ViewHeader
          key={`section-item-${index}`}
          title={item.Status}
          style={{
            paddingTop: 12,
            paddingBottom: 6,
            backgroundColor: AppColors.baseGray,
            borderBottomWidth: 0,
          }}
        />
        {item.needDetails.map(renderNeedDetail)}
      </View>
    );
  };

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
    <View style={{flex: 1, backgroundColor: AppColors.baseGray}}>
      {loading && (
        <ActivityIndicator
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            top: 0,
            bottom: 0,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        />
      )}
      <FlatList
        refreshControl={
          <RefreshControl
            tintColor={AppColors.blue}
            colors={[AppColors.blue]}
            refreshing={refreshing}
            onRefresh={() => load(true)}
          />
        }
        renderItem={renderNeedSection}
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
  padding: 15,
  paddingRight: 8,
  paddingLeft: 18,
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
    width: '100.2%',
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
