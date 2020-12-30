import * as types from "../constants/ActionTypes.js";

// =============== //
//      VOTING     //
// =============== //
export const voteUp = (id) => ({
  type: types.VOTE_UP,
  id,
});

export const voteUpSuccess = () => ({
  type: types.VOTE_UP_SUCCESS,
});
