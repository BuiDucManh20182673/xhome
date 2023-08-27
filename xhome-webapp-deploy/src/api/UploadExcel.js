import * as constants from "../constants/callAPI"
export default function callAPI(method, path, data) {
    console.log("call API ", data);
    let objFetch = {}
    const token = localStorage.getItem("UI") ? JSON.parse(localStorage.getItem("UI")).token : ""
    const headers = {
        "Authorization": `Bearer ${token}`
    }
    if(method === constants.HTTP_READ || method === constants.HTTP_DELETE){
        objFetch = {
            method,
            headers
          }
    }else{
        objFetch = {
            method,
            headers: {
                ...headers,
                ...constants.HTTP_HEADER_JSON
            },
            body: JSON.stringify(data)
          }
    }
    return new Promise((resolve, reject) => {
        const url = constants.DOMAIN + path
        fetch(url, objFetch)
            .then((response) => response.then((data) => {
                if(data.err){
                    if(data.err === "jwt expired"){
                        alert("Đăng nhập hết hạn, vui lòng đăng nhập lại!")
                        localStorage.removeItem("UI")
                        window.location.reload()
                    }
                    if(data.err === "Permission denied !!!"){
                        alert("Bạn không có quyền sử dụng chức năng này, hãy yêu cầu admin cấp quyền!")
                    }
                }
                resolve(data)
            }))
            .catch((error) => reject(error));
    });
}
