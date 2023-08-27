import * as types from "../constants/actionTypes"
import * as LIMIT from "../constants/callAPI"
const STATE_DEFAULT = {
    isLoading: false,
    errMess: '',
    listFraction: [],
    listMaterial: [],
    listAgency: [],
    listDistributor: [],
    listCatalog: [],
    statusPost: '',
    isSuccess: false
};

export default (state = STATE_DEFAULT, action) => {
    switch (action.type) {
        case types.GET_FORM_FRACTION_REQUEST:
        case types.GET_FORM_AGENCY_REQUEST:
        case types.GET_FORM_DISTRIBUTOR_REQUEST:
        case types.GET_FORM_CATALOG_REQUEST:
        case types.GET_FORM_MATERIAL_REQUEST:
        case types.GET_FORM_MATERIAL_SEARCH_REQUEST:
        case types.GET_FORM_DISTRIBUTOR_ALL_REQUEST:
        case types.GET_FORM_CATALOG_ALL_REQUEST:
        case types.GET_FORM_CATALOG_SEARCH_REQUEST:
            return {
                ...state,
                isLoading: false,
            }
        case types.POST_FORM_REQUEST:
        case types.POST_FORM_INPUT_REQUEST:
            return {
                ...state,
                isLoading: true,
                statusPost: '',
                isSuccess: false
            }
        case types.GET_FORM_AGENCY_SUCCESS:
            return {
                ...state,
                isLoading: false,
                listAgency: action.payload.listAgency,
            }
        case types.GET_AGENCY_FILTER_SUCCESS:
            return {
                ...state,
                isLoading: false,
                listAgency: action.payload.listAgencyFilter.rows,
            }
        case types.GET_FORM_CATALOG_SUCCESS:
        case types.GET_FORM_CATALOG_SEARCH_SUCCESS:
            return {
                ...state,
                isLoading: false,
                listCatalog: action.payload.listCatalog,
            }
        case types.GET_FORM_DISTRIBUTOR_SUCCESS:
            return {
                ...state,
                isLoading: false,
                listDistributor: action.payload.listDistributor,
            }
        case types.GET_FORM_DISTRIBUTOR_ALL_SUCCESS:
            return {
                ...state,
                isLoading: false,
                listDistributor: action.payload.listDistributor,
            }
        case types.GET_FORM_CATALOG_ALL_SUCCESS:
            return {
                ...state,
                isLoading: false,
                listCatalog: action.payload.listCatalog.rows,
            }
        case types.GET_FORM_FRACTION_SUCCESS:
            return {
                ...state,
                isLoading: false,
                listFraction: action.payload.listFraction,
            }
        case types.GET_FRACTION_FORCUS_SUCCESS:
            return {
                ...state,
                isLoading: false,
                listFraction: action.payload.listFactionFilter,
            }
        case types.GET_AGENCY_FORCUS_SUCCESS:
            return {
                ...state,
                isLoading: false,
                listAgency: action.payload.listAgencyFilter.rows,
            }
        case types.GET_FORM_MATERIAL_SUCCESS:
        case types.GET_FORM_MATERIAL_SEARCH_SUCCESS:
            return {
                ...state,
                isLoading: false,
                listMaterial: action.payload.listMaterial,
            }
        case types.POST_FORM_SUCCESS:
        case types.POST_FORM_INPUT_SUCCESS:
            return {
                ...state,
                isLoading: false,
                statusPost : action.payload.statusPost,
                isSuccess: true
            }
        case types.GET_FORM_FRACTION_FAILURE:
        case types.GET_FORM_AGENCY_FAILURE:
        case types.GET_FORM_CATALOG_FAILURE:
        case types.GET_FORM_CATALOG_SEARCH_FAILURE:
        case types.GET_FORM_DISTRIBUTOR_FAILURE:
        case types.GET_FORM_MATERIAL_FAILURE:
        case types.GET_FORM_MATERIAL_SEARCH_FAILURE:
        case types.GET_FORM_DISTRIBUTOR_ALL_FAILURE:
        case types.GET_FORM_CATALOG_ALL_FAILURE:
            return {
                ...state,
                isLoading: false,
                errMsg: action.payload.errorMessage
            }
        case types.POST_FORM_FAILURE:
        case types.POST_FORM_INPUT_FAILURE:
            return {
                ...state,
                isLoading: false,
                errMsg: action.payload.errorMessage,
                statusPost : action.payload.statusPost,
                isSuccess: false
            }
        case types.RESET_IS_SUCCESS:
            return {
                ...state,
                isSuccess : false,
                isLoading: false
            }
        default:
            return state
    }
}