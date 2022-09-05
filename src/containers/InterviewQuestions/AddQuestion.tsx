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
  const [modalVisible, setModalVisible] = useState(false);
  const propsData = props?.route?.params || {};
  console.log('Aakah===>', propsData?.unitName);

  const messageTextBlur = () => {
    if (messageText && messageText.length) {
      setMessageTextError(false);
    } else {
      setMessageTextError(true);
    }
  };

  // const question: typeof QuestionModel.Type;

  // const onSave() {
  //   return this.props.onSave || function () {};
  // }

  // get onClose() {
  //   return this.props.onClose || function () {};
  // }

  // unitTypes: Array<typeof FacilityUnitModel.Type>;

  // get unitType(): typeof FacilityUnitModel.Type {
  //   const unitId = this._question.unitId;

  //   let result = this.unitTypes.find(unitType => {
  //     return unitType.unitId === unitId;
  //   });

  //   if (!result) {
  //     result = this.unitTypes.find(unitType => {
  //       return unitType.unitName === unitId;
  //     });
  //   }

  //   return result;
  // }

  // get unitTypeId(): string {
  //   const unitType = this.unitType;
  //   return unitType ? unitType.unitId : '';
  // }

  //   if (parseInt(this.props.questionId) < 1) {
  //     this._question = QuestionModel.create({
  //       id: '0',
  //       needId: this.props.needId,
  //       unitId: this.props.initialUnitId,
  //     });
  //   } else {
  //     this.loadQuestion();
  //   }
  // }

  // componentWillUnmount() {
  //   if (this.onClose) {
  //     this.onClose();
  //   }
  // }

  // componentWillMount() {
  //   this.setState({loading: true});

  //   loadFacilityUnits(this.props.userStore.selectedFacilityId).then(
  //     unitTypes => {
  //       this.unitTypes = unitTypes;
  //       const unitType = this.unitType;

  //       if (this._question.isNewQuestion && unitType) {
  //         this._question.setUnit(unitType.unitId, unitType.unitName);
  //       }

  //       this.setState({loading: false});
  //     },
  //     err => {
  //       log.info('Load units error', err);
  //       this.setState({loading: true});
  //       Alert.alert(`We're Sorry`, 'Units are unavailable for this facility.');
  //       // Actions.pop()
  //     },
  //   );
  // }

  useEffect(() => {});

  // loadQuestion(newId: string = null) {
  //   if (this.props.needId) {
  //     this._question =
  //       this.props.facilityQuestionsStore.needSection.questions.find(
  //         q => q.id === (newId || this.props.questionId),
  //       );
  //   } else {
  //     this._question = this.props.facilityQuestionsStore.findQuestion(
  //       this.props.userStore.selectedFacilityId,
  //       newId || this.props.questionId,
  //     );
  //   }
  // }

  // selectUnit(unitId: string) {
  //   const existingUnitType = this.unitTypes.find(
  //     i => i.unitId === this._question.unitId,
  //   );
  //   const newUnitType = this.unitTypes.find(i => i.unitId === unitId);

  //   if (newUnitType) {
  //     this._question.setUnit(newUnitType.unitId, newUnitType.unitName);
  //   }

  //   this.forceUpdate();

  //   const onCancel = () => {
  //     if (existingUnitType) {
  //       this._question.setUnit(
  //         existingUnitType.unitId,
  //         existingUnitType.unitName,
  //       );
  //     }
  //   };

  //   if (!this._question.isNewQuestion) {
  //     this.saveQuestion(onCancel);
  //   }
  // }

  const onSelectUnit = () => {
    Alert.alert('hi');
  };

  const renderUnitField = () => {
    return (
      <SelectUnitModal
        title={propsData?.unitName || 'Select a unit'}
        onRequestClose={() => setModalVisible(false)}
        onDismiss={() => setModalVisible(false)}
        onPress={() => onSelectUnit()}
        onClose={() => setModalVisible(false)}
      />
    );
  };

  // onDefaultQuestionChanged(defaultFlag: boolean) {
  //   const existingValue = this._question.defaultFlag;
  //   this._question.setDefaultFlag(defaultFlag);

  //   const onCancel = () => {
  //     this._question.setDefaultFlag(existingValue);
  //   };

  //   if (!this._question.isNewQuestion) {
  //     this.saveQuestion(onCancel).then(() => this.forceUpdate.bind(this));
  //   }
  // }

  // saveQuestion(onCancel?: () => any, isNew: boolean = false) {
  //   const {needId} = this.props;

  //   return this._question.save().then(
  //     saveResult => {
  //       return this.props.facilityQuestionsStore.load(needId).then(() => {
  //         log.info('New question Id', saveResult['id']);
  //         this._question = QuestionModel.create(saveResult);

  //         log.info('Before pop');
  //         if (isNew) {
  //           // Close the recording window
  //           // Actions.pop()
  //         }
  //         log.info('After pop');
  //         this.onSave();
  //         log.info('After onSave');
  //         this.forceUpdate();
  //       });
  //     },
  //     error => {
  //       log.info('Save Question Error', error);

  //       showYesNoAlert({
  //         onNo: onCancel,
  //         onYes: this.saveQuestion.bind(this, onCancel, isNew),
  //         yesTitle: 'Retry',
  //         noTitle: 'Cancel',
  //         title: 'Save Error',
  //         message: 'An error occurred while saving.',
  //       });
  //     },
  //   );
  // }

  // recordQuestion() {
  //   if (this.validate()) {
  //     Keyboard.dismiss();
  //     // Actions[ScreenType.FACILITIES.RECORD_QUESTION]({
  //     //     videoUrl: this._question.tokBoxArchiveUrl,
  //     //     text: this._question.text,
  //     //     onSave: (archiveId) => {
  //     //         this._question.setArchiveId(archiveId);
  //     //         this.saveQuestion(null, true)
  //     //     }
  //     // })
  //   }
  // }

  // validate() {
  //   if (!(this._question.text || '').trim()) {
  //     Alert.alert(
  //       'Validation Error',
  //       'Please enter the text of your question.',
  //     );
  //     return false;
  //   }

  //   if (!this.unitTypeId) {
  //     Alert.alert('Validation Error', 'Please choose a unit.');
  //     return false;
  //   }

  //   return true;
  // }

  const renderDefaultQuestionField = () => {
    return (
      <View style={styles.defaultQuestionField}>
        <Switch
          style={styles.switch}
          // value={this._question.defaultFlag}
          // onValueChange={this.onDefaultQuestionChanged.bind(
          //   this,
          //   !this._question.defaultFlag,
          // )}
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
        <Text style={styles.header}>
          Enter the text of your question below.
        </Text>
        <View style={styles.form}>
          <TextInput
            style={[styles.questionInput]}
            maxLength={1000}
            autoCapitalize="sentences"
            rowSpan={4}
            placeholder="Type your question"
            placeholderTextColor={AppColors.mediumGray}
            autoFocus={false}
            value={propsData?.questionText || ''}
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
              // onPress={this.recordQuestion.bind(this)}
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
              // onPress={this.recordQuestion.bind(this)}
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
