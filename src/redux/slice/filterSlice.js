import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  filteredProducts: [],
};

const filterSlice = createSlice({
  name: "filter",
  initialState,
  reducers: {
    FILTER_BY_SEARCH(state, action) {
      //filter the products
      const { products, search } = action.payload;
      const tempProducts = products.filter(
        (product) =>
          //search by name
          product.name.toLowerCase().includes(search.toLowerCase()) ||
          //or search by category
          //ex user types: phone, it'll show all the products with phone category
          product.category.toLowerCase().includes(search.toLowerCase())
      );
      //set the filtered products to the filtered state
      state.filteredProducts = tempProducts;
    },
    SORT_PRODUCTS(state, action) {
      //sort products
      const { products, sort } = action.payload;
      let tempProducts = [];

      //NEWER ITEM
      if (sort === "latest") {
        tempProducts = products;
      }

      //LOWEST PRICE
      if (sort === "lowest-price") {
        tempProducts = products.slice().sort((a, b) => {
          return a.price - b.price;
        });
      }

      //HIGHEST PRICE
      if (sort === "highest-price") {
        tempProducts = products.slice().sort((a, b) => {
          return b.price - a.price;
        });
      }

      //A TO Z
      if (sort === "a-z") {
        tempProducts = products.slice().sort((a, b) => {
          return a.name.localeCompare(b.name);
        });
      }

      //Z TO A
      if (sort === "z-a") {
        tempProducts = products.slice().sort((a, b) => {
          return b.name.localeCompare(a.name);
        });
      }
      state.filteredProducts = tempProducts;
    },

    //BY CATEGORY
    FILTER_BY_CATEGORY(state, action) {
      const { products, category } = action.payload;
      let tempProducts = [];
      if (category === "All") {
        tempProducts = products;
      } else {
        tempProducts = products.filter(
          (product) => product.category === category
        );
      }
      state.filteredProducts = tempProducts;
    },

    //BY BRAND
    FILTER_BY_BRAND(state, action) {
      const { products, brand } = action.payload;
      let tempProducts = [];

      if (brand === "All") {
        tempProducts = products;
      } else {
        tempProducts = products.filter((product) => product.brand === brand);
      }
      state.filteredProducts = tempProducts;
    },

    //BY PRICE
    FILTER_BY_PRICE(state, action) {
      const { products, price } = action.payload;
      let tempProducts = [];

      //filter the products which the price is lower than the one dispatched
      tempProducts = products.filter((product) => product.price <= price);

      state.filteredProducts = tempProducts;
    },
  },
});

//export the actions
export const {
  FILTER_BY_SEARCH,
  SORT_PRODUCTS,
  FILTER_BY_CATEGORY,
  FILTER_BY_BRAND,
  FILTER_BY_PRICE,
} = filterSlice.actions;

export const selectFilteredProducts = (state) => state.filter;

export default filterSlice.reducer;
