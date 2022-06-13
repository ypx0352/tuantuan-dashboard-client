import { fromJS } from "immutable";
import { actionTypes } from ".";
import { generalHandle } from "../../../general-handler/errorHandler";
import { authAxios } from "../../../general-handler/requestHandler";

export const getUserInfoAction = async (dispatch) => {
  generalHandle(
    async () => {
      const response = await authAxios.get("/api/user/user_info");
      // Add createdAtLocale property
      response.data.createdAtLocale = new Date(
        response.data.createdAt
      ).toLocaleString();
      dispatch({ type: actionTypes.USER_INFO, value: fromJS(response.data) });
    },
    dispatch,
    () => {}
  );
};
