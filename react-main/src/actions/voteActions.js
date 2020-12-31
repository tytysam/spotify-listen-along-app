// REF: https://redux.js.org/tutorials/fundamentals/part-2-concepts-data-flow
// * note: Actions in Redux are plain objects with a TYPE field, and describe "what happened" in the app + causes an update to state when something happens
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
