import {
  TIME_SLOTS,
  SCHEDUELES,
  BUTTON_LOADING,
  CLEAR_ERRORS,
  LOADING_CLEAR,
  SET_ERRORS,
  SET_APPOITNMENT_ORDER,
  SET_APPOITNMENT,
} from "../types";
import axios from "axios";

export const timeSlots = (params: any) => (dispatch: any) => {
  axios.defaults.headers.common["x-populate"] = "clientId,serviceId";
  dispatch({ type: BUTTON_LOADING });
  axios
    .get(`/timeslots`, { params })
    .then((res) => {
      dispatch({
        type: TIME_SLOTS,
        payload: res.data,
      });
      dispatch({ type: LOADING_CLEAR });
      dispatch({ type: CLEAR_ERRORS });
      delete axios.defaults.headers.common["x-populate"];
    })
    .catch((err) => {
      console.log(err);
    });
};

export const schedule = (params: any) => (dispatch: any) => {
  dispatch({ type: BUTTON_LOADING });
  axios
    .get(`/resources/schedules`, { params })
    .then((res) => {
      dispatch({
        type: SCHEDUELES,
        payload: res.data,
      });
      dispatch({ type: LOADING_CLEAR });
      dispatch({ type: CLEAR_ERRORS });
    })
    .catch((err) => {
      console.log(err);
    });
};

export const addSchedule = (params: any) => (dispatch: any) => {
  dispatch({ type: BUTTON_LOADING });
  axios
    .post(`/resources/schedules/generate`, params)
    .then((res) => {
      dispatch({ type: LOADING_CLEAR });
    })
    .catch((err) => {
      dispatch({
        type: SET_ERRORS,
        payload: err.response,
      });
      dispatch({ type: LOADING_CLEAR });
    });
};

export const updateSchedule = (id: any, params: any) => (dispatch: any) => {
  dispatch({ type: BUTTON_LOADING });
  axios
    .patch(`/resources/schedules/${id}`, params)
    .then((res) => {
      dispatch({ type: LOADING_CLEAR });
    })
    .catch((err) => {
      dispatch({
        type: SET_ERRORS,
        payload: err.response,
      });
      dispatch({ type: LOADING_CLEAR });
    });
};

export const deleteSchedule = (id: any, params: any) => (dispatch: any) => {
  dispatch({ type: BUTTON_LOADING });
  axios
    .delete(`/resources/schedules/${id}`, params)
    .then((res) => {
      dispatch({ type: LOADING_CLEAR });
    })
    .catch((err) => {
      dispatch({
        type: SET_ERRORS,
        payload: err.response,
      });
      dispatch({ type: LOADING_CLEAR });
    });
};

export const addAppointments =
  (params: any, query: any, history: any) => (dispatch: any) => {
    axios.defaults.headers.common["x-populate"] = "clientId,resourceId";
    dispatch({ type: BUTTON_LOADING });
    axios
      .post(`/appointments?${query}`, params)
      .then((res) => {
        history.push("/schedule");
        dispatch({ type: LOADING_CLEAR });
        delete axios.defaults.headers.common["x-populate"];
      })
      .catch((err) => {
        console.log(err);
        dispatch({
          type: SET_ERRORS,
          payload: err.response,
        });
        dispatch({ type: LOADING_CLEAR });
      });
  };

export const updateAppointments = (params: any) => (dispatch: any) => {
  axios.defaults.headers.common["x-populate"] = "clientId,resourceId";
  dispatch({ type: BUTTON_LOADING });
  axios
    .post("/appointments/update", params)
    .then((res) => {
      dispatch({ type: LOADING_CLEAR });
      delete axios.defaults.headers.common["x-populate"];
    })
    .catch((err) => {
      dispatch({
        type: SET_ERRORS,
        payload: err.response,
      });
      dispatch({ type: LOADING_CLEAR });
    });
};

export const getAppointment = (id: any, params: any) => (dispatch: any) => {
  axios.defaults.headers.common["x-populate"] = "categoryId,clientId";
  dispatch({ type: BUTTON_LOADING });
  axios
    .get(`appointments/${id}`, { params })
    .then((res) => {
      dispatch({
        type: SET_APPOITNMENT,
        payload: res.data,
      });
      dispatch({ type: LOADING_CLEAR });
      dispatch({ type: CLEAR_ERRORS });
      delete axios.defaults.headers.common["x-populate"];
    })
    .catch((err) => {
      console.log(err);
      dispatch({ type: LOADING_CLEAR });
    });
};

export const deleteAppointment = (id: any, params: any) => (dispatch: any) => {
  dispatch({ type: BUTTON_LOADING });
  axios
    .delete(`appointments/${id}`, { params })
    .then((res) => {
      dispatch({ type: LOADING_CLEAR });
      dispatch({ type: CLEAR_ERRORS });
    })
    .catch((err) => {
      dispatch({ type: LOADING_CLEAR });
    });
};

export const noShowAppointments = (id: any, params: any) => (dispatch: any) => {
  dispatch({ type: BUTTON_LOADING });
  axios
    .delete(`appointments/${id}`, { params })
    .then((res) => {
      dispatch({ type: LOADING_CLEAR });
      dispatch({ type: CLEAR_ERRORS });
    })
    .catch((err) => {
      console.log(err);
      dispatch({ type: LOADING_CLEAR });
    });
};

export const deleteFutureAppointment =
  (id: any, params: any) => (dispatch: any) => {
    dispatch({ type: BUTTON_LOADING });
    axios
      .post("appointments/delete/repeat", params)
      .then((res) => {
        dispatch({ type: LOADING_CLEAR });
        dispatch({ type: CLEAR_ERRORS });
      })
      .catch((err) => {
        console.log(err);
        dispatch({ type: LOADING_CLEAR });
      });
  };

export const getAppointmentOrder =
  (id: any, params: any) => (dispatch: any) => {
    axios.defaults.headers.common["x-populate"] = "categoryId,clientId";
    dispatch({ type: BUTTON_LOADING });
    axios
      .get(`orders/${id}`, { params })
      .then((res) => {
        dispatch({
          type: SET_APPOITNMENT_ORDER,
          payload: res.data,
        });
        dispatch({ type: LOADING_CLEAR });
        dispatch({ type: CLEAR_ERRORS });
        delete axios.defaults.headers.common["x-populate"];
      })
      .catch((err) => {
        console.log(err);
        dispatch({ type: LOADING_CLEAR });
      });
  };
