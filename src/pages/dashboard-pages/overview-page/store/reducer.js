import { fromJS } from "immutable";
import { actionTypes } from ".";

const defaultState = fromJS({
  todosSpinning: true,
  todosData: {
    pendingTransaction: { count: 0 },
    pendingException: { count: 0 },
    stockItem: { count: 0 },
    newItem: { count: 0 },
  },
});

const returnNewStateToStore = (state = defaultState, action) => {
  switch (action.type) {
    case actionTypes.TODOS_SPINNING:
      return state.set("todosSpinning", action.value);
    case actionTypes.SET_TODOS_DATA:
      return state.set("todosData", action.value);

    default:
      return state;
  }
};

export default returnNewStateToStore;
