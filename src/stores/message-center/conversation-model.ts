import { types, getSnapshot } from 'mobx-state-tree'
import { ConversationMessageModel } from './conversation-message-model'
import { TitleDescriptionModel } from '../title-description-model'

export const ConversationModel = types.model('Conversation', {
    conversationId: types.string,
    display: types.maybe(TitleDescriptionModel),
    recentMessageDateTime: types.optional(types.string, ''),
    hcpFirstName: types.optional(types.string, ''),
    hcpLastName: types.optional(types.string, ''),
    hcpPhotoUrl: types.optional(types.string, ''),
    facPhotoUrl: types.optional(types.string, ''),
    appInstalled: types.boolean,
    unreadCount: types.optional(types.number, 0),
    hcpUserId: types.optional(types.string, ''),
    messageCount: types.optional(types.number, 0),
    submissionId: types.optional(types.string, ''),
    messages: types.optional(types.array(ConversationMessageModel), [])
})
    .actions(self => {
        return {
            getSnapshot() {
                return getSnapshot(self)
            }
        }
    })
    .preProcessSnapshot(snapshot => {
        if (!!snapshot) {
            snapshot.messageCount = snapshot.messageCount || 0
            snapshot.unreadCount = snapshot.unreadCount || 0
        }
        return snapshot;
    })
