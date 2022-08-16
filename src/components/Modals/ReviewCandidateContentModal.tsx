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
  disabled?: boolean;
  loadingColor: string;
  loading: any;
  customStyle: any;
  customTitleStyle: any;
  visible: boolean;
  onClose: any;
  renderContent: any;
}

export const ReviewCandidateContentModal = (props: SelectUnitModalProps) => {
  const {
    visible,
    title,
    onClose,
    renderContent,
    customStyle,
    disabled,
    customTitleStyle,
  } = props;

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
            <View style={styles.content}>
              {renderContent && renderContent()}
            </View>
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
  content: {
    flex: 1,
    flexDirection: 'column',
    marginTop: 18,
    alignSelf: 'stretch',
    alignItems: 'stretch',
    padding: 20,
  },
  wrapperView: {
    flexDirection: 'row',
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
    marginLeft: 35,
    textAlign: 'center',
  },
});
