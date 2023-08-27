import { combineReducers } from "redux";
import commonReducer from "./common";
import projectReducer from "./project";
import MaterialReducer from "./MaterialReducer";
import FractionReducer from "./FractionReducer";
import SupplierReducer from "./SupplierReducer";
import productReducer from './productReducer'
import CatalogReducer from "./CatalogReducer";
import projectReducerSon from "./projectReducer"
import accountReducer from './AccountReducer'
import projectManagerReducer from './projectManagerReducer'
import listPendingReducer from './ListPendingReducer'
import FormReducer from './FormAddReducer'
const rootReducer = combineReducers({
  common: commonReducer,
  projectState: projectReducer,
  productReducer: productReducer,
  supplier: SupplierReducer,
  material: MaterialReducer,
  projectReducer: projectReducerSon,
  fraction: FractionReducer,
  catalog: CatalogReducer,
  account : accountReducer,
  projectManagerReducer : projectManagerReducer,
  listPendingReducer: listPendingReducer,
  formAdd : FormReducer
});

export default rootReducer;