import axios from "axios";

// Config global defaults for axios/django
axios.defaults.xsrfHeaderName = "X-CSRFToken";
axios.defaults.xsrfCookieName = "csrftoken";

// Available endpoints
export const API_LOGIN = "/dj-rest-auth/login/";
export const API_LOGOUT = "/dj-rest-auth/logout/";
export const API_REGISTER = "/dj-rest-auth/registration/";

export const API_AVATARS = "/api/avatars/";
export const API_BOARDS = "/api/boards/";
export const API_TASKS = "/api/tasks/";
export const API_SORT_COLUMNS = "/api/sort/column/";
export const API_SORT_TASKS = "/api/sort/task/";
export const API_USERS = "/api/users/";

export default axios;
