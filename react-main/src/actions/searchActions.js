// REF: https://redux.js.org/tutorials/fundamentals/part-2-concepts-data-flow
// * note: Actions in Redux are plain objects with a TYPE field, and describe "what happened" in the app + causes an update to state when something happens
import * as types from "../constants/ActionTypes.js";

// =============== //
//      SEARCH     //
// =============== //
export const searchTracks = (query) => ({ type: types.SEARCH_TRACKS, query });

export const searchTracksSuccess = (query, results) => ({
  types: types.SEARCH_TRACKS_SUCCESS,
  query,
  results,
});

export const searchTracksReset = () => ({
  type: types.SEARCH_TRACKS_RESET,
});

// =============== //
//      FETCH      //
// =============== //
export const fetchTrack = (id) => ({ type: types.FETCH_TRACK, id });

export const fetchTrackSuccess = (id, track) => ({
  type: types.FETCH_TRACK_SUCCESS,
  id,
  track,
});
