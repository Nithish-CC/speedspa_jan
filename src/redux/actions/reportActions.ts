import {
  LOADING_UI,
  CLEAR_ERRORS,
  LOADING_CLEAR,
  SET_TOTAL_SALES,
  SET_THIRTY_DAY_SNAPSHOT,
  SET_REPORT_TOTAL_SALES,
  SET_REPORT_ESTIMATED_PAYROLL,
  SET_REPORT_SERVICES_COMPLETED,
  SET_REPORT_PRODUCT_SALES,
  SET_REPORT_CLIENT_REPORT,
  SET_STAFF_BOOKING_ANALYSIS,
  BUTTON_LOADING,
  SET_REPORT_CLIENT_REBOOKINGS,
  SET_PRODUCT_ORDER,
  SET_DASHBOARD_CHART,
  SET_SERVICE_ORDER,
} from "../types";
import axios from "axios";

export const getTodayTodaySales = (params: any) => (dispatch: any) => {
  dispatch({ type: LOADING_UI });
  axios
    .get(`/reports/total_sales`, { params })
    .then((res) => {
      dispatch({
        type: SET_TOTAL_SALES,
        payload: res.data[0],
      });
      dispatch({ type: CLEAR_ERRORS });
    })
    .catch((err) => {
      console.log(err);
    });
};

export const getThirtyDaySnapshot = (params: any) => (dispatch: any) => {
  dispatch({ type: LOADING_UI });
  axios
    .get(`/reports/thirty_day_snapshot`, { params })
    .then((res) => {
      dispatch({
        type: SET_THIRTY_DAY_SNAPSHOT,
        payload: res.data[0],
      });
      dispatch({ type: CLEAR_ERRORS });
    })
    .catch((err) => {
      console.log(err);
    });
};

export const searchTotalSales = (params: any) => (dispatch: any) => {
  dispatch({ type: BUTTON_LOADING });
  axios
    .get(`/reports/total_sales`, { params })
    .then((res) => {
      dispatch({
        type: SET_REPORT_TOTAL_SALES,
        payload: res.data,
      });
      dispatch({ type: LOADING_CLEAR });
      dispatch({ type: CLEAR_ERRORS });
    })
    .catch((err) => {
      console.log(err);
    });
};

export const searchEstimatedPayroll = (params: any) => (dispatch: any) => {
  dispatch({ type: BUTTON_LOADING });
  axios
    .get(`/reports/estimated_payroll`, { params })
    .then((res) => {
      dispatch({
        type: SET_REPORT_ESTIMATED_PAYROLL,
        payload: res.data,
      });
      dispatch({ type: LOADING_CLEAR });
      dispatch({ type: CLEAR_ERRORS });
    })
    .catch((err) => {
      console.log(err);
    });
};

export const searchServiceCompleted = (params: any) => (dispatch: any) => {
  dispatch({ type: BUTTON_LOADING });
  axios
    .get(`/reports/services_completed`, { params })
    .then((res) => {
      dispatch({
        type: SET_REPORT_SERVICES_COMPLETED,
        payload: res.data,
      });
      dispatch({ type: LOADING_CLEAR });
      dispatch({ type: CLEAR_ERRORS });
    })
    .catch((err) => {
      console.log(err);
    });
};

export const setDashboardChart = (params: any) => (dispatch: any) => {
  dispatch({ type: BUTTON_LOADING });
  axios
    .get(`/reports/dashboard_chart`, { params })
    .then((res) => {
      dispatch({
        type: SET_DASHBOARD_CHART,
        payload: res.data,
      });
      dispatch({ type: LOADING_CLEAR });
      dispatch({ type: CLEAR_ERRORS });
    })
    .catch((err) => {
      console.log(err);
    });
};

export const searchProductSales = (params: any) => (dispatch: any) => {
  dispatch({ type: BUTTON_LOADING });
  axios
    .get(`/reports/product_sales`, { params })
    .then((res) => {
      dispatch({
        type: SET_REPORT_PRODUCT_SALES,
        payload: res.data,
      });
      dispatch({ type: LOADING_CLEAR });
      dispatch({ type: CLEAR_ERRORS });
    })
    .catch((err) => {
      console.log(err);
    });
};

export const searchClientReport = (params: any) => (dispatch: any) => {
  dispatch({ type: BUTTON_LOADING });
  axios
    .get(`/reports/client_reports`, { params })
    .then((res) => {
      dispatch({
        type: SET_REPORT_CLIENT_REPORT,
        payload: res.data,
      });
      dispatch({ type: LOADING_CLEAR });
      dispatch({ type: CLEAR_ERRORS });
    })
    .catch((err) => {
      console.log(err);
    });
};

export const searchStaffBookingAnalysis = (params: any) => (dispatch: any) => {
  dispatch({ type: BUTTON_LOADING });
  axios
    .get(`/reports/staff_booking_analysis_reports`, { params })
    .then((res) => {
      dispatch({
        type: SET_STAFF_BOOKING_ANALYSIS,
        payload: res.data,
      });
      dispatch({ type: LOADING_CLEAR });
      dispatch({ type: CLEAR_ERRORS });
    })
    .catch((err) => {
      console.log(err);
    });
};

export const getproductOrders = (params: any) => (dispatch: any) => {
  dispatch({ type: BUTTON_LOADING });
  axios
    .get(`/reports/orders`, { params })
    .then((res) => {
      dispatch({
        type: SET_PRODUCT_ORDER,
        payload: res.data.data,
      });
      console.log(res.data.data);

      dispatch({ type: LOADING_CLEAR });
      dispatch({ type: CLEAR_ERRORS });
    })
    .catch((err) => {
      console.log(err);
      dispatch({ type: LOADING_CLEAR });
    });
};

export const getServiceOrders = (id: any, params: any) => (dispatch: any) => {
  dispatch({ type: BUTTON_LOADING });
  axios
    .get(`/reports/orders/${id}`, { params })
    .then((res) => {
      dispatch({
        type: SET_SERVICE_ORDER,
        payload: res.data,
      });
      dispatch({ type: LOADING_CLEAR });
      dispatch({ type: CLEAR_ERRORS });
    })
    .catch((err) => {
      console.log(err);
      dispatch({ type: LOADING_CLEAR });
    });
};

export const getData = (params: any) => (dispatch: any) => {
  dispatch({ type: BUTTON_LOADING });
  axios
    .get(`/reports/new_client_report`, { params })
    .then((res) => {
      dispatch({
        type: SET_REPORT_CLIENT_REBOOKINGS,
        payload: res.data[0].data,
      });
      dispatch({ type: LOADING_CLEAR });
      dispatch({ type: CLEAR_ERRORS });
    })
    .catch((err) => {
      console.log(err);
    });
};
