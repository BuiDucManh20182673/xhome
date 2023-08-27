import { createAction } from 'redux-actions';
import * as types from './actionTypes';

// export const doLoggedIn = createAction(types.USER_LOGGED_IN);
// export const doLoggedOut = createAction(types.USER_LOGGED_OUT);

export const doFetchProjects = createAction(types.PROJECTS_FETCH);
export const doAddProjects = createAction(types.PROJECTS_ADD);
// --------Product action---------
export const getProduct = createAction(types.GET_PRODUCT_REQUEST);
export const postProduct = createAction(types.POST_PRODUCT_REQUEST);
export const putProduct = createAction(types.PUT_PRODUCT_REQUEST);
export const deleteProduct = createAction(types.DELETE_PRODUCT_REQUEST);
export const deleteItemSelected = createAction(types.DROP_PRODUCT);
export const chooseProductlAction = createAction(types.CHOOSED_PRODUCT);
export const getProductByIdRequest = createAction(types.GET_PRODUCT_BY_ID_REQUEST)
export const saveNote = createAction(types.SAVE_NOTE)
export const saveSize = createAction(types.SAVE_SIZE)
export const saveDescription = createAction(types.SAVE_DESCRIPTION)
//---------------------------------
// --------Material action---------
export const getMaterial = createAction(types.GET_MATERIAL_REQUEST);
// --------Selection action--------
export const getListSelection = createAction(types.GET_SELECTION_REQUEST);
//--------- Filter ----------------
export const getMaterialFilter = createAction(types.GET_MATERIAL_FILTER_REQUEST);
export const getAgencyFilter = createAction(types.GET_AGENCY_FILTER_REQUEST);
export const getCatalogFilter = createAction(types.GET_CATALOG_FILTER_REQUEST);
export const getFractionFilter = createAction(types.GET_FRACTION_FILTER_REQUEST);
export const getMaterialForcus = createAction(types.GET_MATERIAL_FORCUS_REQUEST);
export const getAgencyForcus = createAction(types.GET_AGENCY_FORCUS_REQUEST);
export const getCatalogForcus = createAction(types.GET_CATALOG_FORCUS_REQUEST);
export const getFractionForcus = createAction(types.GET_FRACTION_FORCUS_REQUEST);
export const clearName = createAction(types.CLEAR_NAME);
//------------- form add ---------------
export const getMaterialForm = createAction(types.GET_FORM_MATERIAL_REQUEST);
export const getMaterialSearchForm = createAction(types.GET_FORM_MATERIAL_SEARCH_REQUEST);
export const getDistributor = createAction(types.GET_DISTRIBUTOR_REQUEST);
export const getDistributorForm = createAction(types.GET_FORM_DISTRIBUTOR_REQUEST);
export const getDistributorAllForm = createAction(types.GET_FORM_DISTRIBUTOR_ALL_REQUEST);
export const getCatalogAllForm = createAction(types.GET_FORM_CATALOG_ALL_REQUEST);
export const getCatalogSearchForm = createAction(types.GET_FORM_CATALOG_SEARCH_REQUEST);
export const getAgencyForm = createAction(types.GET_FORM_AGENCY_REQUEST);
export const getCatalogForm = createAction(types.GET_FORM_CATALOG_REQUEST);
export const getFractionForm = createAction(types.GET_FORM_FRACTION_REQUEST);
export const postProductForm = createAction(types.POST_FORM_REQUEST);
export const postProductFormInput = createAction(types.POST_FORM_INPUT_REQUEST);
export const putProductForm = createAction(types.PUT_FORM_REQUEST);
//---------------------------------
//supplier
export const getSupplierRequest = createAction(types.GET_SUPPLIER_REQUEST);
export const getSupplierSuccess = createAction(types.GET_SUPPLIER_SUCCESS);
export const getSupplierFailure = createAction(types.GET_SUPPLIER_FAILURE);

export const addSupplierNameRequest = createAction(types.ADD_SUPPLIER_NAME_REQUEST);
export const addSupplierNameSuccess = createAction(types.ADD_SUPPLIER_NAME_SUCCESS);
export const addSupplierNameFailure = createAction(types.ADD_SUPPLIER_NAME_FAILURE);

export const getSupplierNameRequest = createAction(types.GET_SUPPLIER_NAME_REQUEST);
export const getSupplierNameSuccess = createAction(types.GET_SUPPLIER_NAME_SUCCESS);
export const getSupplierNameFailure = createAction(types.GET_SUPPLIER_NAME_FAILURE);

export const addSupplierRequest = createAction(types.ADD_SUPPLIER_REQUEST);
export const addSupplierSuccess = createAction(types.ADD_SUPPLIER_SUCCESS);
export const addSupplierFailure = createAction(types.ADD_SUPPLIER_FAILURE);

export const updateSupplierNameAllRequest = createAction(types.UPDATE_SUPPLIER_NAME_ALL_REQUEST);
export const updateSupplierNameAllSuccess = createAction(types.UPDATE_SUPPLIER_NAME_ALL_SUCCESS);
export const updateSupplierNameAllFailure = createAction(types.UPDATE_SUPPLIER_NAME_ALL_FAILURE);

export const deleteSupplierNameAllRequest = createAction(types.DELETE_SUPPLIER_NAME_ALL_REQUEST);
export const deleteSupplierNameAllSuccess = createAction(types.DELETE_SUPPLIER_NAME_ALL_SUCCESS);
export const deleteSupplierNameAllFailure = createAction(types.DELETE_SUPPLIER_NAME_ALL_FAILURE);

export const updateSupplierRequest = createAction(types.UPDATE_SUPPLIER_REQUEST);
export const updateSupplierSuccess = createAction(types.UPDATE_SUPPLIER_SUCCESS);
export const updateSupplierFailure = createAction(types.UPDATE_SUPPLIER_FAILURE);

export const deleteSupplierRequest = createAction(types.DELETE_SUPPLIER_REQUEST);
export const deleteSupplierSuccess = createAction(types.DELETE_SUPPLIER_SUCCESS);
export const deleteSupplierFailure = createAction(types.DELETE_SUPPLIER_FAILURE);

export const searchSupplierRequest = createAction(types.SEARCH_SUPPLIER_REQUEST);
export const searchSupplierSuccess = createAction(types.SEARCH_SUPPLIER_SUCCESS);
export const searchSupplierFailure = createAction(types.SEARCH_SUPPLIER_FAILURE);

export const searchSupplierNameRequest = createAction(types.SEARCH_SUPPLIER_NAME_REQUEST);
export const searchSupplierNameSuccess = createAction(types.SEARCH_SUPPLIER_NAME_SUCCESS);
export const searchSupplierNameFailure = createAction(types.SEARCH_SUPPLIER_NAME_FAILURE);

export const getDetailSupplierRequest = createAction(types.GET_DETAIL_SUPPLIER_REQUEST);
export const getDetailSupplierSuccess = createAction(types.GET_DETAIL_SUPPLIER_SUCCESS);
export const getDetailSupplierFailure = createAction(types.GET_DETAIL_SUPPLIER_FAILURE);

export const unmountSupplier = createAction(types.UNMOUNT_SUPPLIER);
export const chooseSupplier = createAction(types.CHOOSE_SUPPLIER);
export const chooseSupplierName = createAction(types.CHOOSE_SUPPLIER_NAME);

export const getDistributorBySupNameRequest = createAction(types.GET_DISTRIBUTOR_BY_SUP_NAME_REQUEST);
export const getDistributorBySupNameSuccess = createAction(types.GET_DISTRIBUTOR_BY_SUP_NAME_SUCCESS);
export const getDistributorBySupNameFailure = createAction(types.GET_DISTRIBUTOR_BY_SUP_NAME_FAILURE);

export const addDistributorBySupNameRequest = createAction(types.ADD_DISTRIBUTOR_BY_SUP_NAME_REQUEST);
export const addDistributorBySupNameSuccess = createAction(types.ADD_DISTRIBUTOR_BY_SUP_NAME_SUCCESS);
export const addDistributorBySupNameFailure = createAction(types.ADD_DISTRIBUTOR_BY_SUP_NAME_FAILURE);

export const updateDistributorBySupNameRequest = createAction(types.UPDATE_DISTRIBUTOR_BY_SUP_NAME_REQUEST);
export const updateDistributorBySupNameSuccess = createAction(types.UPDATE_DISTRIBUTOR_BY_SUP_NAME_SUCCESS);
export const updateDistributorBySupNameFailure = createAction(types.UPDATE_DISTRIBUTOR_BY_SUP_NAME_FAILURE);

export const deleteDistributorBySupNameRequest = createAction(types.DELETE_DISTRIBUTOR_BY_SUP_NAME_REQUEST);
export const deleteDistributorBySupNameSuccess = createAction(types.DELETE_DISTRIBUTOR_BY_SUP_NAME_SUCCESS);
export const deleteDistributorBySupNameFailure = createAction(types.DELETE_DISTRIBUTOR_BY_SUP_NAME_FAILURE);

//Add infomations for project
export const addAreaAction = createAction(types.ADD_AREA);
export const deleteAreaAction = createAction(types.DELETE_AREA);
export const addCodeContractAction = createAction(types.ADD_CODE_CONTRACT);
export const addCustomerAction = createAction(types.ADD_CUSTOMER);

//Save project
export const saveProjectRequest = createAction(types.SAVE_PROJECT_REQUEST)
export const saveProjectSuccess = createAction(types.SAVE_PROJECT_SUCCESS)
export const saveProjectFailure = createAction(types.SAVE_PROJECT_FAILURE)

export const updateProjectRequest = createAction(types.UPDATE_PROJECT_REQUEST)
export const updateProjectSuccess = createAction(types.UPDATE_PROJECT_SUCCESS)
export const updateProjectFailure = createAction(types.UPDATE_PROJECT_FAILURE)
//Drop project
export const dropProjectRequest = createAction(types.DROP_PROJECT_REQUEST)
export const dropProjectSuccess = createAction(types.DROP_PROJECT_SUCCESS)
export const dropProjectFailure = createAction(types.DROP_PROJECT_FAILURE)
//copy product to area
export const copyProductToArea = createAction(types.COPY_PRODUCT_TO_AREA)
export const cancelCopyProductToArea = createAction(types.CANCEL_COPY_PRODUCT_TO_AREA)

//Drop item
export const dropMaterialAction = createAction(types.DROP_PRODUCT)

//Active page
export const activePageAction = createAction(types.ACTIVE_PAGE)

//Open full list
export const openListAction = createAction(types.OPEN_LIST)

//Close full list
export const closeListAction = createAction(types.CLOSE_LIST)

//Close product board
export const closeProductBoardAction = createAction(types.CLOSE_PRODUCT_BOARD)

//Open product board
export const openProductBoardAction = createAction(types.OPEN_PRODUCT_BOARD)

//Text Note 
export const textNoteAction = createAction(types.TEXT_NOTE)
//Material
export const getMaterialRequest = createAction(types.GET_MATERIAL_REQUEST);
export const getMaterialSuccess = createAction(types.GET_MATERIAL_SUCCESS);
export const getMaterialFailure = createAction(types.GET_MATERIAL_FAILURE);

export const addMaterialRequest = createAction(types.ADD_MATERIAL_REQUEST);
export const addMaterialSuccess = createAction(types.ADD_MATERIAL_SUCCESS);
export const addMaterialFailure = createAction(types.ADD_MATERIAL_FAILURE);

export const updateMaterialRequest = createAction(types.UPDATE_MATERIAL_REQUEST);
export const updateMaterialSuccess = createAction(types.UPDATE_MATERIAL_SUCCESS);
export const updateMaterialFailure = createAction(types.UPDATE_MATERIAL_FAILURE);

export const deleteMaterialRequest = createAction(types.DELETE_MATERIAL_REQUEST);
export const deleteMaterialSuccess = createAction(types.DELETE_MATERIAL_SUCCESS);
export const deleteMaterialFailure = createAction(types.DELETE_MATERIAL_FAILURE);

export const searchMaterialRequest = createAction(types.SEARCH_MATERIAL_REQUEST);
export const searchMaterialSuccess = createAction(types.SEARCH_MATERIAL_SUCCESS);
export const searchMaterialFailure = createAction(types.SEARCH_MATERIAL_FAILURE);

export const chooseMaterial = createAction(types.CHOOSE_MATERIAL);

//Catalog
export const getListCatalogRequest = createAction(types.GET_CATALOG_REQUEST)
export const getListSupplierRequest = createAction(types.GET_ALL_SUPPLIER_REQUEST)
export const editCatalogRequest = createAction(types.EDIT_CATALOG_REQUEST)
export const deleteCatalogRequest = createAction(types.DELETE_CATALOG_REQUEST)

export const getCatalogByAgencyIdRequest = createAction(types.GET_CATALOG_BY_AGENCY_ID_REQUEST)
export const getCatalogByAgencyIdSuccess = createAction(types.GET_CATALOG_BY_AGENCY_ID_SUCCESS)
export const getCatalogByAgencyIdFailure = createAction(types.GET_CATALOG_BY_AGENCY_ID_FAILURE)

export const addCatalogRequest = createAction(types.ADD_CATALOG_REQUEST)
export const addCatalogSuccess = createAction(types.ADD_CATALOG_SUCCESS)
export const addCatalogFailure = createAction(types.ADD_CATALOG_FAILURE)

export const searchCatalogRequest = createAction(types.SEARCH_CATALOG_REQUEST)
export const searchCatalogSuccess = createAction(types.SEARCH_CATALOG_SUCCESS)
export const searchCatalogFailure = createAction(types.SEARCH_CATALOG_FAILURE)

export const searchCatalogIdRequest = createAction(types.SEARCH_CATALOG_BY_ID_REQUEST)
export const searchCatalogIdSuccess = createAction(types.SEARCH_CATALOG_BY_ID_SUCCESS)
export const searchCatalogIdFailure = createAction(types.SEARCH_CATALOG_BY_ID_FAILURE)


export const unmountCatalog = createAction(types.UNMOUNT_CATALOG);

//Fraction
export const getFractionRequest = createAction(types.GET_FRACTION_REQUEST);
export const getFractionSuccess = createAction(types.GET_FRACTION_SUCCESS);
export const getFractionFailure = createAction(types.GET_FRACTION_FAILURE);

export const addFractionRequest = createAction(types.ADD_FRACTION_REQUEST);
export const addFractionSuccess = createAction(types.ADD_FRACTION_SUCCESS);
export const addFractionFailure = createAction(types.ADD_FRACTION_FAILURE);

export const updateFractionRequest = createAction(types.UPDATE_FRACTION_REQUEST);
export const updateFractionSuccess = createAction(types.UPDATE_FRACTION_SUCCESS);
export const updateFractionFailure = createAction(types.UPDATE_FRACTION_FAILURE);

export const deleteFractionRequest = createAction(types.DELETE_FRACTION_REQUEST);
export const deleteFractionSuccess = createAction(types.DELETE_FRACTION_SUCCESS);
export const deleteFractionFailure = createAction(types.DELETE_FRACTION_FAILURE);

//------------------------------ ACCOUNT ---------------------------------------
export const getAccount = createAction(types.GET_ACCOUNT_REQUEST)
export const postAccount = createAction(types.POST_ACCOUNT_REQUEST)
export const putAccount = createAction(types.PUT_ACCOUNT_REQUEST)
export const deleteAccount = createAction(types.DELETE_ACCOUNT_REQUEST)
export const getSearchAccount = createAction(types.GET_SEARCH_ACCOUNT_REQUEST)

export const updatePermissionRequest = createAction(types.UPDATE_PERMISSION_REQUEST)
export const updatePermissionSuccess = createAction(types.UPDATE_PERMISSION_SUCCESS)
export const updatePermissionFailure = createAction(types.UPDATE_PERMISSION_FAILURE)

//------------------------------------------------------------------------------

//------------------------------ PROJECT_MANAGER ---------------------------------------
export const getProjectManager = createAction(types.GET_PROJECT_MANAGER_REQUEST)

export const searchProjectManagerRequest = createAction(types.SEARCH_PROJECT_MANAGER_REQUEST)
export const searchProjectManagerSuccess = createAction(types.SEARCH_PROJECT_MANAGER_SUCCESS)
export const searchProjectManagerFailure = createAction(types.SEARCH_PROJECT_MANAGER_FAILURE)

export const deleteProjectManagerRequest = createAction(types.DELETE_PROJECT_MANAGER_REQUEST)
export const deleteProjectManagerSuccess = createAction(types.DELETE_PROJECT_MANAGER_SUCCESS)
export const deleteProjectManagerFailure = createAction(types.DELETE_PROJECT_MANAGER_FAILURE)

export const restoreProjectManagerRequest = createAction(types.RESTORE_PROJECT_MANAGER_REQUEST)
export const restoreProjectManagerSuccess = createAction(types.RESTORE_PROJECT_MANAGER_SUCCESS)
export const restoreProjectManagerFailure = createAction(types.RESTORE_PROJECT_MANAGER_FAILURE)

export const chooseProjectToUpdate = createAction(types.CHOOSE_PROJECT_TO_UPDATE)

export const copyProjectRequest = createAction(types.COPY_PROJECT_REQUEST)
export const copyProjectSuccess = createAction(types.COPY_PROJECT_SUCCESS)
export const copyProjectFailure = createAction(types.COPY_PROJECT_FAILURE)


//------------------------------------------------------------------------------

//------------------------------ LIST_PENDING -------------------------------
export const getListPending = createAction(types.GET_LIST_PENDING_REQUEST)
export const postProductPendingRequest = createAction(types.POST_PRODUCT_PENDING_REQUEST)
export const postProductPendingSuccess = createAction(types.POST_PRODUCT_PENDING_SUCCESS)
export const postProductPendingFailure = createAction(types.POST_PRODUCT_PENDING_FAILURE)
 
export const putStatusPendingRequest = createAction(types.PUT_STATUS_PENDING_REQUEST)
//---------------------------------------------------------------------------
//---------------------------------------------------------------------------

//------------------------------ Forget password ----------------------------
export const forgetUserPassword = createAction(types.FORGET_ACCOUNT_PASSWORD_REQUEST)
// --------------------------------------------------------------------------
