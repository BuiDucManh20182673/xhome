import * as types from "../constants/actionTypes"
import * as callAPI from '../constants/callAPI'
const STATE_DEFAULT = {

    listSelection: {
        count: 0,
        rows: []
    },
    listMaterial: [],
    listMaterialFilter: [],
    listCatalogFilter: [],
    listAgencyFilter: [],
    listFactionFilter: [],
    listDistributor : [],
    materialName: null,
    catalogName: null,
    agencyName: null,
    fractionName: null,
    listProductByCatalog: [],
    activePageByCatalog: 1,
    totalPageByCatalog: 1,
    materialId: null,
    catalogId: null,
    agencyId: null,
    fractionId: null,
    isFetching: false,
    fetched: false,
    error: false,
    errorMessage: '',
    activePage: 1,
    totalPage: 1,
    keyWord: ''
}

export default (state = STATE_DEFAULT, action) => {
    switch (action.type) {
        case types.POST_PRODUCT_REQUEST:
        case types.PUT_PRODUCT_REQUEST:
        case types.DELETE_PRODUCT_REQUEST:
        case types.GET_MATERIAL_REQUEST:
        case types.GET_SELECTION_REQUEST:
        case types.GET_PRODUCT_REQUEST :
        case types.GET_PRODUCT_BY_ID_REQUEST:
            // case types.SEARCH_PRODUCT_REQUEST:
            return {
                ...state,
                isFetching: true
            }
        case types.GET_AGENCY_FILTER_REQUEST:
        case types.GET_CATALOG_FILTER_REQUEST:
        case types.GET_FRACTION_FILTER_REQUEST:
        case types.GET_MATERIAL_FILTER_REQUEST:
        case types.GET_AGENCY_FORCUS_REQUEST:
        case types.GET_CATALOG_FORCUS_REQUEST:
        case types.GET_FRACTION_FORCUS_REQUEST:
        case types.GET_MATERIAL_FORCUS_REQUEST:
        case types.GET_DISTRIBUTOR_REQUEST:
            return {
                ...state,
                isFetching: false
            }
        case types.POST_PRODUCT_SUCCESS:
        case types.PUT_PRODUCT_SUCCESS:
        case types.DELETE_PRODUCT_SUCCESS:
            return {
                ...state,
                isFetching: false,
                fetched: true
            }
        case types.GET_PRODUCT_BY_ID_SUCCESS:
            if (action.payload.totalPage < action.payload.activePage) {
                action.payload.activePage = action.payload.totalPage;
            }
            let textS = action.payload.textSearch ? action.payload.textSearch : ""
            return {
                ...state,
                listProductByCatalog: action.payload.listProductByCatalog,
                activePageByCatalog: action.payload.activePage,
                totalPageByCatalog: action.payload.totalPage,
                isFetching: false,
                keyWord: textS
            }
        case types.POST_PRODUCT_FAILURE:
        case types.PUT_PRODUCT_FAILURE:
        case types.DELETE_PRODUCT_FAILURE:
        case types.GET_MATERIAL_FAILURE:
        case types.GET_SELECTION_FAILURE:
        case types.GET_AGENCY_FILTER_FAILURE:
        case types.GET_CATALOG_FILTER_FAILURE:
        case types.GET_FRACTION_FILTER_FAILURE:
        case types.GET_MATERIAL_FILTER_FAILURE:
        case types.GET_PRODUCT_BY_ID_FAILURE:
        case types.GET_PRODUCT_BY_ID_FAILURE:
        case types.GET_DISTRIBUTOR_FAILURE:
            // case types.SEARCH_PRODUCT_FAILURE:
            return {
                ...state,
                isFetching: false,
                error: true,
                errorMessage: action.payload.errorMessage
            }

        case types.GET_SELECTION_SUCCESS:
            return {
                ...state,
                isFetching: false,
                fetched: true,
                listSelection: action.payload.listSelection,
                totalPage: Math.ceil(action.payload.listSelection.count / callAPI.LIMIT),
                activePage: action.payload.activePage,
                materialName: action.payload.materialName,
                catalogName: action.payload.catalogName,
                agencyName: action.payload.agencyName,
                fractionName: action.payload.fractionName,
                keyWord: action.payload.keyWord
            }
        case types.GET_MATERIAL_FILTER_SUCCESS:
            return {
                ...state,
                isFetching: false,
                fetched: true,
                listMaterialFilter: action.payload.listMaterialFilter.rows,
            }
        case types.GET_AGENCY_FILTER_SUCCESS:
            return {
                ...state,
                isFetching: false,
                fetched: true,
                listAgencyFilter: action.payload.listAgencyFilter.rows,
            }
        case types.GET_CATALOG_FILTER_SUCCESS:
            return {
                ...state,
                isFetching: false,
                fetched: true,
                listCatalogFilter: action.payload.listCatalogFilter.rows,
            }
        case types.GET_FRACTION_FILTER_SUCCESS:
            return {
                ...state,
                isFetching: false,
                fetched: true,
                listFactionFilter: action.payload.listFactionFilter.rows,
            }
        case types.GET_DISTRIBUTOR_SUCCESS:
            return {
                ...state,
                isFetching: false,
                fetched: true,
                listDistributor: action.payload.listDistributor,
            }
        case types.GET_MATERIAL_FORCUS_SUCCESS:
            return {
                ...state,
                isFetching: false,
                fetched: true,
                listMaterialFilter: action.payload.listMaterialFilter.rows,
            }
        case types.GET_AGENCY_FORCUS_SUCCESS:
        
            // action.payload.listAgencyFilter.map((item, idx) => {
            //     listAgency.push({ supplier: item.name })
            // })
            return {
                ...state,
                isFetching: false,
                fetched: true,
                listAgencyFilter:  action.payload.listAgencyFilter.rows,
            }
        case types.GET_CATALOG_FORCUS_SUCCESS:
            return {
                ...state,
                isFetching: false,
                fetched: true,
                listCatalogFilter: action.payload.listCatalogFilter.rows,
            }
        case types.GET_FRACTION_FORCUS_SUCCESS:
            return {
                ...state,
                isFetching: false,
                fetched: true,
                listFactionFilter: action.payload.listFactionFilter,
            }
        case types.GET_PRODUCT_SUCCESS:
            return {
                ...state,
                isFetching: false,
                fetched: true,
                listSelection: action.payload.listSelection,
                activePage: action.payload.activePage,
                totalPage: Math.ceil(action.payload.listSelection.count / callAPI.LIMIT),
                keyWord: action.payload.keyWord ? action.payload.keyWord : state.keyWord
            }


        case types.POST_PRODUCT_FAILURE:
        case types.PUT_PRODUCT_FAILURE:
        case types.DELETE_PRODUCT_FAILURE:
        case types.GET_MATERIAL_FAILURE:
        case types.GET_SELECTION_FAILURE:
        case types.GET_AGENCY_FILTER_FAILURE:
        case types.GET_CATALOG_FILTER_FAILURE:
        case types.GET_FRACTION_FILTER_FAILURE:
        case types.GET_MATERIAL_FILTER_FAILURE:
        case types.GET_AGENCY_FORCUS_FAILURE:
        case types.GET_CATALOG_FORCUS_FAILURE:
        case types.GET_FRACTION_FORCUS_FAILURE:
        case types.GET_MATERIAL_FORCUS_FAILURE:
            return {
                ...state,
                isFetching: false,
                error: true,
                errorMessage: action.payload.errorMessage
            }
        case types.CLEAR_NAME:
            return {
                ...state,
                materialName: null,
                catalogName: null,
                agencyName: null,
                fractionName: null,
                keyWord: ''
            }

        //get dữ liệu ở trang check box

        default:
            return state
    }
}