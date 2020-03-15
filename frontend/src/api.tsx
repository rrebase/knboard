import axios from "axios";

// Config global defaults for axios/django
axios.defaults.xsrfHeaderName = "X-CSRFToken";
axios.defaults.xsrfCookieName = "csrftoken";

// Available endpoints
export const API_BOARDS = "/api/boards/";

export default axios;
