import { createStore, combineReducers, applyMiddleware, compose } from "redux";
import { composeWithDevTools } from "redux-devtools-extension";
import thunk from "redux-thunk";
import promise from "redux-promise-middleware";
import userReducer from "./reducers/userReducers";
import uiReducer from "./reducers/uiReducers";
import businessReducers from "./reducers/businessReducers";
import reportReducers from "./reducers/reportReducers";
import productReducers from "./reducers/productReducers";
import serviceReducers from "./reducers/serviceReducers";
import scheduleReducers from "./reducers/scheduleReducers";

declare global {
  interface Window {
    __REDUX_DEVTOOLS_EXTENSION__?: typeof compose;
  }
}

const reducer = combineReducers({
  user: userReducer,
  UI: uiReducer,
  business: businessReducers,
  report: reportReducers,
  product: productReducers,
  service: serviceReducers,
  schedule: scheduleReducers,
});



const initialState = {};
const middleware = [thunk, promise];

const store = createStore(
  reducer,
  initialState,
  composeWithDevTools(applyMiddleware(...middleware))
);

export default store;
