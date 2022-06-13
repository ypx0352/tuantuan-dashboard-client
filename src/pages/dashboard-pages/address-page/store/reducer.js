import { fromJS } from "immutable";
import { actionTypes } from ".";

const defaultState = fromJS({
  allAddress: [],
  addFormDisplayed: false,
  tableSpinning: false,
  showModal: false,
});

const returnNewStateToStore = (state = defaultState, action) => {
  switch (action.type) {
    case actionTypes.SHOW_ADD_FORM:
      return state.set("addFormDisplayed", action.value);

    case actionTypes.INITIALIZE_ADDRESS:
      return state.set("allAddress", action.value);

    case actionTypes.TABLE_SPINNING:
      return state.set("tableSpinning", action.value);

    case actionTypes.SHOW_MODAL:
      return state.set("showModal", action.value);

    default:
      return state;
  }
};

export default returnNewStateToStore;
