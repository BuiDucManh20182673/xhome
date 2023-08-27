import * as types from "../constants/actionTypes"
import * as LIMIT from "../constants/callAPI"
const STATE_DEFAULT = {
    isLoading: false,
    errMess: '',
    activePage: 0,
    totalPage: 0,
    listAccount: [],
    chooseAccountId: 0,
    listPermissionMaterial: [false, false, false, false],
    listPermissionAgency: [false, false, false, false],
    listPermissionFraction: [false, false, false, false],
    listPermissionCatalog: [false, false, false, false],
    listPermissionProduct: [false, false, false, false],
    listPermissionProject: [false, false, false, false],
    textSearch: '',
    isAdmin: false
};

export default (state = STATE_DEFAULT, action) => {
    switch (action.type) {
        case types.GET_ACCOUNT_REQUEST:
            return {
                ...state,
                isLoading: true
            }
        case types.GET_ACCOUNT_SUCCESS:
            let totalPage = Math.ceil(action.payload.listAccount.count / LIMIT.LIMIT_ACCOUNT)
            return {
                ...state,
                isLoading: false,
                listAccount: action.payload.listAccount,
                totalPage: totalPage,
                activePage: action.payload.activePage,
                textSearch: ""
            }
        case types.GET_ACCOUNT_FAILURE:
            return {
                ...state,
                isLoading: false,
                errMsg: action.payload.errorMessage
            }
        case types.GET_SEARCH_ACCOUNT_REQUEST:
            return {
                ...state,
                isLoading: true
            }
        case types.GET_SEARCH_ACCOUNT_SUCCESS:
            let totalPageSearch = Math.ceil(action.payload.listAccount.count / LIMIT.LIMIT_ACCOUNT)
            return {
                ...state,
                isLoading: false,
                listAccount: action.payload.listAccount,
                totalPage: totalPageSearch,
                activePage: action.payload.activePage,
                textSearch: action.payload.textSearch
            }
        case types.GET_SEARCH_ACCOUNT_FAILURE:
            return {
                ...state,
                isLoading: false,
                errMsg: action.payload.errorMessage
            }
        case types.POST_ACCOUNT_REQUEST:
            return {
                ...state,
                isLoading: true
            }
        case types.POST_ACCOUNT_SUCCESS:
            return {
                ...state,
                isLoading: false,
                activePage: action.payload.activePage
            }
        case types.POST_ACCOUNT_FAILURE:
            return {
                ...state,
                isLoading: false,
                errMsg: action.payload.errorMessage
            }
        case types.PUT_ACCOUNT_REQUEST:
            return {
                ...state,
                isLoading: true
            }
        case types.PUT_ACCOUNT_SUCCESS:
            return {
                ...state,
                isLoading: false,
                // activePage : action.payload.activePage
            }
        case types.PUT_ACCOUNT_FAILURE:
            return {
                ...state,
                isLoading: false,
                errMsg: action.payload.errorMessage
            }
        case types.DELETE_ACCOUNT_REQUEST:
            return {
                ...state,
                isLoading: true
            }
        case types.DELETE_ACCOUNT_SUCCESS:
            return {
                ...state,
                isLoading: false,
                // activePage : action.payload.activePage
            }
        case types.DELETE_ACCOUNT_FAILURE:
            return {
                ...state,
                isLoading: false,
                errMsg: action.payload.errorMessage
            }
        case "CHECK_PERMISSION":
            const { title, key } = action.payload
            let listPermissionNewCheck = [state[title][0], state[title][1], state[title][2], state[title][3]]
            switch (key) {
                case 0:
                    if (listPermissionNewCheck[0]) {
                        listPermissionNewCheck[0] = false
                        listPermissionNewCheck[2] = false
                        listPermissionNewCheck[3] = false
                    } else {
                        listPermissionNewCheck[key] = !listPermissionNewCheck[key]
                    }
                    break;
                case 1:
                    listPermissionNewCheck[key] = !listPermissionNewCheck[key]
                    break;
                case 2:
                case 3:
                    if (!listPermissionNewCheck[key]) {
                        listPermissionNewCheck[0] = true
                        listPermissionNewCheck[key] = true
                    } else {
                        listPermissionNewCheck[key] = false
                    }
                    break;
                default:
                    listPermissionNewCheck = listPermissionNewCheck.indexOf(false) !== -1 ? [true, true, true, true]
                        : [false, false, false, false]
                    break;
            }
            return {
                ...state,
                [title]: listPermissionNewCheck
            }
        case "CHOOSE_ACCOUNT_PERMISSION":
            const permission = action.payload.permission
            const listPermissionMaterial = [permission.viewMaterial, permission.addMaterial, permission.editMaterial, permission.deleteMaterial],
                listPermissionAgency = [permission.viewAgency, permission.addAgency, permission.editAgency, permission.deleteAgency],
                listPermissionFraction = [permission.viewFraction, permission.addFraction, permission.editFraction, permission.deleteFraction],
                listPermissionCatalog = [permission.viewCatalog, permission.addCatalog, permission.editCatalog, permission.deleteCatalog],
                listPermissionProduct = [permission.viewProduct, permission.addProduct, permission.editProduct, permission.deleteProduct],
                listPermissionProject = [permission.viewProject, permission.addProject, permission.editProject, permission.deleteProject]
            return {
                ...state,
                chooseAccountId: permission.account_id,
                listPermissionMaterial,
                listPermissionAgency,
                listPermissionFraction,
                listPermissionCatalog,
                listPermissionProduct,
                listPermissionProject,
                isAdmin: action.payload.isAdmin
            }
        case types.FORGET_ACCOUNT_PASSWORD_REQUEST:
            return{
                ...state,
                isLoading: true
            }
        
        case types.FORGET_ACCOUNT_PASSWORD_SUCCESS:
            return{
                ...state,
                isLoading: true
            }
        
        case types.FORGET_ACCOUNT_PASSWORD_FAILURE:
            return{
                ...state,
                isLoading: true
            }
        
        default:
            return state
    }
}