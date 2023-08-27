import { handleActions } from "redux-actions";
import {
    GET_FRACTION_FAILURE, GET_FRACTION_REQUEST, GET_FRACTION_SUCCESS,
    ADD_FRACTION_FAILURE, ADD_FRACTION_SUCCESS, ADD_FRACTION_REQUEST,
    UPDATE_FRACTION_FAILURE, UPDATE_FRACTION_SUCCESS, UPDATE_FRACTION_REQUEST,
    DELETE_FRACTION_FAILURE, DELETE_FRACTION_REQUEST, DELETE_FRACTION_SUCCESS,
    UNMOUNT_SUPPLIER
} from "../constants/actionTypes";

const INITIAL_STATE = {
    isLoading: false,
    listData: [],
    allListData: [],
    activePage: 1,
    totalPage: 1,
    errMsg: ""
};

const handleGetFractionRequest = (state) => ({ ...state, isLoading: true });
const handleGetFractionSuccess = (state, action) => ({
    ...state,
    isLoading: false,
    listData: action.payload.listData,
    allListData: action.payload.allListData,
    activePage: action.payload.activePage,
    totalPage: action.payload.totalPage,
    errMsg: ""
});
const handleGetFractionFailure = (state, action) => ({ ...state, isLoading: false, errMsg: action.payload });

const handleCommonRequest = (state) => ({ ...state, isLoading: true });
const handleCommonSuccess = (state, action) => ({
    ...state,
    isLoading: false,
    errMsg: ""
});
const handleCommonFailure = (state, action) => ({ ...state, isLoading: false, errMsg: action.payload });

const handleUnmountSupplier = (state, action) => (INITIAL_STATE);

const fractionReducer = handleActions(
    {
        [GET_FRACTION_REQUEST]: handleGetFractionRequest,
        [GET_FRACTION_SUCCESS]: handleGetFractionSuccess,
        [GET_FRACTION_FAILURE]: handleGetFractionFailure,
        [ADD_FRACTION_REQUEST]: handleCommonRequest,
        [ADD_FRACTION_SUCCESS]: handleCommonSuccess,
        [ADD_FRACTION_FAILURE]: handleCommonFailure,
        [UPDATE_FRACTION_REQUEST]: handleCommonRequest,
        [UPDATE_FRACTION_SUCCESS]: handleCommonSuccess,
        [UPDATE_FRACTION_FAILURE]: handleCommonFailure,
        [DELETE_FRACTION_REQUEST]: handleCommonRequest,
        [DELETE_FRACTION_SUCCESS]: handleCommonSuccess,
        [DELETE_FRACTION_FAILURE]: handleCommonFailure,
        [UNMOUNT_SUPPLIER]: handleUnmountSupplier
    },
    INITIAL_STATE
);

export default fractionReducer;