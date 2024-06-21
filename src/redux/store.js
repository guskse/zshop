import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { getDefaultMiddleware } from "@reduxjs/toolkit";

//auth reducers
import authReducer from "./slice/authSlice";
import productReducer from "./slice/productSlice";
import filterReducer from "./slice/filterSlice";
import cartReducer from "./slice/cartSlice";
import checkoutReducer from "./slice/checkoutSlice";
import orderReducer from "./slice/orderSlice";

const rootReducer = combineReducers({
  auth: authReducer,
  product: productReducer,
  filter: filterReducer,
  cart: cartReducer,
  checkout: checkoutReducer,
  order: orderReducer,
});

const store = configureStore({
  reducer: rootReducer,

  //stop the serialized data error from redux
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export default store;
