import { message } from "antd";
import { fromJS } from "immutable";
import { actionTypes } from ".";
import {
  authAxios,
  normalAxios,
} from "../../../general-handler/requestHandler";
import { generalHandle } from "../../../general-handler/errorHandler";

export const searchAction = (pk_id) => {
  return async (dispatch) => {
    generalHandle(
      async () => {
        dispatch({
          type: actionTypes.SPINNING,
          value: fromJS(true),
        });
        dispatch({
          type: actionTypes.RESET_ORDER,
        });
        dispatch({ type: actionTypes.SHOW_REVIEW, value: fromJS(false) });
        const response = await authAxios.get(`/api/order/${pk_id.trim()}`);
        const { exist } = response.data;
        if (exist) {
          dispatch({
            type: actionTypes.SPINNING,
            value: fromJS(false),
          });
          return dispatch({
            type: actionTypes.SHOW_EXIST_MESSAGE,
            value: fromJS(true),
          });
        } else {
          dispatch({
            type: actionTypes.SHOW_EXIST_MESSAGE,
            value: fromJS(false),
          });
        }
        const { result } = response.data;
        result.sendTimeLocale = new Date(result.sendTimeISO).toLocaleString();
        dispatch({
          type: actionTypes.INITIAL_ORDER,
          value: fromJS(result),
        });
        dispatch({
          type: actionTypes.SPINNING,
          value: fromJS(false),
        });
      },
      dispatch,
      () => {
        dispatch({
          type: actionTypes.SPINNING,
          value: fromJS(false),
        });
      }
    );
  };
};

export const initializeExchangeRateAction = async (dispatch) => {
  generalHandle(
    async () => {
      dispatch({
        type: actionTypes.EXCHANGE_RATE_SPINNING,
        value: fromJS(true),
      });
      const response = await normalAxios.get("/api/order/tools/exchange_rate");
      const { result } = response.data;
      dispatch({ type: actionTypes.EXCHANGE_RATE, value: fromJS(result) });
      dispatch({
        type: actionTypes.EXCHANGE_RATE_SPINNING,
        value: fromJS(false),
      });
    },
    dispatch,
    () => {
      dispatch({
        type: actionTypes.EXCHANGE_RATE_SPINNING,
        value: fromJS(false),
      });
    }
  );
};

export const reviewTableDataAction = (tableData) => {
  return async (dispatch) => {
    // input validation
    try {
      if (tableData.items.length === 0) {
        throw new Error("error");
      } else {
        tableData.items.forEach((element) => {
          const { item, qty, price, weight, cost } = element;
          delete element.sendTimeLocale;
          if (qty * price * weight * cost === 0 || item.length === 0) {
            throw new Error("error");
          }
        });
      }

      const { pk_id, exchangeRate, sendTimeISO } = tableData.package;
      const { receiver } = tableData;

      const items = [[], [], []];
      tableData.items.forEach((element) => {
        const { qty, stock, employee } = element;
        const sold = qty - stock - employee;
        const counts = [sold, stock, employee];
        const types = ["sold", "stock", "employee"];

        for (let index = 0; index < counts.length; index++) {
          const count = counts[index];
          if (count > 0) {
            items[index].push({
              ...element,
              qty: count,
              qty_in_cart: 0,
              pk_id: pk_id,
              exchangeRate,
              sendTimeISO,
              receiver,
              type: types[index],
            });
          }
        }
      });

      const [soldItems, stockItems, employeeItems] = items;

      dispatch({ type: actionTypes.SHOW_REVIEW, value: fromJS(true) });

      dispatch({
        type: actionTypes.REVIEW_DATA,
        value: fromJS({
          pk_id: pk_id,
          sold: soldItems,
          stock: stockItems,
          employee: employeeItems,
        }),
      });
    } catch (error) {
      dispatch({
        type: actionTypes.SHOW_REVIEW,
        value: fromJS(false),
      });

      message.warning("Input is incompleted.");
    }
  };
};

export const submitAction = (reviewData, packageData, receiverData) => {
  return async (dispatch) => {
    dispatch({ type: actionTypes.SUBMIT_LOADING, value: fromJS(true) });

    const submitResult = {};
    delete packageData.sendTimeLocale;
    try {
      const response = await authAxios.post("/api/order/submit", {
        reviewData,
        packageData,
        receiverData,
      });

      const { msg } = response.data;
      submitResult.success = true;
      submitResult.msg = msg;

      dispatch({ type: actionTypes.SUBMIT_LOADING, value: fromJS(false) });

      dispatch({
        type: actionTypes.SHOW_SUBMIT_RESULT_DIALOG,
        value: fromJS(true),
      });
    } catch (error) {
      console.log(error);
      const { msg } = error.response.data;
      submitResult.success = false;
      submitResult.msg = msg;
      dispatch({ type: actionTypes.SUBMIT_LOADING, value: fromJS(false) });
      dispatch({
        type: actionTypes.SHOW_SUBMIT_RESULT_DIALOG,
        value: fromJS(true),
      });
    }
    dispatch({
      type: actionTypes.SUBMIT_RESULT,
      value: fromJS(submitResult),
    });
  };
};

export const initializeSettingsAction = async (dispatch) => {
  generalHandle(async () => {
    const response = await authAxios.get("/api/setting");
    const { result } = response.data;
    const setting = {};
    result.forEach((item) => {
      switch (item.name) {
        case "normalPostage":
          setting.normalPostage = item.value;
          break;
        case "babyFormulaPostage":
          setting.babyFormulaPostage = item.value;
          break;
        case "exchangeRateInSetting":
          setting.exchangeRateInSetting = item.value;
          break;
      }
    });
    dispatch({ type: actionTypes.INITIAL_SETTINGS, value: fromJS(setting) });
  });
};
