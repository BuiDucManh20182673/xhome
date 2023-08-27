import { handleActions } from "redux-actions";
import { PROJECTS_ADD } from "../constants/actionTypes";

const INITIAL_STATE = [];

const applyAddProjects = (state, action) => action.payload;

const projectReducer = handleActions(
  {
    [PROJECTS_ADD]: applyAddProjects,
  },
  INITIAL_STATE
);

export default projectReducer;