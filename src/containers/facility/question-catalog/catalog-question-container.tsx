
import React from 'react'
import { Container, Text, Textarea, Switch } from 'native-base'
import { Platform, ViewProperties, ActivityIndicator, StyleSheet, View, KeyboardAvoidingView, TouchableOpacity, Alert, ScrollView, Keyboard } from 'react-native'
import { Actions } from 'react-native-router-flux'
import { inject, observer } from 'mobx-react'
import { AppFonts, AppColors } from '../../../theme';
import { ScreenType } from '../../../common/constants'
import { QuestionModel, FacilityQuestionsStore } from '../../../stores/facility'
import { UserStore, VideoStore } from '../../../stores'
import { ConexusIcon, ScreenFooterButton } from '../../../components'
import { FacilityUnitModel, loadFacilityUnits } from '../../../stores/facility'
import { showYesNoAlert } from '../../../common'

import { logger } from 'react-native-logs'
const log = logger.createLogger()

export interface CatalogQuestionContainerProps extends ViewProperties {
    questionId: string,
    initialUnitId: string,
    needId?: string,
    onSave?: () => any,
    onClose?: () => any,
    facilityQuestionsStore?: typeof FacilityQuestionsStore.Type,
    userStore?: UserStore,
    videoStore?: VideoStore
}

export interface CatalogQuestionContainerState {
    loading: boolean
}

@inject('userStore', 'facilityQuestionsStore', 'videoStore')
@observer
export class CatalogQuestionContainer extends React.Component<CatalogQuestionContainerProps, CatalogQuestionContainerState>  {

    _question: typeof QuestionModel.Type

    get onSave() {
        return this.props.onSave || function () { }
    }

    get onClose() {
        return this.props.onClose || function () { }
    }

    unitTypes: Array<typeof FacilityUnitModel.Type>

    get unitType(): typeof FacilityUnitModel.Type {
        const unitId = this._question.unitId;

        let result = this.unitTypes.find(unitType => {
            return unitType.unitId === unitId
        })

        if (!result) {
            result = this.unitTypes.find(unitType => {
                return unitType.unitName === unitId
            })
        }

        return result
    }

    get unitTypeId(): string {
        const unitType = this.unitType;
        return unitType ? unitType.unitId : ''
    }

    constructor(props, state) {
        super(props, state);

        this.state = {
            loading: false
        }

        if (parseInt(this.props.questionId) < 1) {
            this._question = QuestionModel.create({
                id: '0',
                needId: this.props.needId,
                unitId: this.props.initialUnitId
            })
        } else {
            this.loadQuestion()
        }
    }

    componentWillUnmount() {
        if (this.onClose) {
            this.onClose();
        }
    }

    componentWillMount() {
        this.setState({ loading: true })

        loadFacilityUnits(this.props.userStore.selectedFacilityId)
            .then((unitTypes) => {
                this.unitTypes = unitTypes;
                const unitType = this.unitType;

                if (this._question.isNewQuestion && unitType) {
                    this._question.setUnit(unitType.unitId, unitType.unitName)
                }

                this.setState({ loading: false })
            }, (err) => {
                log.info('Load units error', err)
                this.setState({ loading: true })
                Alert.alert(`We're Sorry`, "Units are unavailable for this facility.")
                Actions.pop()
            })
    }

    loadQuestion(newId: string = null) {
        if (this.props.needId) {
            this._question = this.props.facilityQuestionsStore.needSection.questions.find(q => q.id === (newId || this.props.questionId))
        } else {
            this._question = this.props.facilityQuestionsStore.findQuestion(this.props.userStore.selectedFacilityId, newId || this.props.questionId)
        }
    }

    selectUnit(unitId: string) {
        const existingUnitType = this.unitTypes.find(i => i.unitId === this._question.unitId);
        const newUnitType = this.unitTypes.find(i => i.unitId === unitId);

        if (newUnitType) {
            this._question.setUnit(newUnitType.unitId, newUnitType.unitName);
        }

        this.forceUpdate()

        const onCancel = () => {
            if (existingUnitType) {
                this._question.setUnit(existingUnitType.unitId, existingUnitType.unitName);
            }
        };


        if (!this._question.isNewQuestion) {
            this.saveQuestion(onCancel)
        }
    }

    openUnitSelector() {

        Actions[ScreenType.RADIO_LIST_LIGHTBOX](
            {
                title: "Select a Unit",
                value: this.unitTypeId,
                showImages: false,
                data: this.unitTypes.map(i => {
                    return { value: i.unitId, title: i.unitName }
                }),
                onClose: this.selectUnit.bind(this)
            }
        )
    }

    renderUnitField() {
        const unitType = this.unitType;

        return (
            <TouchableOpacity onPress={this.openUnitSelector.bind(this)}>
                <View style={styles.chooserField}>
                    <View style={{ flex: 1 }}>
                        {!unitType && <Text style={styles.chooserFieldPlaceholder}>Choose a Unit</Text>}
                        {!!unitType && <Text style={styles.chooserFieldText}>{unitType.unitName}</Text>}
                    </View>
                    <ConexusIcon style={styles.chooserFieldIcon} size={16} name="cn-dropdown" color={AppColors.darkBlue} />
                </View>
            </TouchableOpacity>
        )
    }

    onDefaultQuestionChanged(defaultFlag: boolean) {
        const existingValue = this._question.defaultFlag;
        this._question.setDefaultFlag(defaultFlag)

        const onCancel = () => {
            this._question.setDefaultFlag(existingValue)
        };

        if (!this._question.isNewQuestion) {
            this.saveQuestion(onCancel)
                .then(() => this.forceUpdate.bind(this));
        }
    }

    saveQuestion(onCancel?: () => any, isNew: boolean = false) {
        const { needId } = this.props

        return this._question.save()
            .then((saveResult) => {
                return this.props.facilityQuestionsStore.load(needId)
                    .then(() => {
                        
                        log.info('New question Id', saveResult['id'])
                        this._question = QuestionModel.create(saveResult)  

                        log.info('Before pop')
                        if (isNew) {
                            // Close the recording window
                            Actions.pop()
                        }
                        log.info('After pop')
                        this.onSave()
                        log.info('After onSave')
                        this.forceUpdate()
                    })
            },
            (error) => {
                log.info('Save Question Error', error)

                showYesNoAlert(
                    {
                        onNo: onCancel,
                        onYes: this.saveQuestion.bind(this, onCancel, isNew),
                        yesTitle: 'Retry',
                        noTitle: 'Cancel',
                        title: 'Save Error',
                        message: 'An error occurred while saving.'
                    })
            })
    }

    recordQuestion() {
        if (this.validate()) {
            Keyboard.dismiss()
            Actions[ScreenType.FACILITIES.RECORD_QUESTION]({
                videoUrl: this._question.tokBoxArchiveUrl,
                text: this._question.text,
                onSave: (archiveId) => {
                    this._question.setArchiveId(archiveId);
                    this.saveQuestion(null, true)
                }
            })
        }
    }

    validate() {
        if (!(this._question.text || '').trim()) {
            Alert.alert('Validation Error', 'Please enter the text of your question.')
            return false
        }

        if (!this.unitTypeId) {
            Alert.alert('Validation Error', 'Please choose a unit.')
            return false
        }

        return true
    }

    renderDefaultQuestionField() {
        return (
            <View style={styles.defaultQuestionField}>
                <Switch
                    style={[styles.switch]}
                    value={this._question.defaultFlag}
                    onValueChange={this.onDefaultQuestionChanged.bind(this, !this._question.defaultFlag)} />

                <TouchableOpacity onPress={this.onDefaultQuestionChanged.bind(this, !this._question.defaultFlag)}>
                    <Text style={this._question.defaultFlag ? styles.switchLabelEnabled : styles.switchLabel}>Default question for this unit.</Text>
                </TouchableOpacity>
            </View>
        )
    }

    renderEditableHeader() {
        return (
            <View style={{ flex: 1 }}>
                <Text style={styles.header}>Enter the text of your question below.</Text>
                < View style={styles.form} >
                    <Textarea
                        style={[styles.questionInput]}
                        maxLength={1000}
                        autoCapitalize="sentences"
                        rowSpan={4}
                        placeholder="Type your question"
                        autoFocus={false}
                        value={this._question.text}
                        returnKeyType="done"
                        blurOnSubmit={true}
                        multiline={false}
                        onChangeText={(text) => {
                            this._question.setText(text)
                            this.forceUpdate()
                        }} />
                </View >
            </View>
        )
    }

    renderReadOnlyHeader() {
        return (
            <View style={[styles.readonlyQuestionInputContainer]}>
                <Text style={[styles.readonlyQuestionInput]}>{'\u201C'}{this._question.text}{'\u201D'}</Text>
            </View>
        )
    }

    renderQuestionContainer() {
        return (
            <KeyboardAvoidingView style={{ flex: 1 }}>
                <Container style={styles.container}>
                    <ScrollView
                        style={{ flex: 1, padding: 20 }}>
                        {this._question.isNewQuestion ? this.renderEditableHeader() : this.renderReadOnlyHeader()}
                        {this.renderUnitField()}
                        {this.renderDefaultQuestionField()}
                    </ScrollView>
                </Container >
                {this._question.canPlayQuestion &&
                    <ScreenFooterButton title="Play Question" onPress={() => Actions[ScreenType.FACILITIES.QUESTION_PLAYBACK_LIGHTBOX]({ videoUrl: this._question.tokBoxArchiveUrl })} />
                }

                {this._question.isNewQuestion &&
                    <ScreenFooterButton title="Record Your Question" onPress={this.recordQuestion.bind(this)} />
                }
            </KeyboardAvoidingView>
        )
    }

    renderLoadingContainer() {
        return (
            <Container style={styles.container}>
                <ActivityIndicator color={AppColors.blue} style={{ flex: 1 }} />
            </Container>
        )
    }

    render() {
        const { loading } = this.state;

        if (loading) {
            return this.renderLoadingContainer()
        }

        return this.renderQuestionContainer()
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'stretch',
    },
    listItem: {
        backgroundColor: AppColors.white,
        borderBottomWidth: 1,
        borderBottomColor: AppColors.lightBlue
    },

    header: {
        ...AppFonts.bodyTextNormal,
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center'
    },

    headerTitle: {
        ...AppFonts.title,
        paddingLeft: 18,
        paddingRight: 18
    },

    headerDescription: {
        ...AppFonts.description,
        paddingLeft: 18,
        paddingRight: 18
    },

    form: {
        paddingTop: 18,
        paddingBottom: 18
    },


    switch: {
        position: 'relative',
        top: Platform.OS === 'android' ? 3 : 0,
    },

    switchLabel: {
        paddingLeft: 8,
        opacity: .75,
    },

    switchLabelEnabled: {
        paddingLeft: 8,
        opacity: 1
    },

    defaultQuestionField: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginTop: 18,
        marginBottom: 18
    },

    questionInput: {
        backgroundColor: AppColors.white,
        borderRadius: 6,
        borderColor: AppColors.lightBlue,
        borderWidth: 1,
        padding: 6,
        marginBottom: 18
    },

    readonlyQuestionInputContainer: {
        backgroundColor: AppColors.white,
        borderRadius: 6,
        borderColor: AppColors.lightBlue,
        borderWidth: 1,
        marginBottom: 18,
        paddingTop: 20,
        paddingBottom: 20,
        padding: 4
    },

    readonlyQuestionInput: {
        ...AppFonts.bodyTextLarge,
        fontWeight: '600',
        color: AppColors.gray,
        textAlign: 'center',
    },

    chooserField: {
        backgroundColor: AppColors.white,
        borderRadius: 6,
        borderColor: AppColors.lightBlue,
        borderWidth: 1,
        padding: 12,
        marginBottom: 24,
        flexDirection: 'row',
        alignItems: 'stretch'
    },

    chooserFieldText: {
        ...AppFonts.buttonText,
        color: AppColors.darkBlue
    },

    chooserFieldIcon: {
        alignSelf: 'flex-end',
    },

    chooserFieldPlaceholder: {
        ...AppFonts.buttonText,
        color: AppColors.darkBlue,
        fontStyle: 'italic',
        opacity: .6
    }
})  