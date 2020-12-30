import { UPDATE_USERS } from "../constants/ActionTypes.js";

const initialState = [
  {
    id: "something",
    name: "Jenna",
  },
  {
    id: "something",
    name: "Nate",
  },
  {
    id: "something",
    name: "Grant",
  },
  {
    id: "something",
    name: "Kirsten",
  },
];

export default (state, action) => {
  switch (action.type) {
    case UPDATE_USERS:
      return action.data;
    default:
      return state ? state : initialState;
  }
};
