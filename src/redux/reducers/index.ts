import { combineReducers } from 'redux';
import { UserReducer } from './userReducer';
// import { feedReducer } from './feed.reducer';
// import { storiesReducer } from './stories.reducer'

export const rootReducer = combineReducers({
userReducer: UserReducer,
//   stories: storiesReducer
});

export type RootState = ReturnType<typeof rootReducer>;