import {
  SET_ERRORS,
  BUTTON_LOADING,
  LOADING_CLEAR,
  SET_URL,
  CLEAR_ERRORS,
} from "../types";
import axios from "axios";

export const sendMessage =
  (params: any, callback: (args: any) => void) => (dispatch: any) => {
    dispatch({ type: BUTTON_LOADING });
    axios
      .post("/messages", params)
      .then((res) => {
        callback(true);
        dispatch({ type: LOADING_CLEAR });
      })
      .catch((err) => {
        callback(false);
        dispatch({
          type: SET_ERRORS,
          payload: err.response.data,
        });
        dispatch({ type: LOADING_CLEAR });
      });
  };

export const createURL = (params: any) => (dispatch: any) => {
  axios
    .get(
      `https://api-ssl.bitly.com/v3/shorten?access_token=301828a24a8d2084cee1947d805eb537e578e915&longUrl=https://promotions-prod.speedspa.io/promotion.html?img=${params}`
    )
    .then((res) => {
      dispatch({
        type: SET_URL,
        payload: res.data,
      });
      dispatch({ type: CLEAR_ERRORS });
    })
    .catch((err) => {
      console.log(err);
    });
};
