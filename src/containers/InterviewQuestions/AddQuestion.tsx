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
} from 'react-native';
import {AppFonts, AppColors} from '../../theme';
import {ScreenType} from '../../common/constants';
import {
  QuestionModel,
  FacilityQuestionsStore,
  FacilityUnitModel,
  loadFacilityUnits,
} from '../../stores/facility';
import {UserStore, VideoStore} from '../../stores';
import {ActionButton} from '../../components/action-button';
import Icon from 'react-native-vector-icons/Ionicons';
import {showYesNoAlert, windowDimensions} from '../../common';
import {SelectUnitModal} from '../../components/Modals/selectUnitModal';
import NavigationService from '../../navigation/NavigationService';

export interface CatalogQuestionContainerProps {
  questionId: string;
  initialUnitId: string;
  needId?: string;
  onSave?: () => any;
  onClose?: () => any;
  facilityQuestionsStore?: typeof FacilityQuestionsStore.Type;
  userStore?: UserStore;
  videoStore?: VideoStore;
}

const AddQuestion = (props: CatalogQuestionContainerProps) => {
  const [loading, setLoading] = useState(false);
  const [messageText, setMessageText] = useState('');
  const [messageTextError, setMessageTextError] = useState(false);
  const [unitValue, setUnitValue] = useState(props?.route?.params?.unitName);
  const [flagValue, setFlagValue] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const propsData = props?.route?.params || {};
  const {facilityId} = propsData;

  const messageTextBlur = () => {
    if (messageText && messageText.length) {
      setMessageTextError(false);
    } else {
      setMessageTextError(true);
    }
  };

  const validate = () => {
    if (!(propsData?.questionText || '').trim() && !messageText.trim()) {
      Alert.alert(
        'Validation Error',
        'Please enter the text of your question.',
      );
      return false;
    }

    if (!propsData.questionUnitId && !unitValue) {
      Alert.alert('Validation Error', 'Please choose a unit.');
      return false;
    }
    return true;
  };

  const recordQuestion = () => {
    if (validate()) {
      Keyboard.dismiss();
      NavigationService.navigate('VideoRecorder', {
        videoUrl: '',
        text: messageText,
        needId: propsData?.needId || '',
        facilityId: facilityId,
        // onSave: archiveId => {
        //   this._question.setArchiveId(archiveId);
        //   this.saveQuestion(null, true);
        // },
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

        <TouchableOpacity
        // onPress={this.onDefaultQuestionChanged.bind(
        //   this,
        //   !this._question.defaultFlag,
        // )}
        >
          <Text style={styles.switchLabel}>
            Default question for this unit.
          </Text>
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

        <View style={styles.form}>
          <TextInput
            style={[styles.questionInput]}
            maxLength={1000}
            autoCapitalize="sentences"
            rowSpan={4}
            placeholder="Type your question"
            placeholderTextColor={AppColors.mediumGray}
            autoFocus={false}
            value={propsData ? propsData?.questionText : messageText}
            showError={messageTextError}
            returnKeyType="done"
            onBlur={messageTextBlur}
            errorMessage={'Invalid Message please type a message to send.'}
            multiline={false}
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
      <SelectUnitModal
        unitValue={unitValue ? unitValue : 'Select a unit'}
        onRequestClose={() => setModalVisible(false)}
        onClose={() => setModalVisible(false)}
        onSelectUnit={value => setUnitValue(value)}
      />
    );
  };

  const renderQuestionContainer = () => {
    return (
      <View style={styles.rootContainer}>
        {renderEditableHeader()}
        {renderUnitField()}
        {/* {this._question.isNewQuestion
              ? this.renderEditableHeader()
              : this.renderReadOnlyHeader()} */}
        {renderDefaultQuestionField()}
        {
          <View style={styles.footer}>
            <ActionButton
              title="RECORD YOUR QUESTION"
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
                  videoUrl: propsData?.questionHasUrl || '',
                })
              }
              customStyle={styles.btnEnable}
            />
          </View>
        )}
      </View>
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
    right: 10,
    left: 10,
    position: 'absolute',
    bottom: 20,
  },
  listItem: {
    backgroundColor: AppColors.white,
    borderBottomWidth: 1,
    borderBottomColor: AppColors.lightBlue,
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
  headerTitle: {
    ...AppFonts.title,
    paddingLeft: 18,
    paddingRight: 18,
  },
  headerDescription: {
    ...AppFonts.description,
    paddingLeft: 18,
    paddingRight: 18,
  },
  form: {
    paddingTop: 18,
    paddingBottom: 18,
    paddingHorizontal: 20,
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
  switchLabelEnabled: {
    paddingLeft: 8,
    opacity: 1,
  },
  defaultQuestionField: {
    flexDirection: 'row',
    marginLeft: 20,
    alignItems: 'flex-start',
    marginTop: 20,
  },
  questionInput: {
    textAlignVertical: 'top',
    backgroundColor: AppColors.white,
    height: 130,
    fontSize: 14,
    color: AppColors.mediumGray,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: AppColors.lightBlue,
    width: '100%',
    justifyContent: 'center',
    alignSelf: 'center',
    borderRadius: 5,
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
  chooserFieldIcon: {
    alignSelf: 'flex-end',
  },
});

export default AddQuestion;
