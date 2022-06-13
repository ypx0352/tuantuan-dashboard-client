import { fromJS } from "immutable";
import { actionTypes } from ".";
import { generalHandle } from "../../../general-handler/errorHandler";
import { authAxios } from "../../../general-handler/requestHandler";

export const getAllLogsAction = async (dispatch) => {
  generalHandle(
    async () => {
      dispatch({ type: actionTypes.TABLE_SPINNING, value: fromJS(true) });
      const response = await authAxios.get("/api/log/all_logs");
      const rawResult = response.data.result;
      const result = rawResult.map((item) => {
        const { createdAt, ...rest } = item;
        const createdAtLocale = new Date(createdAt).toLocaleString();
        return { createdAtLocale, ...rest };
      });
      dispatch({
        type: actionTypes.ALL_LOGS,
        value: fromJS(result),
      });
      dispatch({ type: actionTypes.TABLE_SPINNING, value: fromJS(false) });
    },
    dispatch,
    () => {
      dispatch({ type: actionTypes.TABLE_SPINNING, value: fromJS(false) });
    }
  );
};
