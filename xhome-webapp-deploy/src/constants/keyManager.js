import * as storageKeys from "./keyNames";

export const saveTokenToStorage = value => {
    localStorage.setItem(storageKeys.API_KEY, value);
}

export const getTokenFromStorage = () => {
    return localStorage.getItem(storageKeys.API_KEY);
}