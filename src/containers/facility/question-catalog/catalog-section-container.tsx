import React from 'react'
import { Container, Icon, Text } from 'native-base'
import { ViewProperties, ActivityIndicator, StyleSheet, View, RefreshControl, ScrollView, Alert } from 'react-native'
import { Actions } from 'react-native-router-flux'
import { inject, observer } from 'mobx-react'
import { AppColors, AppSizes } from '../../../theme'
import { ScreenType } from '../../../common/constants'
import { ViewHeader, TabBar, TabDetails } from '../../../components'
import { SortableQuestionRow } from './sortable-question-row'
import { FacilityQuestionsStore, QuestionSectionModel, QuestionModel } from '../../../stores/facility'
import { UserStore } from '../../../stores'
import { ScreenFooterButton } from '../../../components'
import { showYesNoAlert } from '../../../common'
import Styles from '../../../theme/styles'
import { logger } from 'react-native-logs'

import SortableList from 'react-native-sortable-list'


export interface CatalogSectionContainerProps extends ViewProperties {
    questionSectionId: string,
    needId: string,
    sectionTitleOverride?: string,
    facilityQuestionsStore: typeof FacilityQuestionsStore.Type,
    userStore?: UserStore,
    onSave?: () => any
}

export interface CatalogSectionContainerState {
    selectedTabId: string,
    editing: boolean,
    refreshing: boolean,
    silentRefreshing: boolean,
    saving: boolean,
    loading: boolean,
    loadingError: boolean
}

type RowMap = {
    [key: string]: typeof QuestionModel.Type
}
const log = logger.createLogger()

@inject('userStore', 'facilityQuestionsStore') @observer
export class CatalogSectionContainer extends React.Component<CatalogSectionContainerProps, CatalogSectionContainerState>  {

    get onSave() {
        return this.props.onSave || function () { }
    }

    get section(): typeof QuestionSectionModel.Type {
        const { userStore, questionSectionId, facilityQuestionsStore, needId } = this.props

        if (needId) {
            return facilityQuestionsStore.needSection
        }

        return facilityQuestionsStore.findQuestionSection(userStore.selectedFacilityId, questionSectionId);
    }

    get showableQuestions(): Array<typeof QuestionModel.Type> {
        if (!this.section) {
            return []
        }

        let questions = []

        if (this.props.needId) {
            questions = this.section.questions || []
        } else {
            questions = this.showDefault ? this.section.defaultQuestions : this.section.questions
        }

        return questions.filter(q => !q['deleted'])
    }

    get showDefault() {
        return this.state.selectedTabId === 'default'
    }

    get defaultListContentHeight() {
        return AppSizes.screen.height - AppSizes.navbarHeight;
    }


    constructor(props: CatalogSectionContainerProps, state: CatalogSectionContainerState) {
        super(props, state);

        this.state = {
            editing: false,
            selectedTabId: !!props.needId ? 'other' : 'default',
            refreshing: false,
            silentRefreshing: false,
            saving: false,
            loading: false,
            loadingError: false
        }
    }

    componentWillMount() {
        if (this.props.needId) {
            this.props.facilityQuestionsStore.reset();
        }
    }

    componentDidMount() {
        if (this.props.needId) {
            this.loadNeedQuestions();
        }
    }

    loadNeedQuestions() {
        this.props.facilityQuestionsStore.reset();
        this.setState({ loading: true, loadingError: false })

        this.props.facilityQuestionsStore
            .load(this.props.needId)
            .then(() => {
                this.setState({ loading: false, loadingError: false })
            })
            .catch(error => {
                log.info('Load questions error', error)
                this.setState({ loading: false, loadingError: true })
            })
    }


    onQuestionClose() {
        if (!this.section && !this.props.needId) {
            return Actions.pop();
        }
    }

    newQuestion() {
        const { refreshing, silentRefreshing } = this.state

        if (refreshing || silentRefreshing) {
            return
        }

        Actions[ScreenType.FACILITIES.CATALOG_QUESTION]({
            title: 'Add Question',
            questionId: '0',
            initialUnitId: this.section ? this.section.sectionId : '',
            needId: this.props.needId,
            onClose: this.onQuestionClose.bind(this),
            onSave: () => {
                this.onSave()
                this.forceUpdate()
            }
        })
    }

    openQuestion(questionId: string, needId: string, unitId: string) {
        const { refreshing, silentRefreshing } = this.state

        if (refreshing || silentRefreshing) {
            return
        }

        Actions[ScreenType.FACILITIES.CATALOG_QUESTION]({
            title: 'Modify Question',
            questionId: questionId,
            initialUnitId: unitId,
            needId: needId,
            onClose: this.onQuestionClose.bind(this),
            onSave: () => {
                this.onSave()
                this.forceUpdate()
            }
        })
    }

    playQuestion(questionId: string, needId: string) {
        const { refreshing, silentRefreshing } = this.state

        if (refreshing || silentRefreshing) {
            return
        }

        var question = this.props.facilityQuestionsStore.findQuestion(this.props.userStore.selectedFacilityId, questionId)

        if (!question) {
            return Alert.alert('Question Not Available');
        }

        Actions[ScreenType.FACILITIES.QUESTION_PLAYBACK_LIGHTBOX]({ videoUrl: question.tokBoxArchiveUrl })
    }

    deleteQuestion(questionId: string, needId: string) {
        const { facilityQuestionsStore } = this.props

        const tryDelete = () => {

            facilityQuestionsStore.deleteQuestion(questionId, needId)
                .then(() => {
                    this.onSave();
                    this.forceUpdate();
                    facilityQuestionsStore.load(needId)
                        .then(() => {
                            this.onSave()

                            if (!this.section && !this.props.needId) {
                                return Actions.pop();
                            }

                            this.forceUpdate()
                        })
                },
                    (error) => {
                        log.info('Delete error', error)

                        showYesNoAlert({
                            onNo: () => { },
                            onYes: tryDelete.bind(this),
                            yesTitle: 'Retry',
                            noTitle: 'Cancel',
                            title: 'Delete Error',
                            message: 'An error occurred while deleting the question.'
                        })
                    })
        }

        showYesNoAlert({
            onNo: () => { },
            onYes: tryDelete.bind(this),
            yesStyle: { color: AppColors.red },
            yesTitle: 'Delete',
            noTitle: 'Cancel',
            title: 'Are you sure?',
            message: 'This action can not be undone.'
        })
    }

    toggleEditing() {
        const { editing } = this.state
        this.setState({
            editing: !editing
        })
    }

    onTabSelection(tab: TabDetails) {
        this.setState({
            selectedTabId: tab.id
        })
    }

    renderUnitHeader() {
        const { editing } = this.state
        const questionCount = this.section.questions.length + this.section.defaultQuestions.length
        const description = `${questionCount} question${questionCount === 0 || questionCount > 1 ? 's' : ''}`
        const actionText = editing ? 'Finished' : 'Edit'

        return (
            <ViewHeader
                first
                title={this.props.sectionTitleOverride || this.section.sectionTitle}
                description={description}
                titleStyle={{ color: AppColors.white }}
                descriptionStyle={{ color: AppColors.white }}
                style={{ backgroundColor: AppColors.blue, borderBottomWidth: 0 }}
                actionStyle={{ borderWidth: 0 }}
                actionText={questionCount > 0 ? actionText : ''}
                onActionPress={this.toggleEditing.bind(this)}
            />
        )
    }

    renderTabs() {
        const { selectedTabId } = this.state;

        const tabs = [
            {
                id: 'default',
                title: 'Default Questions',
                badge: this.showDefault ? '' : this.getQuestionsBadge(this.section.defaultQuestions, true)
            },
            {
                id: 'other',
                title: 'Other Questions',
                badge: this.showDefault ? this.getQuestionsBadge(this.section.questions, false) : ''
            }
        ]

        return (
            <TabBar
                style={styles.tabBar}
                tabs={tabs}
                selectedTabId={selectedTabId}
                onTabSelection={this.onTabSelection.bind(this)} />
        )
    }

    getQuestionsBadge(questions: typeof QuestionModel.Type[], defaultQuestions: boolean) {
        const count = questions.filter(q => q.defaultFlag === defaultQuestions).length;
        return count.toString();
    }

    refreshSection(silent = false) {
        this.setState({ refreshing: !silent, silentRefreshing: silent }, () => {
            this.props.facilityQuestionsStore.load(this.props.needId)
                .then(() => {
                    if (!this.section && !this.props.needId) {
                        Actions.pop()
                    } else {
                        this.setState({ refreshing: false, silentRefreshing: false })
                    }
                }, (err => {
                    this.setState({ refreshing: false, silentRefreshing: false, })
                }))
        })
    }

    rowOrder: Array<string> = []
    newOrder: Array<string> = [];
    onChangeOrder(rowMap: RowMap, newOrder: string[]) {
        this.newOrder = newOrder
        log.info('New Order: ', newOrder)
    }

    onReleaseRow(rowMap: RowMap, rowKey) {
        log.info('Row Released')

        const currentIndex = parseInt(rowKey);
        const newIndex = this.newOrder.findIndex(v => v === rowKey);

        this.setState({ saving: true })

        this.showDefault ?
            this.section.moveDefaultQuestion(currentIndex, newIndex) :
            this.section.moveQuestion(currentIndex, newIndex)

        this.setState({ saving: false })
    }


    renderSortableList() {
        const { editing, refreshing } = this.state;
        const rowMap: RowMap = {};
        this.rowOrder = [];

        const questions = this.showableQuestions;
        
        this.showableQuestions
            .forEach((question, index) => {
                if (!question.deleted) { // This 
                    rowMap[index] = question
                    this.rowOrder.push(index.toString())
                }
            })

        return (
            <SortableList
                style={{ flex: 1 }}
                sortingEnabled={editing}
                refreshControl={
                    <RefreshControl
                        tintColor={AppColors.blue}
                        colors={[AppColors.blue]}
                        refreshing={refreshing}
                        onRefresh={this.refreshSection.bind(this, false)}
                    />
                }
                onChangeOrder={this.onChangeOrder.bind(this, rowMap)}
                onReleaseRow={this.onReleaseRow.bind(this, rowMap)}
                data={rowMap}
                renderRow={
                    ({ data, active, index }) => {
                        var paddingBottom = index + 1 === questions.length ? AppSizes.conexusFooterButtonHeight + 20 : 0;
                        var question: typeof QuestionModel.Type = data;

                        return (<SortableQuestionRow
                            marginBottom={paddingBottom}
                            allowDeleteQuestion={true}
                            text={data.text}
                            videoUrl={data.tokBoxArchiveUrl}
                            onDeleteQuestion={this.deleteQuestion.bind(this, question.id, question.needId)}
                            onOpenQuestion={this.openQuestion.bind(this, question.id, question.needId, question.unitId)}
                            onPlayQuestion={this.playQuestion.bind(this, question.id, question.needId)}
                            dragActive={active}
                            editing={editing} />)
                    }
                } />
        )
    }

    renderEmptyList() {
        const { refreshing } = this.state;

        return (
            <ScrollView
                style={{ flex: 1 }}
                refreshControl={
                    <RefreshControl
                        tintColor={AppColors.blue}
                        colors={[AppColors.blue]}
                        refreshing={refreshing}
                        onRefresh={this.refreshSection.bind(this, false)}
                    />
                }>

                <View style={StyleSheet.flatten([{ paddingBottom: 220 }, Styles.cnxNoDataMessageContainer])}>
                    <Icon name="information-circle" style={Styles.cnxNoDataIcon} />
                    <Text style={Styles.cnxNoDataMessageText}>No Questions Available</Text>
                </View>
            </ScrollView>
        )
    }

    renderLoadingContainer() {
        return <Container>
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                <ActivityIndicator color={AppColors.blue}></ActivityIndicator>
            </View>
        </Container>
    }

    renderLoadingErrorContainer() {
        return (
            <Container>
                <View style={StyleSheet.flatten([{ paddingBottom: 220 }, Styles.cnxNoDataMessageContainer])}>
                    <Icon name="information-circle" style={Styles.cnxNoDataIcon} />
                    <Text style={Styles.cnxNoDataMessageText}>An error occured while loading.</Text>
                </View>
            </Container>
        )
    }

    render() {
        const { needId } = this.props
        const { editing, loading, loadingError } = this.state;

        if (loading) {
            return this.renderLoadingContainer()
        }

        if (loadingError) {
            this.renderLoadingErrorContainer()
        }

        return (
            <Container style={{ flex: 1 }}>
                {!!this.section && this.renderUnitHeader()}
                {!needId && !!this.section && this.renderTabs()}
                {this.showableQuestions.length === 0 && this.renderEmptyList()}
                {this.showableQuestions.length > 0 && this.renderSortableList()}
                {!editing && <ScreenFooterButton title="Add Question" onPress={this.newQuestion.bind(this)} />}
            </Container>
        )

    }
}

const styles = StyleSheet.create({

    tabBar: {
        height: 62,
        borderTopWidth: 0,
        borderBottomWidth: 1,
        borderBottomColor: AppColors.lightBlue,
        backgroundColor: AppColors.white
    }
})


