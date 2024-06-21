import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  orderHistory: [],
  totalOrderAmount: null,
};

const orderSlice = createSlice({
  name: "order",
  initialState,
  reducers: {
    STORE_ORDER(state, action) {
      state.orderHistory = action.payload;
      console.log("changed")
      // console.log("storing the order: ", action.payload);
    },
    CALC_TOTAL_ORDER_AMOUNT(state, action) {
      console.log("state orderhistory:", state.orderHistory);
      const arr = [];
      state.orderHistory.map((item) => {
        const { totalAmount } = item;
        // console.log("order amount:", totalAmount);
        return arr.push(totalAmount);
      });
      const totalOrdersAmount = arr.reduce((a, b) => {
        return a + b;
      }, 0);
      state.totalOrderAmount = totalOrdersAmount;
    },
  },
});

export const { STORE_ORDER, CALC_TOTAL_ORDER_AMOUNT } = orderSlice.actions;

export const selectOrderHistory = (state) => state.order.orderHistory;
export const selectTotalOrderAmount = (state) => state.order.totalOrderAmount;

export default orderSlice.reducer;
