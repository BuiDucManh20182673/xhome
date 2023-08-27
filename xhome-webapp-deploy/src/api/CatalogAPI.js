import * as constants from "../constants/callAPI"
const token = localStorage.getItem("UI") ? JSON.parse(localStorage.getItem("UI")).token : ""

const headers = {
    "Authorization": `Bearer ${token}`
}
export const getCatalogAPI = (data) => {
    return new Promise((resolve, reject) => {
        fetch(constants.DOMAIN + `/catalog?quantity=${constants.LIMIT_CATALOG}&page=${data}`, {
            method: constants.HTTP_READ,
            headers
        })
            .then((response) => response.json().then((data) => {
                if (data.err) {
                    if (data.err === "jwt expired") {
                        alert("Đăng nhập hết hạn, vui lòng đăng nhập lại!")
                        localStorage.removeItem("UI")
                        window.location.reload()
                    }
                    if (data.err === "Permission denied !!!") {
                        alert("Bạn không có quyền sử dụng chức năng này, hãy yêu cầu admin cấp quyền!")
                    }
                }
                resolve(data)
            }))
            .catch(error => {
                reject(error)
            })
    })
}

export const editCatalogAPI = (data) => {
    return new Promise((resolve, reject) => {
        fetch(constants.DOMAIN + '/catalog', {
            method: constants.HTTP_UPDATE,
            headers: {
                ...headers,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
            .then((response) => response.json().then((data) => {
                if (data.err) {
                    if (data.err === "jwt expired") {
                        alert("Đăng nhập hết hạn, vui lòng đăng nhập lại!")
                        localStorage.removeItem("UI")
                        window.location.reload()
                    }
                    if (data.err === "Permission denied !!!") {
                        alert("Bạn không có quyền sử dụng chức năng này, hãy yêu cầu admin cấp quyền!")
                    }
                }
                resolve(data)
            }))
            .catch(error => {
                reject(error)
            })
    })
}

export const deleteCatalogAPI = (data) => {
    return new Promise((resolve, reject) => {
        fetch(constants.DOMAIN + `/catalog?id=${data.id}`, {
            method: constants.HTTP_DELETE,
            headers
        })
            .then((response) => response.json().then((data) => {
                if (data.err) {
                    if (data.err === "jwt expired") {
                        alert("Đăng nhập hết hạn, vui lòng đăng nhập lại!")
                        localStorage.removeItem("UI")
                        window.location.reload()
                    }
                    if (data.err === "Permission denied !!!") {
                        alert("Bạn không có quyền sử dụng chức năng này, hãy yêu cầu admin cấp quyền!")
                    }
                }
                resolve(data)
            }))
            .catch(error => {
                reject(error)
            })
    })
}
export const getProductByCatalogAPI = (data) => {
    return new Promise((resolve, reject) => {
        fetch(constants.DOMAIN + `/product/by-catalog-id?id=${data.id}&&quantity=${constants.LIMIT_PRODUCT}&&page=${data.activePage}`, {
            method: constants.HTTP_READ,
            headers
        })
            .then((response) => response.json().then((data) => {
                if (data.err) {
                    if (data.err === "jwt expired") {
                        alert("Đăng nhập hết hạn, vui lòng đăng nhập lại!")
                        localStorage.removeItem("UI")
                        window.location.reload()
                    }
                    if (data.err === "Permission denied !!!") {
                        alert("Bạn không có quyền sử dụng chức năng này, hãy yêu cầu admin cấp quyền!")
                    }
                }
                resolve(data)
            }))
            .catch(error => {
                reject(error)
            })
    })
}
