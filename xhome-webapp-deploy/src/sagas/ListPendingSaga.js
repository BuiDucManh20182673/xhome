import { put, takeEvery, select } from "redux-saga/effects";
import * as types from '../constants/actionTypes'
import callAPI from "../api/callAPI"
import { HTTP_CREATE, HTTP_DELETE, HTTP_READ, HTTP_UPDATE } from '../constants/callAPI'
import * as LIMIT from "../constants/callAPI"
import { ERR_MSG } from "../constants/callAPI"

function* getListPendingSaga(action) {
    try {
        // call API
        const res = yield callAPI(HTTP_READ, `/request?quantity=7&page=${action.payload}`)
        if (res.err) {
            yield put({
                type: types.GET_LIST_PENDING_FAILURE,
                payload: res.err
            })
            alert(res.err.details[0].message)
        } else {
            yield put({
                type: types.GET_LIST_PENDING_SUCCESS,
                payload: {
                    listData: res.rows,
                    activePage: action.payload,
                    totalPage: Math.ceil(res.count / 7)
                }
            })
        }

    } catch (error) {
        yield put({
            type: types.GET_LIST_PENDING_FAILURE,
            payload: error.errorMessage
        })
        alert(error.errorMessage.details[0].message)
    }
}

function* putStatusPendingSaga(action) {
    try {
        // call API
        const res = yield callAPI(HTTP_UPDATE, `/request/no-action`, action.payload)
        if (res.err) {
            yield put({
                type: types.PUT_STATUS_PENDING_FAILURE,
                payload: res.err
            })
            alert(res.err.details[0].message)
        } else {
            yield put({
                type: types.PUT_STATUS_PENDING_SUCCESS
            })
            yield put({
                type: types.RESET_IS_SUCCESS
            })
            const { activePage } = yield select((state) => state.listPendingReducer)
            yield put({
                type: types.GET_LIST_PENDING_REQUEST,
                payload: activePage
            })
        }
    } catch (error) {
        yield put({
            type: types.PUT_STATUS_PENDING_FAILURE,
            payload: error.errorMessage
        })
        alert(error.errorMessage.details[0].message)
    }
}

function* postProductPendingSaga(action) {
    try {
        const data = {
            id: action.payload.id,
            accept: true,
            material: action.payload.material,
            fraction: action.payload.fraction,
            agency: action.payload.agency,
            distributorName: action.payload.distributorName,
            distributorEmail: action.payload.distributorEmail,
            distributorTel: action.payload.distributorTel,
            catalogName: action.payload.catalogName,
            catalogImage: action.payload.catalogImage,
            product: action.payload.product,
            group: action.payload.group,
            miniProductName: action.payload.miniProductName,
            miniProductImage: action.payload.miniProductImage
        }
        const res = yield callAPI(HTTP_UPDATE, `/request/full-product`, data)
        if (res.err) {
            yield put({
                type: types.POST_PRODUCT_PENDING_FAILURE,
                payload: {
                    errorMessage: res.err
                }
            })
            alert(res.err.details[0].message)
        } else {
            yield put({
                type: types.POST_PRODUCT_PENDING_SUCCESS,
                payload: {
                    activePage: action.payload.activePage
                }
            })
            yield put({
                type: types.RESET_IS_SUCCESS
            })
            alert("Thêm thành công")
            const { activePage } = yield select((state) => state.listPendingReducer)
            yield put({
                type: types.GET_LIST_PENDING_REQUEST,
                payload: activePage
            })
        }
    } catch (error) {
        yield put({
            type: types.POST_PRODUCT_PENDING_FAILURE,
            payload: {
                errorMessage: error.errorMessage
            }
        })
        alert(error.errorMessage.details[0].message)
    }
}

function* handleRQSaga(action) {
    const { activePage, totalPage, listData } = yield select((state) => state.listPendingReducer)
    try {
        // call API
        const res = yield callAPI(HTTP_UPDATE, `/request`, action.payload)
        if (res.err) {
            yield put({
                type: "HANDLE_RQ_FAILURE",
                payload: res.err
            })
            alert(ERR_MSG)
        } else {
            yield put({
                type: "HANDLE_RQ_SUCCESS"
            })
            yield put({
                type: types.GET_LIST_PENDING_REQUEST,
                payload: activePage === totalPage && listData.length === 1 && totalPage > 1 ? activePage - 1 : activePage
            })
        }

    } catch (error) {
        yield put({
            type: "HANDLE_RQ_FAILURE",
            payload: error.errorMessage
        })
        alert(ERR_MSG)
    }
}

export default [
    takeEvery(types.GET_LIST_PENDING_REQUEST, getListPendingSaga),
    takeEvery(types.POST_PRODUCT_PENDING_REQUEST, postProductPendingSaga),
    takeEvery(types.PUT_STATUS_PENDING_REQUEST, putStatusPendingSaga),
    takeEvery("HANDLE_RQ_REQUEST", handleRQSaga)
]

