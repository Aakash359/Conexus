import {createStore, applyMiddleware} from 'redux';
import thunk from 'redux-thunk';
import {rootReducer} from './reducers'; // root reducer
import logger from 'redux-logger';

const middlewares = [];

middlewares.push(logger);

const store = createStore(rootReducer, applyMiddleware(...middlewares, thunk));

export {store};
