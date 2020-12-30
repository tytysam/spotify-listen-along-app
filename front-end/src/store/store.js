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
