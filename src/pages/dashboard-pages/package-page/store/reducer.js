import { fromJS } from "immutable";
import { actionTypes } from ".";

const defaultState = fromJS({
  tableData: {
    packageData: [],
    reveiverData: [],
    itemData: [],
    trackData: [],
  },
  tablesDisplayed: false,
  tableSpinning: false,
  latestPackagesSpinning: false,
  latestPackages: [],
  pdfLoading: false,
});

const returnNewStateToStore = (state = defaultState, action) => {
  switch (action.type) {
    case actionTypes.SET_TABLE_DATA:
      return state.set("tableData", action.value);

    case actionTypes.SHOW_TABLES:
      return state.set("tablesDisplayed", action.value);

    case actionTypes.SET_TABLE_SPINNING:
      return state.set("tableSpinning", action.value);

    case actionTypes.LATEST_PACKAGES:
      return state.set("latestPackages", action.value);

    case actionTypes.LATEST_PACKAGES_SPINNING:
      return state.set("latestPackagesSpinning", action.value);

    case actionTypes.PDF_LOADING:
      return state.set("pdfLoading", action.value);
    default:
      return state;
  }
};

export default returnNewStateToStore;
