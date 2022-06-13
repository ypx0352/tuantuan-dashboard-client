import { fromJS } from "immutable";
import { actionTypes } from ".";

const defaultState = fromJS({
  inputErrorObject: {},
  registered: false,
  registerButtonLoading: false,
});

const returnNewStateToStore = (state = defaultState, action) => {
  switch (action.type) {
    case actionTypes.INPUT_ERROR_OBJECT:
      return state.set("inputErrorObject", action.value);

    case actionTypes.MODIFY_INPUT_ERROR_OBJECT:
      return state.set("inputErrorObject", action.value);

    case actionTypes.REGISTERED_SUCCESS:
      return state.set("registered", fromJS(true));

    case actionTypes.REGISTER_BUTTON_LOADING:
      return state.set("registerButtonLoading", action.value);

    default:
      return state;
  }
};

export default returnNewStateToStore;
