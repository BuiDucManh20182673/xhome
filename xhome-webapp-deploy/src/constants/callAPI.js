// domain
// export const DOMAIN = "http://34.209.159.203:3099/api";
// export const DOMAIN = "https://b49e6fb9179d.ngrok.io/api";
// export const DOMAIN = "http://192.168.100.69:3099/api";
// export const DOMAIN_IMAGE = "http://192.168.100.69:3099/images/";
// export const DOMAIN = "http://14.161.37.149:3099/api";
// export const DOMAIN_IMAGE = "http://14.161.37.149:3099/images/";
export const DOMAIN = process.env.NODE_ENV == "development" ? "http://localhost:3004/api" : "http://14.161.37.149:3099/api";
export const DOMAIN_IMAGE = process.env.NODE_ENV == "development" ? "http://localhost:3004/images/" : "http://14.161.37.149:3099/images/";



//limit of data / 1 page
export const LIMIT_MATERIAL = 5;
export const LIMIT_SUPPLIER = 6;
export const LIMIT_CHOOSE = 4;
export const LIMIT = 4;
export const LIMIT_CATALOG = 15;
export const LIMIT_PRODUCT = 6
export const LIMIT_FRACTION = 3;
export const LIMIT_ACCOUNT = 10;
const ACT = "ACCOUNT_XHOME_"
export const UN = ACT + "U"
export const PW = ACT + "P"

// HTTP method 
export const HTTP_READ = "GET"
export const HTTP_CREATE = "POST"
export const HTTP_UPDATE = "PUT"
export const HTTP_DELETE = "DELETE"

// HTTP headers
export const HTTP_HEADER_JSON = {
    "Content-Type": "Application/json"
}

//pending message
export const PENDING_MSG = "Yêu cầu của bạn đã được gửi đến admin. Vui lòng chờ được duyệt !!!"

//err
export const ERR_MSG = "Oops! Something Wrong!"