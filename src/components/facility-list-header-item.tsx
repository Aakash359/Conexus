import React, {useEffect, useState} from 'react';
import {
  Text,
  Alert,
  StyleSheet,
  View,
  TouchableOpacity,
  Image,
} from 'react-native';
import {AppFonts, AppColors} from '../theme';
import {ConexusIcon} from '../components/conexus-icon';
import {Avatar} from '../components/avatar';
import Icon from 'react-native-vector-icons/Ionicons';
import NavigationService from '../navigation/NavigationService';
import {useSelector} from '../redux/reducers/index';

export interface FacilitySelectionItem {
  facilityId: string;
  facilityName: string;
  photoUrl: string;
}

export interface FacilityListHeaderItemProps {
  caption: string;
  facilityChosen?: (facilityId: string) => any;
  overrideFacilities?: FacilitySelectionItem[];
}

export interface FacilityListHeaderItemState {}

const FacilityListHeaderItem = (props: FacilityListHeaderItemProps) => {
  const {caption} = props;
  const userInfo = useSelector(state => state.userReducer);

  const facilities = (): FacilitySelectionItem[] => {
    if (props.overrideFacilities) {
      return props.overrideFacilities;
    }

    return !!userInfo?.user?.user && !!userInfo?.user?.user?.userFacilities
      ? userInfo?.user?.user?.userFacilities.map(
          (i: {facilityId: any; facilityName: any; photoUrl: any}) => {
            return {
              facilityId: i.facilityId,
              facilityName: i.facilityName,
              photoUrl: i.photoUrl,
            };
          },
        )
      : [];
  };

  const selectedFacility = (): FacilitySelectionItem => {
    const overrideFacilities = props.overrideFacilities;
    const facilityId = props.userStore.selectedFacilityId;

    if (!facilityId) {
      return null;
    }

    if (!!overrideFacilities && overrideFacilities.length) {
      return overrideFacilities.find(i => i.facilityId === facilityId);
    }
    if (props.userStore.selectedFacility) {
      const f = props.userStore.selectedFacility;

      return {
        facilityId: f.facilityId,
        facilityName: f.facilityName,
        photoUrl: f.photoUrl,
      };
    }
    return null;
  };

  // useEffect(()=>{

  // },[])

  // componentDidMount() {
  //   if (
  //     !this.props.userStore.selectedFacility ||
  //     (!!this.props.overrideFacilities &&
  //       this.props.overrideFacilities
  //         .map(f => f.facilityId)
  //         .indexOf(this.props.userStore.selectedFacilityId) === -1)
  //   ) {
  //     this._chooseFacility();
  //   }
  // }

  const facilityChosen = (id: string) => {
    props.userStore.setSelectedFacility(id);

    if (props.facilityChosen) {
      setTimeout(() => {
        props.facilityChosen(id);
      }, 0);
    }

    forceUpdate();
  };

  const chooseFacility = () => {
    const items = facilities.map(
      (i: {facilityId: any; facilityName: any; photoUrl: any}) => {
        return {
          value: i.facilityId,
          title: i.facilityName,
          imageUrl: i.photoUrl,
        };
      },
    );
    NavigationService.navigate('RadioListLightbox', {
      title: 'Choose a Facility',
      data: items,
      value: selectedFacility(),
      showImages: true,
      facilityImages: true,
      hideSelectedIcon: true,
      onClose: facilityChosen(),
    });
  };

  const title = selectedFacility ? selectedFacility.facilityName : '';

  const imageUrl = selectedFacility ? selectedFacility.photoUrl : '';

  return (
    <TouchableOpacity style={styles.root} onPress={chooseFacility}>
      <Image source={imageUrl} style={styles.circleStyle} />

      <View style={styles.textWrapper}>
        <Text style={styles.caption}>{caption}</Text>
        <Text style={styles.title}>{title}</Text>
      </View>
      <View style={styles.chooser}>
        <Icon
          name="chevron-down"
          size={25}
          color={AppColors.white}
          style={{alignSelf: 'center'}}
        />
      </View>
    </TouchableOpacity>
  );
};

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
  circleStyle: {
    width: 38,
    height: 38,
    bottom: 4,
    borderRadius: 38 / 2,
    borderWidth: 2,
    borderColor: AppColors.imageColor,
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

export default FacilityListHeaderItem;
function forceUpdate() {
  throw new Error('Function not implemented.');
}
