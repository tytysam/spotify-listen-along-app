// * note: Reducers are functions that calculate a new state value based on previous state + an action

import { combineReducers } from "redux";

import devicesReducer from "../reducers/devicesReducer.js";
import playbackReducer from "../reducers/playbackReducer.js";
import queueReducer from "../reducers/queueReducer.js";
import searchReducer from "../reducers/searchReducer.js";
import sessionReducer from "../reducers/sessionReducer.js";
import usersReducer from "../reducers/usersReducer.js";

export const reducers = () => {
  // pass through an object containing our slice reducers...
  combineReducers({
    // combineReducers will call each slice reducer individually,
    // pass in the specific slice of the Redux state,
    // and include each return value in the final new Redux state object
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
