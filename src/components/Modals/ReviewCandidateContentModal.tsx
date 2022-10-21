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
  const {visible, title, onClose, renderContent} = props;

  return (
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
            <Text style={styles.titleText}>{title}</Text>
            <TouchableOpacity activeOpacity={0.8} onPress={onClose}>
              <Icon name="close-outline" size={40} color={AppColors.blue} />
            </TouchableOpacity>
          </View>
          <View style={styles.content}>{renderContent && renderContent()}</View>
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
    marginTop: 50,
  },
  wrapperView: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
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
