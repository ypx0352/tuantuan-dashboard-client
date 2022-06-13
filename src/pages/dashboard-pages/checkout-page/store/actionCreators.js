import { fromJS } from "immutable";
import { message } from "antd";
import { actionTypes } from ".";
import { actionCreators } from "../../static/store";
import { authAxios } from "../../../general-handler/requestHandler";
import { generalHandle } from "../../../general-handler/errorHandler";

const getItemsCount = (allItems) => {
  const counts = [];
  var allCount = 0;
  Object.entries(allItems).forEach((entry) => {
    var result = 0;
    entry[1].forEach((item) => {
      result += item.qty;
    });
    counts.push(result);
    allCount += result;
  });
  const [soldCount, stockCount, employeeCount, exceptionCount] = counts;
  return { soldCount, stockCount, employeeCount, exceptionCount, allCount };
};

export const getAllItemsAction = async (dispatch) => {
  generalHandle(
    async () => {
      dispatch({ type: actionTypes.COUNT_SPINNING, value: fromJS(true) });
      const response = await authAxios.get("/api/checkout/all_items");
      const allItems = response.data.result;

      // Transfer ISO time to local time
      // Add qty_available entry
      Object.entries(allItems).forEach((entry) => {
        entry[1].forEach((item) => {
          item.qty_available = item.qty - item.qty_in_cart;
          item.sendTimeLocale = new Date(item.sendTimeISO).toLocaleString();
          item.localCreatedAt = new Date(item.createdAt).toLocaleString();
          item.localUpdatedAt = new Date(item.updatedAt).toLocaleString();
        });
      });
      dispatch({
        type: actionTypes.SET_ALL_ITEMS,
        value: fromJS(allItems),
      });
      dispatch({
        type: actionTypes.SET_ITEMS_COUNT,
        value: fromJS(getItemsCount(allItems)),
      });
      dispatch({ type: actionTypes.COUNT_SPINNING, value: fromJS(false) });
    },
    dispatch,
    () => {
      dispatch({ type: actionTypes.COUNT_SPINNING, value: fromJS(false) });
    }
  );
};

export const addToCartAction = (record) => {
  return async (dispatch) => {
    generalHandle(async () => {
      const { addToCart, _id, type, subtotal } = record;
      const payload =
        type !== "employee"
          ? { addToCart, _id, type, subtotal }
          : { addToCart, _id, type };
      const response = await authAxios.post("/api/cart/add_to_cart", payload);
      const { msg } = response.data;
      message.success(msg);
      dispatch(getAllItemsAction);
      dispatch(actionCreators.initializeCartAction);
    });
  };
};

export const approveExceptionItemAction = (_id) => {
  return async (dispatch) => {
    generalHandle(async () => {
      const response = await authAxios.put(
        "/api/checkout/approve_exception_item",
        { _id }
      );
      dispatch(getAllItemsAction);
      message.success(response.data.msg);
    });
  };
};

export const transferItemAction = (
  original_id,
  sourceType,
  targetType,
  transferQty,
  subtotal
) => {
  return async (dispatch) => {
    generalHandle(async () => {
      const response = await authAxios.put("/api/checkout/transfer_item", {
        original_id,
        sourceType,
        targetType,
        transferQty,
        subtotal,
      });
      message.success(response.data.msg);
      if (targetType === "exception") {
        dispatch({ type: actionTypes.SHOW_MODAL, value: fromJS(false) });
      }
      dispatch(getAllItemsAction);
    });
  };
};
