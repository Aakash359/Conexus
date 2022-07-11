import { types, flow, getSnapshot } from 'mobx-state-tree'
import { Alert } from 'react-native';

import { rest } from '../services/rest'
import { logger } from 'react-native-logs'
const log = logger.createLogger()
export const NurseSubmissionModel = types.model('NurseSubmission', {
    display: types.model({
        title: types.optional(types.string, ''),
        description: types.optional(types.string, '')
    }),
    submissionId: types.optional(types.string, ''),
    facilityName: types.optional(types.string, ''),
    facilityCity: types.optional(types.string, ''),
    facilityState: types.optional(types.string, ''),
    facilityZip: types.optional(types.string, ''),
    facilityAddress: types.optional(types.string, ''),
    facilityAddress2: types.optional(types.string, ''),
    facilityImage: types.optional(types.string, ''),
    vendorName: types.optional(types.string, ''),
    questionCount: types.optional(types.number, 0),
    submissionStatus: types.optional(types.string, ''),
    interviewStatus: types.optional(types.string, ''),
    interviewDate: types.optional(types.string, '0001-01-01T06:00:00Z'),
    actionType: types.optional(types.string, ''),
    actionText: types.optional(types.string, ''),
    actionSort: types.optional(types.string, ''),
    needId: types.optional(types.string, ''),
    interviewRequestId: types.optional(types.string, ''),
    position: types.model({
        display: types.model({
            title: types.optional(types.string, ''),
            description: types.optional(types.string, '')
        }),
        unit: types.optional(types.string, ''),
        discipline: types.optional(types.string, ''),
        specialty: types.optional(types.string, ''),
        shift: types.optional(types.string, '')
    })
})
    .actions(self => {
        return {
            getSnapshot() {
                return getSnapshot(self)
            }
        }
    })

    .preProcessSnapshot(snapshot => {
        return { ...snapshot, ...{ questionCount: snapshot.questionCount } }
    })

export type NurseSubmissionsStore = typeof NurseSubmissionsStore.Type
export enum InterviewStatusTypes {
    Complete = 83,
    Available = 82,
    Closed = 84
}
export const NurseSubmissionsStore = types
    .model('NurseSubmissionsStore', {
        submissions: types.optional(types.array(NurseSubmissionModel), []),

        isLoadingSubmissions: types.optional(types.boolean, false),
        loadingError: types.optional(types.string, '')
    })
    .views(self => {
        return {
            get hasLoadingError(): boolean {
                return !self.isLoadingSubmissions && !!self.loadingError
            },

            get availableInterviews() {
                return self.submissions.filter(i => {
                    return i.interviewStatus === 'Avaliable' || i.interviewStatus === 'Available'
                })
            },

            get completedInterviews() {
                return self.submissions.filter(i => {
                    return i.interviewStatus === 'Completed' || i.interviewStatus === 'Complete'
                })
            },

            get closedInterviews() {
                return self.submissions.filter(i => {
                    return i.interviewStatus === 'Closed'
                })
            }
        }
    })
    .actions(self => {
        return {
            reset: function () {
                log.info('NurseSubmissionsStore', 'Reset');
                self.submissions.clear();
                self.isLoadingSubmissions = false;
                self.loadingError = '';
            },
            load: flow(function* () {
                try {
                    log.info('NurseSubmissionsStore', 'Loading');

                    self.isLoadingSubmissions = true;
                    const response = yield rest.get('/hcp/submissions');

                    self.submissions = response.data
                    self.isLoadingSubmissions = false
                    self.loadingError = ''

                    log.info('NurseSubmissionsStore', 'Response', response);

                } catch (error) {
                    log.info('NurseSubmissionsStore', 'Error', error);
                    self.isLoadingSubmissions = false;
                    self.loadingError = error;

                    let defaultTitle = 'Error';
                    let defaultDescription = 'An unexpected error occurred while loading available positions.';

                    if (error.response && error.response.data) {
                        const { title, description } = error.response.data;
                        Alert.alert(title || defaultTitle, description || defaultDescription);
                    } else {
                        Alert.alert(defaultTitle, defaultDescription);
                    }
                }
            }),
            getSnapshot() {
                return getSnapshot(self)
            }
        }
    })

export const nurseSubmissionsStore = NurseSubmissionsStore.create();
