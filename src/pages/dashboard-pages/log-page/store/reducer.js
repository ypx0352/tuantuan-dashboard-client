import { fromJS } from "immutable";
import { actionTypes } from ".";

const defaultState = fromJS({ allLogs: [], tableSpinning: false });

const returnNewStateToStore = (state = defaultState, action) => {
  switch (action.type) {
    case actionTypes.ALL_LOGS:
      return state.set("allLogs", action.value);

    case actionTypes.TABLE_SPINNING:
      return state.set("tableSpinning", action.value);

    default:
      return state;
  }
};

export default returnNewStateToStore;
