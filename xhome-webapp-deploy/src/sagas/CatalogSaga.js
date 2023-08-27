import * as types from "../constants/actionTypes"
import * as limits from "../constants/callAPI"
import { put, takeEvery, select } from "redux-saga/effects"
import * as API from "../api/CatalogAPI"
import callAPI from "../api/callAPI"
import {ERR_MSG} from "../constants/callAPI"
import {
    getCatalogByAgencyIdRequest, getCatalogByAgencyIdFailure, getCatalogByAgencyIdSuccess,
    addCatalogFailure, addCatalogSuccess, searchCatalogSuccess, searchCatalogFailure, searchCatalogIdSuccess,
    searchCatalogIdFailure, searchCatalogIdRequest
} from "../constants/actionCreators"
import { HTTP_READ, HTTP_CREATE, HTTP_UPDATE, HTTP_DELETE } from "../constants/callAPI"

function* getCatalogSaga(action) {
    try {
        const response = yield callAPI(HTTP_READ, `/catalog?quantity=${limits.LIMIT_CATALOG}&page=${action.payload}`)
        if (response.err) {
            yield put({
                type: types.GET_CATALOG_FAILURE,
                payload: {
                    errorMessage: response.err
                }
            })
            alert(ERR_MSG)
        } else {
            yield put({
                type: types.GET_CATALOG_SUCCESS,
                payload: {
                    activePage: action.payload,
                    totalPage: Math.ceil(response.count / limits.LIMIT_CATALOG),
                    listCatalog: response
                }
            })
        }
    } catch (error) {
        yield put({
            type: types.GET_CATALOG_FAILURE,
            payload: {
                errorMessage: error
            }
        })
        alert(ERR_MSG)
    }
}

function* getCatalogByAgencyIdSaga(action) {
    try {
        const agencyId = yield select((state) => state.supplier.chooseId)
        const path = `/catalog/by-agency-id?id=${agencyId}&quantity=${limits.LIMIT_CATALOG}&page=${action.payload}`
        const res = yield callAPI(HTTP_READ, path)
        if (res.err) {
            yield put(getCatalogByAgencyIdFailure(res.err))
            alert(ERR_MSG)
        } else {
            yield put(getCatalogByAgencyIdSuccess({
                activePage: action.payload,
                totalPage: Math.ceil(res.count / limits.LIMIT_CATALOG),
                listCatalog: res
            }))
        }
    } catch (error) {
        yield put(getCatalogByAgencyIdFailure(error.message))
        alert(ERR_MSG)
    }
}

// function* getAllSupllierSaga(){
//     try {
//         const response = yield API.getAllSupplierAPI()
//         yield put({
//             type: types.GET_ALL_SUPPLIER_SUCCESS,
//             payload: response
//         })
//     } catch (error) {
//         yield put({
//             type: types.GET_ALL_SUPPLIER_FAILURE,
//             payload: {
//                 errorMessage: error
//             }
//         })
//     }
// }

function* editCatalogSaga(action) {
    try {
        const agencyId = yield select((state) => state.supplier.chooseId)
        const textSearch = yield select((state) => state.catalog.textSearch)
        const supplierId = yield select((state) => state.catalog.supplierId)
        const { id, name, type, imageUrl, activePage } = action.payload
        let dataEdit = { id, name, type, imageUrl }
        const response = yield callAPI(HTTP_UPDATE, "/catalog", dataEdit);
        if (response.err) {
            yield put({
                type: types.EDIT_CATALOG_FAILURE,
                payload: {
                    errorMessage: response.err
                }
            })
            alert(ERR_MSG)
        } else {
            yield put({
                type: types.EDIT_CATALOG_SUCCESS
            })
            const uInfo = JSON.parse(localStorage.getItem("UI"))
            if (uInfo.isAdmin === 0 && uInfo.skipApproveCatalog === 0) {
                alert("Yêu cầu của bạn đã được gửi đến admin. Vui lòng chờ được duyệt !!!");
            }
            if (agencyId !== 0) {
                if (supplierId !== 0) {
                    yield put(searchCatalogIdRequest({ supplierId: supplierId, textSearch: textSearch, pageIndex: activePage }))
                } else {
                    yield put(getCatalogByAgencyIdRequest(activePage))
                }
            } else {
                if (textSearch === '') {
                    yield put({
                        type: types.GET_CATALOG_REQUEST,
                        payload: activePage
                    })
                } else {
                    yield put({
                        type: types.SEARCH_CATALOG_REQUEST,
                        payload: {
                            pageIndex: activePage,
                            textSearch: textSearch
                        }
                    })
                }
            }
        }
    } catch (error) {
        yield put({
            type: types.EDIT_CATALOG_FAILURE,
            payload: {
                errorMessage: error.message
            }
        })
        alert(ERR_MSG)
    }
}

function* deleteCatalogSaga(action) {
    try {
        const agencyId = yield select((state) => state.supplier.chooseId)
        const textSearch = yield select((state) => state.catalog.textSearch)
        const supplierId = yield select((state) => state.catalog.supplierId)
        const activePage = yield select((state) => state.catalog.activePage)
        const resDel = yield callAPI(HTTP_DELETE, `/catalog?id=${action.payload.id}`);
        let response;
        if (resDel.err) {
            yield put({
                type: types.DELETE_CATALOG_FAILURE,
                payload: {
                    errorMessage: resDel.err
                }
            })
            alert(ERR_MSG)
        } else {
            if (agencyId !== 0) {
                if (supplierId !== 0) {
                    response = yield callAPI(HTTP_READ, `/catalog/by-agency-id?id=${supplierId}&page=${activePage}&quantity=1&keyword=${textSearch}`);
                } else {
                    response = yield callAPI(HTTP_READ, `/catalog/by-agency-id?id=${agencyId}&quantity=${limits.LIMIT_CATALOG}&page=1`);
                }
            } else {
                if (textSearch === '') {
                    response = yield callAPI(HTTP_READ, `/catalog?quantity=${limits.LIMIT_CATALOG}&page=${action.payload.activePage}`)
                } else {
                    response = yield callAPI(HTTP_READ, `/catalog/search?keyword=${textSearch}&quantity=${limits.LIMIT_CATALOG}&page=${action.payload.activePage}`)
                }
            }
            const totalPage = Math.ceil(response.count / limits.LIMIT_CATALOG);
            yield put({
                type: types.DELETE_CATALOG_SUCCESS
            })
            const uInfo = JSON.parse(localStorage.getItem("UI"))
            if (uInfo.isAdmin === 0 && uInfo.skipApproveCatalog === 0) {
                alert("Yêu cầu của bạn đã được gửi đến admin. Vui lòng chờ được duyệt !!!");
            }
            let pageIndex = action.payload.activePage;
            if (totalPage < action.payload.activePage) {
                if(totalPage === 0){
                    pageIndex = 1;
                }else{
                    --pageIndex;
                }
                if (agencyId !== 0) {

                    if (supplierId !== 0) {
                        yield put(searchCatalogIdRequest({ supplierId: supplierId, textSearch: textSearch, pageIndex: pageIndex }))
                    } else {
                        yield put(getCatalogByAgencyIdRequest(pageIndex))
                    }
                } else {
                    if (textSearch === '') {
                        yield put({
                            type: types.GET_CATALOG_REQUEST,
                            payload: pageIndex
                        })
                    } else {
                        yield put({
                            type: types.SEARCH_CATALOG_REQUEST,
                            payload: {
                                pageIndex: pageIndex,
                                textSearch: textSearch
                            }
                        })
                    }
                }
            } else {
                if (agencyId !== 0) {
                    yield put(getCatalogByAgencyIdRequest(pageIndex))
                } else {
                    if (textSearch === '') {
                        yield put({
                            type: types.GET_CATALOG_REQUEST,
                            payload: pageIndex
                        })
                    } else {
                        yield put({
                            type: types.SEARCH_CATALOG_REQUEST,
                            payload: {
                                pageIndex: pageIndex,
                                textSearch: textSearch
                            }
                        })
                    }
                }
            }
        }
    } catch (error) {
        yield put({
            type: types.DELETE_CATALOG_FAILURE,
            payload: {
                errorMessage: error
            }
        })
        alert(ERR_MSG)
    }
}

function* addCatalogSaga(action) {
    try {
        // const agencyId = yield select((state) => state.supplier.chooseId)
        const dataToFetch = {
            id: action.payload.id,
            name: action.payload.name,
            imageUrl: action.payload.imageUrl
        }
        const res = yield callAPI(HTTP_CREATE, "/catalog", dataToFetch)
        if (res.err) {
            yield put(addCatalogFailure(res.err))
            alert(ERR_MSG)
        } else {
            // const listRecord = yield callAPI(HTTP_READ, `/catalog/by-agency-id?id=${agencyId}&quantity=${limits.LIMIT_CATALOG}&page=1`)
            yield put(addCatalogSuccess())
            const uInfo = JSON.parse(localStorage.getItem("UI"))
            if (uInfo.isAdmin === 0 && uInfo.skipApproveCatalog === 0) {
                alert("Yêu cầu của bạn đã được gửi đến admin. Vui lòng chờ được duyệt !!!");
            }
            // const { listCatalog, totalPage, activePage } = yield select((state) => state.catalog);
            // const pageIndex = Math.ceil(listRecord.count / limits.LIMIT_CATALOG)
            // const catalogLength = yield select((state) => state.catalog.listCatalog.rows.length)
            const catalogCount = res.count;
            yield put({
                type: types.GET_CATALOG_REQUEST,
                payload: Math.ceil(catalogCount / limits.LIMIT_CATALOG)
            })
            // if (agencyId !== 0) {
            //     yield put(getCatalogByAgencyIdRequest(pageIndex))
            // } else {
            //     yield put({
            //         type: types.GET_CATALOG_REQUEST,
            //         payload: Math.ceil(catalogCount / limits.LIMIT_CATALOG)
            //     })
            // }
        }
    } catch (error) {
        yield put(addCatalogFailure(error.message))
        alert(ERR_MSG)
    }
}

function* searchCatalogSaga(action) {
    try {
        const { pageIndex, textSearch } = action.payload;
        const res = yield callAPI(HTTP_READ, `/catalog/search?keyword=${textSearch}&quantity=${limits.LIMIT_CATALOG}&page=${pageIndex}`)
        if (res.err) {
            yield put(searchCatalogFailure(res.err))
            alert(ERR_MSG)
        } else {
            yield put(searchCatalogSuccess({
                listCatalog: res,
                totalPage: Math.ceil(res.count / limits.LIMIT_CATALOG),
                activePage: pageIndex,
                textSearch
            }))
        }
    } catch (error) {
        yield put(searchCatalogFailure(error.message))
        alert(ERR_MSG)
    }
}

function* searchCatalogByIdSaga(action) {
    try {
        // const { pageIndex, textSearch, supplierId } = action.payload;
        const res = yield callAPI(HTTP_READ, `/catalog/by-agency-id?id=${action.payload.supplierId}&page=${action.payload.pageIndex}&quantity=${limits.LIMIT_CATALOG}&keyword=${action.payload.textSearch}
        `)
        if (res.err) {
            yield put(searchCatalogIdFailure(res.err))
            alert(ERR_MSG)
        } else {
            yield put(searchCatalogIdSuccess({
                listCatalog: res,
                totalPage: Math.ceil(res.count / limits.LIMIT_CATALOG),
                activePage: action.payload.pageIndex,
                textSearch: action.payload.textSearch,
                supplierId: action.payload.supplierId
            }))
        }
    } catch (error) {
        yield put(searchCatalogIdFailure(error.message))
        alert(ERR_MSG)
    }
}
const CatalogSaga = [
    takeEvery(types.GET_CATALOG_REQUEST, getCatalogSaga),
    takeEvery(types.ADD_CATALOG_REQUEST, addCatalogSaga),
    takeEvery(types.GET_CATALOG_BY_AGENCY_ID_REQUEST, getCatalogByAgencyIdSaga),
    // takeEvery(types.GET_ALL_SUPPLIER_REQUEST, getAllSupllierSaga),
    takeEvery(types.EDIT_CATALOG_REQUEST, editCatalogSaga),
    takeEvery(types.DELETE_CATALOG_REQUEST, deleteCatalogSaga),
    takeEvery(types.SEARCH_CATALOG_REQUEST, searchCatalogSaga),
    takeEvery(types.SEARCH_CATALOG_BY_ID_REQUEST, searchCatalogByIdSaga)
]
export default CatalogSaga