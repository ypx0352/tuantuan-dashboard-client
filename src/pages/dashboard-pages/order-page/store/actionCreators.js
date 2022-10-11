import { message } from "antd";
import { fromJS } from "immutable";
import { actionTypes } from ".";
import {
  authAxios,
  normalAxios,
} from "../../../general-handler/requestHandler";
import { generalHandle } from "../../../general-handler/errorHandler";
import { getTimeInZone } from "../../../general-handler/generalFunction";

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
        result.sendTimeACST = getTimeInZone(result.sendTimeISO, "ACST");
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
          delete element.sendTimeACST;
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
    delete packageData.sendTimeACST;
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
        case "adultFormula3Postage":
          setting.adultFormula3Postage = item.value;
          break;
        case "adultFormula6Postage":
          setting.adultFormula6Postage = item.value;
          break;
        case "otherItemPostage":
          setting.otherItemPostage = item.value;
          break;
        case "exchangeRateInSetting":
          setting.exchangeRateInSetting = item.value;
          break;
      }
    });    
    dispatch({ type: actionTypes.INITIAL_SETTINGS, value: fromJS(setting) });
  });
};

export const modifyOriginalOrderAction = (key, value, originalOrder) => {
  return (dispatch) => {
    const newData = originalOrder.toJS();
    if (key == "sendTimeISO") {
      newData.sendTimeISO = value;
    } else {
      newData[key] = value;
    }
    dispatch({
      type: actionTypes.MODIFY_ORIGINAL_ORDER,
      value: fromJS(newData),
    });
  };
};

export const getReceiversAction = (dispatch) => {
  generalHandle(async () => {
    const response = await authAxios.get("/api/address/all_address");
    const { result } = response.data;
    const receivers = [];
    result.forEach((receiver) => {
      const address =
        receiver.province +
        receiver.city +
        receiver.district +
        receiver.address;
      const id = receiver._id;
      const name = receiver.name;
      const phone = receiver.phone;
      receivers.push({ id, name, phone, address });
    });

    dispatch({ type: actionTypes.GET_RECEIVERS, value: fromJS(receivers) });
  });
};

export const setReceiverBySelectionAction = (
  receiverIdNameString,
  receivers
) => {
  return (dispatch) => {
    const receiver_id = receiverIdNameString.split("/")[0];
    const receiver = receivers
      .toJS()
      .find((receiver) => receiver.id == receiver_id);

    dispatch({
      type: actionTypes.SET_RECEIVER_BY_SELECTION,
      value: fromJS(receiver),
    });
  };
};
