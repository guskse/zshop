import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  products: [],
  minPrice: null,
  maxPrice: null,

};

const productSlice = createSlice({
  name: "product",
  initialState,
  reducers: {
    STORE_PRODUCTS(state, action) {
      state.products = action.payload;
    },

    //Calc min and max prices
    GET_PRICE_RANGE(state, action) {
      const { products } = action.payload;

      let arr = [];
      //put all the prices inside the array
      products.map((product) => {
        const price = product.price;
        return arr.push(price);
      });

      //get the min and max from the array
      const max = Math.max(...arr);
      const min = Math.min(...arr);

      //finally change the states of min and max prices
      state.minPrice = min;
      state.maxPrice = max;
    },
  },
});

export const { STORE_PRODUCTS, GET_PRICE_RANGE } = productSlice.actions;

export const selectProducts = (state) => state.product;
export const selectMinPrice = (state) => state.product.minPrice;
export const selectMaxPrice = (state) => state.product.maxPrice;

export default productSlice.reducer;
