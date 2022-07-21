import React from 'react';
import {Text} from 'native-base';
import {ViewProperties, StyleSheet, View, TouchableOpacity} from 'react-native';
// import {inject, observer} from 'mobx-react';
import {AppFonts, AppColors} from '../theme';
import {ConexusIcon, Avatar} from '../components';
// import {Actions} from 'react-native-router-flux';
import {ScreenType} from '../common';
import {UserStore, UserFacilityModel} from '../stores/userStore';

export interface FacilitySelectionItem {
  facilityId: string;
  facilityName: string;
  photoUrl: string;
}

export interface FacilityListHeaderItemProps extends ViewProperties {
  caption: string;
  facilityChosen?: (facilityId: string) => any;
  userStore?: UserStore;
  overrideFacilities?: FacilitySelectionItem[];
}

export interface FacilityListHeaderItemState {}

// @inject('userStore')
// @observer
export class FacilityListHeaderItem extends React.Component<
  FacilityListHeaderItemProps,
  FacilityListHeaderItemState
> {
  get facilities(): FacilitySelectionItem[] {
    if (
      this.props.overrideFacilities &&
      this.props.overrideFacilities.length > 0
    ) {
      return this.props.overrideFacilities;
    }

    return !!this.props.userStore.user &&
      !!this.props.userStore.user.userFacilities
      ? this.props.userStore.user.userFacilities.map(i => {
          return {
            facilityId: i.facilityId,
            facilityName: i.facilityName,
            photoUrl: i.photoUrl,
          };
        })
      : [];
  }

  get selectedFacility(): FacilitySelectionItem {
    const overrideFacilities = this.props.overrideFacilities;
    const facilityId = this.props.userStore.selectedFacilityId;

    if (!facilityId) {
      return null;
    }

    if (!!overrideFacilities && overrideFacilities.length) {
      return overrideFacilities.find(i => i.facilityId === facilityId);
    }

    if (this.props.userStore.selectedFacility) {
      const f = this.props.userStore.selectedFacility;
      return {
        facilityId: f.facilityId,
        facilityName: f.facilityName,
        photoUrl: f.photoUrl,
      };
    }

    return null;
  }

  constructor(
    props: FacilityListHeaderItemProps,
    state: FacilityListHeaderItemState,
  ) {
    super(props, state);
  }

  componentDidMount() {
    if (
      !this.props.userStore.selectedFacility ||
      (!!this.props.overrideFacilities &&
        this.props.overrideFacilities
          .map(f => f.facilityId)
          .indexOf(this.props.userStore.selectedFacilityId) === -1)
    ) {
      this._chooseFacility();
    }
  }

  _facilityChosen(id: string) {
    this.props.userStore.setSelectedFacility(id);

    if (this.props.facilityChosen) {
      setTimeout(() => {
        this.props.facilityChosen(id);
      }, 0);
    }

    this.forceUpdate();
  }

  _chooseFacility() {
    const items = this.facilities.map(i => {
      return {value: i.facilityId, title: i.facilityName, imageUrl: i.photoUrl};
    });
    // Actions[ScreenType.RADIO_LIST_LIGHTBOX]({
    //   title: 'Choose a Facility',
    //   data: items,
    //   value: this.selectedFacility,
    //   showImages: true,
    //   facilityImages: true,
    //   hideSelectedIcon: true,
    //   onClose: this._facilityChosen.bind(this),
    // });
  }

  render() {
    const {caption} = this.props;
    const title = this.selectedFacility
      ? this.selectedFacility.facilityName
      : '';
    const imageUrl = this.selectedFacility
      ? this.selectedFacility.photoUrl
      : '';

    return (
      <TouchableOpacity
        style={styles.root}
        onPress={this._chooseFacility.bind(this)}>
        <Avatar
          facility
          source={imageUrl}
          size={36}
          borderColor={AppColors.white}
        />
        <View style={styles.textWrapper}>
          <Text style={styles.caption}>{caption}</Text>
          <Text style={styles.title}>{title}</Text>
        </View>
        <View style={styles.chooser}>
          <ConexusIcon name="cn-dropdown" color={AppColors.white} size={16} />
        </View>
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  root: {
    backgroundColor: AppColors.blue,
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'center',
    height: 56,
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  icon: {
    paddingTop: 2,
  },
  textWrapper: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'flex-start',
    paddingLeft: 16,
  },
  caption: {
    ...AppFonts.bodyTextXtraSmall,
    color: AppColors.white,
    zIndex: 1,
  },
  title: {
    ...AppFonts.bodyTextLarge,
    fontWeight: '700',
    color: AppColors.white,
    position: 'relative',
    top: -2,
  },
  chooser: {
    alignSelf: 'flex-end',
    paddingBottom: 6,
  },
});
