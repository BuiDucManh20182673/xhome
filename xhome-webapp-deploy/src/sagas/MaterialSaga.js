import { put, takeEvery, select } from "redux-saga/effects";
import {
    GET_MATERIAL_REQUEST, ADD_MATERIAL_REQUEST, CHOOSE_MATERIAL,
    UPDATE_MATERIAL_REQUEST, DELETE_MATERIAL_REQUEST, SEARCH_MATERIAL_REQUEST
} from "../constants/actionTypes";
import {
    getMaterialRequest, getMaterialSuccess, getMaterialFailure,
    searchMaterialRequest, searchMaterialSuccess, searchMaterialFailure,
    addMaterialFailure, addMaterialSuccess, updateMaterialSuccess,
    updateMaterialFailure, deleteMaterialSuccess, deleteMaterialFailure
} from "../constants/actionCreators"
import callAPI from "../api/callAPI"
import { HTTP_READ, HTTP_CREATE, LIMIT_MATERIAL, HTTP_UPDATE, HTTP_DELETE, ERR_MSG } from "../constants/callAPI"

function* getMaterialSaga(action) {
    try {
        const res = yield callAPI(HTTP_READ, `/material?page=${action.payload}&quantity=${LIMIT_MATERIAL}`)
        if (res.err) {
            yield put(getMaterialFailure(res.err))
            alert(ERR_MSG)
        } else {
            yield put(getMaterialSuccess({
                listData: res.rows,
                totalPage: Math.ceil(res.count / LIMIT_MATERIAL),
                activePage: action.payload
            }))
        }
    } catch (error) {
        yield put(getMaterialFailure(error.message))
        alert(ERR_MSG)
    }
}

function* addMaterialSaga(action) {
    try {
        const dataToFetch = {
            name: action.payload.name
        }
        const res = yield callAPI(HTTP_CREATE, "/material", dataToFetch)
        if (res.err) {
            yield put(addMaterialFailure(res.err))
            alert(ERR_MSG)
        } else {
            yield put(addMaterialSuccess());
            const uInfo = JSON.parse(localStorage.getItem("UI"))
            if (uInfo.isAdmin === 0 && uInfo.skipApproveMaterial === 0) {
                alert("Yêu cầu của bạn đã được gửi đến admin. Vui lòng chờ được duyệt !!!");
            } else {
                yield callAPI(HTTP_CREATE, "/fraction", { id: res.newRecord.id, name: "Luxury" });
                yield callAPI(HTTP_CREATE, "/fraction", { id: res.newRecord.id, name: "Standard" });
                alert(`Thêm vật liệu ${action.payload.name} thành công !!!`);
                yield put(getMaterialRequest(Math.ceil(res.count / LIMIT_MATERIAL)))
            }
            // const { listData, totalPage, activePage } = yield select((state) => state.material);
        }
    } catch (error) {
        yield put(addMaterialFailure(error.message))
        alert(ERR_MSG)
    }
}

function* updateMaterialSaga(action) {
    try {
        const dataToFetch = {
            name: action.payload.name,
            id: action.payload.id
        }
        const res = yield callAPI(HTTP_UPDATE, "/material", dataToFetch)
        if (res.err) {
            yield put(updateMaterialFailure(res.err))
            alert(ERR_MSG)
        } else {
            yield put(updateMaterialSuccess())
            const uInfo = JSON.parse(localStorage.getItem("UI"))
            if (uInfo.isAdmin === 0 && uInfo.skipApproveMaterial === 0) {
                alert("Yêu cầu của bạn đã được gửi đến admin. Vui lòng chờ được duyệt !!!");
            }
            const { activePage, textSearch } = yield select((state) => state.material);
            if (textSearch !== "") {
                yield put(searchMaterialRequest({ pageIndex: activePage, textSearch }))
            } else {
                yield put(getMaterialRequest(activePage))
            }
        }
    } catch (error) {
        yield put(updateMaterialFailure(error.message))
        alert(ERR_MSG)
    }
}

function* deleteMaterialSaga(action) {
    try {
        const res = yield callAPI(HTTP_DELETE, `/material?id=${action.payload}`)
        if (res.err) {
            yield put(deleteMaterialFailure(res.err))
            alert(ERR_MSG)
        } else {
            yield put(deleteMaterialSuccess())
            const uInfo = JSON.parse(localStorage.getItem("UI"))
            if (uInfo.isAdmin === 0 && uInfo.skipApproveMaterial === 0) {
                alert("Yêu cầu của bạn đã được gửi đến admin. Vui lòng chờ được duyệt !!!");
            }
            const { activePage, textSearch, listData, totalPage } = yield select((state) => state.material);
            const pageIndex = listData.length === 1 && activePage > 1 && activePage === totalPage ? activePage - 1 : activePage;
            if (textSearch !== "") {
                yield put(searchMaterialRequest({ pageIndex, textSearch }))
            } else {
                yield put(getMaterialRequest(pageIndex))
            }
        }
    } catch (error) {
        yield put(deleteMaterialFailure(error.message))
        alert(ERR_MSG)
    }
}

function* searchMaterialSaga(action) {
    try {
        const { pageIndex, textSearch } = action.payload;
        const res = yield callAPI(HTTP_READ, `/material/search?page=${pageIndex}&quantity=10&name=${textSearch}`)
        if (res.err) {
            yield put(searchMaterialFailure(res.err))
            alert(ERR_MSG)
        } else {
            yield put(searchMaterialSuccess({
                listData: res.rows,
                totalPage: Math.ceil(res.count / 10),
                activePage: pageIndex,
                textSearch
            }))
        }
    } catch (error) {
        yield put(searchMaterialFailure(error.message))
        alert(ERR_MSG)
    }
}

export default [
    takeEvery(GET_MATERIAL_REQUEST, getMaterialSaga),
    takeEvery(ADD_MATERIAL_REQUEST, addMaterialSaga),
    takeEvery(UPDATE_MATERIAL_REQUEST, updateMaterialSaga),
    takeEvery(SEARCH_MATERIAL_REQUEST, searchMaterialSaga),
    takeEvery(DELETE_MATERIAL_REQUEST, deleteMaterialSaga)
]