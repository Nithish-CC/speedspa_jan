import {
  LOADING_UI,
  CLEAR_ERRORS,
  SET_ERRORS,
  BUTTON_LOADING,
  LOADING_CLEAR,
  SET_PRODUCT_CATEGORIES,
  SET_PRODUCT_CATEGORY,
  SET_PRODUCTS,
  SET_PRODUCT_VIEW,
  SET_PRODUCT_CATEGORIES_DATA,
  SET_PRODUCT_ORDER,
  SET_PRODUCT_ORDER_DATA,
  SET_PRODUCT_SETTINGS_DATA,
} from "../types";
import axios from "axios";

export const getAllProductCategories = (params: any) => (dispatch: any) => {
  dispatch({ type: LOADING_UI });
  axios
    .get(`/products_categories`, { params })
    .then((res) => {
      const plainCategories: any = [];
      dispatch({
        type: SET_PRODUCT_CATEGORIES_DATA,
        payload: res.data,
      });
      let productCategories = categoriesToPlain(res.data, plainCategories, 0);
      dispatch({
        type: SET_PRODUCT_CATEGORIES,
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

export const deleteProductCategories =
  (productId: any, params: any) => (dispatch: any) => {
    axios
      .delete(`/products_categories/${productId}`, { params })
      .then((res) => {})
      .catch((err) => {
        console.log(err);
      });
  };

export const addProductCategory =
  (params: any, history: any) => (dispatch: any) => {
    dispatch({ type: BUTTON_LOADING });
    axios
      .post("/products_categories", params)
      .then((res) => {
        history.push("/products/categories");
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

export const getProductCategory =
  (productCategoryId: any, params: any) => (dispatch: any) => {
    dispatch({ type: LOADING_UI });
    axios
      .get(`products_categories/${productCategoryId}`, { params })
      .then((res) => {
        dispatch({
          type: SET_PRODUCT_CATEGORY,
          payload: res.data,
        });
        dispatch({ type: CLEAR_ERRORS });
      })
      .catch((err) => {
        console.log(err);
      });
  };

export const updateProductCategory =
  (params: any, history: any) => (dispatch: any) => {
    dispatch({ type: BUTTON_LOADING });
    axios
      .put(`products_categories/${params.id}`, params)
      .then((res) => {
        history.push("/products/categories");
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

// product
export const getAllProducts = (params: any) => (dispatch: any) => {
  dispatch({ type: LOADING_UI });
  axios
    .get(`/products`, { params })
    .then((res) => {
      dispatch({
        type: SET_PRODUCTS,
        payload: res.data,
      });
      console.log(res.data);
      dispatch({ type: CLEAR_ERRORS });
    })
    .catch((err) => {
      console.log(err);
    });
};

export const addProductProduct =
  (params: any, history: any) => (dispatch: any) => {
    dispatch({ type: BUTTON_LOADING });
    axios
      .post("/products", params)
      .then((res) => {
        history.push("/products");
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

export const getProductProductView =
  (Id: any, params: any) => (dispatch: any) => {
    dispatch({ type: LOADING_UI });
    axios
      .get(`products/${Id}`, { params })
      .then((res) => {
        dispatch({
          type: SET_PRODUCT_VIEW,
          payload: res.data,
        });
        dispatch({ type: CLEAR_ERRORS });
      })
      .catch((err) => {
        console.log(err);
      });
  };

export const getProductProductUpdate =
  (params: any, history: any) => (dispatch: any) => {
    dispatch({ type: BUTTON_LOADING });
    axios
      .patch(`products/${params.id}`, params)
      .then((res) => {
        history.push("/products");
        dispatch({ type: LOADING_CLEAR });
      })
      .catch((err) => {
        console.log(err);
      });
  };

export const deleteProducts =
  (productId: any, params: any) => (dispatch: any) => {
    axios
      .delete(`/products/${productId}`, { params })
      .then((res) => {})
      .catch((err) => {
        console.log(err);
      });
  };

export const getProductOrderUpdate =
  (orderId: any, params: any, history: any) => (dispatch: any) => {
    dispatch({ type: BUTTON_LOADING });
    axios
      .patch(`orders/${orderId}`, params)
      .then((res) => {
        dispatch({
          type: SET_PRODUCT_ORDER,
          payload: res.data,
        });

        dispatch({ type: LOADING_CLEAR });
      })
      .catch((err) => {
        console.log(err);
      });
  };

export const addProductOrder =
  (params: any, callback: any) => (dispatch: any) => {
    axios.defaults.headers.common["x-populate"] = "clientId,serviceId";
    dispatch({ type: BUTTON_LOADING });
    axios
      .post("/orders", params)
      .then((res) => {
        const id = res.data.id;
        callback(true, id);
        dispatch({ type: LOADING_CLEAR });
        delete axios.defaults.headers.common["x-populate"];
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

export const updateProductOrder =
  (id: any, params: any, history: any, callback: any) => (dispatch: any) => {
    axios.defaults.headers.common["x-populate"] = "clientId,serviceId";
    dispatch({ type: BUTTON_LOADING });
    axios
      .patch(`/orders/${id}`, params)
      .then((res) => {
        dispatch({
          type: SET_PRODUCT_ORDER_DATA,
          payload: res.data,
        });
        const id = res.data;
        callback(true, id);
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

export const getProductOrderView =
  (Id: any, params: any) => (dispatch: any) => {
    axios.defaults.headers.common["x-populate"] = "clientId,serviceId";
    dispatch({ type: LOADING_UI });
    axios
      .get(`orders/${Id}`, { params })
      .then((res) => {
        dispatch({
          type: SET_PRODUCT_ORDER_DATA,
          payload: res.data,
        });
        dispatch({ type: CLEAR_ERRORS });
        delete axios.defaults.headers.common["x-populate"];
      })
      .catch((err) => {
        console.log(err);
      });
  };

export const addProductUpdateStaffOrder =
  (params: any, callback: any) => (dispatch: any) => {
    axios.defaults.headers.common["x-populate"] = "clientId,serviceId";
    dispatch({ type: BUTTON_LOADING });
    axios
      .post("orders/update/staff", params)
      .then((res) => {
        const id = res.data;
        callback(true, id);
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
  
export const getProductSettingData = (params: any) => (dispatch: any) => {
  dispatch({ type: LOADING_UI });
  axios
    .get(`/products/settings`, { params })
    .then((res) => {
      dispatch({
        type: SET_PRODUCT_SETTINGS_DATA,
        payload: res.data,
      });
      dispatch({ type: CLEAR_ERRORS });
    })
    .catch((err) => {
      console.log(err);
    });
};

export const updateProductSetting = (params: any) => (dispatch: any) => {
  dispatch({ type: BUTTON_LOADING });
  axios
    .patch(`products/settings/${params.id}`, params)
    .then((res) => {
      dispatch({ type: LOADING_CLEAR });
    })
    .catch((err) => {
      console.log(err);
    });
};
