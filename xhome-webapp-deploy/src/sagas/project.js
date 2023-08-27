import { call, put } from "redux-saga/effects";
import { fetchProjects } from "../api/getProjects";
import { doAddProjects } from "../constants/actionCreators";

function* handleFetchProjects(action) {
  const { query } = action.payload;
  try {
    const result = yield call(fetchProjects, query);
    yield put(doAddProjects(result));
  } catch (error) {
    // yield put(doFetchErrorProjects(error));
  }
}

export { handleFetchProjects };
