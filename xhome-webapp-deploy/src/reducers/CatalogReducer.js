import * as types from "../constants/actionTypes"
const STATE_DEFAULT = {
    isLoading: false,
    listCatalog: [],
    activePage: 0,
    totalPage: 0,
    listProduct: [],
    listSupplier: [],
    textSearch: "",
    errMsg: "",
    supplierId : 0
};

export default (state = STATE_DEFAULT, action) => {
    switch (action.type) {
        case types.GET_CATALOG_REQUEST:
        case types.GET_CATALOG_BY_AGENCY_ID_REQUEST:
        case types.SEARCH_CATALOG_BY_ID_REQUEST:
        case types.EDIT_CATALOG_REQUEST:
        case types.ADD_CATALOG_REQUEST:
        case types.DELETE_CATALOG_REQUEST:
        case types.SEARCH_CATALOG_REQUEST:
            return {
                ...state,
                isLoading: true
            }
        case types.EDIT_CATALOG_SUCCESS:
        case types.ADD_CATALOG_SUCCESS:
        case types.DELETE_CATALOG_SUCCESS:
            return {
                ...state,
                isLoading: false
            }
        case types.GET_CATALOG_SUCCESS:
        case types.GET_CATALOG_BY_AGENCY_ID_SUCCESS:
            if (action.payload.totalPage < action.payload.activePage) {
                action.payload.activePage = action.payload.totalPage;
            }
            return {
                ...state,
                isLoading: false,
                listCatalog: action.payload.listCatalog,
                activePage: action.payload.activePage,
                totalPage: action.payload.totalPage,
                textSearch: ""
            }
        case types.SEARCH_CATALOG_SUCCESS:
            if (action.payload.totalPage < action.payload.activePage) {
                action.payload.activePage = action.payload.totalPage;
            }
            return {
                ...state,
                isLoading: false,
                listCatalog: action.payload.listCatalog,
                activePage: action.payload.activePage,
                totalPage: action.payload.totalPage,
                textSearch: action.payload.textSearch
            }

        case types.SEARCH_CATALOG_BY_ID_SUCCESS:
            if (action.payload.totalPage < action.payload.activePage) {
                action.payload.activePage = action.payload.totalPage;
            }
            return {
                ...state,
                isLoading: false,
                listCatalog: action.payload.listCatalog,
                activePage: action.payload.activePage,
                totalPage: action.payload.totalPage,
                textSearch: action.payload.textSearch,
                supplierId : action.payload.supplierId
            }
        case types.GET_CATALOG_FAILURE:
        case types.GET_CATALOG_BY_AGENCY_ID_FAILURE:
        case types.GET_CATALOG_FAILURE:
        case types.ADD_CATALOG_FAILURE:
        case types.DELETE_CATALOG_FAILURE:
        case types.SEARCH_CATALOG_REQUEST:
        case types.SEARCH_CATALOG_BY_ID_FAILURE:
            return {
                ...state,
                isLoading: false,
                errMsg: action.payload.errorMessage
            }
        default:
            return state
    }
}