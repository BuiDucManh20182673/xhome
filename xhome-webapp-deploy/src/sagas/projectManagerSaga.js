import { put, takeEvery, select } from "redux-saga/effects";
import * as types from '../constants/actionTypes'
import callAPI from "../api/callAPI"
import {
    searchProjectManagerSuccess, searchProjectManagerFailure, searchProjectManagerRequest,
    deleteProjectManagerFailure, deleteProjectManagerSuccess,
    updateProjectSuccess, updateProjectFailure, getProjectManager
} from '../constants/actionCreators'
import { HTTP_READ, HTTP_DELETE, HTTP_UPDATE, ERR_MSG } from '../constants/callAPI'
function* getProjectManagerSaga(action) {
    try {
        // call API 
        const res = yield callAPI(HTTP_READ, `/project?quantity=15&page=${action.payload.data}&isActive=${action.payload.isActive}`)
        console.log('====================================');
        console.log("ressssssssssssssss ", res);
        console.log('====================================');
        if (res.err) {
            yield put({
                type: types.GET_PROJECT_MANAGER_FAILURE,
                payload: res.err
            })
            alert(ERR_MSG)
        } else {
            yield put({
                type: types.GET_PROJECT_MANAGER_SUCCESS,
                payload: {
                    listProjectManager: res.projects.rows,
                    totalPage: Math.ceil(res.projects.count / 15),
                    activePage: action.payload,
                    isActive: action.payload.isActive
                }
            })
        }
    } catch (error) {
        yield put({
            type: types.GET_PROJECT_MANAGER_FAILURE,
            payload: error.errorMessage
        })
        alert(ERR_MSG)
    }
}

function* searchProjectManagerSaga(action) {
    try {
        const { activePage, textSearch, isActive } = action.payload
        const res = yield callAPI(HTTP_READ, `/project/search?quantity=15&page=${activePage}&keyword=${textSearch}&isActive=${isActive}`)
        if (res.err) {
            yield put(searchProjectManagerFailure(res.err))
            alert(ERR_MSG)
        } else {
            yield put(searchProjectManagerSuccess({
                listProjectManager: res.rows,
                totalPage: Math.ceil(res.count / 15),
                activePage, textSearch, isActive
            }))
        }
    } catch (error) {
        yield put(searchProjectManagerFailure(error.errorMessage))
        alert(ERR_MSG)
    }
}

// function* deleteProjectManagerSaga(action) {
//     try {
//         const { activePage, textSearch, listProjectManager, totalPage } = yield select((state) => state.projectManagerReducer)
//         const res = yield callAPI(HTTP_DELETE, `/project?id=${action.payload}&isactive=false`)
//         const pageIndex = (listProjectManager.length === 1 && totalPage === activePage && activePage !== 1) ? activePage - 1 : activePage
//         if (res.err) {
//             yield put(deleteProjectManagerFailure(res.err))
//             alert(ERR_MSG)
//         } else {
//             yield put(deleteProjectManagerSuccess())
//             if (textSearch !== "") {
//                 yield put(searchProjectManagerRequest({
//                     activePage: pageIndex,
//                     textSearch
//                 }))
//             } else {
//                 yield put({
//                     type: types.GET_PROJECT_MANAGER_REQUEST,
//                     payload: pageIndex
//                 })
//             }
//         }
//     } catch (error) {
//         yield put(deleteProjectManagerFailure(error.errorMessage))
//         alert(ERR_MSG)
//     }
// }


function* changeStatusProjectSaga(action) {
    const { areas, contractId, customerName, id } = action.payload;
    // isActive
    const isActive = yield select((state) => state.projectManagerReducer.isActive)

    var listAreas = []
    if (areas) {
        areas.map((item, idx) => {
            var listProduct = []
            if (item.project_products) {
                item.project_products.map((item, idx) => {
                    listProduct.push({
                        material: item?.cloneData?.material,
                        catalog_name: item?.cloneData?.catalog_name,
                        catalog_image: item?.cloneData?.catalog_image,
                        image_url: item?.cloneData?.image_url,
                        code: item?.cloneData?.code,
                        note: item.note ? item.note : '',
                        size: item.size ? item.size : '',
                        description: item.description ? item.description : ''
                    })
                })
            }
            listAreas.push({
                name: item.name,
                products: listProduct
            })
        })
    }

    const dataUpdate = {
        contractId: contractId,
        customerName: customerName,
        areas: listAreas,
        id: id,
        isActive: false
    }

    console.log("data update ", dataUpdate);
    try {
        const res = yield callAPI(HTTP_UPDATE, `/project`, dataUpdate)
        if (res.err) {
            yield put(updateProjectFailure(res.err))
            alert('Đã xảy ra lỗi trong khi xóa dự án!');
        } else {
            yield put(updateProjectSuccess())
            alert('Dự án đã được xóa!');
            yield put(getProjectManager({ data: 1, isActive }))
            // window.location.replace("/dashboard")
            // if (localStorage.getItem("lastActProjectForm") !== null) {
            //     if (localStorage.getItem("lastActProjectForm") === "ADD") {
            //         localStorage.removeItem("projectReducerState")
            //     } else if (localStorage.getItem("lastActProjectForm") === "UPDATE") {
            //         localStorage.removeItem("projectReducerStateUpdate")
            //     }
            // }
        }
    } catch (error) {
        yield put(updateProjectFailure(error.message))
        alert(ERR_MSG)
    }
}

function* restoreProjectSaga(action) {
    const { areas, contractId, customerName, id } = action.payload;
    var listAreas = []
    const isActive = yield select((state) => state.projectManagerReducer.isActive)

    if (areas) {
        areas.map((item, idx) => {
            var listProduct = []
            if (item.project_products) {
                item.project_products.map((item, idx) => {
                    listProduct.push({
                        material: item?.cloneData?.material,
                        catalog_name: item?.cloneData?.catalog_name,
                        catalog_image: item?.cloneData?.catalog_image,
                        image_url: item?.cloneData?.image_url,
                        code: item?.cloneData?.code,
                        note: item.note ? item.note : '',
                        size: item.size ? item.size : '',
                        description: item.description ? item.description : ''
                    })
                })
            }
            listAreas.push({
                name: item.name,
                products: listProduct
            })
        })
    }

    const dataUpdate = {
        contractId: contractId,
        customerName: customerName,
        areas: listAreas,
        id: id,
        isActive: true
    }

    console.log("data update ", dataUpdate);
    try {
        const res = yield callAPI(HTTP_UPDATE, `/project`, dataUpdate)
        if (res.err) {
            yield put(updateProjectFailure(res.err))
            alert('Đã xảy ra lỗi trong khi khôi phục dự án!');
        } else {
            yield put(updateProjectSuccess())
            alert('Dự án đã được khôi phục!');
            yield put(getProjectManager(1, isActive))
            // window.location.replace("/dashboard")
            // if (localStorage.getItem("lastActProjectForm") !== null) {
            //     if (localStorage.getItem("lastActProjectForm") === "ADD") {
            //         localStorage.removeItem("projectReducerState")
            //     } else if (localStorage.getItem("lastActProjectForm") === "UPDATE") {
            //         localStorage.removeItem("projectReducerStateUpdate")
            //     }
            // }
        }
    } catch (error) {
        yield put(updateProjectFailure(error.message))
        alert(ERR_MSG)
    }
}

export { getProjectManagerSaga, searchProjectManagerSaga, changeStatusProjectSaga, restoreProjectSaga }