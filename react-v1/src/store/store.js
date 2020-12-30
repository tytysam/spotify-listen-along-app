// * note: A Redux store runs the root reducer whenever an action is dispatched

import { createStore, applyMiddleware } from "redux";
import thunk from "redux-thunk";

import { reducers } from "../reducers";

import devicesMiddlware from "../middleware/devicesMiddleware.js";
import loggerMiddleware from "../middleware/loggerMiddleware.js";
import playbackMiddleware from "../middleware/playbackMiddleware";
import searchMiddleware from "../middleware/searchMiddleware.js";
import sessionMiddleware from "../middleware/sessionMiddleware.js";
import socketMiddlewareDefault from "../middleware/socketMiddleware.js";
import { socketMiddleware } from "../middleware/socketMiddleware.js";

import { load } from "../actions/sessionActions.js";

export const initStore = (initialState = {}) => {
  const store = createStore(
    reducers(),
    initialState,
    applyMiddleware(
      thunk,
      // THUNK is a specific kind of Redux function that can contain asynchronous logic
      // This Redux Thunk middleware modifies the store to let us pass functions into DISPATCH
      devicesMiddlware,
      loggerMiddleware,
      playbackMiddleware,
      searchMiddleware,
      sessionMiddleware,
      socketMiddleware
    )
  );
  socketMiddlewareDefault(store);
  store.dispatch(load());
  return store;
};
