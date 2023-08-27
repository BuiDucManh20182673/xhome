import { put, takeEvery, select } from "redux-saga/effects";
import {
    GET_FRACTION_REQUEST, ADD_FRACTION_REQUEST, CHOOSE_Fraction,
    UPDATE_FRACTION_REQUEST, DELETE_FRACTION_REQUEST, SEARCH_FRACTION_REQUEST
} from "../constants/actionTypes";
import {
    getFractionRequest, getFractionSuccess, getFractionFailure,
    addFractionFailure, addFractionSuccess, updateFractionSuccess,
    updateFractionFailure, deleteFractionSuccess, deleteFractionFailure,
    getSupplierRequest
} from "../constants/actionCreators"
import callAPI from "../api/callAPI"
import { HTTP_READ, HTTP_CREATE, HTTP_UPDATE, HTTP_DELETE, LIMIT_FRACTION, ERR_MSG } from "../constants/callAPI"

// function* getFractionSaga(action) {
//     try {
//         const path = `/fraction/all-by-material-id?id=${action.payload}`
//         const res = yield callAPI(HTTP_READ, path)
//         if (res.err) {
//             yield put(getFractionFailure(res.err))
//         } else {
//             yield put(getFractionSuccess(res))
//             if(res.length > 0){
//                 yield put(getSupplierRequest({
//                     fractionId: res[0].id,
//                     pageIndex: 1
//                 }))
//             }
//         }
//     } catch (error) {
//         yield put(getFractionFailure(error.message))
//     }
// }

function* getFractionSaga(action) {
    try {
        const materialId = yield select(state => state.material.chooseId)
        const activePageCur = yield select(state => state.fraction.activePage)
        const data = action.payload;
        const id = data && !data.activePage ? data : materialId;
        const activePage = data.activePage ? data.activePage : data === materialId ? activePageCur : 1;
        //-------------------------
        const path = `/fraction/by-material-id?id=${id}&&quantity=${LIMIT_FRACTION}&&page=${activePage}`
        const pathTakeAllList = `/fraction/all-by-material-id?id=${data && !data.activePage ? data : materialId}`
        //----------------------------
        const fractionById = yield callAPI(HTTP_READ, path)
        const allFractionById = yield callAPI(HTTP_READ, pathTakeAllList)
        if (fractionById.err) {
            yield put(getFractionFailure(fractionById.err))
            alert(ERR_MSG)
        }else if(allFractionById.err) {
            yield put(getFractionFailure(allFractionById.err))
            alert(ERR_MSG)
        } else {
            yield put(getFractionSuccess({
                listData: fractionById.rows,
                activePage: activePage,
                totalPage: Math.ceil(allFractionById.length / LIMIT_FRACTION),
                allListData: allFractionById
            }))
            if(fractionById.rows.length > 0 && !window.location.pathname.match("segment") && !action.payload.activePage){
                yield put(getSupplierRequest({
                    fractionId: fractionById.rows[0].id,
                    pageIndex: 1
                }))
            }
        }
    } catch (error) {
        yield put(getFractionFailure(error.message))
        alert(ERR_MSG)
    }
}

function* putFractionSaga(action) {
    try {
        const path = `/fraction`
        const res = yield callAPI(HTTP_UPDATE, path, action.payload)
        const materialId = yield select(state => state.material.chooseId)
        if (res.err) {
            yield put(updateFractionFailure(res.err))
            alert(ERR_MSG)
        } else {
            yield put(updateFractionSuccess())
            const uInfo = JSON.parse(localStorage.getItem("UI"))
            if (uInfo.isAdmin === 0 && uInfo.skipApproveFraction === 0) {
                alert("Yêu cầu của bạn đã được gửi đến admin. Vui lòng chờ được duyệt !!!");
            }
            yield put(getFractionRequest(materialId))
        }
    } catch (error) {
        yield put(updateFractionFailure(error.message))
        alert(ERR_MSG)
    }
}

function* deleteFractionSaga(action) {
    try {
        const path = `/fraction?id=${action.payload}`
        const res = yield callAPI(HTTP_DELETE, path)
        const materialId = yield select(state => state.material.chooseId)
        const { listData, activePage, totalPage } = yield select( state => state.fraction)
        const pageIndex = (listData.length === 1 && totalPage === activePage && activePage !== 1) ? activePage - 1 : activePage
        if (res.err) {
            yield put(deleteFractionFailure(res.err))
            alert(ERR_MSG)
        } else {
            yield put(deleteFractionSuccess())
            const uInfo = JSON.parse(localStorage.getItem("UI"))
            if (uInfo.isAdmin === 0 && uInfo.skipApproveFraction === 0) {
                alert("Yêu cầu của bạn đã được gửi đến admin. Vui lòng chờ được duyệt !!!");
            }
            yield put(getFractionRequest({activePage: pageIndex}))
        }
    } catch (error) {
        yield put(deleteFractionFailure(error.message))
        alert(ERR_MSG)
    }
}

function* addFractionSaga(action) {
    try {
        const materialId = yield select(state => state.material.chooseId)
        const path = `/fraction`
        const res = yield callAPI(HTTP_CREATE, path, {id: materialId, name: action.payload})
        const getFraction = yield callAPI(HTTP_READ, `/fraction/all-by-material-id?id=${materialId}`)
        const pageIndex = Math.ceil(getFraction.length / LIMIT_FRACTION);

        if (res.err) {
            yield put(addFractionFailure(res.err))
            alert(ERR_MSG)
        } else {
            yield put(addFractionSuccess())
            const uInfo = JSON.parse(localStorage.getItem("UI"))
            if (uInfo.isAdmin === 0 && uInfo.skipApproveFraction === 0) {
                alert("Yêu cầu của bạn đã được gửi đến admin. Vui lòng chờ được duyệt !!!");
            }
            yield put(getFractionRequest({activePage: pageIndex}))
        }
    } catch (error) {
        yield put(addFractionFailure(error.message))
        alert(ERR_MSG)
    }
}

export default [
    takeEvery(GET_FRACTION_REQUEST, getFractionSaga),
    takeEvery(UPDATE_FRACTION_REQUEST, putFractionSaga),
    takeEvery(DELETE_FRACTION_REQUEST, deleteFractionSaga),
    takeEvery(ADD_FRACTION_REQUEST, addFractionSaga)
]