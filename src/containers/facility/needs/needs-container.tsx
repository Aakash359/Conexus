import React from 'react';
import {Text, ListItem, Body, Button} from 'native-base';
import {
  ViewProperties,
  StyleSheet,
  View,
  FlatList,
  Alert,
  Platform,
  RefreshControl,
} from 'react-native';
import {
  FacilityNeedsStore,
  FacilityNeedsModel,
  NeedSummaryModel,
  NeedDetailModel,
  UserStore,
} from '../../../stores';
// import { Actions } from 'react-native-router-flux'
import {logger} from 'react-native-logs';

import {ScreenType} from '../../../common/constants';
import {AppColors, AppFonts} from '../../../theme';
import {ViewHeader, FacilitySelectionContainer} from '../../../components';

export interface NeedsContainerProps extends ViewProperties {
  facilityNeedsStore: typeof FacilityNeedsStore.Type;
  userStore: UserStore;
}

export interface NeedsContainerState {
  refreshing: boolean;
  expandedNeedId: string;
}

let needsStorePromise: Promise<any>;
const log = logger.createLogger();

export class NeedsContainer extends React.Component<
  NeedsContainerProps,
  NeedsContainerState
> {
  mounted: boolean = false;

  get selectedFacility(): typeof FacilityNeedsModel.Type {
    const {facilityNeedsStore, userStore} = this.props;

    if (facilityNeedsStore.loading) {
      return null;
    }

    if (userStore.selectedFacilityId) {
      return facilityNeedsStore.facilities.find(
        i => i.facilityId === userStore.selectedFacilityId,
      );
    }

    return null;
  }

  get showNoData(): boolean {
    const {facilityNeedsStore} = this.props;
    if (this.state.refreshing || facilityNeedsStore.loading) {
      return false;
    }

    return (
      !this.selectedFacility ||
      facilityNeedsStore.loading ||
      this.selectedFacility.needs.length === 0
    );
  }

  get showLoading(): boolean {
    const {facilityNeedsStore} = this.props;
    if (this.state.refreshing) {
      return false;
    }
    return facilityNeedsStore.loading;
  }

  constructor(props, state) {
    super(props, state);

    this.state = {
      refreshing: false,
      expandedNeedId: '',
    };

    log.info('NeedContainer', 'constructor');
  }

  componentDidMount() {
    this.mounted = true;

    if (this.props.userStore.isFacilityUser) {
      this.load(false);
    }
  }

  showNeedQuestions(need: typeof NeedDetailModel.Type) {
    // Actions[ScreenType.FACILITIES.CATALOG_SECTION]({
    //     //questionSectionId: section.sectionId,
    //     needId: need.needId,
    //     sectionTitleOverride: need.display.title,
    //     onSave: this.load.bind(this)
    // })
  }

  toggleExpandedNeedId(needId: string = '') {
    let {expandedNeedId} = this.state;

    if (expandedNeedId === needId) {
      expandedNeedId = '';
    } else {
      expandedNeedId = needId;
    }

    this.setState({expandedNeedId});
  }

  load(refreshing: boolean = false) {
    const {facilityNeedsStore} = this.props;

    this.setState({refreshing});

    if (!needsStorePromise) {
      log.info('NeedContainer', 'Loading needs', refreshing);
      needsStorePromise = facilityNeedsStore.load();
    } else {
      log.info('NeedContainer', 'Joining existing need store load', refreshing);
    }

    needsStorePromise
      .then(() => {
        if (this.mounted) {
          log.info('NeedContainer', 'Needs loaded');

          this.setState({refreshing: false}, () => {
            needsStorePromise = undefined;
          });
        } else {
          log.info(
            'NeedContainer',
            'Not mounted so doing nothing after data loaded.',
          );
        }
      })
      .catch(error => {
        if (this.mounted) {
          this.setState({refreshing: false}, () => {
            needsStorePromise = undefined;
          });
        } else {
          log.info(
            'NeedContainer',
            'Not mounted so doing nothing after data loaded.',
          );
        }
        log.info('NeedsContainer', 'ERROR', error);
        Alert.alert(
          'Error',
          'We are having trouble loading needs. Please try again.',
        );
      });
  }

  renderNeedBodyMetric(title: string, description: string) {
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
  }

  renderNeedBody(need: typeof NeedDetailModel.Type) {
    return need.stats.map(stat =>
      this.renderNeedBodyMetric(stat.title, stat.description),
    );
  }

  renderCardButton(options: {
    id: string;
    title: string;
    onPress: () => any;
    isLastCard: boolean;
    firstButton: boolean;
    lastButton: boolean;
  }) {
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
        <Button style={buttonStyle} onPress={options.onPress}>
          <Text style={styles.cardButtonText}>{options.title}</Text>
        </Button>
      </View>
    );
  }

  renderNeed(
    need: typeof NeedDetailModel.Type,
    index: number,
    needs: typeof NeedDetailModel.Type[],
  ) {
    const {expandedNeedId} = this.state;

    const titleParts = [];
    !!need.specialty && titleParts.push(need.specialty);
    !!need.discipline && titleParts.push(need.discipline);
    titleParts.push(need.needId);

    const descriptionParts = [];
    !!need.shift && descriptionParts.push(need.shift);

    const expanded = expandedNeedId === need.needId;

    let paddingBottom = 0;
    let result = [];

    if (!expanded) {
      paddingBottom = index === needs.length - 1 ? 18 : 0;
    }

    const cardButtons = [];
    if (expanded) {
      cardButtons.push(
        this.renderCardButton({
          id: need.needId,
          title: 'Edit Virtual Interview',
          onPress: () => {
            this.showNeedQuestions(need);
          },
          isLastCard: index === needs.length - 1,
          firstButton: true,
          lastButton: true,
        }),
      );
    }

    const cardStyle = expanded
      ? [styles.listItemExpanded, {...getCardShadows()}]
      : [styles.listItem, {...getCardShadows()}];

    result.push(
      <View
        key={`need-${need.needId}`}
        style={{flex: 1, margin: 8, paddingBottom}}>
        <ListItem
          onPress={this.toggleExpandedNeedId.bind(this, need.needId)}
          style={cardStyle}>
          <Body style={StyleSheet.flatten([styles.itemSection, styles.body])}>
            <View style={{flex: 1, alignSelf: 'stretch'}}>
              <Text
                style={{...AppFonts.listItemTitleTouchable, paddingLeft: 0}}>
                {need.display.title}
              </Text>
              <Text
                style={{
                  ...AppFonts.listItemDescription,
                  paddingLeft: 0,
                  paddingBottom: 8,
                }}>
                {need.display.description}
              </Text>
              <View style={[styles.listItemBodyDetail]}>
                {this.renderNeedBody(need)}
              </View>
            </View>
          </Body>
        </ListItem>
        {cardButtons}
      </View>,
    );

    return result;
  }

  renderNeedSection({item, index}) {
    const needSummary = item as typeof NeedSummaryModel.Type;
    const result = needSummary.needDetails.map(this.renderNeed.bind(this));

    if (result.length) {
      result.unshift(
        <ViewHeader
          key={`section-item-${index}`}
          title={needSummary.Status}
          style={{
            paddingTop: 12,
            paddingBottom: 6,
            backgroundColor: AppColors.baseGray,
            borderBottomWidth: 0,
          }}
        />,
      );
    }

    return result;
  }

  render() {
    const {refreshing} = this.state;
    const {facilityNeedsStore, userStore} = this.props;
    const facility = facilityNeedsStore
      .getSnapshot()
      .facilities.find(i => i.facilityId === userStore.selectedFacilityId);
    const needs = facility ? facility.needs : [] || [];

    return (
      <FacilitySelectionContainer
        showNoData={this.showNoData}
        showLoading={this.showLoading}
        noDataText="No Needs Available"
        facilityHeaderCaption="Showing needs for"
        refreshing={this.state.refreshing}
        onRefresh={this.load.bind(this, true)}
        onFacilityChosen={(facilityId: string) => this.forceUpdate()}>
        <FlatList
          style={{flex: 1}}
          refreshControl={
            <RefreshControl
              tintColor={AppColors.blue}
              colors={[AppColors.blue]}
              refreshing={refreshing}
              onRefresh={this.load.bind(this, true)}
            />
          }
          renderItem={this.renderNeedSection.bind(this)}
          data={needs}
        />
      </FacilitySelectionContainer>
    );
  }
}

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
