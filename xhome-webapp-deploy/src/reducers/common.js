import { handleActions } from "redux-actions";
import { 
    // USER_LOGGED_IN,
    // USER_LOGGED_OUT 
} from "../constants/actionTypes";

const INITIAL_STATE = {
	// isLoggedIn: false,
};

// const setLoggedIn = (state) => ({ ...state, isLoggedIn: false });
// const setLoggedOut = (state) => ({ ...state, isLoggedIn: true });

const projectReducer = handleActions(
	{
		// [USER_LOGGED_IN]: setLoggedIn,
		// [USER_LOGGED_OUT]: setLoggedOut,
	},
	INITIAL_STATE
);

export default projectReducer;
