import { fromJS } from "immutable";
import { actionTypes } from ".";

const defaultState = fromJS({
  originalOrder: {
    package_id: "",
    package_weight: "",
    receiver_name: "",
    receiver_phone: "",
    receiver_address: "",
    item_count: "",
    item_type: "",
    items: [],
  },
  spinning: false,
  exchangeRate: "",
  exchangeRateSpinning: false,
  showReview: false,
  reviewData: {
    pk_id: "",
    sold: [],
    stock: [],
    employee: [],
  },
  submitLoading: false,
  showSubmitResultDialog: false,
  submitResult: { title: "Result", msg: "Loading" },
  normalPostage: null,
  babyFormulaPostage: null,
  exchangeRateInSetting: null,
  showExistMessage: false,
});

const returnNewStateToStore = (state = defaultState, action) => {
  switch (action.type) {
    case actionTypes.INITIAL_ORDER:
      return state.set("originalOrder", action.value);

    case actionTypes.SPINNING:
      return state.set("spinning", action.value);

    case actionTypes.RESET_ORDER:
      return state.set("originalOrder", defaultState.get("originalOrder"));

    case actionTypes.EXCHANGE_RATE:
      return state.set("exchangeRate", action.value);

    case actionTypes.EXCHANGE_RATE_SPINNING:
      return state.set("exchangeRateSpinning", action.value);

    case actionTypes.SHOW_REVIEW:
      return state.set("showReview", action.value);
    
    case actionTypes.REVIEW_DATA:
      return state.set("reviewData", action.value);

    case actionTypes.SUBMIT_LOADING:
      return state.set("submitLoading", action.value);

    case actionTypes.SHOW_SUBMIT_RESULT_DIALOG:
      return state.set("showSubmitResultDialog", action.value);

    case actionTypes.RESET_ORDER_STORE:
      const newState = defaultState.toJS();
      newState.exchangeRate = state.get("exchangeRate");
      return fromJS(newState);

    case actionTypes.SUBMIT_RESULT:
      return state.set("submitResult", action.value);

    case actionTypes.INITIAL_SETTINGS:
      return state.merge({
        normalPostage: action.value.get("normalPostage"),
        babyFormulaPostage: action.value.get("babyFormulaPostage"),
        exchangeRateInSetting: action.value.get("exchangeRateInSetting"),
      });

    case actionTypes.SHOW_EXIST_MESSAGE:
      return state.set("showExistMessage", action.value);

    default:
      return state;
  }
};

export default returnNewStateToStore;
