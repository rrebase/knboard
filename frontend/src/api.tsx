import axios from "axios";
import { logout } from "features/auth/AuthSlice";

// Config global defaults for axios/django
axios.defaults.xsrfHeaderName = "X-CSRFToken";
axios.defaults.xsrfCookieName = "csrftoken";

export const setupInterceptors = (store: any) => {
  axios.interceptors.response.use(
    (response) => response,
    (error) => {
      // Handle expired sessions
      if (error.response && error.response.status === 401) {
        store.dispatch(logout());
      }
      return Promise.reject(error);
    }
  );
};

// Available endpoints
export const API_LOGIN = "/auth/login/";
export const API_LOGOUT = "/auth/logout/";
export const API_REGISTER = "/auth/registration/";
export const API_GUEST_REGISTER = "/auth/guest/";
export const API_AUTH_SETUP = "/auth/setup/";

export const API_AVATARS = "/api/avatars/";
export const API_BOARDS = "/api/boards/";
export const API_COLUMNS = "/api/columns/";
export const API_TASKS = "/api/tasks/";
export const API_COMMENTS = "/api/comments/";
export const API_LABELS = "/api/labels/";
export const API_SORT_COLUMNS = "/api/sort/column/";
export const API_SORT_TASKS = "/api/sort/task/";
export const API_USERS = "/api/users/";
export const API_SEARCH_USERS = "/api/u/search/";

export default axios;
