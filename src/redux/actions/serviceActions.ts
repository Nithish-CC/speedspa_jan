import {
  LOADING_UI,
  CLEAR_ERRORS,
  BUTTON_LOADING,
  LOADING_CLEAR,
  SET_ERRORS,
  SET_SERVICE_CATEGORIES,
  SET_SERVICE_CATEGORY,
  SET_SERVICE_ORDERS,
  SET_SERVICES,
  SET_ROOT_SERVICE_CATEGORIES,
  SET_SERVICE_DATA,
  SET_SERVICE_SERVICE_DATA,
} from "../types";
import axios from "axios";

// category
export const getAllCategory = (params: any) => (dispatch: any) => {
  dispatch({ type: LOADING_UI });
  axios
    .get(`/categories?`, { params })
    .then((res) => {
      const plainCategories: any = [];
      let productCategories = categoriesToPlain(res.data, plainCategories, 0);
      dispatch({
        type: SET_SERVICE_CATEGORIES,
        payload: productCategories,
      });
      dispatch({ type: CLEAR_ERRORS });
    })
    .catch((err) => {
      console.log(err);
    });
};

const categoriesToPlain = (
  categories: any,
  plainCategories: any,
  level: any
) => {
  categories.forEach((value: any) => {
    var pre = "";
    var i = 1;
    if (level > 0)
      while (i <= level) {
        pre = pre + "- ";
        i++;
      }
    var parent = {
      id: value.id,
      originalNam: value.name,
      name: pre + value.name,
      description: value.description,
      seats: value.seats,
      parentId: value.parentId,
      rootCategoryId: value.rootCategoryId,
      order: value.order,
      resourcesStrategy: value.resourcesStrategy,
      resourcesIds: value.resourcesIds,
    };
    plainCategories.push(parent);
    if (value.subcategories) {
      var nLevel = level + 1;
      categoriesToPlain(value.subcategories, plainCategories, nLevel);
    }
  });
  return plainCategories;
};

export const deleteServiceCategories =
  (productId: any, params: any) => (dispatch: any) => {
    axios
      .delete(`/categories/${productId}`, { params })
      .then((res) => {})
      .catch((err) => {
        console.log(err);
      });
  };

export const addServiceCategory =
  (params: any, history: any) => (dispatch: any) => {
    dispatch({ type: BUTTON_LOADING });
    axios
      .post("/categories", params)
      .then((res) => {
        history.push("/services/categories");
        dispatch({ type: LOADING_CLEAR });
      })
      .catch((err) => {
        dispatch({
          type: SET_ERRORS,
          payload: err.response.data,
        });
        dispatch({ type: LOADING_CLEAR });
      });
  };

export const getServiceCategory =
  (serviceCategoryId: any, params: any) => (dispatch: any) => {
    dispatch({ type: LOADING_UI });
    axios
      .get(`categories/${serviceCategoryId}`, { params })
      .then((res) => {
        dispatch({
          type: SET_SERVICE_CATEGORY,
          payload: res.data,
        });
        dispatch({ type: CLEAR_ERRORS });
      })
      .catch((err) => {
        console.log(err);
      });
  };

export const updateServiceCategory =
  (params: any, history: any, props: any) => (dispatch: any) => {
    dispatch({ type: BUTTON_LOADING });
    axios
      .put(`categories/${params.id}`, params)
      .then((res) => {
        history.push("/services/categories");
        dispatch({ type: LOADING_CLEAR });
      })
      .catch((err) => {
        dispatch({
          type: SET_ERRORS,
          payload: err.response.data,
        });
        dispatch({ type: LOADING_CLEAR });
      });
  };

// service
export const getAllService = (params: any) => (dispatch: any) => {
  axios.defaults.headers.common["x-populate"] = "categoryId";
  dispatch({ type: LOADING_UI });
  axios
    .get(`/services`, { params })
    .then((res) => {
      dispatch({
        type: SET_SERVICES,
        payload: res.data,
      });
      dispatch({ type: CLEAR_ERRORS });
      delete axios.defaults.headers.common["x-populate"];
    })
    .catch((err) => {
      console.log(err);
    });
};

export const addServiceOfService =
  (params: any, history: any) => (dispatch: any) => {
    dispatch({ type: BUTTON_LOADING });
    axios
      .post("/services", params)
      .then((res) => {
        history.push("/services");
        dispatch({ type: LOADING_CLEAR });
      })
      .catch((err) => {
        dispatch({
          type: SET_ERRORS,
          payload: err.response.data,
        });
        dispatch({ type: LOADING_CLEAR });
      });
  };

export const searchService = (params: any) => (dispatch: any) => {
  dispatch({ type: LOADING_UI });
  axios
    .get(`/services`, { params })
    .then((res) => {
      dispatch({
        type: SET_SERVICES,
        payload: res.data,
      });
      dispatch({ type: CLEAR_ERRORS });
    })
    .catch((err) => {
      console.log(err);
    });
};

export const deleteService =
  (serviceId: any, params: any) => (dispatch: any) => {
    axios
      .delete(`/services/${serviceId}`, { params })
      .then((res) => {})
      .catch((err) => {
        console.log(err);
      });
  };

export const deleteAddCost = (params: any) => (dispatch: any) => {
  axios
    .post(`/variations`, params)
    .then((res) => {
      console.log("success");
    })
    .catch((err) => {
      console.log(err);
    });
};

export const serviceAddCost = (params: any) => (dispatch: any) => {
  dispatch({ type: BUTTON_LOADING });
  axios
    .post(`/variations`, params)
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

export const serviceUpdateService =
  (params: any, history: any) => (dispatch: any) => {
    dispatch({ type: BUTTON_LOADING });
    axios
      .patch(`/services/${params.id}`, params)
      .then((res) => {
        history.push("/services");
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

export const serviceUpdateAddCost = (params: any) => (dispatch: any) => {
  dispatch({ type: BUTTON_LOADING });
  axios
    .post(`/variations`, params)
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

// order
export const getAllOrder = (params: any) => (dispatch: any) => {
  dispatch({ type: BUTTON_LOADING });
  axios
    .get(`/reports/orders?`, { params })
    .then((res) => {
      dispatch({
        type: SET_SERVICE_ORDERS,
        payload: res.data,
      });
      dispatch({ type: CLEAR_ERRORS });
      dispatch({ type: LOADING_CLEAR });
    })
    .catch((err) => {
      console.log(err);
    });
};

export const searchOrder = (params: any) => (dispatch: any) => {
  dispatch({ type: LOADING_UI });
  axios
    .get(`/services`, { params })
    .then((res) => {
      dispatch({
        type: SET_SERVICE_ORDERS,
        payload: res.data,
      });
      dispatch({ type: CLEAR_ERRORS });
    })
    .catch((err) => {
      console.log(err);
    });
};

export const searchServiceService =
  (serviceId: any, params: any) => (dispatch: any) => {
    dispatch({ type: LOADING_UI });
    axios
      .get(`/services/${serviceId}`, { params })
      .then((res) => {
        dispatch({
          type: SET_SERVICE_SERVICE_DATA,
          payload: res.data,
        });
        dispatch({ type: CLEAR_ERRORS });
      })
      .catch((err) => {
        console.log(err);
      });
  };

export const deleteOrder = (clientId: any, params: any) => (dispatch: any) => {
  axios
    .delete(`/users/${clientId}`, { params })
    .then((res) => {})
    .catch((err) => {
      console.log(err);
    });
};

export const getRootServiceCategory = (params: any) => (dispatch: any) => {
  dispatch({ type: LOADING_UI });
  axios
    .get(`/categories`, { params })
    .then((res) => {
      dispatch({
        type: SET_ROOT_SERVICE_CATEGORIES,
        payload: res.data,
      });
      dispatch({ type: CLEAR_ERRORS });
    })
    .catch((err) => {
      console.log(err);
    });
};

//staff add resources
export const getAllStaffResources = (params: any) => (dispatch: any) => {
  dispatch({ type: LOADING_UI });
  axios
    .get(`/categories?`, { params })
    .then((res) => {
      dispatch({
        type: SET_SERVICE_DATA,
        payload: res.data,
      });
      dispatch({ type: CLEAR_ERRORS });
    })
    .catch((err) => {
      console.log(err);
    });
};

//adding staff resource
export const addStaffCategory =
  (profileId: any, params: any, history: any) => (dispatch: any) => {
    dispatch({ type: BUTTON_LOADING });
    axios
      .patch(`/categories/${profileId}`, params)
      .then((res) => {
        history.push("/staff");
        dispatch({ type: LOADING_CLEAR });
      })
      .catch((err) => {
        console.log(err);
      });
    dispatch({ type: LOADING_CLEAR });
  };

//update staff resource
export const updateStaffServiceResource =
  (params: any, history: any, props: any) => (dispatch: any) => {
    dispatch({ type: BUTTON_LOADING });
    axios
      .patch(`categories/${params.id}`, params)
      .then((res) => {
        history.push("/staff");

        dispatch({ type: LOADING_CLEAR });
      })
      .catch((err) => {
        dispatch({
          type: SET_ERRORS,
          payload: err.response.data,
        });
        dispatch({ type: LOADING_CLEAR });
      });
  };

//update Services Order Details
export const updateServiceOrder =
  (params: any, callback: any) => (dispatch: any) => {
    axios.defaults.headers.common["x-populate"] = "clientId,serviceId";
    dispatch({ type: BUTTON_LOADING });
    axios
      .post("/orders/update/order", params)
      .then((res) => {
        const key = res.data;
        callback(true, key);
        dispatch({ type: LOADING_CLEAR });
        delete axios.defaults.headers.common["x-populate"];
      })
      .catch((err) => {
        dispatch({
          type: SET_ERRORS,
          payload: err.response.data,
        });
        dispatch({ type: LOADING_CLEAR });
      });
  };
