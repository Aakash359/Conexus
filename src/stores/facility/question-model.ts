import { types, flow, getSnapshot } from 'mobx-state-tree'
import { rest } from '../../services/rest'
import { logger } from 'react-native-logs'
import _ from 'lodash'
import { userStoreInstance } from '../../stores/userStore'
const log = logger.createLogger()
export const QuestionModel = types.model("QuestionModel", {
    id: types.optional(types.string, '0'),
    needId: types.optional(types.string, ''),
    text: types.optional(types.string, ''),
    unitId: types.optional(types.string, ''),
    unitName: types.optional(types.string, ''),
    defaultFlag: types.optional(types.boolean, false),
    tokBoxArchiveId: types.optional(types.string, ''),
    tokBoxArchiveUrl: types.optional(types.string, ''),
    maxAnswerLengthSeconds: types.optional(types.string, '0'),
    displayOrder: types.optional(types.number, 0),
    deleted: types.optional(types.boolean, false),
    facilityId: types.optional(types.string, '')
})
    .views(self => {
        const views = {
            get isNewQuestion() {
                return parseInt(self.id) < 1
            },
            get canPlayQuestion() {
                return !views.isNewQuestion && views.hasVideoUrl
            },
            get hasVideoUrl() {
                return !!self.tokBoxArchiveUrl
            }
        }

        return views
    })
    .actions(self => {

        const actions = {
            setText: (text: string) => {
                self.text = text;
            },
            setUnit: (unitId: string, unitName: string) => {
                self.unitId = unitId
                self.unitName = unitName
            },
            setNeedId: (needId: string) => {
                self.needId = needId
            },
            setDefaultFlag: (value: boolean) => {
                self.defaultFlag = value;
            },
            setDisplayOrder: (displayOrder: number) => {
                log.info(`${self.text} : ${self.displayOrder} -> ${displayOrder}`)
                self.displayOrder = displayOrder
            },
            setDeleted: () => {
                self.deleted = true
            },
            setArchiveId: (archiveId: string) => {
                self.tokBoxArchiveId = archiveId
            },
            clone: () => {
                return QuestionModel.create(getSnapshot(self));
            },
            setId: (id: string) => {
                self.id = id;
            },
            save: flow(function* () {
                let data = getSnapshot(self);

                // Don't send an ID for inserts
                if (parseInt(self.id) < 1) {
                    data = _.omit(data, ['id'])
                }

                let url = !!self.needId ? `/facility/updateNeedQuestion/${self.needId}` : `/facility/updateQuestion/${userStoreInstance.selectedFacilityId}`

                if (!data['id'] && data['needId']) {
                    url = `/facility/createNeedQuestion/${data['needId']}`;
                    log.info('Using url for need insert', url)
                }


                log.info('sending data', url, data)

                return yield rest.post(url, data).then(
                    (response) => {
                        log.info('response', response)
                        return response.data

                    }, (error) => {
                        log.info('request failed', error)
                    })
            }),

            getSnapshot() {
                return getSnapshot(self)
            }
        }


        return actions

    })



export const QuestionSectionModel = types.model({
    sectionId: types.optional(types.string, ''),
    sectionTitle: types.optional(types.string, ''),
    questions: types.optional(types.array(QuestionModel), []),
    defaultQuestions: types.optional(types.array(QuestionModel), []),
})
    .actions(self => {
        return {
            setNeedId(needId: string) {
                for (const question of self.questions) {
                    question.setNeedId(needId)
                }
                for (const question of self.defaultQuestions) {
                    question.setNeedId(needId)
                }
            },
            moveQuestion(currentIndex: number, newIndex: number) {
                const question = self.questions[currentIndex] as typeof QuestionModel.Type
                try {
                    question.setDisplayOrder(newIndex + 1)
                    self.questions.move(currentIndex, newIndex)
                } catch (error) { log.info('moveQuestion Error', error) }
                return question.save()
            },

            moveDefaultQuestion(currentIndex: number, newIndex: number) {
                const question = self.defaultQuestions[currentIndex] as typeof QuestionModel.Type
                try {
                    question.setDisplayOrder(newIndex + 1)
                    self.defaultQuestions.move(currentIndex, newIndex)
                } catch (error) { log.info('moveQuestion Error', error) }
                return question.save()
            },

            saveQuestion(currentIndex: number, newIndex: number) {
                const question = self.defaultQuestions[currentIndex] as typeof QuestionModel.Type

                question.setDisplayOrder(newIndex + 1)
                self.defaultQuestions.move(currentIndex, newIndex)
                return question.save()
            },

            clone: () => {
                return QuestionSectionModel.create(getSnapshot(self));
            },

            findQuestion(id: string): typeof QuestionModel.Type {
                var result = self.questions.find(i => i['id'] === id)

                if (!result) {
                    result = self.defaultQuestions.find(i => i['id'] === id)
                }

                return result;
            }
        }
    })
