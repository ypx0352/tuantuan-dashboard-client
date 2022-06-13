import { message } from "antd";
import { actionTypes } from ".";
import { fromJS } from "immutable";
import { actionCreators as checkoutActionCreators } from "../../checkout-page/store";
import { authAxios } from "../../../general-handler/requestHandler";
import { prettifyMoneyNumber } from "../../../general-handler/generalFunction";
import { generalHandle } from "../../../general-handler/errorHandler";

export const initializeCartAction = async (dispatch) => {
  generalHandle(async () => {
    const response = await authAxios.get("/api/cart/items");
    const { result } = response.data;
    var cartItemsCount = 0;
    var cartSubtotal = 0;
    result.forEach((element) => {
      cartItemsCount += element.qty;
      cartSubtotal += element.payAmountToSender;
      element.cost = prettifyMoneyNumber(element.cost);
      element.payAmountToSender = prettifyMoneyNumber(
        element.payAmountToSender
      );
      if (element.originalType !== "employee") {
        element.payAmountFromCustomer = prettifyMoneyNumber(
          element.payAmountFromCustomer
        );
        element.profits = prettifyMoneyNumber(element.profits);
      }
    });
    const roundedPrettyCartSubtotal = prettifyMoneyNumber(cartSubtotal);
    dispatch({ type: actionTypes.GET_CART_ITEMS, value: fromJS(result) });
    dispatch({
      type: actionTypes.CART_ITEMS_COUNT,
      value: fromJS(cartItemsCount),
    });
    dispatch({
      type: actionTypes.CART_SUBTOTAL,
      value: fromJS(roundedPrettyCartSubtotal),
    });
  });
};

export const removeFromCartAction = (record_id, solid_id, type, addToCart) => {
  return async (dispatch) => {
    generalHandle(async () => {
      const response = await authAxios.put("/api/cart/remove_item", {
        record_id,
        solid_id,
        type,
        addToCart,
      });
      const { msg } = response.data;
      message.success(msg);
      dispatch(checkoutActionCreators.getAllItemsAction);
      dispatch(initializeCartAction);
    });
  };
};

export const setReturnAllProfitsItemAction = (_id, returnAllProfits) => {
  return async (dispatch) => {
    try {
      const response = await authAxios.put(
        "/api/cart/set_return_all_profits_item",
        { _id, returnAllProfits }
      );
      message.success(response.data.msg);
      dispatch(initializeCartAction);
    } catch (error) {
      console.log(error);
      const { msg } = error.response.data;
      message.error(msg);
    }
  };
};

export const updateNoteAction = (info) => {
  return async () => {
    generalHandle(async () => {
      const { newNote, note, type, _id } = info;
      if (newNote !== undefined && note !== newNote) {
        const response = await authAxios.put("/api/checkout/update_note", {
          newNote,
          type,
          _id,
        });
        message.success(response.data.msg);
      }
    });
  };
};

export const finishPaymentAction = (paymentMethod) => {
  return async (dispatch) => {
    generalHandle(async () => {
      const response = await authAxios.post("/api/transaction/add", {
        paymentMethod,
      });
      message.success(response.data.msg);
      dispatch(initializeCartAction);
      dispatch(checkoutActionCreators.getAllItemsAction);
    });
  };
};

export const logoutAction = () => {
  try {
    localStorage.clear();
  } catch (error) {
    console.log(error);
  }
};
