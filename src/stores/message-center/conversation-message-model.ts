import { types, getSnapshot } from 'mobx-state-tree'

export const ConversationMessageModel = types.model('ConversationMessage', {
    messageId: types.string,
    messageTimestamp: types.optional(types.string, ''),
    messageTypeId: types.optional(types.string, ''),
    messageType: types.optional(types.string, ''),
    sentByUserId: types.optional(types.string, ''),
    senderFirstName: types.optional(types.string, ''),
    senderLastName: types.optional(types.string, ''),
    senderTitle: types.optional(types.string, ''),
    senderPhotoUrl: types.optional(types.string, ''),
    facPhotoUrl: types.optional(types.string, ''),
    messageText: types.optional(types.string, ''),
    audioUrl: types.optional(types.string, ''),
    videoUrl: types.optional(types.string, ''),
    sentByMe: types.optional(types.boolean, false),
    tokBoxArchiveUrl: types.optional(types.string, ''),
    read: types.optional(types.boolean, false)
})
.actions(self => {
    return {
        getSnapshot() {
            return getSnapshot(self)
        },
        updateReadState(readState: boolean){
            self.read = readState
        }
    }
})