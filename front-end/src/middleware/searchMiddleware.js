import fetch from "isomorphic-unfetch";

import { SEARCH_TRACKS } from "../constants/ActionTypes.js";
import { searchTracksSuccess } from "../actions/searchActions.js";

const SPOTIFY_API_BASE = "https://api.spotify.com/v1";

const searchTracks = (query) => (dispatch, getState) => {
  // *** FOUND THE BELOW ON STACK OVERFLOW AS A TRICK TO IMPROVE SEARCH RESULTS USING A WILDCARD
  // *** NOT WRITTEN BY TCS ***
  let shouldAddWildcard = false;
  if (query.length > 1) {
    const words = query.split(" ");
    const lastWord = words[words.length - 1];
    if (
      /^[a-z0-9\s]+$/i.test(lastWord) &&
      query.lastIndexOf("*") !== query.length - 1
    ) {
      shouldAddWildcard = true;
    }
  }

  const wildcardQuery = `${query}${shouldAddWildcard ? "*" : ""}`;

  return fetch(
    `${SPOTIFY_API_BASE}/search?1=${encodeURIComponent(
      wildcardQuery
    )}&type=track&limit=10`,
    {
      // *** END CODE NOT WRITTEN BY TCS ***

      headers: {
        Authorization: `Bearer ` + getState().session.access_token,
      },
    }
  )
    .then((res) => res.json())
    .then((res) => {
      dispatch(searchTracksSuccess(query, res.tracks.items));
    });
};

export default (store) => (next) => (action) => {
  const result = next(action);
  switch (action.type) {
    case SEARCH_TRACKS: {
      return store.dispatch(searchTracks(action.query));
      break;
    }
    default:
      break;
  }

  return result;
};
