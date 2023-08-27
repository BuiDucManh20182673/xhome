import * as types from "../constants/actionTypes"
const STATE_DEFAULT = {
    isLoading: false,
    errMsg: "",
    activePage: 1,
    totalPage: 10,
    textSearch: "",
    listProjectManager: [],
    isActive: 0
};

export default (state = STATE_DEFAULT, action) => {
    switch (action.type) {
        case types.SEARCH_PROJECT_MANAGER_REQUEST:
        case types.DELETE_PROJECT_MANAGER_REQUEST:
        case types.GET_PROJECT_MANAGER_REQUEST:
            return {
                ...state,
                isLoading: true
            }
        case types.GET_PROJECT_MANAGER_SUCCESS:
            return {
                ...state,
                isLoading: false,
                listProjectManager: action.payload.listProjectManager,
                activePage: action.payload.activePage,
                totalPage: action.payload.totalPage,
                errMsg: "",
                textSearch: "",
                isActive : action.payload.isActive
            }
        case types.SEARCH_PROJECT_MANAGER_SUCCESS:
            const { listProjectManager, activePage, totalPage, textSearch } = action.payload
            return {
                ...state,
                isLoading: false,
                listProjectManager, activePage, totalPage, textSearch,
                errMsg: "",
                isActive : action.payload.isActive
            }
        case types.DELETE_PROJECT_MANAGER_SUCCESS:
            return {
                ...state,
                isLoading: false,
                errMsg: ""
            }
        case types.SEARCH_PROJECT_MANAGER_FAILURE:
        case types.DELETE_PROJECT_MANAGER_FAILURE:
        case types.GET_PROJECT_MANAGER_FAILURE:
            return {
                ...state,
                isLoading: false,
                errMsg: action.payload
            }
        default:
            return state
    }
}