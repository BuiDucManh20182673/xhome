import { act } from "react-dom/test-utils";
import * as types from "../constants/actionTypes";
const LIMIT_ITEM = 3
const STATE_PROJECT = {
    selectedData: [],
    project: {
        codeContract: null,
        customer: null,
        areas: []
    },
    listIdChoosedMaterial: [],
    listActivePageAreas: [],
    openListAll: [],
    activeArea: 1,
    error: false,
    errorMessage: null,
    isFetching: false,
    isLoadingSave: false,
    fetched: false,
    saveProject: false,
    typeEditor: "",
    listCopyProductToArea: [],
}

const reducerProject = (state = STATE_PROJECT, action) => {

    switch (action.type) {
        case types.ADD_AREA:
            const area = action.payload.area;
            const stateAreas = state.project.areas;
            state.listIdChoosedMaterial.push([])
            var listChoose = state.listIdChoosedMaterial
            const newState = {
                ...state,
                listIdChoosedMaterial: listChoose,
                project: {
                    ...state.project,
                    areas: [...stateAreas, {
                        area: area,
                        listProduct: [],
                        textNote: ''
                    }]
                },
                listActivePageAreas: [...state.listActivePageAreas, action.payload.activePage],
                openListAll: [...state.openListAll, action.payload.openListAll]
            }
            if (localStorage.getItem("lastActProjectForm") !== null) {
                if (localStorage.getItem("lastActProjectForm") === "ADD") {
                    localStorage.setItem("projectReducerState", JSON.stringify(newState))
                } else if (localStorage.getItem("lastActProjectForm") === "UPDATE") {
                    localStorage.setItem("projectReducerStateUpdate", JSON.stringify(newState))
                }
            }
            return newState
        case types.DELETE_AREA:
            const openListAll = state.openListAll
            const listActive = state.listActivePageAreas
            const listChooseArea = state.listIdChoosedMaterial
            let listCopyProductToArea = state.listCopyProductToArea;
            console.log("delete area 1", listCopyProductToArea);
            listCopyProductToArea = listCopyProductToArea.filter(item => item.idx != action.payload)
            console.log("delete area 2", listCopyProductToArea);
            openListAll.splice(action.payload, 1);
            listActive.splice(action.payload, 1);
            listChooseArea.splice(action.payload, 1);
            const newStateDelete = {
                ...state,
                project: {
                    ...state.project,
                    areas: state.project.areas.filter((element, index) => index !== action.payload)
                },
                openListAll: openListAll,
                listActivePageAreas: listActive,
                listIdChoosedMaterial: listChooseArea,
                listCopyProductToArea: listCopyProductToArea
            }
            if (localStorage.getItem("lastActProjectForm") !== null) {
                if (localStorage.getItem("lastActProjectForm") === "ADD") {
                    localStorage.setItem("projectReducerState", JSON.stringify(newStateDelete))
                } else if (localStorage.getItem("lastActProjectForm") === "UPDATE") {
                    localStorage.setItem("projectReducerStateUpdate", JSON.stringify(newStateDelete))
                }
            }
            return newStateDelete

        case types.ADD_CUSTOMER:
            const customer = action.payload;
            return {
                ...state,
                project: {
                    ...state.project,
                    customer: customer
                }
            }
        case types.ADD_CODE_CONTRACT:
            const codeContract = action.payload
            return {
                ...state,
                project: {
                    ...state.project,
                    codeContract: codeContract
                }
            }

        case types.UPDATE_PROJECT_REQUEST:
        case types.SAVE_PROJECT_REQUEST:
            return {
                ...state,
                isLoadingSave: true
            }
        case types.DROP_PROJECT_REQUEST:
        case types.COPY_PROJECT_REQUEST:
            return {
                ...state,
                isFetching: true
            }
        case types.COPY_PROJECT_SUCCESS:
            return state;

        // case types.SAVE_PROJECT_SUCCESS:
        case types.DROP_PROJECT_SUCCESS:
            if (localStorage.getItem("lastActProjectForm") === "ADD") {
                localStorage.removeItem("projectReducerState")
            }
            localStorage.setItem("lastActProjectForm", "ADD")
            return {
                ...STATE_PROJECT,
                listIdChoosedMaterial: []
            };

        case types.UPDATE_PROJECT_SUCCESS:
            let localStorageItemUpdate = state;
            if (localStorage.getItem("lastActProjectForm") === "UPDATE") {
                localStorageItemUpdate = JSON.parse(localStorage.getItem("projectReducerStateUpdate"))
            }
            return {
                ...state,
                state: localStorageItemUpdate,
                isLoadingSave: false
                // listIdChoosedMaterial: []
            };

        case types.SAVE_PROJECT_SUCCESS:
            let localStorageItem = state;
            if (localStorage.getItem("lastActProjectForm") === "ADD") {
                localStorageItem = JSON.parse(localStorage.getItem("projectReducerState"))
            }
            return {
                ...state,
                state: localStorageItem,
                isLoadingSave: false
                // listIdChoosedMaterial: []
            };

        case types.SAVE_PROJECT_FAILURE:
        case types.UPDATE_PROJECT_FAILURE:
            if (localStorage.getItem("lastActProjectForm") === "ADD") {
                localStorage.removeItem("projectReducerState")
            }
            localStorage.setItem("lastActProjectForm", "ADD")
            return {
                ...state,
                isLoadingSave: false,
                error: true,
                errorMessage: action.payload
            };
        case types.COPY_PROJECT_FAILURE:
        case types.DROP_PROJECT_FAILURE:
            return {
                ...state,
                isFetching: false,
                error: true,
                errorMessage: action.payload
            }
        case types.ACTIVE_PAGE:
            const number = action.payload.number;
            const indexArea = action.payload.index;
            const listActivePageAreas = state.listActivePageAreas
            // if
            listActivePageAreas[indexArea] = number
            return {
                ...state,
                listActivePageAreas: listActivePageAreas
            }
        case types.DROP_PRODUCT:
            const areaIndex = action.payload.areaIndex
            const Areas = state.project.areas
            const productIndex = state.listIdChoosedMaterial[action.payload.areaIndex].indexOf(action.payload.productIndex)
            Areas[areaIndex].listProduct.splice(productIndex, 1);
            state.listIdChoosedMaterial[action.payload.areaIndex].splice(productIndex, 1)
            let listActivePageAreasNew = state.listActivePageAreas;
            let listIdChoosedMaterialNew = state.listIdChoosedMaterial;
            // let activePageCurent = listActivePageAreasNew[action.payload.areaIndex];
            // let totalPage = Math.ceil(state.listIdChoosedMaterial[action.payload.areaIndex].length / LIMIT_ITEM)
            // if (totalPage < listActivePageAreasNew[action.payload.areaIndex] && listActivePageAreasNew[action.payload.areaIndex] !== 1) {
            //     listActivePageAreasNew[action.payload.areaIndex] = activePageCurent - 1
            // }
            // let activePageCurent = listActivePageAreasNew[action.payload.areaIndex];
            // let totalPage = Math.ceil(state.listIdChoosedMaterial[action.payload.areaIndex].length / LIMIT_ITEM)
            // if (totalPage < listActivePageAreasNew[action.payload.areaIndex] && listActivePageAreasNew[action.payload.areaIndex] !== 1) {
            listActivePageAreasNew[areaIndex] = action.payload.activePage === 0 ? 1 : action.payload.activePage
            // }
            return {
                ...state,
                project: {
                    ...state.project,
                    areas: Areas
                },
                listActivePageAreas: listActivePageAreasNew,
                listIdChoosedMaterial: listIdChoosedMaterialNew,
                listCopyProductToArea: []
            }
        case types.CHOOSED_PRODUCT:
            let areasNew = state.project.areas;
            let idMaterial = action.payload.material.id
            areasNew[action.payload.areaIndex].listProduct.push(action.payload.material)
            let selectedData = areasNew[action.payload.areaIndex].listProduct
            state.listIdChoosedMaterial[action.payload.areaIndex].push(idMaterial)
            var listIdChoosedMaterial = state.listIdChoosedMaterial
            return {
                ...state,
                project: {
                    ...state.project,
                    areas: areasNew
                },
                listIdChoosedMaterial: listIdChoosedMaterial,
                selectedData: selectedData
            }
        case types.OPEN_LIST:
            const openList = state.openListAll;
            openList[action.payload] = true;
            return {
                ...state,
                openListAll: openList
            }
        case types.CLOSE_LIST:
            const closeList = state.openListAll;
            closeList[action.payload] = false;
            return {
                ...state,
                openListAll: closeList
            }
        case types.CLOSE_PRODUCT_BOARD:
            return {
                ...state,
                // listIdChoosedMaterial: [],
                selectedData: []
            }
        case types.OPEN_PRODUCT_BOARD:
            const currentListMaterial = state.project.areas[action.payload].listProduct;
            // let idChoosedMaterial = [];
            // currentListMaterial.map((i) => idChoosedMaterial.push(i.id))
            return {
                ...state,
                selectedData: currentListMaterial,
                // listIdChoosedMaterial: idChoosedMaterial,
                activeArea: action.payload
            }
        case types.TEXT_NOTE:
            const textNote = action.payload.textNote;
            const index = action.payload.areaIndex;
            state.project.areas[index].textNote = textNote;
            return state
        case "SAVE_PROJECT_TO_LOCAL":
            if (localStorage.getItem("lastActProjectForm") !== null) {
                if (localStorage.getItem("lastActProjectForm") === "ADD") {
                    localStorage.setItem("projectReducerState", JSON.stringify(state))
                } else if (localStorage.getItem("lastActProjectForm") === "UPDATE") {
                    localStorage.setItem("projectReducerStateUpdate", JSON.stringify(state))
                }
            }
            return state
        case "SAVE_PROJECT_FROM_LOCAL":

            if (localStorage.getItem("lastActProjectForm") !== null) {
                let projectReducerState = {}
                if (localStorage.getItem("lastActProjectForm") === "ADD") {
                    projectReducerState = localStorage.getItem("projectReducerState") !== null ? JSON.parse(localStorage.getItem("projectReducerState"))
                        : {
                            ...STATE_PROJECT,
                            listIdChoosedMaterial: []
                        };
                    return projectReducerState
                } else if (localStorage.getItem("lastActProjectForm") === "UPDATE" && localStorage.getItem("projectReducerStateUpdate") !== null) {
                    projectReducerState = JSON.parse(localStorage.getItem("projectReducerStateUpdate"));
                    return projectReducerState
                } else {
                    return state
                }
            } else {
                return state;
            }
        case types.SAVE_SIZE:
            const productIndexSize = state.listIdChoosedMaterial[action.payload.areaIndex].indexOf(action.payload.idProduct)
            state.project.areas[action.payload.areaIndex].listProduct[productIndexSize].size = action.payload.size
            var stateProduct = state.project.areas[action.payload.areaIndex].listProduct[productIndexSize]
            return {
                ...state,
                stateProduct: stateProduct
            }

        case types.SAVE_DESCRIPTION:
            console.log("description ", action.payload);
            const productIndexDescription = state.listIdChoosedMaterial[action.payload.areaIndex].indexOf(action.payload.idProduct)
            state.project.areas[action.payload.areaIndex].listProduct[productIndexDescription].description = action.payload.description ? action.payload.description : ''
            var stateProduct = state.project.areas[action.payload.areaIndex].listProduct[productIndexDescription]
            return {
                ...state,
                stateProduct: stateProduct
            }
        case types.SAVE_NOTE:
            const productIndexNote = state.listIdChoosedMaterial[action.payload.areaIndex].indexOf(action.payload.idProduct)
            state.project.areas[action.payload.areaIndex].listProduct[productIndexNote].note = action.payload.note ? action.payload.note : ''
            var stateProduct = state.project.areas[action.payload.areaIndex].listProduct[productIndexNote]
            return {
                ...state,
                stateProduct: stateProduct
            }
        case types.PUT_FORM_REQUEST:
            const productIndexForm = state.listIdChoosedMaterial[action.payload.areaIndex].indexOf(action.payload.idProduct)
            state.project.areas[action.payload.areaIndex].listProduct[productIndexForm].supplier = action.payload.agency
            state.project.areas[action.payload.areaIndex].listProduct[productIndexForm].code = action.payload.productCode
            state.project.areas[action.payload.areaIndex].listProduct[productIndexForm].distributor = action.payload.distributor
            state.project.areas[action.payload.areaIndex].listProduct[productIndexForm].product = action.payload.productName
            state.project.areas[action.payload.areaIndex].listProduct[productIndexForm].fraction = action.payload.fraction
            state.project.areas[action.payload.areaIndex].listProduct[productIndexForm].image_url = action.payload.imgURL
            state.project.areas[action.payload.areaIndex].listProduct[productIndexForm].catalog_image = action.payload.imgCatalog
            state.project.areas[action.payload.areaIndex].listProduct[productIndexForm].size = action.payload.size
            state.project.areas[action.payload.areaIndex].listProduct[productIndexForm].description = action.payload.description
            state.project.areas[action.payload.areaIndex].listProduct[productIndexForm].note = action.payload.note
            var stateProduct = state.project.areas[action.payload.areaIndex].listProduct[productIndexForm]
            return {
                ...state,
                stateProduct: stateProduct
            }
        case types.CHOOSE_PROJECT_TO_UPDATE:
            const payloadMap = action.payload.item
            const typeEditor = action.payload.typeEditor
            console.log("reducer type editor ", typeEditor);
            let listActivePageAreasMap = []
            let openListAllMap = []
            let listIdChoosedMaterialMap = []
            let areasMap = []
            console.log("action.payloaf", action.payload);
            for (let index = 0; index < payloadMap.areas.length; index++) {
                listActivePageAreasMap.push(1);
                openListAllMap.push(false);
                let listProdIdByArea = []
                let areaMap = {
                    area: payloadMap.areas[index].name,
                    id: payloadMap.areas[index].id,
                    listProduct: payloadMap.areas[index].project_products.map((product) => {
                        listProdIdByArea.push(product.id);
                        return {
                            ...product.cloneData,
                            description: product.description,
                            note: product.note,
                            size: product.size,
                            id: product.id,
                        }
                    })
                }
                listIdChoosedMaterialMap.push(listProdIdByArea)
                areasMap.push(areaMap)
            }
            let projectMap = {
                codeContract: payloadMap.contractId,
                customer: payloadMap.customerName,
                id: payloadMap.id,
                areas: areasMap
            }
            localStorage.setItem("projectReducerStateUpdate", JSON.stringify({
                ...state,
                listActivePageAreas: listActivePageAreasMap,
                openListAll: openListAllMap,
                listIdChoosedMaterial: listIdChoosedMaterialMap,
                project: projectMap,
                typeEditor: typeEditor
            }))
            return {
                ...state,
                listActivePageAreas: listActivePageAreasMap,
                openListAll: openListAllMap,
                listIdChoosedMaterial: listIdChoosedMaterialMap,
                project: projectMap,
                typeEditor: typeEditor
            }

        case types.COPY_PRODUCT_TO_AREA:
            let product = action.payload.product;
            console.log("product ", product);
            let product_copy = {}
            for (const key in product) {
                if (product[key] !== "distributors") {
                    product_copy[key] = product[key]
                }
            }

            if (product_copy) {
                product_copy.description = "";
                product_copy.note = "";
                product_copy.size = "";
            }
            console.log("product copy ", product_copy);
            let areaArr = action.payload.areaIndex;
            let listIdChoose = state.listIdChoosedMaterial;
            let projectCopy = state.project
            let listAreaCurent = projectCopy?.areas;
            // lấy ra 1 mảng chưa index của các khu vực hiện tại có product là id
            let arrProductCurrent = [];
            for (let i = 0; i < listAreaCurent.length; i++) {
                let index = listAreaCurent[i]?.listProduct.findIndex(i => i.id === product_copy.id)
                if (index !== -1) {
                    arrProductCurrent.push({ idx: i })
                }
            }
            // thêm thêm tất cả product vào mảng hiện tại có khu vực có id được thêm
            areaArr.map((item, idx) => {
                let index = listAreaCurent[item.idx]?.listProduct.findIndex(i => i.id === product_copy.id)
                if (index === -1) {
                    listAreaCurent[item.idx]?.listProduct.push(product_copy)
                    listIdChoose[item.idx].push(product_copy.id)
                }

            })

            // xóa các product thừa, bỏ tick ra khỏi mảng are hiện tại
            arrProductCurrent.map((item, idx) => {
                let index = areaArr.findIndex(i => i.idx === item.idx)
                if (index === -1) {
                    listAreaCurent[item.idx].listProduct = listAreaCurent[item.idx]?.listProduct.filter((element, index) => element.id !== product_copy.id)
                    listIdChoose[item.idx] = listIdChoose[item.idx].filter((element, index) => element !== product_copy.id)
                }
            })

            console.log("list id ", listIdChoose);
            projectCopy.areas = listAreaCurent;
            return {
                ...state,
                project: projectCopy,
                listIdChoosedMaterial: listIdChoose,
                listCopyProductToArea: areaArr,
            }

        case types.CANCEL_COPY_PRODUCT_TO_AREA:
            return {
                ...state,
                listCopyProductToArea: [],
            }
        default:
            return state
    }
}
export default reducerProject;