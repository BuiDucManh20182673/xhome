import { handleActions } from "redux-actions";
import {
    GET_MATERIAL_FAILURE, GET_MATERIAL_REQUEST, GET_MATERIAL_SUCCESS,
    ADD_MATERIAL_FAILURE, ADD_MATERIAL_SUCCESS, ADD_MATERIAL_REQUEST,
    UPDATE_MATERIAL_FAILURE, UPDATE_MATERIAL_SUCCESS, UPDATE_MATERIAL_REQUEST,
    DELETE_MATERIAL_FAILURE, DELETE_MATERIAL_REQUEST, DELETE_MATERIAL_SUCCESS,
    SEARCH_MATERIAL_FAILURE, SEARCH_MATERIAL_REQUEST, SEARCH_MATERIAL_SUCCESS,
    CHOOSE_MATERIAL, UNMOUNT_SUPPLIER
} from "../constants/actionTypes";

const INITIAL_STATE = {
    isLoading: false,
    listData: [],
    activePage: 1,
    totalPage: 10,
    chooseId: 0,
    textSearch: "",
    errMsg: ""
};

const handleGetMaterialRequest = (state) => ({ ...state, isLoading: true });
const handleGetMaterialSuccess = (state, action) => ({
    ...state,
    isLoading: false,
    listData: action.payload.listData,
    activePage: action.payload.activePage,
    totalPage: action.payload.totalPage,
    textSearch: "",
    errMsg: ""
});
const handleGetMaterialFailure = (state, action) => ({ ...state, isLoading: false, errMsg: action.payload });

const handleSearchMaterialRequest = (state) => ({ ...state, isLoading: true });
const handleSearchMaterialSuccess = (state, action) => ({
    ...state,
    isLoading: false,
    listData: action.payload.listData,
    activePage: action.payload.activePage,
    totalPage: action.payload.totalPage,
    textSearch: action.payload.textSearch,
    errMsg: ""
});
const handleSearchMaterialFailure = (state, action) => ({ ...state, isLoading: false, errMsg: action.payload });

const handleCommonRequest = (state) => ({ ...state, isLoading: true });
const handleCommonSuccess = (state, action) => ({
    ...state,
    isLoading: false,
    errMsg: ""
});
const handleCommonFailure = (state, action) => ({ ...state, isLoading: false, errMsg: action.payload });

const handleChoose = (state, action) => ({ ...state, chooseId: action.payload });

const handleUnmountSupplier = (state, action) => ({ ...state, chooseId: 0 });

const materialReducer = handleActions(
    {
        [GET_MATERIAL_REQUEST]: handleGetMaterialRequest,
        [GET_MATERIAL_SUCCESS]: handleGetMaterialSuccess,
        [GET_MATERIAL_FAILURE]: handleGetMaterialFailure,
        [SEARCH_MATERIAL_REQUEST]: handleSearchMaterialRequest,
        [SEARCH_MATERIAL_SUCCESS]: handleSearchMaterialSuccess,
        [SEARCH_MATERIAL_FAILURE]: handleSearchMaterialFailure,
        [ADD_MATERIAL_REQUEST]: handleCommonRequest,
        [ADD_MATERIAL_SUCCESS]: handleCommonSuccess,
        [ADD_MATERIAL_FAILURE]: handleCommonFailure,
        [UPDATE_MATERIAL_REQUEST]: handleCommonRequest,
        [UPDATE_MATERIAL_SUCCESS]: handleCommonSuccess,
        [UPDATE_MATERIAL_FAILURE]: handleCommonFailure,
        [DELETE_MATERIAL_REQUEST]: handleCommonRequest,
        [DELETE_MATERIAL_SUCCESS]: handleCommonSuccess,
        [DELETE_MATERIAL_FAILURE]: handleCommonFailure,
        [CHOOSE_MATERIAL]: handleChoose,
        [UNMOUNT_SUPPLIER]: handleUnmountSupplier
        
    },
    INITIAL_STATE
);

export default materialReducer;