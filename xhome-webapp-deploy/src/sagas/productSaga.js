import { put, select } from 'redux-saga/effects'
import * as types from '../constants/actionTypes'
import { LIMIT_CATALOG, LIMIT_PRODUCT } from '../constants/callAPI'
import callAPI from "../api/callAPI"
import { getProductByCatalogAPI } from "../api/CatalogAPI"
import { HTTP_READ, HTTP_CREATE, HTTP_UPDATE, HTTP_HEADER_JSON, HTTP_DELETE, LIMIT_CHOOSE, ERR_MSG } from "../constants/callAPI"

function* getDataProduct(action) {
    try {
        const res = yield callAPI(HTTP_READ, `/product/search?quantity=${LIMIT_CHOOSE}&page=1`)
        if (res.err) {
            yield put({
                type: types.GET_PRODUCT_FAILURE,
                payload: {
                    errorMessage: res.err
                }
            })
            alert(ERR_MSG)
        } else {
            yield put({
                type: types.GET_PRODUCT_SUCCESS,
                payload: {
                    listSelection: res,
                    activePage: action.payload.activePage
                }
            })
        }
    } catch (error) {
        yield put({
            type: types.GET_PRODUCT_FAILURE,
            payload: {
                errorMessage: error.errorMessage
            }
        })
        alert(ERR_MSG)
    }
}

function* getDataProductLastPage(action) {
    try {
        const data = yield callAPI(HTTP_READ, `/product?quantity=${LIMIT_CHOOSE}&page=1`)
        const totalPage = Math.ceil(data.count / LIMIT_CHOOSE)
        const res = yield callAPI(HTTP_READ, `/product?quantity=${LIMIT_CHOOSE}&page=${totalPage}`)
        if (res.err) {
            yield put({
                type: types.GET_PRODUCT_FAILURE,
                payload: {
                    errorMessage: res.err
                }
            })
            alert(ERR_MSG)
        } else {
            yield put({
                type: types.GET_PRODUCT_SUCCESS,
                payload: {
                    listSelection: res,
                    activePage: totalPage
                }
            })
        }
    } catch (error) {
        yield put({
            type: types.GET_PRODUCT_FAILURE,
            payload: {
                errorMessage: error.errorMessage
            }
        })
        alert(ERR_MSG)
    }
}

function* postDataProduct(action) {
    try {
        const { name, group, imageUrl, code, idCatalog } = action.payload;
        const res = yield callAPI(HTTP_CREATE, `/product`, { id: idCatalog, name: name, type: group, imageUrl: imageUrl, code: code })
        if (res.err) {
            yield put({
                type: types.POST_PRODUCT_FAILURE,
                payload: {
                    errorMessage: res.err
                }
            })
            alert(ERR_MSG)
        } else {
            const listRecord = yield callAPI(HTTP_READ, `/product/by-catalog-id?id=${idCatalog}&quantity=1&page=1`)
            yield put({
                type: types.POST_PRODUCT_SUCCESS,
                payload: {
                    activePage: action.payload.activePage
                }
            })
            const uInfo = JSON.parse(localStorage.getItem("UI"))
            if (uInfo.isAdmin === 0 && uInfo.skipApproveProduct === 0) {
                alert("Yêu cầu của bạn đã được gửi đến admin. Vui lòng chờ được duyệt !!!");
            }
            // const { activePageByCatalog, totalPageByCatalog, listProductByCatalog } = yield select((state) => state.productReducer)
            // const pageIndex = (listProductByCatalog.length === LIMIT_PRODUCT && totalPageByCatalog === activePageByCatalog || activePageByCatalog === 0)
            //     ? activePageByCatalog + 1 : activePageByCatalog
            // const {activePageByCatalog, totalPageByCatalog, listProductByCatalog} = yield select((state) => state.productReducer)
            const pageIndex = Math.ceil(listRecord.count / LIMIT_PRODUCT)
            yield put({
                type: types.GET_PRODUCT_BY_ID_REQUEST,
                payload: {
                    activePage: pageIndex,
                    id: idCatalog
                }
            })
        }
    } catch (error) {
        yield put({
            type: types.POST_PRODUCT_FAILURE,
            payload: {
                errorMessage: error.errorMessage
            }
        })
        alert(ERR_MSG)
    }
}

function* putDataProduct(action) {
    try {
        const { id, name, group, imageUrl, code, activePage, idCatalog, textSearch } = action.payload;
        const res = yield callAPI(HTTP_UPDATE, `/product`, { id: id, name: name, type: group, code: code, imageUrl: imageUrl })
        if (res.err) {
            yield put({
                type: types.PUT_PRODUCT_FAILURE,
                payload: {
                    errorMessage: res.err
                }
            })
            alert(ERR_MSG)
        } else {
            yield put({
                type: types.PUT_PRODUCT_SUCCESS,
                payload: {
                    activePage: activePage
                }
            })
            const uInfo = JSON.parse(localStorage.getItem("UI"))
            if (uInfo.isAdmin === 0 && uInfo.skipApproveProduct === 0) {
                alert("Yêu cầu của bạn đã được gửi đến admin. Vui lòng chờ được duyệt !!!");
            }
            yield put({
                type: types.GET_PRODUCT_BY_ID_REQUEST,
                payload: {
                    activePage: action.payload.activePage,
                    id: idCatalog,
                    textSearch
                }
            })
        }
    } catch (error) {
        yield put({
            type: types.PUT_PRODUCT_FAILURE,
            payload: {
                errorMessage: error.errorMessage
            }
        })
        alert(ERR_MSG)
    }
}
function* deleteDataProduct(action) {
    try {
        const { id, idCatalog, textSearch } = action.payload;
        const res = yield callAPI(HTTP_DELETE, `/product?id=${id}`)
        if (res.err) {
            yield put({
                type: types.DELETE_PRODUCT_FAILURE,
                payload: {
                    errorMessage: res.err
                }
            })
            alert(ERR_MSG)
        } else {
            yield put({
                type: types.DELETE_PRODUCT_SUCCESS
            })
            const uInfo = JSON.parse(localStorage.getItem("UI"))
            if (uInfo.isAdmin === 0 && uInfo.skipApproveProduct === 0) {
                alert("Yêu cầu của bạn đã được gửi đến admin. Vui lòng chờ được duyệt !!!");
            }
            const { activePageByCatalog, totalPageByCatalog, listProductByCatalog } = yield select((state) => state.productReducer)
            const pageIndex = (listProductByCatalog.length === 1 && totalPageByCatalog === activePageByCatalog && activePageByCatalog !== 1)
                ? activePageByCatalog - 1 : activePageByCatalog
            yield put({
                type: types.GET_PRODUCT_BY_ID_REQUEST,
                payload: {
                    activePage: pageIndex,
                    id: idCatalog,
                    textSearch
                }
            })
            // }else{
            //     yield put({
            //         type: types.GET_PRODUCT_BY_ID_REQUEST,
            //         payload: {
            //             activePage: action.payload.activePage,
            //             id: idCatalog
            //         }
            //     })
            // }
        }
    } catch (error) {
        yield put({
            type: types.DELETE_PRODUCT_FAILURE,
            payload: {
                errorMessage: error.errorMessage
            }
        })
        alert(ERR_MSG)
    }
}

function* getMaterialFilter(action) {
    try {
        const res = yield callAPI(HTTP_READ, `/material/search-name?name=${action.payload}&quantity=100&page=1`)
        if (res.err) {
            yield put({
                type: types.GET_MATERIAL_FILTER_FAILURE,
                payload: {
                    errorMessage: res.err
                }
            })
            alert(ERR_MSG)
        } else {
            yield put({
                type: types.GET_MATERIAL_FILTER_SUCCESS,
                payload: {
                    listMaterialFilter: res
                }
            })
        }
    } catch (error) {
        yield put({
            type: types.GET_MATERIAL_FILTER_FAILURE,
            payload: {
                errorMessage: error.errorMessage
            }
        })
        alert(ERR_MSG)
    }
}
function* getAgencyFilter(action) {
    try {
        const res = yield callAPI(HTTP_READ, `/agency/search-name?supplier=${action.payload}&quantity=100&page=1`)
        if (res.err) {
            yield put({
                type: types.GET_AGENCY_FILTER_FAILURE,
                payload: {
                    errorMessage: res.err
                }
            })
            alert(ERR_MSG)
        } else {
            yield put({
                type: types.GET_AGENCY_FILTER_SUCCESS,
                payload: {
                    listAgencyFilter: res
                }
            })
        }
    } catch (error) {
        yield put({
            type: types.GET_AGENCY_FILTER_FAILURE,
            payload: {
                errorMessage: error.errorMessage
            }
        })
        alert(ERR_MSG)
    }
}
function* getDistributor(action) {
    try {
        const res = yield callAPI(HTTP_READ, `/agency/search?supplier=${action.payload}&quantity=1&page=1`)
        if (res.err) {
            yield put({
                type: types.GET_FRACTION_FILTER_FAILURE,
                payload: {
                    errorMessage: res.err
                }
            })
            alert(ERR_MSG)
        } else {
            yield put({
                type: types.GET_DISTRIBUTOR_SUCCESS,
                payload: {
                    listDistributor: res.rows[0].distributor
                }
            })
        }
    } catch (error) {
        yield put({
            type: types.GET_DISTRIBUTOR_FAILURE,
            payload: {
                errorMessage: error.errorMessage
            }
        })
        alert(ERR_MSG)
    }
}
function* getFractionFilter(action) {
    try {
        const res = yield callAPI(HTTP_READ, `/fraction/search-name?name=${action.payload}&quantity=100&page=1`)
        if (res.err) {
            yield put({
                type: types.GET_FRACTION_FILTER_FAILURE,
                payload: {
                    errorMessage: res.err
                }
            })
            alert(ERR_MSG)
        } else {
            yield put({
                type: types.GET_FRACTION_FILTER_SUCCESS,
                payload: {
                    listFactionFilter: res
                }
            })
        }
    } catch (error) {
        yield put({
            type: types.GET_FRACTION_FILTER_FAILURE,
            payload: {
                errorMessage: error.errorMessage
            }
        })
        alert(ERR_MSG)
    }
}
function* getCatalogFilter(action) {
    try {
        var url
        if (action.payload !== '') {
            url = `/catalog/search-name?name=${action.payload}&quantity=100&page=1`
        }
        const res = yield callAPI(HTTP_READ, url)
        if (res.err) {
            yield put({
                type: types.GET_CATALOG_FILTER_FAILURE,
                payload: {
                    errorMessage: res.err
                }
            })
            alert(ERR_MSG)
        } else {
            yield put({
                type: types.GET_CATALOG_FILTER_SUCCESS,
                payload: {
                    listCatalogFilter: res
                }
            })
        }
    } catch (error) {
        yield put({
            type: types.GET_CATALOG_FILTER_FAILURE,
            payload: {
                errorMessage: error.errorMessage
            }
        })
        alert(ERR_MSG)
    }
}
function* getMaterialForcusFilter(action) {
    try {
        const res = yield callAPI(HTTP_READ, `/material?quantity=5&page=1`)
        if (res.err) {
            yield put({
                type: types.GET_MATERIAL_FORCUS_FAILURE,
                payload: {
                    errorMessage: res.err
                }
            })
            alert(ERR_MSG)
        } else {
            yield put({
                type: types.GET_MATERIAL_FORCUS_SUCCESS,
                payload: {
                    listMaterialFilter: res
                }
            })
        }
    } catch (error) {
        yield put({
            type: types.GET_MATERIAL_FORCUS_FAILURE,
            payload: {
                errorMessage: error.errorMessage
            }
        })
        alert(ERR_MSG)
    }
}
function* getAgencyForcusFilter(action) {
    try {
        const res = yield callAPI(HTTP_READ, `/agency/name-all`)
        if (res.err) {
            yield put({
                type: types.GET_AGENCY_FORCUS_FAILURE,
                payload: {
                    errorMessage: res.err
                }
            })
        } else {
            yield put({
                type: types.GET_AGENCY_FORCUS_SUCCESS,
                payload: {
                    listAgencyFilter: res
                }
            })
        }
    } catch (error) {
        yield put({
            type: types.GET_AGENCY_FORCUS_FAILURE,
            payload: {
                errorMessage: error.errorMessage
            }
        })
    }
}
function* getCatalogForcusFilter(action) {
    try {
        const res = yield callAPI(HTTP_READ, `/catalog?quantity=5&page=1`)
        if (res.err) {
            yield put({
                type: types.GET_CATALOG_FORCUS_FAILURE,
                payload: {
                    errorMessage: res.err
                }
            })
        } else {
            yield put({
                type: types.GET_CATALOG_FORCUS_SUCCESS,
                payload: {
                    listCatalogFilter: res
                }
            })
        }
    } catch (error) {
        yield put({
            type: types.GET_CATALOG_FORCUS_FAILURE,
            payload: {
                errorMessage: error.errorMessage
            }
        })
    }
}
function* getFractionForcusFilter(action) {
    try {
        const res = yield callAPI(HTTP_READ, `/fraction/name-all`)
        if (res.err) {
            yield put({
                type: types.GET_FRACTION_FORCUS_FAILURE,
                payload: {
                    errorMessage: res.err
                }
            })
        } else {
            yield put({
                type: types.GET_FRACTION_FORCUS_SUCCESS,
                payload: {
                    listFactionFilter: res
                }
            })
        }
    } catch (error) {
        yield put({
            type: types.GET_FRACTION_FORCUS_FAILURE,
            payload: {
                errorMessage: error.errorMessage
            }
        })
    }
}

function* getDataSelection(action) {
    let url = `/product/search?quantity=${LIMIT_CHOOSE}&page=${action.payload.activePage}`
    if (action.payload.keyWord && action.payload.keyWord !== null && action.payload.keyWord !== '') {
        url = url + `&keyword=` + encodeURIComponent(action.payload.keyWord)
    }
    if (action.payload.materialName && action.payload.materialName !== null && action.payload.materialName !== -1) {
        url = url + `&materialName=` + encodeURIComponent(action.payload.materialName)
    }
    if (action.payload.fractionName && action.payload.fractionName !== null && action.payload.fractionName !== -1) {
        url = url + `&fractionName=` + encodeURIComponent(action.payload.fractionName)
    }
    if (action.payload.agencyName && action.payload.agencyName !== null && action.payload.agencyName !== -1) {
        url = url + `&agencyName=` + encodeURIComponent(action.payload.agencyName)
    }
    if (action.payload.catalogName && action.payload.catalogName !== null && action.payload.catalogName !== -1) {
        url = url + `&catalogName=` + encodeURIComponent(action.payload.catalogName)
    }
    try {
        const res = yield callAPI(HTTP_READ, url)
        if (res.err) {
            yield put({
                type: types.GET_SELECTION_FAILURE,
                payload: {
                    errorMessage: res.err
                }
            })
        } else {
            yield put({
                type: types.GET_SELECTION_SUCCESS,
                payload: {
                    listSelection: res,
                    activePage: action.payload.activePage,
                    keyWord: action.payload.keyWord && action.payload.keyWord !== null && action.payload.keyWord !== '' ? action.payload.keyWord : null,
                    materialName: action.payload.materialName && action.payload.materialName !== null && action.payload.materialName !== -1 ? action.payload.materialName : null,
                    fractionName: action.payload.fractionName && action.payload.fractionName !== null && action.payload.fractionName !== -1 ? action.payload.fractionName : null,
                    agencyName: action.payload.agencyName && action.payload.agencyName !== null && action.payload.agencyName !== -1 ? action.payload.agencyName : null,
                    catalogName: action.payload.catalogName && action.payload.catalogName !== null && action.payload.catalogName !== -1 ? action.payload.catalogName : null,
                }
            })
        }
    } catch (error) {
        yield put({
            type: types.GET_SELECTION_FAILURE,
            payload: {
                errorMessage: error.errorMessage
            }
        })
    }
}

function* getProductByCatalogSaga(action) {

    try {
        const { id, activePage, textSearch } = action.payload
        const response = yield callAPI(HTTP_READ, textSearch ?
            `/product/by-catalog-id?id=${id}&&quantity=${20}&&page=${activePage}&keyword=${textSearch}`
            : `/product/by-catalog-id?id=${id}&&quantity=${20}&&page=${activePage}`)
        if (response.err) {
            yield put({
                type: types.GET_PRODUCT_BY_ID_FAILURE,
                payload: {
                    errorMessage: response.err
                }
            })
        } else {
            yield put({
                type: types.GET_PRODUCT_BY_ID_SUCCESS,
                payload: {
                    activePage: action.payload.activePage,
                    totalPage: Math.ceil(response.count / 20),
                    listProductByCatalog: response.rows,
                    textSearch
                }
            })
        }
    } catch (error) {
        yield put({
            type: types.GET_PRODUCT_BY_ID_FAILURE,
            payload: {
                errorMessage: error
            }
        })
    }
}


export {
    getDataProduct, getDataSelection, getAgencyFilter
    , getCatalogFilter, getFractionFilter, getMaterialFilter,
    getProductByCatalogSaga,
    postDataProduct, getDataProductLastPage,
    putDataProduct,
    deleteDataProduct
    , getMaterialForcusFilter, getAgencyForcusFilter,
    getCatalogForcusFilter, getFractionForcusFilter, getDistributor
}
