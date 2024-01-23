import { createStore, applyMiddleware, compose, combineReducers } from 'redux';
import thunk from 'redux-thunk';
import sessionReducer from './session';
import groupReducer from './group';
import eventReducer from './event';
import groupIdReducer from './groupdetail';
import eventIdReducer from './eventdetail';
import createGroupReducer from './creategroup';


const rootReducer = combineReducers({
  session: sessionReducer,
  groups: groupReducer,
  events: eventReducer,
  currGroup : groupIdReducer,
  currEvent : eventIdReducer,
  newGroup: createGroupReducer
});

let enhancer;
if (import.meta.env.MODE === "production") {
  enhancer = applyMiddleware(thunk);
} else {
  const logger = (await import("redux-logger")).default;
  const composeEnhancers =
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
  enhancer = composeEnhancers(applyMiddleware(thunk, logger));
}

const configureStore = (preloadedState) => {
  return createStore(rootReducer, preloadedState, enhancer);
};

export default configureStore;
