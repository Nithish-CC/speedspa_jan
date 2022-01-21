import {
  LOADING_UI,
  CLEAR_ERRORS,
  SET_STAFF,
  SET_STAFFS,
  BUTTON_LOADING,
  LOADING_CLEAR,
  SET_ERRORS,
  SET_STAFF_RESOURCES,
  SET_STYLIST,
  SET_STAFF_SERVICE,
} from "../types";
import axios from "axios";
import { toast } from "react-toastify";

export const getAllStaff = (params: any) => (dispatch: any) => {
  dispatch({ type: LOADING_UI });
  axios
    .get(`/users/search?`, { params })
    .then((res) => {
      dispatch({
        type: SET_STAFFS,
        payload: res.data,
      });
      dispatch({ type: CLEAR_ERRORS });
    })
    .catch((err) => {
      console.log(err);
    });
};

export const getAllStylist = (params: any) => (dispatch: any) => {
  dispatch({ type: LOADING_UI });
  axios
    .get(`/users/search?`, { params })
    .then((res) => {
      console.log(res);
      dispatch({
        type: SET_STYLIST,
        payload: res.data,
      });
      dispatch({ type: CLEAR_ERRORS });
    })
    .catch((err) => {
      console.log(err);
    });
};

export const addStaff = (params: any, callback: any) => (dispatch: any) => {
  dispatch({ type: BUTTON_LOADING });
  axios
    .post("users", params)
    .then((res) => {
      if (res.data) {
        const id = res.data.id;
        callback(true, id);
      }
      dispatch({ type: LOADING_CLEAR });
    })
    .catch((err) => {
      callback(false, null);
      toast(err.response.data);
      console.log(err.response.data);
      dispatch({
        type: SET_ERRORS,
        payload: err.response.data,
      });
      dispatch({ type: LOADING_CLEAR });
    });
};

export const updateClient = (params: any, props: any) => (dispatch: any) => {
  dispatch({ type: BUTTON_LOADING });
  axios
    .patch(`users/${params.id}`, params)
    .then((res) => {
      dispatch({ type: LOADING_CLEAR });
    })
    .catch((err) => {
      console.log(err);
      dispatch({
        type: SET_ERRORS,
        payload: err.response.data,
      });
      dispatch({ type: LOADING_CLEAR });
    });
};

export const getStaffDetails =
  (clientId: any, params: any) => (dispatch: any) => {
    dispatch({ type: LOADING_UI });
    axios
      .get(`/users/${clientId}`, { params })
      .then((res) => {
        dispatch({
          type: SET_STAFF,
          payload: res.data,
        });
        dispatch({ type: CLEAR_ERRORS });
      })
      .catch((err) => {
        console.log(err);
      });
  };

export const deleteStaff = (clientId: any, params: any) => (dispatch: any) => {
  axios
    .delete(`/users/${clientId}`, { params })
    .then((res) => {})
    .catch((err) => {
      console.log(err);
    });
};

export const getResourceServices = (params: any) => (dispatch: any) => {
  dispatch({ type: LOADING_UI });
  axios
    .get(`/resourcesServices`, { params })
    .then((res) => {
      dispatch({
        type: SET_STAFF_RESOURCES,
        payload: res.data,
      });
      dispatch({ type: CLEAR_ERRORS });
    })
    .catch((err) => {
      console.log(err);
    });
};

export const addResourceServices = (params: any) => (dispatch: any) => {
  dispatch({ type: BUTTON_LOADING });
  axios
    .post(`/resourcesServices`, params)
    .then((res) => {
      dispatch({ type: LOADING_CLEAR });
    })
    .catch((err) => {
      console.log(err);
      dispatch({
        type: SET_ERRORS,
        payload: err.response.data,
      });
      dispatch({ type: LOADING_CLEAR });
    });
};

export const updateResourceServices = (params: any) => (dispatch: any) => {
  dispatch({ type: BUTTON_LOADING });
  axios
    .patch(`resourcesServices/${params.resourceId}`, params)
    .then((res) => {
      dispatch({ type: LOADING_CLEAR });
    })
    .catch((err) => {
      console.log(err);
      dispatch({
        type: SET_ERRORS,
        payload: err.response.data,
      });
      dispatch({ type: LOADING_CLEAR });
    });
};

export const staffService = (params: any) => (dispatch: any) => {
  dispatch({ type: BUTTON_LOADING });
  axios
    .get(`/staff/services`, { params })
    .then((res) => {
      dispatch({
        type: SET_STAFF_SERVICE,
        payload: res.data,
      });
      dispatch({ type: CLEAR_ERRORS });    
      dispatch({ type: LOADING_CLEAR });  
    })
    .catch((err) => {
      console.log(err);
      dispatch({ type: LOADING_CLEAR });
    });
};

export const uploadImage =
  (imageToSave: any, callback: any) => (dispatch: any) => {
    dispatch({ type: BUTTON_LOADING });
    const config = {
      headers: { "content-type": "multipart/form-data" },
    };
    const url = "http://upload-stage.savantsaloncrm.com/s3/upload";
    axios
      .post(url, imageToSave, config)
      .then((res: any) => {
        if (res.data) {
          const key = res.data.key;
          const url = res.data.url;
          callback(true, key, url);
        }        
        dispatch({ type: LOADING_CLEAR });
      })
      .catch((err) => {
        callback(false, null);
        dispatch({
          type: SET_ERRORS,
          payload: err.response,
        });
        dispatch({ type: LOADING_CLEAR });
      });
  };

export const getImageFile =
  (imageName: any, bussinessId: any, callback: any) => (dispatch: any) => {
    dispatch({ type: BUTTON_LOADING });
    console.log(bussinessId);
    axios
      .get(
        `s3/getFileURL?fileName=${imageName.imageName}&businessId=${bussinessId.bussinessId}`
      )
      .then((res: any) => {
        if (res) {
          const valres = res;
          callback(true, valres);
        }
        dispatch({ type: LOADING_CLEAR });
      })
      .catch((err) => {
        callback(false, null);
        dispatch({
          type: SET_ERRORS,
          payload: err.response,
        });
        dispatch({ type: LOADING_CLEAR });
      });
  };
