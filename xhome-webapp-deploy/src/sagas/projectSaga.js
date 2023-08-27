import { put, takeEvery, select, call } from "redux-saga/effects";
import callAPI from '../api/callAPI'
import { HTTP_CREATE, HTTP_UPDATE, ERR_MSG, HTTP_READ } from '../constants/callAPI'
import { updateProjectSuccess, updateProjectFailure, copyProjectSuccess, copyProjectFailure } from "../constants/actionCreators";
import * as types from "../constants/actionTypes"
function* saveProjectSaga(action) {
    const project = action.payload;
    var areas = []

    if (action.payload.areas) {
        action.payload.areas.map((item, idx) => {
            var listProduct = []
            if (item.listProduct) {
                item.listProduct.map((item, idx) => {
                    listProduct.push({
                        material: item.material,
                        catalog_name: item.catalog_name,
                        catalog_image: item.catalog_image,
                        image_url: item.image_url,
                        code: item.code,
                        note: item.note ? item.note : '',
                        size: item.size ? item.size : '',
                        description: item.description ? item.description : ''
                    })
                })
            }
            areas.push({
                name: item.area,
                products: listProduct
            })
        })
    }

    const dataPost = {
        contractId: action.payload.codeContract,
        customerName: action.payload.customer,
        areas: areas,
        isActive: true
    }
    try {
        if (localStorage.getItem("newProject")) {
            let data = JSON.parse(localStorage.getItem("newProject"))
            console.log("data project ", data);
            dataPost.id = data
            dataPost.isActive = true
            yield put({
                type: types.UPDATE_PROJECT_REQUEST,
                payload: dataPost
            })
        } else {
            const res = yield callAPI(HTTP_CREATE, `/project`, dataPost)
            if (res.err) {
                yield put({
                    type: types.SAVE_PROJECT_FAILURE,
                    payload: res.err
                })
                alert('Đã xảy ra lỗi trong khi lưu dự án!');
            } else {
                yield put({
                    type: types.SAVE_PROJECT_SUCCESS,
                })
                console.log("project save ", res);
                let newRecord = JSON.stringify(res.newRecord && res.newRecord.id)
                yield localStorage.setItem("newProject", newRecord)
                yield localStorage.setItem("typeSaveProject", "update")
                // yield localStorage.removeItem("newProject")
                // yield localStorage.removeItem("typeSaveProject")
                yield put({
                    type: types.DROP_PROJECT_REQUEST
                })
                alert('Dự án đã được lưu!');

                // if (localStorage.getItem("lastActProjectForm") !== null) {
                //     if (localStorage.getItem("lastActProjectForm") === "ADD") {
                //         localStorage.removeItem("projectReducerState")
                //     } else if (localStorage.getItem("lastActProjectForm") === "UPDATE") {
                //         localStorage.removeItem("projectReducerStateUpdate")
                //     }
                // }
            }
        }
    } catch (error) {
        yield put({
            type: types.SAVE_PROJECT_FAILURE,
            payload: error.message
        })
        alert(ERR_MSG)
    }
}

function* updateProjectSaga(action) {
    const project = action.payload;
    var areas = []
    if (project.areas) {
        project.areas.map((item, idx) => {
            var listProduct = []
            if (item.listProduct) {
                item.listProduct.map((item, idx) => {
                    listProduct.push({
                        material: item.material,
                        catalog_name: item.catalog_name,
                        catalog_image: item.catalog_image,
                        image_url: item.image_url,
                        code: item.code,
                        note: item.note ? item.note : '',
                        size: item.size ? item.size : '',
                        description: item.description ? item.description : ''
                    })
                })
            }
            areas.push({
                name: item.area,
                products: listProduct
            })
        })
    }
    let dataUpdate = {
        contractId: project.codeContract,
        customerName: project.customer,
        areas: areas,
        id: project.id,
        isActive: true
    }
    if (localStorage.getItem("typeSaveProject") && localStorage.getItem("typeSaveProject") === "update" && localStorage.getItem("lastActProjectForm") !== "UPDATE") {
        dataUpdate = action.payload
    }
    console.log("datae ", dataUpdate);
    try {
        const res = yield callAPI(HTTP_UPDATE, `/project`, dataUpdate)
        if (res.err) {
            yield put(updateProjectFailure(res.err))
            alert('Đã xảy ra lỗi trong khi lưu dự án!');
        } else {
            yield put(updateProjectSuccess())
            alert('Dự án đã được lưu!');
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

function* dropProjectSaga(action) {
    // const project = action.payload;
    try {
        yield put({
            type: types.DROP_PROJECT_SUCCESS,
            payload: {
                responseMessage: 'Drop Success'
            }
        })
    } catch (error) {
        yield put({
            type: types.DROP_PROJECT_FAILURE,
            payload: {
                errorMessage: error
            }
        })
        alert(ERR_MSG)
    }
}


function* copyProjectSaga(action) {
    try {
        const res = yield callAPI(HTTP_READ, `/project/copy?id=${action.payload}`)
        const isActive = yield select((state) => state.projectManagerReducer.isActive)

        if (res.err) {
            yield put(copyProjectFailure(res.err))
            alert(ERR_MSG)
        } else {
            yield put(copyProjectSuccess())
            alert('Dự án đã được sao chép!');
            yield put({
                type: types.GET_PROJECT_MANAGER_REQUEST,
                payload: { data: 1, isActive }
            })
        }
    } catch (error) {
        yield put(copyProjectFailure(error.message))
        alert(ERR_MSG)
    }
}

const ProjectCreationSaga = [
    takeEvery(types.SAVE_PROJECT_REQUEST, saveProjectSaga),
    takeEvery(types.DROP_PROJECT_REQUEST, dropProjectSaga),
    takeEvery(types.UPDATE_PROJECT_REQUEST, updateProjectSaga),
    takeEvery(types.COPY_PROJECT_REQUEST, copyProjectSaga)
]

export default ProjectCreationSaga