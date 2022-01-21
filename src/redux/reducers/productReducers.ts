import {
  SET_PRODUCT_CATEGORIES,
  SET_PRODUCT_CATEGORY,
  SET_PRODUCTS,
  SET_PRODUCT_VIEW,
  SET_PRODUCT_CATEGORIES_DATA,
  SET_PRODUCT_ORDER_DATA,
  SET_PRODUCT_SETTINGS_DATA,
} from "../types";

export type State = Readonly<{
  productCategories: [];
  productCategory: object;
  productDetails: [];
  getProductProductView: object;
  getAllCategories: [];
  ProductOrderView: object;
  getSettings: [];
}>;

const initialState: State = {
  productCategories: [],
  productCategory: {},
  productDetails: [],
  getProductProductView: {},
  getAllCategories: [],
  ProductOrderView: {},
  getSettings: [],
};

export default function productReducers(state = initialState, action: any) {
  switch (action.type) {
    case SET_PRODUCT_CATEGORIES:
      return {
        ...state,
        productCategories: action.payload,
      };
    case SET_PRODUCT_CATEGORIES_DATA:
      return {
        ...state,
        getAllCategories: action.payload,
      };
    case SET_PRODUCT_CATEGORY:
      return {
        ...state,
        productCategory: action.payload,
      };
    case SET_PRODUCTS:
      return {
        ...state,
        productDetails: _.orderBy(action.payload.data, ["name"], ["asc"]),
      };
    case SET_PRODUCT_VIEW:
      return {
        ...state,
        getProductProductView: action.payload,
      };
    case SET_PRODUCT_ORDER_DATA:
      return {
        ...state,
        ProductOrderView: action.payload,
      };
    case SET_PRODUCT_SETTINGS_DATA:
      return {
        ...state,
        getSettings: action.payload,
      };

    default:
      return state;
  }
}
