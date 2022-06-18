import { message } from "antd";
import { fromJS } from "immutable";
import { actionTypes } from ".";
import { generalHandle } from "../../../general-handler/errorHandler";
import { authAxios } from "../../../general-handler/requestHandler";
import {
  getTimeInZone,
  prettifyMoneyNumber,
} from "../../../general-handler/generalFunction";

export const initializeAllTransactionsAction = async (dispatch) => {
  generalHandle(
    async () => {
      const response = await authAxios.get("/api/transaction/all");
      // Convert ISO time to local CST time.
      // Prettify money display
      response.data.result.forEach((item) => {
        item.createdAtCST = getTimeInZone(item.createdAt, "CST");
        if (item.approvedAt !== undefined) {
          item.approvedAtCST = getTimeInZone(item.approvedAt, "CST");
        }
        item.payAmountToSender = prettifyMoneyNumber(item.payAmountToSender);
        item.items.forEach((row) => {
          row.cost = prettifyMoneyNumber(row.cost);
          row.payAmountToSender = prettifyMoneyNumber(row.payAmountToSender);
          row.price = prettifyMoneyNumber(row.price);
          if (row.payAmountFromCustomer !== undefined) {
            row.payAmountFromCustomer = prettifyMoneyNumber(
              row.payAmountFromCustomer
            );
          }
          if (row.profits !== undefined) {
            row.profits = prettifyMoneyNumber(row.profits);
          }
        });
      });
      dispatch({
        type: actionTypes.SET_ALL_TRANSACTIONS,
        value: fromJS(response.data.result),
      });
      dispatch({ type: actionTypes.TABLE_LOADING, value: fromJS(false) });
    },
    dispatch,
    () => {
      dispatch({ type: actionTypes.TABLE_LOADING, value: fromJS(false) });
    }
  );
};

export const approveTransactionAction = (transaction_id) => {
  return async (dispatch) => {
    generalHandle(
      async () => {
        dispatch({
          type: actionTypes.APPROVED_BUTTON_LOADING,
          value: fromJS(true),
        });

        const response = await authAxios.put("/api/transaction/approve", {
          transaction_id,
        });
        message.success(response.data.msg);
        dispatch({
          type: actionTypes.APPROVED_BUTTON_LOADING,
          value: fromJS(false),
        });
        dispatch(initializeAllTransactionsAction);
      },
      dispatch,
      () => {
        dispatch({
          type: actionTypes.APPROVED_BUTTON_LOADING,
          value: fromJS(false),
        });
      }
    );
  };
};
