import { handleActions } from "redux-actions";
import {
    GET_SUPPLIER_FAILURE, GET_SUPPLIER_REQUEST, GET_SUPPLIER_SUCCESS,
    GET_DISTRIBUTOR_BY_SUP_NAME_FAILURE, GET_DISTRIBUTOR_BY_SUP_NAME_REQUEST, GET_DISTRIBUTOR_BY_SUP_NAME_SUCCESS,
    ADD_DISTRIBUTOR_BY_SUP_NAME_FAILURE, ADD_DISTRIBUTOR_BY_SUP_NAME_REQUEST, ADD_DISTRIBUTOR_BY_SUP_NAME_SUCCESS,
    GET_SUPPLIER_NAME_FAILURE, GET_SUPPLIER_NAME_REQUEST, GET_SUPPLIER_NAME_SUCCESS,
    ADD_SUPPLIER_FAILURE, ADD_SUPPLIER_SUCCESS, ADD_SUPPLIER_REQUEST,
    UPDATE_SUPPLIER_FAILURE, UPDATE_SUPPLIER_SUCCESS, UPDATE_SUPPLIER_REQUEST,
    DELETE_SUPPLIER_FAILURE, DELETE_SUPPLIER_REQUEST, DELETE_SUPPLIER_SUCCESS,
    SEARCH_SUPPLIER_FAILURE, SEARCH_SUPPLIER_REQUEST, SEARCH_SUPPLIER_SUCCESS,
    SEARCH_SUPPLIER_NAME_FAILURE, SEARCH_SUPPLIER_NAME_REQUEST, SEARCH_SUPPLIER_NAME_SUCCESS,
    CHOOSE_SUPPLIER, UNMOUNT_CATALOG, CHOOSE_SUPPLIER_NAME, ADD_SUPPLIER_NAME_REQUEST,
    ADD_SUPPLIER_NAME_SUCCESS, ADD_SUPPLIER_NAME_FAILURE, UPDATE_SUPPLIER_NAME_ALL_REQUEST,
    UPDATE_SUPPLIER_NAME_ALL_SUCCESS, UPDATE_SUPPLIER_NAME_ALL_FAILURE, DELETE_SUPPLIER_NAME_ALL_REQUEST,
    DELETE_SUPPLIER_NAME_ALL_SUCCESS, DELETE_SUPPLIER_NAME_ALL_FAILURE
} from "../constants/actionTypes";

const INITIAL_STATE = {
    isLoading: false,
    listData: [],
    activePage: 1,
    chooseId: 0,
    totalPage: 10,
    textSearch: "",
    errMsg: "",
    listDataName: [],
    activePageName: 1,
    choosedName: "",
    textSearchName: "",
    totalPageName: 10,
    listDataDistributor: [],
    activePageDistributor: 1,
    totalPageDistributor: 10,
    textSearchDistributor: "",
    isLoadingDistributor: false
};

const handleGetSupplierRequest = (state) => ({ ...state, isLoading: true });
const handleGetSupplierSuccess = (state, action) => ({
    ...state,
    isLoading: false,
    listData: action.payload.listData,
    activePage: action.payload.activePage,
    totalPage: action.payload.totalPage,
    textSearch: "",
    errMsg: ""
});
const handleGetSupplierNameSuccess = (state, action) => ({
    ...state,
    isLoading: false,
    listDataName: action.payload.listData,
    activePageName: action.payload.activePage,
    totalPageName: action.payload.totalPage,
    textSearchName: "",
    errMsg: "",
    count: action.payload.count
});

const handleGetSupplierFailure = (state, action) => ({ ...state, isLoading: false, errMsg: action.payload });

const handleSearchSupplierRequest = (state) => ({ ...state, isLoading: true });
const handleSearchSupplierSuccess = (state, action) => ({
    ...state,
    isLoading: false,
    listData: action.payload.listData,
    activePage: action.payload.activePage,
    totalPage: action.payload.totalPage,
    textSearch: action.payload.textSearch,
    errMsg: ""
});
const handleSearchSupplierNameSuccess = (state, action) => ({
    ...state,
    isLoading: false,
    listDataName: action.payload.listData,
    activePageName: action.payload.activePage,
    totalPageName: action.payload.totalPage,
    textSearchName: action.payload.textSearch,
    errMsg: ""
});

const handleGetDistributorSupplierNameRequest = (state) => ({ ...state, isLoadingDistributor: true });
const handleGetDistributorSupplierNameSuccess = (state, action) => ({
    ...state,
    isLoadingDistributor: false,
    listDataDistributor: action.payload.listData,
    activePageDistributor: action.payload.activePage,
    totalPageDistributor: action.payload.totalPage,
    textSearchDistributor: action.payload.textSearch,
    errMsg: ""
});
const handleGetDistributorSupplierNameFailure = (state, action) => ({ ...state, isLoadingDistributor: false, errMsg: action.payload });

const handleSearchSupplierFailure = (state, action) => ({ ...state, isLoading: false, errMsg: action.payload });

const handleCommonRequest = (state) => ({ ...state, isLoading: true });
const handleCommonSuccess = (state, action) => ({
    ...state,
    isLoading: false,
    errMsg: ""
});
const handleCommonFailure = (state, action) => ({ ...state, isLoading: false, errMsg: action.payload });

const handleChoose = (state, action) => ({ ...state, chooseId: action.payload });

const handleUnmountCatalog = (state, action) => ({ ...state, chooseId: 0 });

const handleChooseSupplierName = (state, action) => ({ ...state, choosedName: action.payload });
const handleAddNameSupplierSuccess = (state, action) => ({ ...state, choosedName: "" });

const supplierReducer = handleActions(
    {
        [GET_SUPPLIER_REQUEST]: handleGetSupplierRequest,
        [GET_SUPPLIER_SUCCESS]: handleGetSupplierSuccess,
        [GET_SUPPLIER_FAILURE]: handleGetSupplierFailure,
        [SEARCH_SUPPLIER_REQUEST]: handleSearchSupplierRequest,
        [SEARCH_SUPPLIER_SUCCESS]: handleSearchSupplierSuccess,
        [SEARCH_SUPPLIER_FAILURE]: handleSearchSupplierFailure,
        [ADD_SUPPLIER_REQUEST]: handleCommonRequest,
        [ADD_SUPPLIER_SUCCESS]: handleCommonSuccess,
        [ADD_SUPPLIER_FAILURE]: handleCommonFailure,
        [UPDATE_SUPPLIER_REQUEST]: handleCommonRequest,
        [UPDATE_SUPPLIER_SUCCESS]: handleCommonSuccess,
        [UPDATE_SUPPLIER_FAILURE]: handleCommonFailure,
        [DELETE_SUPPLIER_REQUEST]: handleCommonRequest,
        [DELETE_SUPPLIER_SUCCESS]: handleCommonSuccess,
        [DELETE_SUPPLIER_FAILURE]: handleCommonFailure,
        [GET_SUPPLIER_NAME_REQUEST]: handleCommonRequest,
        [GET_SUPPLIER_NAME_SUCCESS]: handleGetSupplierNameSuccess,
        [GET_SUPPLIER_NAME_FAILURE]: handleCommonFailure,
        [SEARCH_SUPPLIER_NAME_REQUEST]: handleCommonRequest,
        [SEARCH_SUPPLIER_NAME_SUCCESS]: handleSearchSupplierNameSuccess,
        [SEARCH_SUPPLIER_NAME_FAILURE]: handleCommonFailure,
        [GET_DISTRIBUTOR_BY_SUP_NAME_REQUEST]: handleGetDistributorSupplierNameRequest,
        [GET_DISTRIBUTOR_BY_SUP_NAME_SUCCESS]: handleGetDistributorSupplierNameSuccess,
        [GET_DISTRIBUTOR_BY_SUP_NAME_FAILURE]: handleGetDistributorSupplierNameFailure,
        [ADD_SUPPLIER_NAME_REQUEST]: handleCommonRequest,
        [ADD_SUPPLIER_NAME_SUCCESS]: handleAddNameSupplierSuccess,
        [ADD_SUPPLIER_NAME_FAILURE]: handleCommonFailure,
        [ADD_DISTRIBUTOR_BY_SUP_NAME_REQUEST]: handleGetDistributorSupplierNameRequest,
        [ADD_DISTRIBUTOR_BY_SUP_NAME_SUCCESS]: (state) => ({ ...state, isLoadingDistributor: false, textSearchDistributor: "", errMsg: "" }),
        [ADD_DISTRIBUTOR_BY_SUP_NAME_FAILURE]: handleGetDistributorSupplierNameFailure,
        [UPDATE_SUPPLIER_NAME_ALL_REQUEST]: handleCommonRequest,
        [UPDATE_SUPPLIER_NAME_ALL_SUCCESS]: handleCommonSuccess,
        [UPDATE_SUPPLIER_NAME_ALL_FAILURE]: handleCommonFailure,
        [DELETE_SUPPLIER_NAME_ALL_REQUEST]: handleCommonRequest,
        [DELETE_SUPPLIER_NAME_ALL_SUCCESS]: handleCommonSuccess,
        [DELETE_SUPPLIER_NAME_ALL_FAILURE]: handleCommonFailure,
        [CHOOSE_SUPPLIER]: handleChoose,
        [UNMOUNT_CATALOG]: handleUnmountCatalog,
        [CHOOSE_SUPPLIER_NAME]: handleChooseSupplierName
    },
    INITIAL_STATE
);

export default supplierReducer;