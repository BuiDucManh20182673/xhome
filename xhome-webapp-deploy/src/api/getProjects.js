import { BE_BASE_URL } from "../constants/links";

const fetchProjects = (query) =>
  fetch(BE_BASE_URL + query).then((response) => response.json());

export { fetchProjects };
