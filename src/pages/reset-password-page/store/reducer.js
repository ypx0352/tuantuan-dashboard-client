import { fromJS } from "immutable";
import { actionTypes } from ".";

const defaultState = fromJS({
  resetSuccess: false,
  submitButtonLoading: false,
  sendCodeSuccess: false,
  sendCodeButtonLoading: false,
});

const returnNewStateToStore = (state = defaultState, action) => {
  switch (action.type) {
    case actionTypes.RESET_SUCCESS:
      return state.set("resetSuccess", action.value);

    case actionTypes.SUBMIT_BUTTON_LOADING:
      return state.set("submitButtonLoading", action.value);

    case actionTypes.SEND_CODE_SUCCESS:
      return state.set("sendCodeSuccess", action.value);

    case actionTypes.SEND_CODE_BUTTON_LOADING:
      return state.set("sendCodeButtonLoading", action.value);

    default:
      return state;
  }
};

export default returnNewStateToStore;
