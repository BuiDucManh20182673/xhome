import { put, select } from "redux-saga/effects";
import * as types from '../constants/actionTypes'
import callAPI from "../api/callAPI"
import { HTTP_CREATE, HTTP_DELETE, HTTP_READ, HTTP_UPDATE } from '../constants/callAPI'
import * as LIMIT from "../constants/callAPI"
import { ERR_MSG } from "../constants/callAPI"
import { updatePermissionSuccess, updatePermissionFailure } from "../constants/actionCreators"
function* getAccountSaga(action) {
    try {
        // call API
        const res = yield callAPI(HTTP_READ, `/account?quantity=${LIMIT.LIMIT_ACCOUNT}&page=${action.payload.activePage}`)
        if (res.err) {
            yield put({
                type: types.GET_ACCOUNT_FAILURE,
                payload: {
                    errorMessage: res.err
                }
            })
            alert(ERR_MSG)
        } else {
            yield put({
                type: types.GET_ACCOUNT_SUCCESS,
                payload: {
                    listAccount: res,
                    activePage: action.payload.activePage
                }
            })
        }
    } catch (error) {
        yield put({
            type: types.GET_ACCOUNT_FAILURE,
            payload: {
                errorMessage: error.errorMessage
            }
        })
        alert(ERR_MSG)
    }
}

function* changePassSaga(action) {
    try {
        // call API
        const res = yield callAPI(HTTP_UPDATE, "/account/change-password", action.payload)
        if (res.err) {
            alert(ERR_MSG)
        } else {
            alert("Đổi mật khẩu thành công, vui lòng đăng nhập lại!")
            localStorage.removeItem("UI")
            window.location.reload()
        }
    } catch (error) {
        alert(ERR_MSG)
    }
}

function* getSearchAccountSaga(action) {
    try {
        // call API
        const res = yield callAPI(HTTP_READ, `/account/search?keyword=${action.payload.textSearch}&quantity=${LIMIT.LIMIT_ACCOUNT}&page=${action.payload.activePage}`)
        if (res.err) {
            yield put({
                type: types.GET_SEARCH_ACCOUNT_FAILURE,
                payload: {
                    errorMessage: res.err
                }
            })
            alert(ERR_MSG)
        } else {
            yield put({
                type: types.GET_SEARCH_ACCOUNT_SUCCESS,
                payload: {
                    listAccount: res,
                    activePage: action.payload.activePage,
                    textSearch: action.payload.textSearch
                }
            })
        }
    } catch (error) {
        yield put({
            type: types.GET_SEARCH_ACCOUNT_FAILURE,
            payload: {
                errorMessage: error.errorMessage
            }
        })
        alert(ERR_MSG)
    }
}

function* updatePermission() {
    try {
        const { chooseAccountId, listPermissionMaterial, listPermissionAgency,
            listPermissionFraction, listPermissionCatalog, listPermissionProduct,
            listPermissionProject, activePage, textSearch } = yield select((state) => state.account)
        let allowPermissions = []
        const listAllPermission = [listPermissionMaterial, listPermissionAgency, listPermissionFraction,
            listPermissionCatalog, listPermissionProduct, listPermissionProject]
        listAllPermission.forEach((list, listIdx) => {
            let ObjName = "Project"
            switch (listIdx) {
                case 0:
                    ObjName = "Material"
                    break;
                case 1:
                    ObjName = "Agency"
                    break;
                case 2:
                    ObjName = "Fraction"
                    break;
                case 3:
                    ObjName = "Catalog"
                    break;
                case 4:
                    ObjName = "Product"
                    break;
                default:
                    break;
            }
            list.forEach((item, idx) => {
                let actionName = "delete"
                switch (idx) {
                    case 0:
                        actionName = "view"
                        break;
                    case 1:
                        actionName = "add"
                        break;
                    case 2:
                        actionName = "edit"
                        break;
                    default:
                        break;
                }
                item && allowPermissions.push(actionName + ObjName)
            })
        })
        const dataToAPI = {
            id: chooseAccountId,
            allowPermissions
        }
        const res = yield callAPI(HTTP_UPDATE, "/account/permission", dataToAPI)
        if (res.err) {
            yield put(updatePermissionFailure(res.err))
            alert(ERR_MSG)

        } else {
            yield put(updatePermissionSuccess(res))
            textSearch === "" ? yield put({
                type: types.GET_ACCOUNT_REQUEST,
                payload: {
                    activePage
                }
            })
                :
                yield put({
                    type: types.GET_SEARCH_ACCOUNT_REQUEST,
                    payload: {
                        activePage,
                        textSearch
                    }
                })

        }
    } catch (error) {
        yield put(updatePermissionFailure(error))
        alert(ERR_MSG)

    }
}

function* postAccountSaga(action) {
    try {
        const data = {
            username: action.payload.userName,
            password: action.payload.passWord,
            fullName: action.payload.fullName
        }
        const res = yield callAPI(HTTP_CREATE, `/account`, data)
        if (res.err) {
            yield put({
                type: types.POST_ACCOUNT_FAILURE,
                payload: {
                    errorMessage: res.err
                }
            })
            alert(ERR_MSG)
        } else {
            yield put({
                type: types.POST_ACCOUNT_SUCCESS,
                payload: {
                    activePage: action.payload.activePage,
                    textSearch: action.payload.textSearch
                }
            })
            if (action.payload.textSearch === '') {
                yield put({
                    type: types.GET_ACCOUNT_REQUEST,
                    payload: {
                        activePage: 1
                    }
                })
            } else {
                yield put({
                    type: types.GET_SEARCH_ACCOUNT_REQUEST,
                    payload: {
                        activePage: 1,
                        textSearch: action.payload.textSearch
                    }
                })
            }
        }
    } catch (error) {
        yield put({
            type: types.POST_ACCOUNT_FAILURE,
            payload: {
                errorMessage: error.errorMessage
            }
        })
        alert(ERR_MSG)
    }
}
function* putAccountSaga(action) {
    try {
        // call API
        const data = {
            id: action.payload.id,
            username: action.payload.userName,
            fullName: action.payload.fullName
        }
        const res = yield callAPI(HTTP_UPDATE, `/account`, data)
        if (res.err) {
            yield put({
                type: types.PUT_ACCOUNT_FAILURE,
                payload: {
                    errorMessage: res.err
                }
            })
            alert(ERR_MSG)
        } else {
            yield put({
                type: types.PUT_ACCOUNT_SUCCESS,
                payload: {
                    activePage: action.payload.activePage,
                    textSearch: action.payload.textSearch
                }
            })
            if (action.payload.textSearch === '') {
                yield put({
                    type: types.GET_ACCOUNT_REQUEST,
                    payload: {
                        activePage: 1
                    }
                })
            } else {
                yield put({
                    type: types.GET_SEARCH_ACCOUNT_REQUEST,
                    payload: {
                        activePage: 1,
                        textSearch: action.payload.textSearch
                    }
                })
            }
        }
    } catch (error) {
        yield put({
            type: types.PUT_ACCOUNT_FAILURE,
            payload: {
                errorMessage: error.errorMessage
            }
        })
        alert(ERR_MSG)
    }
}
function* deleteAccountSaga(action) {
    try {
        // call API
        const res = yield callAPI(HTTP_DELETE, `/account?id=${action.payload.id}`)
        if (res.err) {
            yield put({
                type: types.DELETE_ACCOUNT_FAILURE,
                payload: {
                    errorMessage: res.err
                }
            })
            alert(ERR_MSG)
        } else {
            yield put({
                type: types.DELETE_ACCOUNT_SUCCESS,
                payload: {
                    activePage: action.payload.activePage,
                    textSearch: action.payload.textSearch
                }
            })
            if (action.payload.textSearch === '') {
                yield put({
                    type: types.GET_ACCOUNT_REQUEST,
                    payload: {
                        activePage: 1
                    }
                })
            } else {
                yield put({
                    type: types.GET_SEARCH_ACCOUNT_REQUEST,
                    payload: {
                        activePage: 1,
                        textSearch: action.payload.textSearch
                    }
                })
            }
        }
    } catch (error) {
        yield put({
            type: types.DELETE_ACCOUNT_FAILURE,
            payload: {
                errorMessage: error.errorMessage
            }
        })
        alert(ERR_MSG)
    }
}
function* userForgetPasswordSaga(action) {
    try {
        const res = yield callAPI(HTTP_CREATE, `/account/forgot-password`, { username: action.payload });
        if (res.err) {
            yield put({
                type: types.FORGET_ACCOUNT_PASSWORD_FAILURE,
                payload: {
                    errorMessage: res.err
                }
            })
            alert('Tài khoản không tồn tại, vui lòng nhập lại!')
        } else {
            yield put({
                type: types.FORGET_ACCOUNT_PASSWORD_SUCCESS
            })
            alert('Sự thay đổi đã được chuyển tới danh sách chờ duyệt của ADMIN, vui lòng liên hệ với ADMIN để duyệt');
        }
    } catch (error) {
        yield put({
            type: types.FORGET_ACCOUNT_PASSWORD_FAILURE,
            payload: {
                errorMessage: error.errorMessage
            }
        })
        alert(ERR_MSG)
    }
}

function* chooseAccountAdminSaga() {
    try {
        const chooseAccountId = yield select((state) => state.account.chooseAccountId)
        const res = yield callAPI(HTTP_UPDATE, "/account/promote-admin", {id: chooseAccountId})
        if(res.err){
            alert(ERR_MSG)
        }else{
            alert("Tài khoản này đã trở thành 1 tài khoản Admin")
        }
    } catch (error) {
        alert(ERR_MSG)
    }
}

export {
    getAccountSaga,
    postAccountSaga,
    putAccountSaga,
    deleteAccountSaga,
    getSearchAccountSaga,
    updatePermission,
    changePassSaga,
    userForgetPasswordSaga,
    chooseAccountAdminSaga
}