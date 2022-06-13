import { fromJS } from "immutable";
import { actionTypes } from ".";
import { normalAxios } from "../../general-handler/requestHandler";
import { generalHandle } from "../../general-handler/errorHandler";

export const submitRegisterAction = (registerInfo) => {
  return async (dispatch) => {
    generalHandle(
      async () => {
        dispatch({
          type: actionTypes.REGISTER_BUTTON_LOADING,
          value: fromJS(true),
        });
        const response = await normalAxios.post("/api/register", registerInfo);
        console.log(response);
        //message.success(response.data.msg);
        dispatch({
          type: actionTypes.REGISTER_BUTTON_LOADING,
          value: fromJS(false),
        });

        dispatch({ type: actionTypes.REGISTERED_SUCCESS });
      },
      dispatch,
      (dispatch, error) => {
        const { errorObject } = error.response.data;
        dispatch({
          type: actionTypes.REGISTER_BUTTON_LOADING,
          value: fromJS(false),
        });
        if (errorObject !== undefined) {
          dispatch({
            type: actionTypes.INPUT_ERROR_OBJECT,
            value: fromJS(errorObject),
          });
        }
      }
    );
  };
};
