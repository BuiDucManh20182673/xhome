import { HTTP_CREATE, DOMAIN } from "../constants/callAPI";
export default (files) => {
    let form = new FormData();
    files.forEach((element, idx) => {
        form.append(`photos`, element)
    });
    const token = localStorage.getItem("UI") ? JSON.parse(localStorage.getItem("UI")).token : ""
    const headers = {
        "Authorization": `Bearer ${token}`
    }
    return new Promise((resolve, reject) => {
        fetch(DOMAIN + "/image/upload-multiple", {
            method: HTTP_CREATE,
            headers,
            body: form
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