import { fromJS } from "immutable";
import { actionTypes } from ".";

const defaultState = fromJS({
  allTransactions: [],
  tableLoading: true,
  approvedButtonLoading:false
});

const returnNewStateToStore = (state = defaultState, action) => {
  switch (action.type) {
    case actionTypes.SET_ALL_TRANSACTIONS:
      return state.set("allTransactions", action.value);

    case actionTypes.TABLE_LOADING:
      return state.set("tableLoading", action.value);

      case actionTypes.APPROVED_BUTTON_LOADING:
        return state.set('approvedButtonLoading',action.value)

    default:
      return state;
  }
};

export default returnNewStateToStore;
