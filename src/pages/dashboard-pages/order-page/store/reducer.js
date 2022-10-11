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
  adultFormula3Postage: null,
  adultFormula6Postage: null,
  otherItemPostage:null,
  showExistMessage: false,
  receivers: null,
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
        adultFormula3Postage: action.value.get("adultFormula3Postage"),
        adultFormula6Postage: action.value.get("adultFormula6Postage"),
        otherItemPostage:action.value.get("otherItemPostage"),
        exchangeRateInSetting: action.value.get("exchangeRateInSetting"),
      });

    case actionTypes.SHOW_EXIST_MESSAGE:
      return state.set("showExistMessage", action.value);

    case actionTypes.MODIFY_ORIGINAL_ORDER:
      return state.set("originalOrder", action.value);

    case actionTypes.GET_RECEIVERS:
      return state.set("receivers", action.value);

    case actionTypes.SET_RECEIVER_BY_SELECTION:
      const newOriginalOrder = state.get("originalOrder").toJS();
      newOriginalOrder.receiver_name = action.value.get("name");
      newOriginalOrder.receiver_phone = action.value.get("phone");
      newOriginalOrder.receiver_address = action.value.get("address");
      return state.set("originalOrder", fromJS(newOriginalOrder));

    default:
      return state;
  }
};

export default returnNewStateToStore;
