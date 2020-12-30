import { combineReducers } from "redux";

import devicesReducer from "../reducers/devicesReducer.js";
import playbackReducer from "../reducers/playbackReducer.js";
import queueReducer from "../reducers/queueReducer.js";
import searchReducer from "../reducers/searchReducer.js";
import sessionReducer from "../reducers/sessionReducer.js";
import usersReducer from "../reducers/usersReducer.js";

export const reducers = () => {
  combineReducers({
    queue: queueReducer,
    playback: playbackReducer,
    session: sessionReducer,
    users: usersReducer,
    search: searchReducer,
    devices: devicesReducer,
  });
};

export const getDevices = (state) => fromDevices.getDevices(state.devices);

export const getIsFetchingDevices = (state) =>
  fromDevices.getIsFetching(state.devices);
