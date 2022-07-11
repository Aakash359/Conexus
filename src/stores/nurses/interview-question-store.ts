
import { types, flow, getSnapshot } from 'mobx-state-tree'
import { rest } from '../../services/rest'
import { logger } from 'react-native-logs'
const log = logger.createLogger()
export const InterviewQuestionModel = types.model({
    needId: types.optional(types.string, ''),
    facilityId: types.optional(types.string, ''),
    facility: types.optional(types.string, ''),
    specialty: types.optional(types.string, ''),
    shift: types.optional(types.string, ''),
    unitName: types.optional(types.string, ''),
    unitId: types.optional(types.string, ''),
    archiveId: types.optional(types.string, ''),
    questionUrl: types.optional(types.string, ''),
    mediaDurationSeconds: types.optional(types.number, 0),
    maxAnswerLengthSeconds: types.optional(types.number, 0),
    maxThinkSeconds: types.optional(types.number, 0),
    createdByFirstName: types.optional(types.string, ''),
    createdByLastName: types.optional(types.string, ''),
    createdByTitle: types.optional(types.string, ''),
    questionId: types.optional(types.string, ''),
    questionNum: types.optional(types.number, 0),
    questionText: types.optional(types.string, ''),
    FeedbackResponse: types.optional(types.string, ''),
    ResponseByFirstName: types.optional(types.string, ''),
    ResponseByLastName: types.optional(types.string, ''),
    ResponseByTitle: types.optional(types.string, ''),
    HCPViewedFlag: types.optional(types.boolean, false),
    HCPPhotoUrl: types.optional(types.string, ''),
    answerVideoUrl: types.optional(types.string, ''),
    answerAudioPath: types.optional(types.string, ''),
    answerMediaDuration: types.optional(types.string, ''),
    answerMediaType: types.optional(types.string, '')
})
    .preProcessSnapshot(snapshot => {
        return Object.assign(snapshot, {
            mediaDurationSeconds: snapshot.mediaDurationSeconds,
            maxAnswerLengthSeconds: snapshot.maxAnswerLengthSeconds,
            maxThinkSeconds: snapshot.maxThinkSeconds,
            questionNum: snapshot.questionNum
        })
    })
    .actions(self => {
        return {
            saveVideoAnswer: flow<string, string>(function* (submissionId: string, archiveId: string) {

                const url = '/hcp/submitInterviewQuestion';
                const payload = {
                    submissionId,
                    archiveId,
                    questionId: self.questionId
                }

                log.info(`Posting to ${url}`, payload)

                const response = yield rest.post(url, payload)

                return response
            }),
            getSnapshot() {
                return getSnapshot(self)
            }
        }
    })

export const InterviewQuestionStore = types.model({
    questions: types.optional(types.array(InterviewQuestionModel), []),
    loading: types.optional(types.boolean, false)
})
    .actions(self => {
        return {
            load: flow<string>(function* (submissionId: string) {
                self.loading = true;

                try {
                    const response = yield rest.get(`/hcp/interviewquestions/${submissionId}`)
                    const sections = response.data || []
                    const questions = [];

                    sections.forEach(section => {
                        section.questions.forEach(questionData => {
                            questions.push(questionData)
                        })
                    })

                    InterviewQuestionStore.applySnapshot(self.$treenode, { questions });
                    self.loading = false;
                }
                catch (error) {
                    self.loading = false;
                    throw error;
                }
            })
        }
    })