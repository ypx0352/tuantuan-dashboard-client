import { fromJS } from "immutable";
import { actionTypes } from ".";

const defaultState = fromJS({
  loginSuccess: -1, // -1=undefined
  loginButtonLoading:false
});

const returnNewStateToStore = (state = defaultState, action) => {
  switch (action.type) {
    case actionTypes.LOGIN_SUCCESS:
      return state.set("loginSuccess", action.value);

      case actionTypes.LOGIN_BUTTON_LOADING:
        return state.set("loginButtonLoading",action.value);
    default:
      return state;
  }
};

export default returnNewStateToStore;
