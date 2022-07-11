import React from 'react';
import {
  StyleSheet,
  ViewProperties,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import {Container} from 'native-base';
import {
  FacilityListHeaderItem,
  IconTitleBlock,
  FacilitySelectionItem,
  ScreenFooterButton,
} from '../components';
import {inject} from 'mobx-react';
import {AppColors} from '../theme';
import {UserStore, FacilityModel} from '../stores';
import {logger} from 'react-native-logs';
import {Actions} from 'react-native-router-flux';
import {ScreenType, StoreType} from '../common';

interface FacilitySelectionContainerProps extends ViewProperties {
  showLoading?: boolean;
  showNoData: boolean;
  noDataText: string;
  noDataIconName?: string;
  facilityHeaderCaption?: string;
  refreshing?: boolean;
  onRefresh?: () => {};
  onFacilityChosen?: (facilityId: string) => any;
  userStore?: UserStore;
  expectOverrideFacilities?: boolean;
  overrideFacilities?: FacilitySelectionItem[];
  showNewQuestionButton?: boolean;
  needId?: string;
}

interface FacilitySelectionContainerState {}
const log = logger.createLogger();
@inject(StoreType.USER)
export class FacilitySelectionContainer extends React.Component<
  FacilitySelectionContainerProps,
  FacilitySelectionContainerState
> {
  constructor(props, state) {
    super(props, state);
    this.state = {};
  }

  get showNoData(): boolean {
    return this.props.showNoData;
  }

  get noDataText(): string {
    return this.props.noDataText || '';
  }

  get noDataIconName(): string {
    return this.props.noDataIconName || 'cn-info';
  }

  get facilityHeaderCaption(): string {
    return this.props.facilityHeaderCaption || '';
  }

  get refreshing(): boolean {
    return this.props.refreshing;
  }

  get onFacilityChosen(): (selectedFacilityId: string) => any {
    const {onFacilityChosen} = this.props;

    if (onFacilityChosen && onFacilityChosen.call) {
      return onFacilityChosen;
    }

    return function (selectedFacilityId: string) {};
  }

  get onRefresh(): (selectedFacilityId: string) => any {
    const {onRefresh} = this.props;

    if (onRefresh && onRefresh.call) {
      return onRefresh;
    }

    return function (selectedFacilityId: string) {};
  }

  get selectedFacilityId(): string {
    return this.props.userStore.selectedFacilityId;
  }

  get showLoading(): boolean {
    return !!this.props.showLoading;
  }
  get showNewQuestionButton(): boolean {
    return !!this.props.showNewQuestionButton;
  }
  get showFacilitySelector(): boolean {
    if (this.props.expectOverrideFacilities) {
      return this.props.overrideFacilities.length > 0;
    }

    return this.props.userStore.user.userFacilities.length > 1;
  }

  renderEmpty() {
    log.info('Show button', this.showNewQuestionButton);
    log.info('Props', this.props);
    return (
      <FlatList
        contentContainerStyle={[style.containerCenter, {marginBottom: 200}]}
        refreshControl={<ActivityIndicator color={AppColors.blue} />}
        data={[{id: '1'}]}
        refreshing={this.refreshing}
        onRefresh={() => this.onRefresh(this.selectedFacilityId)}
        renderItem={({item, index}) => {
          return (
            //<Container style={style.containerNoQuestions}>
            <IconTitleBlock
              key={item.id}
              iconName={this.noDataIconName}
              text={this.noDataText}
            />
            //    {this.showNewQuestionButton && <ScreenFooterButton style={style.containerNoQuestions} title="Add Question" onPress={this.showNewQuestion.bind(this)} />}
            //</Container>
          );
        }}
      />
    );
  }
  showNewQuestion() {
    const {needId} = this.props;
    log.info(`NeedID: ${needId}`);
    Actions[ScreenType.FACILITIES.CATALOG_QUESTION]({
      questionId: '0',
      initialUnitId: '',
      needId: needId,
      onSave: () => {
        this.forceUpdate();
      },
    });
  }
  render() {
    log.info(this.showNoData);
    log.info(this.props);
    return (
      <Container style={style.container}>
        {this.showFacilitySelector && (
          <FacilityListHeaderItem
            key={'facility-selection-header'}
            caption={this.facilityHeaderCaption}
            overrideFacilities={this.props.overrideFacilities}
            facilityChosen={this.onFacilityChosen.bind(
              this,
              this.selectedFacilityId,
            )}
          />
        )}
        {this.showLoading && (
          <ActivityIndicator color={AppColors.blue} style={{flex: 1}} />
        )}
        {!this.showLoading &&
          this.showNewQuestionButton &&
          this.showNoData &&
          this.props.children}
        {!this.showLoading && this.showNoData && this.renderEmpty()}
        {!this.showLoading && !this.showNoData && this.props.children}
      </Container>
    );
  }
}

const style = StyleSheet.create({
  containerCenter: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  container: {
    flex: 1,
  },
  containerNoQuestions: {
    paddingTop: 60,
  },
});
