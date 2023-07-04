import { combineReducers } from 'redux';
import { UserReducer } from './userReducer';
import CurrentUser from './currentUser'
import ActiveCall from './activeCall'
import {
    useSelector as useReduxSelector,
    TypedUseSelectorHook,
} from 'react-redux'

export const rootReducer = combineReducers({
userReducer: UserReducer,
currentUser:CurrentUser,
activeCall:ActiveCall,

});

export const useSelector: TypedUseSelectorHook<ReturnType<typeof rootReducer>> = useReduxSelector
export type RootState = ReturnType<typeof rootReducer>;