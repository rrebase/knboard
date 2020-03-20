import axios from "axios";

// Config global defaults for axios/django
axios.defaults.xsrfHeaderName = "X-CSRFToken";
axios.defaults.xsrfCookieName = "csrftoken";

// Available endpoints
export const API_BOARDS = "/api/boards/";
export const API_SORT_COLUMNS = "/api/sort/column/";
export const API_SORT_TASKS = "/api/sort/task/";

export default axios;
