import {
  SET_USER,
  SET_AUTHENTICATED,
  SET_UNAUTHENTICATED,
  LOADING_USER,
  SET_CLIENTS,
  SET_CLIENT,
  SET_STAFFS,
  SET_STAFF,
  SET_STAFF_RESOURCES,
  SET_STAFF_RESPONSE_DATA,
  SET_PAYEMENT_CARD,
  SET_STYLIST,
  SET_STAFF_SERVICE,
} from "../types";

export type State = Readonly<{
  authenticated: boolean;
  credentials: object;
  loading: boolean;
  allClients: [];
  clientInfo: object;
  allStaff: [];
  allStylist: [];
  staffInfo: object;
  resourcesServices: [];
  staffResponseData: [];
  paywithCC: object;
  staffService: [];
}>;

const initialState: State = {
  authenticated: false,
  credentials: {},
  loading: false,
  allClients: [],
  clientInfo: {},
  allStaff: [],
  allStylist: [],
  staffInfo: {},
  resourcesServices: [],
  staffResponseData: [],
  paywithCC: {},
  staffService: [],
};

export default function userReducers(state = initialState, action: any) {
  switch (action.type) {
    case SET_AUTHENTICATED:
      return {
        ...state,
        authenticated: true,
      };
    case SET_UNAUTHENTICATED:
      return initialState;
    case SET_USER:
      return {
        ...state,
        authenticated: true,
        loading: false,
        credentials: action.payload,
      };
    case LOADING_USER:
      return {
        ...state,
        loading: true,
      };
    case SET_CLIENTS:
      return {
        ...state,
        allClients: _.orderBy(action.payload, ["createdAt"], ["desc"]),
      };
    case SET_CLIENT:
      return {
        ...state,
        clientInfo: action.payload,
      };
    case SET_STAFFS:
      return {
        ...state,
        allStaff: _.orderBy(action.payload, ["createdAt"], ["desc"]),
      };
    case SET_STAFF:
      return {
        ...state,
        staffInfo: action.payload,
      };
    case SET_STYLIST:
      return {
        ...state,
        allStylist: action.payload,
      };
    case SET_STAFF_RESOURCES:
      return {
        ...state,
        resourcesServices: action.payload,
      };
    case SET_STAFF_RESPONSE_DATA:
      return {
        ...state,
        staffResponseData: action.payload,
      };
    case SET_PAYEMENT_CARD:
      return {
        ...state,
        paywithCC: action.payload,
      };
    case SET_STAFF_SERVICE:
      return {
        ...state,
        staffService: action.payload,
      };
    default:
      return state;
  }
}
