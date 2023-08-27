import { takeEvery, all } from "redux-saga/effects";
import { PROJECTS_FETCH } from "../constants/actionTypes";
import { handleFetchProjects } from "./project";
import {
  getDataProduct, getDataSelection, getAgencyFilter
  , getCatalogFilter, getFractionFilter, getMaterialFilter, getProductByCatalogSaga, postDataProduct, putDataProduct, deleteDataProduct
  , getMaterialForcusFilter, getAgencyForcusFilter,
  getCatalogForcusFilter, getFractionForcusFilter, getDistributor
} from './productSaga'
import ProjectCreationSaga from "./projectSaga"
import * as types from '../constants/actionTypes'
import MaterialSaga from "./MaterialSaga"
import FormAddSaga from "./FormAddSaga"
import SupplierSaga from "./SupplierSaga"
import CatalogSaga from "./CatalogSaga";
import FractionSaga from "./FractionSaga"
import {
  getAccountSaga, changePassSaga, postAccountSaga, putAccountSaga, chooseAccountAdminSaga,
  deleteAccountSaga, getSearchAccountSaga, updatePermission, userForgetPasswordSaga
} from './AccountSaga'
import { getProjectManagerSaga, searchProjectManagerSaga, changeStatusProjectSaga,restoreProjectSaga } from './projectManagerSaga'
import ListPendingSaga from "./ListPendingSaga";
function* watchAll() {
  yield all([
    takeEvery(PROJECTS_FETCH, handleFetchProjects),
    takeEvery(types.GET_PRODUCT_REQUEST, getDataProduct),
    takeEvery(types.GET_SELECTION_REQUEST, getDataSelection),
    takeEvery(types.GET_AGENCY_FILTER_REQUEST, getAgencyFilter),
    takeEvery(types.GET_CATALOG_FILTER_REQUEST, getCatalogFilter),
    takeEvery(types.GET_FRACTION_FILTER_REQUEST, getFractionFilter),
    takeEvery(types.GET_MATERIAL_FILTER_REQUEST, getMaterialFilter),
    takeEvery(types.GET_MATERIAL_FORCUS_REQUEST, getMaterialForcusFilter),
    takeEvery(types.GET_AGENCY_FORCUS_REQUEST, getAgencyForcusFilter),
    takeEvery(types.GET_CATALOG_FORCUS_REQUEST, getCatalogForcusFilter),
    takeEvery(types.GET_FRACTION_FORCUS_REQUEST, getFractionForcusFilter),
    takeEvery(types.GET_PRODUCT_BY_ID_REQUEST, getProductByCatalogSaga),
    takeEvery(types.POST_PRODUCT_REQUEST, postDataProduct),
    takeEvery(types.PUT_PRODUCT_REQUEST, putDataProduct),
    takeEvery(types.DELETE_PRODUCT_REQUEST, deleteDataProduct),
    takeEvery(types.GET_ACCOUNT_REQUEST, getAccountSaga),
    takeEvery(types.POST_ACCOUNT_REQUEST, postAccountSaga),
    takeEvery(types.PUT_ACCOUNT_REQUEST, putAccountSaga),
    takeEvery(types.DELETE_ACCOUNT_REQUEST, deleteAccountSaga),
    takeEvery(types.GET_SEARCH_ACCOUNT_REQUEST, getSearchAccountSaga),
    takeEvery(types.UPDATE_PERMISSION_REQUEST, updatePermission),
    takeEvery(types.GET_PROJECT_MANAGER_REQUEST, getProjectManagerSaga),
    takeEvery(types.SEARCH_PROJECT_MANAGER_REQUEST, searchProjectManagerSaga),
    takeEvery(types.DELETE_PROJECT_MANAGER_REQUEST, changeStatusProjectSaga),
    takeEvery(types.RESTORE_PROJECT_MANAGER_REQUEST, restoreProjectSaga),
    takeEvery("CHANGE_PASS_REQUEST", changePassSaga),
    takeEvery(types.GET_DISTRIBUTOR_REQUEST, getDistributor),
    takeEvery(types.FORGET_ACCOUNT_PASSWORD_REQUEST, userForgetPasswordSaga),
    takeEvery("C_A_A", chooseAccountAdminSaga),
    ...SupplierSaga,
    ...ProjectCreationSaga,
    ...MaterialSaga,
    ...FractionSaga,
    ...CatalogSaga,
    ...ListPendingSaga,
    ...FormAddSaga
  ]);
}
export default watchAll;