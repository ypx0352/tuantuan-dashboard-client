import { message } from "antd";
import { fromJS } from "immutable";
import { actionTypes } from ".";
import { generalHandle } from "../../../general-handler/errorHandler";
import { authAxios } from "../../../general-handler/requestHandler";

export const initializeAddressAction = async (dispatch) => {
  generalHandle(
    async () => {
      dispatch({ type: actionTypes.TABLE_SPINNING, value: fromJS(true) });
      const response = await authAxios.get("/api/address/all_address");
      const allAddress = response.data.result.map((item) => {
        const newItem = item;
        newItem.createdAtLocale = new Date(item.createdAt).toLocaleString();
        newItem.key = item._id;
        return newItem;
      });

      dispatch({
        type: actionTypes.INITIALIZE_ADDRESS,
        value: fromJS(allAddress),
      });

      dispatch({ type: actionTypes.TABLE_SPINNING, value: fromJS(false) });
    },
    dispatch,
    () => dispatch({ type: actionTypes.TABLE_SPINNING, value: fromJS(false) })
  );
};

export const submitNewAddressAction = (address) => {
  return async (dispatch) => {
    generalHandle(async () => {
      const response = await authAxios.post("/api/address/add", address);
      const { msg } = response.data;
      message.success(msg);
      dispatch(initializeAddressAction);
    });
  };
};

export const deleteAddressAction = (_id) => {
  return async (dispatch) => {
    generalHandle(async () => {
      const response = await authAxios.delete("/api/address/delete", {
        data: { _id },
      });
      message.success(response.data.msg);
      dispatch(initializeAddressAction);
    });
  };
};

export const updateAddressAction = (updatedAddress) => {
  return async (dispatch) => {
    generalHandle(async () => {
      const { name, phone, province, city, district, address, note, _id } =
        updatedAddress;
      const newAddress = {
        name,
        phone,
        province,
        city,
        district,
        address,
        note,
        _id,
      };

      const response = await authAxios.put("/api/address/update", newAddress);
      message.success(response.data.msg);
      dispatch(initializeAddressAction);
      dispatch({ type: actionTypes.SHOW_MODAL, value: fromJS(false) });
    });
  };
};
