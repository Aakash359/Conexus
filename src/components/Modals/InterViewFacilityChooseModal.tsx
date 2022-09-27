import React, {useState, useEffect} from 'react';
import {
  View,
  Modal,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Text,
  StyleSheet,
  Image,
} from 'react-native';
import {AppColors, AppFonts} from '../../theme';
import {windowDimensions} from '../../common/window-dimensions';
import Icon from 'react-native-vector-icons/Ionicons';
import {useSelector} from '../../redux/reducers/index';
import {Avatar} from '../avatar';
import {ConexusIcon} from '../conexus-icon';
import {Alert} from 'react-native';

interface InterViewFacilityChooseModalProps {
  title: string;
  onPress: Function;
  primary?: boolean;
  danger?: boolean;
  secondary?: boolean;
  smallSecondary?: boolean;
  smallSecondaryNotRounded?: boolean;
  style?: any;
  textColor?: any;
  disabled?: boolean;
  textStyle?: any;
  textStyleDisabled?: any;
  loadingProps: any;
  loadingColor: string;
  loading: any;
  buttonColor: any;
  borderColor: any;
  customStyle: any;
  customTitleStyle: any;
  visible: boolean;
  onClose: any;
  data: any;
  showImages: any;
  facilityImages: any;
  hideSelectedIcon: any;
  unitValue: any;
  actionText: any;
  unitName: any;
  onSelectUnit: any;
}

interface InterViewFacilityChooseModalState {
  value: any;
  data: RadioListItem[];
  loading: boolean;
}

export type RadioListItem = {
  value: any;
  title: string;
  imageUrl: string;
};

export const InterViewFacilityChooseModal = (
  props: InterViewFacilityChooseModalProps,
  state: InterViewFacilityChooseModalState,
) => {
  const {
    visible,
    onClose,
    onSelectUnit,
    hideSelectedIcon,
    facilityHeaderData,
  } = props;

  const [loading, setLoading] = useState(false);
  const [value, setValue] = useState('');

  const selectValue = (value: any, unitId: any) => {
    setModalVisible(false);
    onSelectUnit(value, unitId);
  };
  const renderItem = (facilityHeaderData: any) => {
    var i: RadioListItem = facilityHeaderData;

    return (
      <TouchableOpacity
        activeOpacity={0.8}
        style={styles.wrapper}
        onPress={onClose}
      >
        <Image source={{uri: i.facPhotoUrl}} style={styles.circleStyle} />
        <Text style={[AppFonts.listItemTitle, [styles.text]]}>
          {i.facilityName}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <>
      <Modal
        visible={visible}
        onDismiss={onClose}
        overlayPointerEvents={'auto'}
        animationType="fade"
        onRequestClose={onClose}
        transparent={true}
      >
        <View style={styles.cardStyle}>
          <View style={styles.cardItemStyle}>
            <View style={styles.wrapperView}>
              <Text style={styles.titleText}>Choose a Facility</Text>
              <Icon
                style={{color: AppColors.mediumGray}}
                name="ios-close-circle-sharp"
                size={22}
                onPress={onClose}
              />
            </View>
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

            {renderItem(facilityHeaderData)}
          </View>
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  cardStyle: {
    height: '100%',
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  text: {
    textAlignVertical: 'center',
  },
  wrapper: {
    flexDirection: 'row',
    marginRight: 30,
    marginTop: 20,
    alignSelf: 'center',
  },
  content: {
    flex: 1,
    marginTop: 20,
  },
  list: {
    flex: 1,
  },
  listItem: {
    backgroundColor: AppColors.red,
  },
  listItemAvatar: {
    marginRight: 12,
  },
  wrapperView: {
    flexDirection: 'row',
  },
  circleStyle: {
    width: 38,
    height: 38,
    bottom: 4,
    borderRadius: 38 / 2,
    borderWidth: 2,
    alignSelf: 'center',
    marginTop: 10,
    marginHorizontal: 10,
    borderColor: AppColors.imageColor,
  },
  cardItemStyle: {
    width: windowDimensions.width * 0.9,
    height: windowDimensions.height * 0.6,
    backgroundColor: AppColors.white,
    borderRadius: 8,
    paddingTop: 15,
    alignItems: 'center',
    overflow: 'hidden',
  },
  titleText: {
    fontSize: 16,
    color: AppColors.mediumGray,
    width: '80%',
    textAlign: 'center',
  },
});
