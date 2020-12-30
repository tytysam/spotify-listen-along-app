// * note: Actions in Redux are plain objects with a TYPE field, and describe "what happened" in the app

import fetch from "isomorphic-unfetch";

import Config from "../../../config/app.js";
import * as types from "../constants/ActionTypes.js";

// =============== //
//      QUEUE      //
// =============== //
export const queueTrack = (id) => ({ type: types.QUEUE_TRACK, id });

export const updateQueue = (queue) => ({
  type: types.UPDATE_QUEUE,
  data: queue,
});

export const queueEnded = () => ({ type: types.QUEUE_ENDED });

export const queueRemoveTrack = (id) => ({
  type: types.QUEUE_REMOVE_TRACK,
  id,
});

export const fetchQueue = () => (dispatch) =>
  fetch(`${Config.HOST}/api/queue`)
    .then((res) => res.json())
    .then((res) => dispatch(updateQueue(res)));
