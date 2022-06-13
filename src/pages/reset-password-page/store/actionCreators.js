import { fromJS } from "immutable";
import { message } from "antd";
import { actionTypes } from ".";
import { actionTypes as registerActionTypes } from "../../register-page/store";
import { generalHandle } from "../../general-handler/errorHandler";
import { normalAxios } from "../../general-handler/requestHandler";

export const resetPasswordAction = (resetInfo) => {
  return async (dispatch) => {
    generalHandle(
      async () => {
        dispatch({
          type: actionTypes.SUBMIT_BUTTON_LOADING,
          value: fromJS(true),
        });
        await normalAxios.put("/api/reset_password", resetInfo);
        dispatch({
          type: actionTypes.SUBMIT_BUTTON_LOADING,
          value: fromJS(false),
        });
        dispatch({ type: actionTypes.RESET_SUCCESS, value: fromJS(true) });
      },
      dispatch,
      (dispatch, error) => {
        dispatch({
          type: actionTypes.SUBMIT_BUTTON_LOADING,
          value: fromJS(false),
        });
        const { errorObject } = error.response.data;
        if (errorObject !== undefined) {
          dispatch({
            type: registerActionTypes.INPUT_ERROR_OBJECT,
            value: fromJS(errorObject),
          });
        }
      }
    );
  };
};

export const sendVerificationCodeAction = (resetInfo) => {
  return async (dispatch) => {
    generalHandle(
      async () => {
        dispatch({
          type: actionTypes.SEND_CODE_BUTTON_LOADING,
          value: fromJS(true),
        });
        const response = await normalAxios.post(
          "/api/reset_password/verification_code",
          resetInfo
        );
        message.success(response.data.msg);
        dispatch({
          type: actionTypes.SEND_CODE_BUTTON_LOADING,
          value: fromJS(false),
        });

        dispatch({ type: actionTypes.SEND_CODE_SUCCESS, value: fromJS(true) });
      },
      dispatch,
      (dispatch, error) => {
        dispatch({
          type: actionTypes.SEND_CODE_BUTTON_LOADING,
          value: fromJS(false),
        });

        const { errorObject } = error.response.data;
        if (errorObject !== undefined) {
          dispatch({
            type: registerActionTypes.INPUT_ERROR_OBJECT,
            value: fromJS(errorObject),
          });
        }
      }
    );
  };
};
