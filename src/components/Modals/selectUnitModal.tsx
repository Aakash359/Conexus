import React, {useState, useEffect} from 'react';
import {
  View,
  Modal,
  TouchableOpacity,
  Text,
  StyleSheet,
  Alert,
} from 'react-native';
import {AppColors} from '../../theme';
import {windowDimensions} from '../../common/window-dimensions';
import Icon from 'react-native-vector-icons/Ionicons';
import {useSelector} from '../../redux/reducers/index';
import {facilityUnitListService} from '../../services/facilityUnitListService';

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
}

export const SelectUnitModal = (props: SelectUnitModalProps) => {
  const {
    visible,
    title,
    onClose,
    data,
    customStyle,
    textColor,
    borderColor,
    disabled,
    customTitleStyle,
  } = props;

  const [loading, setLoading] = useState(false);
  const userInfo = useSelector(state => state.userReducer);

  useEffect(() => {
    callFacilityUnitListApi();
  }, []);

  const callFacilityUnitListApi = async () => {
    {
      try {
        setLoading(true);
        const facilityId = await facilityUnitListService({
          facilityId: userInfo?.user?.userFacilities?.[0]?.facilityId,
        });
        console.log('Data====>', facilityId);
      } catch (error) {
        setLoading(false);
        console.log('Error', error);
        // Alert.alert(
        //   error?.response?.statusText,
        //   error?.response?.data?.Message,
        // );
      }
    }
  };
  return (
    <Modal
      visible={visible}
      onDismiss={onClose}
      overlayPointerEvents={'auto'}
      animationType="fade"
      onRequestClose={onClose}
      transparent={true}>
      <View style={styles.cardStyle}>
        <View style={styles.cardItemStyle}>
          <View style={styles.wrapperView}>
            <Text style={styles.titleText}>{title}</Text>
            <Icon
              style={{color: AppColors.mediumGray}}
              name="ios-close-circle-sharp"
              size={22}
              onPress={onClose}
            />
          </View>
        </View>
      </View>
    </Modal>
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
  wrapperView: {
    flexDirection: 'row',
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
