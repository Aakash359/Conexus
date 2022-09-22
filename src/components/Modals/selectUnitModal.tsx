import React, {useState, useEffect} from 'react';
import {
  View,
  Modal,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Text,
  StyleSheet,
  Alert,
  ScrollView,
  Image,
} from 'react-native';
import {AppColors, AppFonts} from '../../theme';
import {windowDimensions} from '../../common/window-dimensions';
import Icon from 'react-native-vector-icons/Ionicons';
import {useSelector} from '../../redux/reducers/index';
import {facilityUnitListService} from '../../services/facilityUnitListService';
import {Avatar} from '../avatar';
import {ConexusIcon} from '../conexus-icon';

interface SelectUnitModalProps {
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

interface SelectUnitModalState {
  value: any;
  data: RadioListItem[];
  loading: boolean;
}

export type RadioListItem = {
  value: any;
  title: string;
  imageUrl: string;
};

export const SelectUnitModal = (
  props: SelectUnitModalProps,
  state: SelectUnitModalState,
) => {
  const {
    visible,
    title,
    onClose,
    onPress,
    data,
    facilityImages,
    onSelectUnit,
    customStyle,
    textColor,
    borderColor,
    disabled,
    customTitleStyle,
    hideSelectedIcon,
    actionText,
    unitName,
    unitValue,
  } = props;

  const [loading, setLoading] = useState(false);
  const [unitData, setUnitData] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [value, setValue] = useState('');
  const userInfo = useSelector(state => state.userReducer);

  useEffect(() => {
    callFacilityUnitListApi();
  }, []);

  const callFacilityUnitListApi = async () => {
    {
      setLoading(true);
      try {
        const data = await facilityUnitListService({
          facilityId: userInfo?.user?.userFacilities?.[0]?.facilityId,
        });
        setLoading(false);
        setUnitData(data);
      } catch (error) {
        setLoading(false);
        console.log('Error', error);
        Alert.alert(
          error?.response?.statusText,
          error?.response?.data?.Message,
        );
      }
    }
  };

  const selectValue = (value: any, unitId: any) => {
    setModalVisible(false);
    onSelectUnit(value, unitId);
  };

  const renderItem = ({item, index}) => {
    var i: RadioListItem = item;

    return (
      <TouchableOpacity
        activeOpacity={1}
        key={`${i.unitName}${index}`}
        style={styles.listItem}
        onPress={() => selectValue(i.unitName, i.unitId)}
      >
        <Text style={[AppFonts.listItemTitle, [{textAlignVertical: 'center'}]]}>
          {i.unitName}
        </Text>

        {hideSelectedIcon && value === i.value && (
          <ConexusIcon
            style={styles.listItemIcon}
            size={21}
            color={AppColors.blue}
            name="cn-check"
          />
        )}
      </TouchableOpacity>
    );
  };

  const renderSeparator = () => (
    <View
      style={{
        backgroundColor: AppColors.lightBlue,
        height: 0.5,
      }}
    />
  );

  return (
    <>
      <TouchableOpacity
        onPress={() => setModalVisible(true)}
        activeOpacity={0.8}
      >
        <View style={styles.chooserField}>
          {unitValue && (
            <Text style={styles.chooserFieldText}>{unitValue}</Text>
          )}
          <Icon
            style={{color: AppColors.mediumGray, marginLeft: 20}}
            name="chevron-down"
            size={22}
          />
        </View>
      </TouchableOpacity>
      {modalVisible && (
        <Modal
          visible={visible}
          overlayPointerEvents={'auto'}
          animationType="fade"
          onRequestClose={() => setModalVisible(false)}
          transparent={true}
        >
          <View style={styles.cardStyle}>
            <View style={styles.cardItemStyle}>
              <View style={styles.wrapperView}>
                <Text style={styles.titleText}>Select Unit</Text>
                <Icon
                  style={{color: AppColors.mediumGray}}
                  name="ios-close-circle-sharp"
                  size={22}
                  onPress={() => setModalVisible(false)}
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
              <FlatList
                data={unitData}
                renderItem={renderItem}
                ItemSeparatorComponent={renderSeparator}
              />
            </View>
          </View>
        </Modal>
      )}
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
  chooserFieldPlaceholder: {
    ...AppFonts.buttonText,
    color: AppColors.mediumGray,
    fontStyle: 'regular',
    opacity: 0.6,
    fontSize: 14,
  },
  chooserFieldText: {
    ...AppFonts.buttonText,
    width: '85%',
    alignSelf: 'center',
    color: AppColors.darkBlue,
  },
  chooserField: {
    backgroundColor: AppColors.white,
    borderRadius: 6,
    marginLeft: 20,
    width: '90%',
    borderColor: AppColors.lightBlue,
    borderWidth: 1,
    padding: 12,
    flexDirection: 'row',
  },
  listItemIcon: {
    alignSelf: 'flex-end',
  },
  content: {
    flex: 1,
    marginTop: 20,
  },
  list: {
    flex: 1,
  },
  listItem: {
    backgroundColor: AppColors.white,
    flexDirection: 'row',
    padding: 16,
    marginRight: 80,
  },
  listItemAvatar: {
    marginRight: 12,
  },
  wrapperView: {
    flexDirection: 'row',
  },
  listContent: {
    marginTop: 20,
  },
  cardItemStyle: {
    width: windowDimensions.width * 0.9,
    height: windowDimensions.height * 0.7,
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
