import { fromJS } from "immutable";
import { actionTypes } from ".";

const defaultState = fromJS({
  settingValueFetched: false,
});

const returnNewStateToStore = (state = defaultState, action) => {
  switch (action.type) {
    case actionTypes.SETTING_VALUE_FETCHED:
      return state.set("settingValueFetched", action.value);
    default:
      return state;
  }
};

export default returnNewStateToStore;
