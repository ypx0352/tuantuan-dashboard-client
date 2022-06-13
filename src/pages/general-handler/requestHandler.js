import axios from "axios";
import { fromJS } from "immutable";
import store from "../../store";
import { actionTypes as loginActionTypes } from "../login-page/store";

const serverBaseUrl = process.env.REACT_APP_SERVER_BASE_URL;

const authAxios = axios.create({
  baseURL: serverBaseUrl,
});

authAxios.interceptors.request.use((config) => {
  config.headers["Authorization"] = "Bearer " + localStorage.getItem("token");
  return config;
});

authAxios.interceptors.response.use(
  (response) => handleSuccess(response),
  (error) => {
    handleError(error);
  }
);

// Reset token when request success
const handleSuccess = (response) => {
  const nextToken = response.headers["next-token"];
  localStorage.setItem("token", nextToken);
  return response;
};

// Clear the localStorage when the token is invalid
const handleError = (error) => {
  if (error.response) {
    if (error.response.status === 401) {
      localStorage.clear();
      store.dispatch({
        type: loginActionTypes.LOGIN_SUCCESS,
        value: fromJS(0), // 0=false
      });
    }
  }
  throw error;
};

const normalAxios = axios.create({
  baseURL: serverBaseUrl,
});

export { authAxios, normalAxios };
