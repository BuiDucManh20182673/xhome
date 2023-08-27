import { put, takeEvery, select } from "redux-saga/effects";
import {
    GET_SUPPLIER_REQUEST, ADD_SUPPLIER_REQUEST, GET_SUPPLIER_NAME_REQUEST,
    UPDATE_SUPPLIER_REQUEST, DELETE_SUPPLIER_REQUEST, SEARCH_SUPPLIER_REQUEST,
    SEARCH_SUPPLIER_NAME_REQUEST, GET_DISTRIBUTOR_BY_SUP_NAME_REQUEST, ADD_SUPPLIER_NAME_REQUEST,
    ADD_DISTRIBUTOR_BY_SUP_NAME_REQUEST, UPDATE_SUPPLIER_NAME_ALL_REQUEST, DELETE_SUPPLIER_NAME_ALL_REQUEST,
    UPDATE_DISTRIBUTOR_BY_SUP_NAME_REQUEST, DELETE_DISTRIBUTOR_BY_SUP_NAME_REQUEST
} from "../constants/actionTypes";
import {
    getSupplierRequest, getSupplierSuccess, getSupplierFailure,
    searchSupplierRequest, searchSupplierSuccess, searchSupplierFailure,
    addSupplierFailure, addSupplierSuccess, updateSupplierSuccess,
    updateSupplierFailure, deleteSupplierSuccess, deleteSupplierFailure, getSupplierNameRequest,
    getSupplierNameSuccess, getSupplierNameFailure, searchSupplierNameSuccess, searchSupplierNameRequest,
    searchSupplierNameFailure, getDistributorBySupNameFailure, getDistributorBySupNameSuccess,
    addSupplierNameFailure, addSupplierNameSuccess, getDistributorBySupNameRequest,
    addDistributorBySupNameSuccess, addDistributorBySupNameFailure, updateSupplierNameAllSuccess,
    updateSupplierNameAllFailure, deleteSupplierNameAllSuccess, deleteSupplierNameAllFailure,
    updateDistributorBySupNameSuccess, updateDistributorBySupNameFailure, deleteDistributorBySupNameSuccess,
    deleteDistributorBySupNameFailure
} from "../constants/actionCreators"
import callAPI from "../api/callAPI"
import { HTTP_READ, HTTP_CREATE, LIMIT_SUPPLIER, HTTP_UPDATE, HTTP_DELETE, ERR_MSG, PENDING_MSG } from "../constants/callAPI"

function* getSupplierSaga(action) {
    try {
        let path = ""
        if (window.location.pathname.match("supplier")) {
            path = `/agency?page=${action.payload}&quantity=${LIMIT_SUPPLIER}`
        } else {
            path = `/agency/by-fraction-id?id=${action.payload.fractionId}&page=${action.payload.pageIndex}&quantity=${LIMIT_SUPPLIER}`
        }
        const res = yield callAPI(HTTP_READ, path)
        if (res.err) {
            yield put(getSupplierFailure(res.err))
            alert(ERR_MSG)
        } else {
            yield put(getSupplierSuccess({
                listData: res.rows,
                totalPage: Math.ceil(res.count / LIMIT_SUPPLIER),
                activePage: action.payload.pageIndex
            }))
        }
    } catch (error) {
        yield put(getSupplierFailure(error.message))
        alert(ERR_MSG)
    }
}

function* addSupplierSaga(action) {
    try {
        const dataToFetch = action.payload.data
        const res = yield callAPI(HTTP_CREATE, "/agency", dataToFetch)
        if (res.err) {
            yield put(addSupplierFailure(res.err))
            alert(ERR_MSG)
        } else {
            const listRecord = yield callAPI(HTTP_READ, `/agency/by-fraction-id?id=${dataToFetch.id}&page=1&quantity=1`)
            yield put(addSupplierSuccess())
            const uInfo = JSON.parse(localStorage.getItem("UI"))
            if (uInfo.isAdmin === 0 && uInfo.skipApproveAgency === 0) {
                alert(PENDING_MSG);
            }
            // const { listData, totalPage, activePage } = yield select((state) => state.supplier);
            yield put(getSupplierRequest({
                fractionId: dataToFetch.id,
                pageIndex: Math.ceil(listRecord.count / LIMIT_SUPPLIER)
            }))
        }
    } catch (error) {
        yield put(addSupplierFailure(error.message))
        alert(ERR_MSG)
    }
}

function* updateSupplierSaga(action) {
    try {
        const { name, tel, email } = action.payload.data.distributor
        const dataToFetch = {
            id: action.payload.data.id,
            supplier: action.payload.data.supplier,
            distributor: {
                name, tel, email
            }
        }
        const res = yield callAPI(HTTP_UPDATE, "/agency", dataToFetch)
        if (res.err) {
            yield put(updateSupplierFailure(res.err))
            alert(ERR_MSG)
        } else {
            yield put(updateSupplierSuccess())
            const uInfo = JSON.parse(localStorage.getItem("UI"))
            if (uInfo.isAdmin === 0 && uInfo.skipApproveAgency === 0) {
                alert(PENDING_MSG);
            }
            const { activePage, textSearch } = yield select((state) => state.supplier);
            if (textSearch !== "") {
                yield put(searchSupplierRequest({ pageIndex: activePage, textSearch, fractionId: action.payload.fractionId }))
            } else {
                yield put(getSupplierRequest({ pageIndex: activePage, fractionId: action.payload.fractionId }))
            }
        }
    } catch (error) {
        yield put(updateSupplierFailure(error.message))
        alert(ERR_MSG)
    }
}

function* deleteSupplierSaga(action) {
    try {
        const res = yield callAPI(HTTP_DELETE, `/agency?id=${action.payload.id}`)
        if (res.err) {
            yield put(deleteSupplierFailure(res.err))
            alert(ERR_MSG)
        } else {
            yield put(deleteSupplierSuccess())
            const uInfo = JSON.parse(localStorage.getItem("UI"))
            if (uInfo.isAdmin === 0 && uInfo.skipApproveAgency === 0) {
                alert(PENDING_MSG);
            }
            const { activePage, textSearch, listData, totalPage } = yield select((state) => state.supplier);
            const pageIndex = listData.length === 1 && activePage > 1 && totalPage === activePage ? activePage - 1 : activePage;
            if (textSearch !== "") {
                yield put(searchSupplierRequest({ pageIndex, textSearch, fractionId: action.payload.fractionId }))
            } else {
                yield put(getSupplierRequest({ pageIndex, fractionId: action.payload.fractionId }))
            }
        }
    } catch (error) {
        yield put(deleteSupplierFailure(error.message))
        alert(ERR_MSG)
    }
}

function* searchSupplierSaga(action) {
    try {
        const { pageIndex, textSearch, fractionId } = action.payload;

        const res = yield callAPI(HTTP_READ, window.location.pathname.match("supplier") ?
            `/agency/search?page=${pageIndex}&quantity=${LIMIT_SUPPLIER}&supplier=${textSearch}`
            : `/agency/search?page=${pageIndex}&quantity=${LIMIT_SUPPLIER}&supplier=${textSearch}&fractionId=${fractionId}`)
        if (res.err) {
            yield put(searchSupplierFailure(res.err))
            alert(ERR_MSG)
        } else {
            yield put(searchSupplierSuccess({
                listData: res.rows,
                totalPage: Math.ceil(res.count / LIMIT_SUPPLIER),
                activePage: pageIndex,
                textSearch
            }))
        }
    } catch (error) {
        yield put(searchSupplierFailure(error.message))
        alert(ERR_MSG)
    }
}

function* getSupplierNameSaga(action) {
    try {
        const pageIndex = action.payload;

        const res = yield callAPI(HTTP_READ, `/agency/name-all?page=${pageIndex}&quantity=${LIMIT_SUPPLIER}`)
        if (res.err) {
            yield put(getSupplierNameFailure(res.err))
            alert(ERR_MSG)
        } else {
            yield put(getSupplierNameSuccess({
                listData: res.rows,
                totalPage: Math.ceil(res.count / LIMIT_SUPPLIER),
                activePage: pageIndex,
                count: res.count
            }))
        }
    } catch (error) {
        yield put(getSupplierNameFailure(error.message))
        alert(ERR_MSG)
    }
}

function* searchSupplierNameSaga(action) {
    try {
        const { pageIndex, textSearch } = action.payload;

        const res = yield callAPI(HTTP_READ, `/agency/search-name?page=${pageIndex}&quantity=${LIMIT_SUPPLIER}&supplier=${textSearch}`)
        if (res.err) {
            yield put(searchSupplierNameFailure(res.err))
            alert(ERR_MSG)
        } else {
            yield put(searchSupplierNameSuccess({
                listData: res.rows,
                totalPage: Math.ceil(res.count / LIMIT_SUPPLIER),
                activePage: pageIndex,
                textSearch
            }))
        }
    } catch (error) {
        yield put(searchSupplierNameFailure(error.message))
        alert(ERR_MSG)
    }
}

function* getDistributorBySupNameSaga(action) {
    try {
        const pageIndex = action.payload;
        const choosedName = yield select((state) => state.supplier.choosedName)
        const res = yield callAPI(HTTP_READ, `/distributor/by-supplier?page=${pageIndex}&quantity=10&supplier=${choosedName}`)
        if (res.err) {
            yield put(getDistributorBySupNameFailure(res.err))
            alert(ERR_MSG)
        } else {
            yield put(getDistributorBySupNameSuccess({
                listData: res.rows,
                totalPage: Math.ceil(res.count / 10),
                activePage: pageIndex
            }))
        }
    } catch (error) {
        yield put(getDistributorBySupNameFailure(error.message))
        alert(ERR_MSG)
    }
}

function* addSupplierNameSaga(action) {
    try {
        const res = yield callAPI(HTTP_CREATE, "/agency/name", action.payload)
        const getPage1Result = yield callAPI(HTTP_READ, `/agency/name-all?page=1&quantity=${LIMIT_SUPPLIER}`)
        if (res.err) {
            yield put(addSupplierNameFailure(res.err))
            alert(ERR_MSG)
        } else {
            yield put(addSupplierNameSuccess())
            const uInfo = JSON.parse(localStorage.getItem("UI"))
            if (uInfo.isAdmin === 0 && uInfo.skipApproveAgency === 0) {
                alert(PENDING_MSG);
            }
            yield put(getSupplierNameRequest(Math.ceil(getPage1Result.count / LIMIT_SUPPLIER)))
        }
    } catch (error) {
        yield put(addSupplierNameFailure(error.message))
        alert(ERR_MSG)
    }
}

function* addDistributorBySupNameSaga(action) {
    try {
        const choosedName = yield select((state) => state.supplier.choosedName)
        const dataToFetch = {
            supplier: choosedName,
            name: action.payload.name,
            email: action.payload.email,
            tel: action.payload.tel
        }
        const res = yield callAPI(HTTP_CREATE, "/distributor", dataToFetch)
        if (res.err) {
            yield put(addDistributorBySupNameFailure(res.err))
            alert(ERR_MSG)
        } else {
            const totalRecords = yield callAPI(HTTP_READ, `/distributor/by-supplier?page=1&quantity=1&supplier=${choosedName}`)
            yield put(addDistributorBySupNameSuccess())
            yield put(getDistributorBySupNameRequest(Math.ceil(totalRecords.count / 10)))
        }
    } catch (error) {
        yield put(addDistributorBySupNameFailure(error.message))
        alert(ERR_MSG)
    }
}

function* updateDistributorBySupNameSaga(action) {
    try {
        const dataToFetch = action.payload
        const res = yield callAPI(HTTP_UPDATE, "/distributor", dataToFetch)
        if (res.err) {
            yield put(updateDistributorBySupNameFailure(res.err))
            alert(ERR_MSG)
        } else {
            yield put(updateDistributorBySupNameSuccess())
            const activePageDistributor = yield select((state) => state.supplier.activePageDistributor);
            yield put(getDistributorBySupNameRequest(activePageDistributor))
        }
    } catch (error) {
        yield put(updateDistributorBySupNameFailure(error.message))
        alert(ERR_MSG)
    }
}

function* deleteDistributorBySupNameSaga(action) {
    try {
        const res = yield callAPI(HTTP_DELETE, "/distributor/all?id=" + action.payload)
        if (res.err) {
            yield put(deleteDistributorBySupNameFailure(res.err))
            alert(ERR_MSG)
        } else {
            const { activePageDistributor, totalPageDistributor, listDataDistributor } = yield select((state) => state.supplier);
            const pageIndex = listDataDistributor.length === 1 && activePageDistributor === totalPageDistributor && activePageDistributor !== 1 ?
                activePageDistributor - 1 : activePageDistributor
            yield put(deleteDistributorBySupNameSuccess())
            yield put(getDistributorBySupNameRequest(pageIndex))

        }
    } catch (error) {
        yield put(deleteDistributorBySupNameFailure(error.message))
        alert(ERR_MSG)
    }
}

function* updateSupplierNameAllSaga(action) {
    try {
        const dataToFetch = action.payload
        const res = yield callAPI(HTTP_UPDATE, "/agency/name-all", dataToFetch)
        if (res.err) {
            yield put(updateSupplierNameAllFailure(res.err))
            alert(ERR_MSG)
        } else {
            yield put(updateSupplierNameAllSuccess())
            const uInfo = JSON.parse(localStorage.getItem("UI"))
            if (uInfo.isAdmin === 0 && uInfo.skipApproveAgency === 0) {
                alert(PENDING_MSG);
            }
            const { activePageName, textSearchName } = yield select((state) => state.supplier);
            if (textSearchName !== "") {
                yield put(searchSupplierNameRequest({ pageIndex: activePageName, textSearch: textSearchName }))
            } else {
                yield put(getSupplierNameRequest(activePageName))
            }
        }
    } catch (error) {
        yield put(updateSupplierNameAllFailure(error.message))
        alert(ERR_MSG)
    }
}

function* deleteSupplierNameAllSaga(action) {
    try {
        const res = yield callAPI(HTTP_DELETE, "/agency/name-all?supplier=" + action.payload.supplier)
        if (res.err) {
            yield put(deleteSupplierNameAllFailure(res.err))
            alert(ERR_MSG)
        } else {
            const { activePageName, textSearchName, totalPageName, listDataName } = yield select((state) => state.supplier);
            const pageIndex = listDataName.length === 1 && activePageName === totalPageName && activePageName !== 1 ? activePageName - 1 : activePageName
            yield put(deleteSupplierNameAllSuccess())
            const uInfo = JSON.parse(localStorage.getItem("UI"))
            if (uInfo.isAdmin === 0 && uInfo.skipApproveAgency === 0) {
                alert(PENDING_MSG);
            }
            if (textSearchName !== "") {
                yield put(searchSupplierNameRequest({ pageIndex, textSearch: textSearchName }))
            } else {
                yield put(getSupplierNameRequest(pageIndex))
            }
        }
    } catch (error) {
        yield put(deleteSupplierNameAllFailure(error.message))
        alert(ERR_MSG)
    }
}


export default [
    takeEvery(GET_SUPPLIER_REQUEST, getSupplierSaga),
    takeEvery(ADD_SUPPLIER_REQUEST, addSupplierSaga),
    takeEvery(UPDATE_SUPPLIER_REQUEST, updateSupplierSaga),
    takeEvery(UPDATE_SUPPLIER_NAME_ALL_REQUEST, updateSupplierNameAllSaga),
    takeEvery(SEARCH_SUPPLIER_REQUEST, searchSupplierSaga),
    takeEvery(GET_SUPPLIER_NAME_REQUEST, getSupplierNameSaga),
    takeEvery(SEARCH_SUPPLIER_NAME_REQUEST, searchSupplierNameSaga),
    takeEvery(DELETE_SUPPLIER_REQUEST, deleteSupplierSaga),
    takeEvery(GET_DISTRIBUTOR_BY_SUP_NAME_REQUEST, getDistributorBySupNameSaga),
    takeEvery(ADD_DISTRIBUTOR_BY_SUP_NAME_REQUEST, addDistributorBySupNameSaga),
    takeEvery(UPDATE_DISTRIBUTOR_BY_SUP_NAME_REQUEST, updateDistributorBySupNameSaga),
    takeEvery(DELETE_DISTRIBUTOR_BY_SUP_NAME_REQUEST, deleteDistributorBySupNameSaga),
    takeEvery(DELETE_SUPPLIER_NAME_ALL_REQUEST, deleteSupplierNameAllSaga),
    takeEvery(ADD_SUPPLIER_NAME_REQUEST, addSupplierNameSaga)
]