// * note: Actions in Redux are plain objects with a TYPE field, and describe "what happened" in the app

import fetch from "isomorphic-unfetch";

import Config from "../../../config/app.js";
import * as types from "../constants/ActionTypes.js";

// =============== //
//      USERS      //
// =============== //
export const updateUsers = (users) => ({
  type: types.UPDATE_USERS,
  data: users,
});

export const fetchUsers = () => (dispatch) =>
  fetch(`${Config.HOST}/api/users`)
    .then((res) => res.json())
    .then((res) => dispatch(updateUsers(res)));
