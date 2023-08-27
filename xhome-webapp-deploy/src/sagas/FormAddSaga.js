import { put, takeEvery, select } from "redux-saga/effects";
import callAPI from '../api/callAPI'
import { HTTP_READ, HTTP_CREATE, HTTP_UPDATE, LIMIT_CHOOSE, ERR_MSG } from '../constants/callAPI'
// import { dropProjectRequest } from "../../constants/actionCreators";
import * as types from "../constants/actionTypes"

function* getFormFraction(action) {
    // const project = action.payload;
    try {
        const res = yield callAPI(HTTP_READ, `/fraction/all-by-material-id?id=${action.payload}`)
        if (res.err) {
            yield put({
                type: types.GET_FORM_FRACTION_FAILURE,
                payload: {
                    errorMessage: res.err
                }
            })
            alert(ERR_MSG)
        } else {
            yield put({
                type: types.GET_FORM_FRACTION_SUCCESS,
                payload: {
                    listFraction: res
                }
            })
        }
    } catch (error) {
        yield put({
            type: types.GET_FORM_FRACTION_FAILURE,
            payload: {
                errorMessage: error
            }
        })
        alert(ERR_MSG)
    }
}

function* getFormAgency(action) {
    // const project = action.payload;
    try {
        const res = yield callAPI(HTTP_READ, `/agency/all-by-fraction-id?id=${action.payload}`)
        if (res.err) {
            yield put({
                type: types.GET_FORM_AGENCY_FAILURE,
                payload: {
                    errorMessage: res.err
                }
            })
            alert(ERR_MSG)
        } else {
            yield put({
                type: types.GET_FORM_AGENCY_SUCCESS,
                payload: {
                    listAgency: res
                }
            })
        }
    } catch (error) {
        yield put({
            type: types.GET_FORM_AGENCY_FAILURE,
            payload: {
                errorMessage: error
            }
        })
        alert(ERR_MSG)
    }
}
function* getFormDistributor(action) {
    // const project = action.payload;
    try {
        const res = yield callAPI(HTTP_READ, `/distributor/by-supplier?page=1&quantity=1&supplier=${action.payload}`)
        if (res.err) {
            yield put({
                type: types.GET_FORM_DISTRIBUTOR_ALL_FAILURE,
                payload: {
                    errorMessage: res.err
                }
            })
            alert(ERR_MSG)
        } else {
            yield put({
                type: types.GET_FORM_DISTRIBUTOR_ALL_SUCCESS,
                payload: {
                    listDistributor: res.rows
                }
            })
        }
    } catch (error) {
        yield put({
            type: types.GET_FORM_DISTRIBUTOR_ALL_FAILURE,
            payload: {
                errorMessage: error
            }
        })
        alert(ERR_MSG)
    }
}

function* getFormCatalog(action) {
    // const project = action.payload;
    try {
        const res = yield callAPI(HTTP_READ, `/catalog/all-by-agency-id?id=${action.payload}`)
        if (res.err) {
            yield put({
                type: types.GET_FORM_CATALOG_FAILURE,
                payload: {
                    errorMessage: res.err
                }
            })
            alert(ERR_MSG)
        } else {
            yield put({
                type: types.GET_FORM_CATALOG_SUCCESS,
                payload: {
                    listCatalog: res
                }
            })
        }
    } catch (error) {
        yield put({
            type: types.GET_FORM_CATALOG_FAILURE,
            payload: {
                errorMessage: error
            }
        })
        alert(ERR_MSG)
    }
}

function* getMaterialSaga(action) {
    try {
        const res = yield callAPI(HTTP_READ, `/material?page=1&quantity=5`)
        if (res.err) {
            yield put({
                type: types.GET_FORM_MATERIAL_FAILURE,
                payload: {
                    errorMessage: res.err
                }
            })
            alert(ERR_MSG)
        } else {
            yield put({
                type: types.GET_FORM_MATERIAL_SUCCESS,
                payload: {
                    listMaterial: res.rows
                }
            })
        }
    } catch (error) {
        yield put({
            type: types.GET_FORM_MATERIAL_FAILURE,
            payload: {
                errorMessage: error
            }
        })
        alert(ERR_MSG)
    }
}

function* searchMaterialSaga(action) {
    try {
        const res = yield callAPI(HTTP_READ, `/material/search?page=1&quantity=10&name=${action.payload}`)
        if (res.err) {
            yield put({
                type: types.GET_FORM_MATERIAL_SEARCH_FAILURE,
                payload: {
                    errorMessage: res.err
                }
            })
            alert(ERR_MSG)
        } else {
            yield put({
                type: types.GET_FORM_MATERIAL_SEARCH_SUCCESS,
                payload: {
                    listMaterial: res.rows
                }
            })
        }
    } catch (error) {
        yield put({
            type: types.GET_FORM_MATERIAL_SEARCH_FAILURE,
            payload: {
                errorMessage: error
            }
        })
        alert(ERR_MSG)
    }
}

function* postProductSaga(action) {
    try {
        const data = {
            id: action.payload.idCatalog,
            name: action.payload.productName,
            type: action.payload.type,
            code: action.payload.productCode,
            imageUrl: action.payload.imgURL
        }
        let dataSuccess = {}
        if (window.location.pathname.match("pending")) {
            dataSuccess = {
                id: action.payload.idRequest,
                accept: true
            }
        }
        const res = yield callAPI(HTTP_CREATE, `/product`, data)
        if (res.err) {
            yield put({
                type: types.POST_FORM_FAILURE,
                payload: {
                    errorMessage: res.err
                }
            })
            alert(ERR_MSG)
        } else {
            yield put({
                type: types.POST_FORM_SUCCESS,
                payload: {
                    statusPost: 'succsess'
                }
            })
            if (window.location.pathname.match("pending")) {
                yield callAPI(HTTP_UPDATE, `/request/no-action`, dataSuccess)
                const { activePage } = yield select((state) => state.listPendingReducer)
                yield put({
                    type: types.GET_LIST_PENDING_REQUEST,
                    payload: activePage
                })
            }
            yield put({
                type: types.RESET_IS_SUCCESS
            })
            const uInfo = JSON.parse(localStorage.getItem("UI"))
            if (uInfo.isAdmin === 0 && uInfo.skipApproveProduct === 0) {
                alert("Yêu cầu của bạn đã được gửi đến admin. Vui lòng chờ được duyệt !!!");
            } else {
                alert("Thêm thành công ");
            }
            // const isAdmin = JSON.parse(localStorage.getItem("UI")).isAdmin
            // const dataGetPage1 = yield callAPI(HTTP_READ,
            //     `/product/search?quantity=${LIMIT_CHOOSE}&page=1&catalogId=${action.payload.idCatalog}&keyword=${action.payload.productCode}`)
            // const totalPage = Math.ceil(dataGetPage1.count / LIMIT_CHOOSE)
            // if (isAdmin) {
            //     const res = yield callAPI(HTTP_READ,
            //         `/product/search?quantity=${LIMIT_CHOOSE}&page=${totalPage}&catalogId=${action.payload.idCatalog}&keyword=${action.payload.productCode}`)

            //     if (!res.err) {
            //         yield put({
            //             type: types.GET_PRODUCT_SUCCESS,
            //             payload: {
            //                 listSelection: {
            //                     rows: [res.rows[res.rows.length - 1]],
            //                     count: 1
            //                 },
            //                 activePage: 1,
            //                 keyWord: action.payload.productCode
            //             }
            //         })
            //     } else {
            //         yield put({
            //             type: types.GET_PRODUCT_FAILURE,
            //             payload: {
            //                 errorMessage: res.err
            //             }
            //         })
            //         alert(ERR_MSG)
            //     }
            // } else {
            //     if (!dataGetPage1.err) {
            //         yield put({
            //             type: types.GET_PRODUCT_SUCCESS,
            //             payload: {
            //                 listSelection: {
            //                     rows: [dataGetPage1.requests[dataGetPage1.requests.length - 1]],
            //                     count: 1
            //                 },
            //                 activePage: 1,
            //                 keyWord: action.payload.productCode
            //             }
            //         })
            //     } else {
            //         yield put({
            //             type: types.GET_PRODUCT_FAILURE,
            //             payload: {
            //                 errorMessage: dataGetPage1.err
            //             }
            //         })
            //         alert(ERR_MSG)
            //     }
            // }
        }
    } catch (error) {
        yield put({
            type: types.POST_FORM_FAILURE,
            payload: {
                statusPost: 'failure',
                errorMessage: error
            }
        })
        alert(ERR_MSG)
    }
}
function* postProductInputSaga(action) {
    try {
        const data = {
            "material": action.payload.material,
            "fraction": action.payload.fraction,
            "agency": action.payload.agnecy,
            "distributorName": action.payload.distributorName,
            "distributorEmail": action.payload.distributorMail,
            "distributorTel": action.payload.distributorTel,
            "catalogName": action.payload.catalogName,
            "product": action.payload.productName,
            "catalogImage": action.payload.catalogURL,
            "group": action.payload.type,
            "miniProductName": action.payload.productCode,
            "miniProductImage": action.payload.imageURL
        }
        let dataSuccess = {}
        if (window.location.pathname.match("pending")) {
            dataSuccess = {
                id: action.payload.id,
                accept: true
            }
        }
        const res = yield callAPI(HTTP_CREATE, `/product/full-product`, data)
        if (res.err) {
            yield put({
                type: types.POST_FORM_INPUT_FAILURE,
                payload: {
                    errorMessage: res.err
                }
            })
            alert(ERR_MSG)
        } else {
            yield put({
                type: types.POST_FORM_INPUT_SUCCESS,
                payload: {
                    statusPost: 'succsess'
                }
            })
            if (window.location.pathname.match("pending")) {
                yield callAPI(HTTP_UPDATE, `/request/no-action`, dataSuccess)
                const { activePage } = yield select((state) => state.listPendingReducer)
                yield put({
                    type: types.GET_LIST_PENDING_REQUEST,
                    payload: activePage
                })
            }
            yield put({
                type: types.RESET_IS_SUCCESS
            })
            const uInfo = JSON.parse(localStorage.getItem("UI"))
            if (uInfo.isAdmin === 0 && uInfo.skipApproveProduct === 0) {
                alert("Yêu cầu của bạn đã được gửi đến admin. Vui lòng chờ được duyệt !!!");
            } else {
                alert("Thêm thành công ");
            }
            // const isAdmin = JSON.parse(localStorage.getItem("UI")).isAdmin
            // const dataGetPage1 = yield callAPI(HTTP_READ,
            //     `/product/search?quantity=${LIMIT_CHOOSE}&page=1&keyword=${action.payload.productCode}`)
            // const totalPage = Math.ceil(dataGetPage1.count / LIMIT_CHOOSE)
            // if (!window.location.pathname.match("import")) {
            //     if (isAdmin) {
            //         const res = yield callAPI(HTTP_READ,
            //             `/product/search?quantity=${LIMIT_CHOOSE}&page=${totalPage}&keyword=${action.payload.productCode}`)

            //         if (!res.err) {
            //             yield put({
            //                 type: types.GET_PRODUCT_SUCCESS,
            //                 payload: {
            //                     listSelection: {
            //                         rows: [res.rows[res.rows.length - 1]],
            //                         count: 1
            //                     },
            //                     activePage: 1,
            //                     keyWord: action.payload.productCode
            //                 }
            //             })

            //         } else {
            //             yield put({
            //                 type: types.GET_PRODUCT_FAILURE,
            //                 payload: {
            //                     errorMessage: res.err
            //                 }
            //             })
            //             alert(ERR_MSG)
            //         }
            //     } else {
            //         if (!dataGetPage1.err) {
            //             yield put({
            //                 type: types.GET_PRODUCT_SUCCESS,
            //                 payload: {
            //                     listSelection: {
            //                         rows: [dataGetPage1.requests[dataGetPage1.requests.length - 1]],
            //                         count: 1
            //                     },
            //                     activePage: 1,
            //                     keyWord: action.payload.productCode
            //                 }
            //             })
            //         } else {
            //             yield put({
            //                 type: types.GET_PRODUCT_FAILURE,
            //                 payload: {
            //                     errorMessage: dataGetPage1.err
            //                 }
            //             })
            //             alert(ERR_MSG)
            //         }
            //     }
            // }
        }
    } catch (error) {
        yield put({
            type: types.POST_FORM_INPUT_FAILURE,
            payload: {
                statusPost: 'failure',
                errorMessage: error
            }
        })
        alert(ERR_MSG)
    }
}

function* getCatalogSaga(action) {
    try {
        const response = yield callAPI(HTTP_READ, `/catalog?quantity=100&page=1`)
        if (response.err) {
            yield put({
                type: types.GET_FORM_CATALOG_ALL_FAILURE,
                payload: {
                    errorMessage: response.err
                }
            })
            alert(ERR_MSG)
        } else {
            yield put({
                type: types.GET_FORM_CATALOG_ALL_SUCCESS,
                payload: {
                    listCatalog: response
                }
            })
        }
    } catch (error) {
        yield put({
            type: types.GET_FORM_CATALOG_ALL_FAILURE,
            payload: {
                errorMessage: error
            }
        })
        alert(ERR_MSG)
    }
}


function* searchCatalogSaga(action) {
    try {
        const res = yield callAPI(HTTP_READ, `/catalog/search?keyword=${action.payload}&quantity=100&page=1`)
        if (res.err) {
            yield put({
                type : types.GET_FORM_CATALOG_SEARCH_REQUEST,
                payload: {
                    errorMessage: res.err
                }
            })
            alert(ERR_MSG)
        } else {
            yield put({
                type : types.GET_FORM_CATALOG_SEARCH_SUCCESS,
                payload:{
                    listCatalog : res.rows
                }
            })
        }
    } catch (error) {
        yield put({
            type : types.GET_FORM_CATALOG_SEARCH_REQUEST,
            payload: {
                errorMessage: error
            }
        })
        alert(ERR_MSG)

    }
}
const FormAddSaga = [
    takeEvery(types.GET_FORM_FRACTION_REQUEST, getFormFraction),
    takeEvery(types.GET_FORM_AGENCY_REQUEST, getFormAgency),
    takeEvery(types.GET_FORM_CATALOG_REQUEST, getFormCatalog),
    takeEvery(types.GET_FORM_MATERIAL_REQUEST, getMaterialSaga),
    takeEvery(types.GET_FORM_MATERIAL_SEARCH_REQUEST, searchMaterialSaga),
    takeEvery(types.POST_FORM_REQUEST, postProductSaga),
    takeEvery(types.POST_FORM_INPUT_REQUEST, postProductInputSaga),
    takeEvery(types.GET_FORM_DISTRIBUTOR_ALL_REQUEST, getFormDistributor),
    takeEvery(types.GET_FORM_CATALOG_ALL_REQUEST, getCatalogSaga),
    takeEvery(types.GET_FORM_CATALOG_SEARCH_REQUEST, searchCatalogSaga),
]

export default FormAddSaga