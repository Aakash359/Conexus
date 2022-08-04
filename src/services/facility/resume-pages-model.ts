import { types, flow, getSnapshot } from 'mobx-state-tree'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { USER_STORE_AUTH_TOKEN_STORAGE_KEY } from '../userStore'

export const ResumePagesModel = types.model({
    resumeBaseUrl: types.optional(types.string, ''),
    pageCount: types.optional(types.number, 0),
    images: types.optional(types.array(types.string), [])
})
    .actions(self => {
        return {
            attachAuthToken: flow<any>(function* () {
                var token = JSON.parse(yield AsyncStorage.getItem(USER_STORE_AUTH_TOKEN_STORAGE_KEY));
                const images: string[] = [];
                self.images.forEach(url => {
                    if (url.indexOf('authtoken') === -1) {
                        const hasQuery = url.indexOf('?') > -1;
                        images.push(url += `${hasQuery ? '&' : '?'}authtoken=${token.token}`);
                    }
                });

                self.images.splice(0, images.length, ...images);
            }),
            getSnapshot() {
                return getSnapshot(self)
            }
        }
    })
    .preProcessSnapshot(snapshot => {
        let pageCount: number = snapshot.pageCount || 0
        let resumeBaseUrl: string = snapshot.resumeBaseUrl;

        let i = 0;
        let images: string[] = [];

        pageCount = pageCount || 0;
        resumeBaseUrl = resumeBaseUrl || '';

        while (i < pageCount) {
            images.push(`${resumeBaseUrl}${i + 1}`);
            i += 1;
        }

        return {
            pageCount: pageCount,
            resumeBaseUrl: resumeBaseUrl,
            images
        }
    })