import { fromJS } from "immutable";
import { actionTypes } from ".";
import { generalHandle } from "../../../general-handler/errorHandler";
import { getTimeInZone } from "../../../general-handler/generalFunction";
import { authAxios } from "../../../general-handler/requestHandler";

export const getUserInfoAction = async (dispatch) => {
  generalHandle(
    async () => {
      const response = await authAxios.get("/api/user/user_info");
      // Add createdAtCST property
      response.data.createdAtCST = getTimeInZone(response.data.createdAt,'CST');
      dispatch({ type: actionTypes.USER_INFO, value: fromJS(response.data) });
    },
    dispatch,
    () => {}
  );
};
