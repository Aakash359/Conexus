import { types, flow, getSnapshot, applySnapshot } from 'mobx-state-tree'
import { ConversationModel } from './conversation-model'
import { ConversationMessageModel } from './conversation-message-model'
import { ConversationFacilityModel } from './conversation-facility-model'
import { userStoreInstance } from '../userStore'
import { rest } from '../../services/rest'
import { logger } from 'react-native-logs'
import { YellowBox } from 'react-native';
const log = logger.createLogger()

let moment = require('moment')

export const ConversationStore = types.model('NurseConversations', {
    facilities: types.optional(types.array(ConversationFacilityModel), []),
    nurseConversations: types.optional(types.array(ConversationModel), []),
    loading: types.optional(types.boolean, false),
    loaded: types.optional(types.boolean, false),
    activeConversation: types.maybe(ConversationModel),
    unreadCount: types.optional(types.number, 0),
})
    .actions(self => {

        const actions = {
            loadUnreadCount: flow(function* () {

                try {
                    log.info('ConversationStore', 'Loading conversation count', rest['headers'], '/conference/conversationCount')
                    const response = yield rest.get('/conference/conversationCount')
                    self.unreadCount = response.data.unreadMessages
                    log.info('ConversationStore', 'Loading conversation count', self.unreadCount)
                    return self.unreadCount
                }
                catch (error) {
                    throw error
                }
            }),


            reset: function () {
                self.loaded = false
                self.facilities.clear()
                self.nurseConversations.clear()
            },

            load: flow(function* () {
                self.loading = true

                try {
                    if (userStoreInstance.isNurseUser) {
                        self.facilities.clear()
                        log.info('ConversationStore', 'Loading conversations', rest['headers'], '/conference/conversationList')
                        const response = yield rest.get('/conference/hcpConversationList')
                        applySnapshot(self.nurseConversations, response.data || [])
                    } else {
                        self.nurseConversations.clear()
                        const response = yield rest.get('/conference/conversationList')
                        applySnapshot(self.facilities, response.data || [])
                        log.info('ConversationStore', 'Loadeded conversations', response.data)
                    }

                    yield actions.loadUnreadCount()

                    self.loading = false
                    self.loaded = true // Only set this to true once. It's useful on the view to handle refresh spinners
                }
                catch (error) {
                    self.loading = false
                    throw error
                }
            }),
            pushReceived: flow<string>(function* (pushId) {
                try {
                    log.info('ConversationStore', `Receiving pushId: ${pushId}`)
                    const response = yield rest.get(`conference/received/${pushId}`)
                    log.info(`Push received`)
                }
                catch (error) {
                    log.info(error)
                    self.loading = false
                    throw error
                }
            }),
            markRead: flow<string>(function* (messageId) {
                try {
                    log.info('ConversationStore', `Message read: ${messageId}`)
                    const response = yield rest.post(`conference/message/read/${messageId}`)
                }
                catch (error) {
                    log.info(error)
                    throw error
                }
            }),
            loadActiveConversation: flow<string>(function* (conversationId) {
                try {
                    log.info('ConversationStore', `Loading messages for conversationId: ${conversationId}`, rest.defaults.headers.common.Authorization)
                    const response = yield rest.get(`/conference/messages/${conversationId}`)

                    if (self.activeConversation) {
                        applySnapshot(self.activeConversation, response.data);
                    }
                    else {
                        self.activeConversation = ConversationModel.create(response.data);
                    }

                    log.info('ConversationStore', `${response.data.length} messages loaded for conversationId: ${conversationId}`, response.data)
                    self.loading = false
                }
                catch (error) {
                    log.info(error)
                    self.loading = false
                    throw error
                }
            }),

            initiatePhoneCall: flow<string, string>(function* (submissionId: string, senderPhoneNumber: string) {
                return yield rest.post('/conference/messageSend', {
                    conversationId: "",
                    submissionId,
                    senderPhoneNumber,
                    messageTypeId: '2'
                })
            }),

            sendTextMessage: flow<string, string, string>(function* (conversationId: string, submissionId: string, messageText: string) {
                try {
                    const data = {
                        conversationId: conversationId || null,
                        submissionId: submissionId || null,
                        messageText,
                        messageTypeId: '1'
                    };

                    const url = '/conference/messageSend';
                    log.info('ConversationStore', 'SendTextMessage', `Sending to: ${url}`, data)

                    const response = yield rest.post(url, data)
                    log.info('ConversationStore', 'SendTextMessage', 'Response', response)

                    if (self.activeConversation && self.activeConversation.conversationId === conversationId) {
                        data['messageId'] = moment().toString()
                        data['messageTimestamp'] = moment().toISOString()
                        data['sentByUserId'] = userStoreInstance.user.userId
                        data['senderFirstName'] = userStoreInstance.user.firstName
                        data['senderLastName'] = userStoreInstance.user.lastName
                        data['senderTitle'] = userStoreInstance.user.lastName
                        data['sentByMe'] = true

                        self.activeConversation.messages.push(ConversationMessageModel.create(data))
                    } else if (!this.activeConversation) {
                        log.info('ConversationStore', 'Loading active conversation since one wasn\'t loaded.');
                        yield actions.loadActiveConversation(response.data.conversationId);
                    }

                    return response.data.conversationId

                } catch (error) {
                    log.info('ConversationStore', 'sendTextMessage:error', error)
                    throw error
                }
            }),

            sendVideoMessage: flow<string, string, string, string>(function* (conversationId: string, submissionId: string, archiveId: string, videoUrl: string) {
                try {
                    const url = '/conference/messageSend';
                    const data = {
                        conversationId: conversationId || "",
                        submissionId: submissionId || "",
                        tokBoxArchiveId: archiveId,
                        messageTypeId: '3'
                    }

                    log.info('ConversationStore', 'sendVideoMessage', `Sending to: ${url}`, data)
                    const response = yield rest.post(url, data)

                    log.info('ConversationStore', 'sendVideoMessage', 'Response', response)

                    if (self.activeConversation && self.activeConversation.conversationId === conversationId) {
                        data['messageId'] = moment().toString()
                        data['messageTimestamp'] = moment().toISOString()
                        data['sentByUserId'] = userStoreInstance.user.userId
                        data['senderFirstName'] = userStoreInstance.user.firstName
                        data['senderLastName'] = userStoreInstance.user.lastName
                        data['senderTitle'] = userStoreInstance.user.lastName
                        data['tokBoxArchiveUrl'] = videoUrl
                        data['sentByMe'] = true

                        self.activeConversation.messages.push(ConversationMessageModel.create(data))
                    } else if (!this.activeConversation) {
                        log.info('ConversationStore', 'Loading active conversation since one wasn\'t loaded.');
                        yield actions.loadActiveConversation(response.data.conversationId);
                    }

                    return response.data.conversationId

                }
                catch (error) {
                    log.info('ConversationStore', 'sendVideoMessage:error', error)
                    throw error
                }
            }),

            clearActiveConversation: () => {
                self.activeConversation = null
            },

            getSnapshot() {
                return getSnapshot(self)
            }

        }

        return actions
    })


export const conversationStoreInstance = ConversationStore.create({})