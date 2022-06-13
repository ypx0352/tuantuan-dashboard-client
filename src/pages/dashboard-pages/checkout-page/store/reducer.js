import { fromJS } from "immutable";
import { actionTypes } from ".";

const defaultState = fromJS({
  allItems: {
    soldItems: [],
    stockItems: [],
    employeeItems: [],
    exceptionItems: [],
  },
  itemsCount: {
    soldCount: null,
    stockCount: null,
    employeeCount: null,
    exceptionCount: null,
    allCount: null,
  },
  countSpinning: false,
  blockSelected: "All",
  showModal: false,
});

const returnNewStateToStore = (state = defaultState, action) => {
  switch (action.type) {
    case actionTypes.COUNT_SPINNING:
      return state.set("countSpinning", action.value);

    case actionTypes.SET_ALL_ITEMS:
      return state.set("allItems", action.value);

    case actionTypes.SET_ITEMS_COUNT:
      return state.set("itemsCount", action.value);

    case actionTypes.BLOCK_SELECTED:
      return state.set("blockSelected", action.value);

    case actionTypes.SHOW_MODAL:
      return state.set("showModal", action.value);

    default:
      return state;
  }
};

export default returnNewStateToStore;
