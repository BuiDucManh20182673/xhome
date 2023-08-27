import * as types from "../constants/actionTypes"
import * as LIMIT from "../constants/callAPI"
const STATE_DEFAULT = {
    isLoading: false,
    err: "",
    activePage: 0,
    totalPage: 0,
    listData: [],
    isSuccess : false
};

export default (state = STATE_DEFAULT, action) => {
    switch (action.type) {
        case "HANDLE_RQ_REQUEST":
        case types.GET_LIST_PENDING_REQUEST:
            return {
            ...state,
            isLoading: true,
            err: action.payload
        }
        case types.PUT_STATUS_PENDING_REQUEST:
        case types.POST_PRODUCT_PENDING_REQUEST:
            return {
                ...state,
                isLoading: true,
                isSuccess : false
            }
        case types.GET_LIST_PENDING_SUCCESS:
            const { listData, activePage, totalPage } = action.payload
            return {
                ...state,
                isLoading: false,
                listData, activePage, totalPage,
                err: ""
            }
        case types.PUT_STATUS_PENDING_SUCCESS:
        case types.POST_PRODUCT_PENDING_SUCCESS:
            return {
                ...state,
                isLoading: false,
                isSuccess : true
            }
        case "HANDLE_RQ_FAILURE":
        case types.GET_LIST_PENDING_FAILURE: 
        return {
            ...state,
            isLoading: false,
            err: action.payload
        }
        case types.PUT_STATUS_PENDING_FAILURE:
        case types.POST_PRODUCT_PENDING_FAILURE:
            return {
                ...state,
                isLoading: false,
                isSuccess : false,
                err: action.payload
            }
        case "HANDLE_RQ_SUCCESS":
            return {
                ...state,
                isLoading: false,
                err: ""
            }
        
        case types.RESET_IS_SUCCESS:
            return {
                ...state,
                isLoading : false,
                isSuccess : false
            }

        default:
            return state
    }
}