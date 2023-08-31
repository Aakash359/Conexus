import React, {useState, useEffect} from 'react';
import {
  Platform,
  Switch,
  ActivityIndicator,
  StyleSheet,
  View,
  TouchableOpacity,
  Text,
  TextInput,
  Alert,
  Keyboard,
  ScrollView,
} from 'react-native';
import {AppFonts, AppColors} from '../../theme';
import {ActionButton} from '../../components/action-button';
import {windowDimensions} from '../../common';
import {SelectUnitModal} from '../../components/Modals/selectUnitModal';
import NavigationService from '../../navigation/NavigationService';
import {Strings} from '../../common/Strings';

export interface CatalogQuestionContainerProps {
  questionId: string;
  initialUnitId: string;
  needId?: string;
  onSave?: () => any;
  onClose?: () => any;
}
const {
  ENTER_TEXT,
  CHOOSE_UNIT,
  DEFAULT_UNIT_QUESTION,
  INVALID_MSG,
  RECORD_QUESTIONS,
} = Strings;

const AddQuestion = (props: CatalogQuestionContainerProps) => {
  const [loading, setLoading] = useState(false);
  const [keyboardStatus, setKeyboardStatus] = useState(undefined);
  const [messageText, setMessageText] = useState('');
  const [messageTextError, setMessageTextError] = useState(false);
  const [unitValue, setUnitValue] = useState(props?.route?.params?.unitName);
  const [flagValue, setFlagValue] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const propsData = props?.route?.params || {};
  const {facilityId, initialUnitId} = propsData;

  const messageTextBlur = () => {
    if (messageText && messageText.length) {
      setMessageTextError(false);
    } else {
      setMessageTextError(true);
    }
  };

  useEffect(() => {
    const showSubscription = Keyboard.addListener('keyboardDidShow', () => {
      setKeyboardStatus('Keyboard Shown');
    });
    const hideSubscription = Keyboard.addListener('keyboardDidHide', () => {
      setKeyboardStatus('Keyboard Hidden');
    });

    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, []);

  const validate = () => {
    if (!(propsData?.questionText || '').trim() && !messageText.trim()) {
      Alert.alert('Validation Error', ENTER_TEXT);
      return false;
    }

    if (!propsData.questionUnitId && !unitValue) {
      Alert.alert('Validation Error', CHOOSE_UNIT);
      return false;
    }
    return true;
  };

  const recordQuestion = () => {
    if (validate()) {
      Keyboard.dismiss();
      NavigationService.navigate('VideoRecorder', {
        tokBoxArchiveUrl: '',
        text: messageText,
        needId: propsData?.needId || '',
        unitId: initialUnitId ? initialUnitId : '',
        facilityId: facilityId ? facilityId : '',
        unitName: unitValue,
        flagValue: flagValue,
      });
    }
  };

  const renderDefaultQuestionField = () => {
    return (
      <View style={styles.defaultQuestionField}>
        <Switch
          style={styles.switch}
          value={
            propsData.questionDefaultFlag
              ? propsData.questionDefaultFlag
              : flagValue
          }
          onValueChange={flag => setFlagValue(flag)}
        />

        <TouchableOpacity>
          <Text style={styles.switchLabel}>{DEFAULT_UNIT_QUESTION}</Text>
        </TouchableOpacity>
      </View>
    );
  };

  const renderEditableHeader = () => {
    return (
      <View>
        {propsData?.questionHasUrl && propsData?.questionId ? (
          ''
        ) : (
          <Text style={styles.header}>
            Enter the text of your question below.
          </Text>
        )}

        <View style={styles.messageInput}>
          <TextInput
            style={styles.questionInput}
            maxLength={1000}
            autoCapitalize="sentences"
            rowSpan={4}
            placeholder="Type your question"
            placeholderTextColor={AppColors.mediumGray}
            autoFocus={false}
            value={propsData ? propsData?.questionText : messageText}
            showError={messageTextError}
            returnKeyType="done"
            onSubmitEditing={Keyboard.dismiss}
            onBlur={messageTextBlur}
            errorMessage={INVALID_MSG}
            multiline={true}
            onChangeText={(text: any) => {
              setMessageText(text);
            }}
          />
        </View>
      </View>
    );
  };

  const renderReadOnlyHeader = () => {
    return (
      <View style={[styles.readonlyQuestionInputContainer]}>
        <Text style={[styles.readonlyQuestionInput]}>
          {'\u201C'}
          {/* {_question.text} */}
          {'\u201D'}
        </Text>
      </View>
    );
  };

  const renderUnitField = () => {
    return (
      <View style={{marginTop: 10}}>
        <SelectUnitModal
          unitValue={unitValue ? unitValue : 'Select a unit'}
          onRequestClose={() => setModalVisible(false)}
          onClose={() => setModalVisible(false)}
          onSelectUnit={value => setUnitValue(value)}
        />
      </View>
    );
  };

  const renderQuestionContainer = () => {
    return (
      <ScrollView style={styles.rootContainer}>
        {renderEditableHeader()}
        {renderUnitField()}
        {/* {this._question.isNewQuestion
              ? this.renderEditableHeader()
              : this.renderReadOnlyHeader()} */}
        {renderDefaultQuestionField()}
        {
          <View style={styles.footer}>
            <ActionButton
              title={RECORD_QUESTIONS}
              loading={loading}
              customTitleStyle={{fontSize: 16}}
              onPress={() => recordQuestion()}
              customStyle={styles.btnEnable}
            />
          </View>
        }
        {propsData?.questionHasUrl && propsData?.questionId && (
          <View style={styles.footer}>
            <ActionButton
              title="PLAY QUESTION"
              loading={loading}
              customTitleStyle={{fontSize: 16}}
              onPress={() =>
                NavigationService.navigate('VideoPlayer', {
                  tokBoxArchiveUrl: propsData?.questionHasUrl || '',
                })
              }
              customStyle={styles.btnEnable}
            />
          </View>
        )}
      </ScrollView>
    );
  };

  const renderLoadingContainer = () => {
    return (
      <View style={styles.rootContainer}>
        <ActivityIndicator color={AppColors.blue} style={{flex: 1}} />
      </View>
    );
  };

  if (loading) {
    return renderLoadingContainer();
  }

  return renderQuestionContainer();
};

const styles = StyleSheet.create({
  rootContainer: {
    flex: 1,
    backgroundColor: AppColors.baseGray,
  },
  footer: {
    marginTop: Platform.OS === 'android' ? 280 : 430,
    justifyContent: 'center',
    // position: 'absolute',
    // top: 20,
  },
  btnEnable: {
    alignSelf: 'center',
    width: windowDimensions.width * 0.6,
  },
  header: {
    ...AppFonts.bodyTextNormal,
    alignItems: 'center',
    marginTop: 20,
    justifyContent: 'center',
    textAlign: 'center',
  },
  messageInput: {
    alignSelf: 'center',
    borderWidth: 0.8,
    borderColor: AppColors.lightBlue,
    backgroundColor: AppColors.white,
    marginTop: 40,
    height: 150,
    fontSize: 16,
    color: AppColors.black,
    paddingHorizontal: 10,
    width: '90%',
    borderRadius: 5,
  },
  switch: {
    position: 'relative',
    top: Platform.OS === 'android' ? 0 : 0,
  },
  switchLabel: {
    paddingLeft: 8,
    top: 3.5,
    opacity: 0.75,
  },
  defaultQuestionField: {
    flexDirection: 'row',
    marginLeft: 20,
    alignItems: 'flex-start',
    marginTop: 20,
  },
  questionInput: {
    marginTop: Platform.OS === 'android' ? 0 : 10,
  },
  readonlyQuestionInputContainer: {
    backgroundColor: AppColors.white,
    borderRadius: 6,
    borderColor: AppColors.lightBlue,
    borderWidth: 1,
    marginBottom: 18,
    paddingTop: 20,
    paddingBottom: 20,
    padding: 4,
  },
  readonlyQuestionInput: {
    ...AppFonts.bodyTextLarge,
    fontWeight: '600',
    color: AppColors.gray,
    textAlign: 'center',
  },
});

export default AddQuestion;
