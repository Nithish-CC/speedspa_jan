import {
  SET_USER,
  SET_ERRORS,
  LOADING_UI,
  CLEAR_ERRORS,
  SET_UNAUTHENTICATED,
  SET_PAYEMENT_CARD,
  BUTTON_LOADING,
  LOADING_CLEAR,
} from "../types";
import axios from "axios";

export const loginUser = (userData: any, history: any) => (dispatch: any) => {
  dispatch({ type: LOADING_UI });
  axios
    .post("auth/email", userData)
    .then((res) => {
      const token = `Bearer ${res.data.token}`;
      localStorage.setItem("token", `Bearer ${res.data.token}`);
      localStorage.setItem("userId", `${res.data.id}`);
      axios.defaults.headers.common.Authorization = token;
      dispatch(getUserData());
      dispatch({ type: CLEAR_ERRORS });
    })
    .catch((err) => {
      dispatch({
        type: SET_ERRORS,
        payload: err.response.data,
      });
    });
};

export const getUserData = () => (dispatch: any) => {
  const userId = localStorage.getItem("userId");
  axios
    .get(`/users/${userId}`)
    .then((res) => {
      localStorage.setItem("userDetails", `${JSON.stringify(res.data)}`);
      dispatch({
        type: SET_USER,
        payload: res.data,
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

export const logoutUser = () => (dispatch: any) => {
  localStorage.clear();
  delete axios.defaults.headers.common.Authorization;
  delete axios.defaults.headers.common["x-mothership-key"];
  dispatch({
    type: SET_UNAUTHENTICATED,
  });
};

//Payment with card for product -> orders
export const getPaymentCC = (clientId: any, params: any) => (dispatch: any) => {
  axios
    .get(`users/${clientId}/cards`, { params })
    .then((res) => {
      dispatch({
        type: SET_PAYEMENT_CARD,
        payload: res.data,
      });
      dispatch({ type: CLEAR_ERRORS });
    })
    .catch((err) => {
      console.log(err);
    });
};

export const makePaymentCC =
  (params: any, callback: any) => (dispatch: any) => {
    dispatch({ type: BUTTON_LOADING });
    axios
      .post("/merchant/payment", params)
      .then((res) => {
        const id = res.data;
        callback(true, id);
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

export const refundPayment = (params: any, history: any) => (dispatch: any) => {
  dispatch({ type: BUTTON_LOADING });
  axios
    .post("/merchant/void", params)
    .then((res) => {
      history.push("/products/orders");
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
