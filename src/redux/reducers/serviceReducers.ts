import {
  SET_SERVICE_CATEGORIES,
  SET_SERVICE_ORDERS,
  SET_SERVICES,
  SET_ROOT_SERVICE_CATEGORIES,
  SET_SERVICE_CATEGORY,
  SET_SERVICE_DATA,
  SET_SERVICE_SERVICE_DATA,
} from "../types";

export type State = Readonly<{
  categoryDetails: object;
  serviceDetails: [];
  orderDetails: object;
  getRootServiceCategory: object;
  serviceCategory: [];
  getAllStaffResources: [];
  getServiceServiceData: Object;
}>;

const initialState: State = {
  categoryDetails: {},
  serviceDetails: [],
  orderDetails: {},
  getRootServiceCategory: {},
  serviceCategory: [],
  getAllStaffResources: [],
  getServiceServiceData: {},
};

export default function serviceReducers(state = initialState, action: any) {
  switch (action.type) {
    case SET_SERVICE_CATEGORIES:
      return {
        ...state,
        categoryDetails: action.payload,
      };
    case SET_SERVICE_ORDERS:
      return {
        ...state,
        orderDetails: _.orderBy(action.payload.data,["appTimeStart"],["desc"]),
      };
    case SET_SERVICES:
      return {
        ...state,
        serviceDetails: _.orderBy(action.payload, ["name"], ["asc"]),
      };
    case SET_ROOT_SERVICE_CATEGORIES:
      return {
        ...state,
        getRootServiceCategory: action.payload,
      };
    case SET_SERVICE_CATEGORY:
      return {
        ...state,
        serviceCategory: action.payload,
      };
    case SET_SERVICE_DATA:
      return {
        ...state,
        getAllStaffResources: action.payload,
      };
    case SET_SERVICE_SERVICE_DATA:
      return {
        ...state,
        getServiceServiceData: action.payload,
      };
    default:
      return state;
  }
}
