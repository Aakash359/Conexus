import { createStore, applyMiddleware } from 'redux';
import { persistStore, persistReducer } from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';
import thunk from 'redux-thunk';
import { rootReducer } from './reducers';

const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  whitelist: ['userReducer'],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);
const middlewares = [];
const enhancers = [];

// middlewares.push(logger);

const store = createStore(
  persistedReducer,
  // applyMiddleware(...middlewares, thunk),
  applyMiddleware(thunk),
);


export const persistor = persistStore(store);

export { store };
