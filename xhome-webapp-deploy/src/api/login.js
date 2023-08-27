import * as constants from "../constants/callAPI"
export default function addDataApi(data) {
    let objFetch = {
        method: "POST",
        headers: constants.HTTP_HEADER_JSON,
        body: JSON.stringify(data)
    }
    return new Promise((resolve, reject) => {
        const url = constants.DOMAIN + "/auth"
        fetch(url, objFetch)
            .then((response) => resolve(response.json()))
            .catch((error) => reject(error));
    });
}
