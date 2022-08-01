import { combineReducers } from 'redux';
import { UserReducer } from './userReducer';
import {
    useSelector as useReduxSelector,
    TypedUseSelectorHook,
} from 'react-redux'

export const rootReducer = combineReducers({
userReducer: UserReducer,
});

export const useSelector: TypedUseSelectorHook<ReturnType<typeof rootReducer>> = useReduxSelector
export type RootState = ReturnType<typeof rootReducer>;