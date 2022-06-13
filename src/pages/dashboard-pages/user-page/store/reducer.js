import { fromJS } from "immutable";
import {actionTypes} from '.'

const defaultState = fromJS({
  userInfo: {},
});

const returnNewStateToStore = (state = defaultState, action) => {
  switch (action.type) {
    case actionTypes.USER_INFO:
      return state.set("userInfo", action.value);
    default:
      return state;
  }
};

export default returnNewStateToStore;
