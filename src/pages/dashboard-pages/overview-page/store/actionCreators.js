import { fromJS } from "immutable";
import { actionTypes } from ".";
import { generalHandle } from "../../../general-handler/errorHandler";
import { authAxios } from "../../../general-handler/requestHandler";

export const initializeTodosAction = (dispatch) => {
  generalHandle(
    async () => {
      dispatch({ type: actionTypes.TODOS_SPINNING, value: fromJS(true) });
      const response = await authAxios.get("/api/overview/todos");
      dispatch({
        type: actionTypes.SET_TODOS_DATA,
        value: fromJS(response.data),
      });
      dispatch({ type: actionTypes.TODOS_SPINNING, value: fromJS(false) });
    },
    dispatch,
    () => {
      dispatch({ type: actionTypes.TODOS_SPINNING, value: fromJS(false) });
    }
  );
};
