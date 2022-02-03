import {
  SET_TOTAL_SALES,
  SET_REPORT_CLIENT_REBOOKINGS,
  SET_THIRTY_DAY_SNAPSHOT,
  SET_REPORT_TOTAL_SALES,
  SET_REPORT_ESTIMATED_PAYROLL,
  SET_REPORT_SERVICES_COMPLETED,
  SET_REPORT_PRODUCT_SALES,
  SET_REPORT_CLIENT_REPORT,
  SET_STAFF_BOOKING_ANALYSIS,
  SET_PRODUCT_ORDER,
  SET_SERVICE_ORDER,
  SET_DASHBOARD_CHART,
} from "../types";

export type State = Readonly<{
  totalSales: object;
  thirtyDaySnapshot: object;
  reportTotalSales: [];
  reportEstimatedRoll: [];
  reportServiceCompleted: [];
  reportProductSales: [];
  reportClientReport: [];
  reportStaffBookingAnalysis: [];
  getproductOrders: [];
  getNewClientRebookingData: [];
  getServiceOrders: {};
  dashboardChart: [];
}>;

const initialState: State = {
  totalSales: {},
  thirtyDaySnapshot: {},
  reportTotalSales: [],
  reportEstimatedRoll: [],
  reportServiceCompleted: [],
  reportProductSales: [],
  reportClientReport: [],
  reportStaffBookingAnalysis: [],
  getproductOrders: [],
  getNewClientRebookingData: [],
  getServiceOrders: {},
  dashboardChart: [],
};

export default function reportReducers(state = initialState, action: any) {
  switch (action.type) {
    case SET_TOTAL_SALES:
      return {
        ...state,
        totalSales: action.payload,
      };
    case SET_THIRTY_DAY_SNAPSHOT:
      return {
        ...state,
        thirtyDaySnapshot: action.payload,
      };
    case SET_REPORT_TOTAL_SALES:
      return {
        ...state,
        reportTotalSales: action.payload,
      };
    case SET_REPORT_ESTIMATED_PAYROLL:
      return {
        ...state,
        reportEstimatedRoll: action.payload,
      };
    case SET_REPORT_SERVICES_COMPLETED:
      return {
        ...state,
        reportServiceCompleted: action.payload,
      };
    case SET_REPORT_PRODUCT_SALES:
      console.log(
        _.orderBy(action.payload[0].data, ["inverntoryValue"], ["desc"])
      );

      return {
        ...state,
        reportProductSales: action.payload[0].data,
      };
    case SET_REPORT_CLIENT_REPORT:
      return {
        ...state,
        reportClientReport: _.orderBy(
          action.payload,
          ["totalGrossServiceRevenue"],
          ["desc"]
        ),
      };
    case SET_STAFF_BOOKING_ANALYSIS:
      return {
        ...state,
        reportStaffBookingAnalysis: action.payload,
      };
    case SET_REPORT_CLIENT_REBOOKINGS:
      return {
        ...state,
        getNewClientRebookingData: action.payload,
      };
    case SET_PRODUCT_ORDER:
      return {
        ...state,
        getproductOrders: _.orderBy(action.payload, ["createdAt"], ["desc"]),
      };
    case SET_SERVICE_ORDER:
      return {
        ...state,
        getServiceOrders: action.payload,
      };
    case SET_DASHBOARD_CHART:
      return {
        ...state,
        dashboardChart: action.payload,
      };
    default:
      return state;
  }
}
