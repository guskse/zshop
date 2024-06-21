import { createSlice } from "@reduxjs/toolkit";

//toast
import { toast } from "react-toastify";

const initialState = {
  //check if there is item in localStorage, else initial state will be empty array
  cartItems: localStorage.getItem("cartItems")
    ? JSON.parse(localStorage.getItem("cartItems"))
    : [],
  cartTotalAmount: 0,
  cartTotalQuantity: 0,
  previousURL: "",
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    ADD_TO_CART(state, action) {
      //   console.log("cart payload:", action.payload);
      //check id to find if product was already in the cart (will return 1 or -1)
      const productIndex = state.cartItems.findIndex(
        (item) => item.id === action.payload.id
      );

      if (productIndex >= 0) {
        //already exists in cart
        //increase product quantity in cart
        state.cartItems[productIndex].cartQuantity += 1;
        toast.success(`${action.payload.name} added`, { position: "top-left" });
      } else {
        //product doesnt exist in the cart
        //add product to cart
        //set cart quantity to 1
        let tempProduct = { ...action.payload, cartQuantity: 1 };
        state.cartItems.push(tempProduct);
        toast.success(`${action.payload.name} added to cart successfully!`, {
          position: "top-left",
        });
      }
      //SAVE TO LOCALSTORAGE (CART STATE)
      localStorage.setItem("cartItems", JSON.stringify(state.cartItems));
    },

    DECREASE_CART(state, action) {
      const productIndex = state.cartItems.findIndex(
        (item) => item.id === action.payload.id
      );

      if (state.cartItems[productIndex].cartQuantity > 1) {
        state.cartItems[productIndex].cartQuantity -= 1;
        toast.success(`${action.payload.name} decreased by one`, {
          position: "top-left",
        });
      } else if (state.cartItems[productIndex].cartQuantity === 1) {
        //if product only has 1 quantity and is deleted
        //filter it out from the cartItems state
        const newCartItem = state.cartItems.filter(
          (item) => item.id !== action.payload.id
        );

        //update the cartItems
        state.cartItems = newCartItem;

        toast.success(`${action.payload.name}  removed from cart`, {
          position: "top-left",
        });
      }

      //SAVE TO LOCALSTORAGE (CART STATE)
      localStorage.setItem("cartItems", JSON.stringify(state.cartItems));
    },

    //REMOVE_FROM_CART
    REMOVE_FROM_CART(state, action) {
      //filter the product from the cart state (by id)
      const newCartItem = state.cartItems.filter(
        (item) => item.id !== action.payload.id
      );

      //update the cartItems
      state.cartItems = newCartItem;

      toast.success(`${action.payload.name}  removed from cart`, {
        position: "top-left",
      });

      //SAVE TO LOCALSTORAGE (CART STATE)
      localStorage.setItem("cartItems", JSON.stringify(state.cartItems));
    },

    //CLEAR CART
    CLEAR_CART(state, action) {
      state.cartItems = [];
      //SAVE TO LOCALSTORAGE (CART STATE)
      localStorage.setItem("cartItems", JSON.stringify(state.cartItems));
      toast.success("Cart Cleared.", { position: "top-left" });
    },

    //CALCULATE SUBTOTAL FROM CARTS
    CALCULATE_SUBTOTAL(state, action) {
      const arr = [];

      state.cartItems.map((item) => {
        //get the price and quantity of each item
        const { price, cartQuantity } = item;
        const cartItemAmount = price * cartQuantity;
        return arr.push(cartItemAmount);
      });

      const totalAmount = arr.reduce((a, b) => {
        return a + b;
      }, 0);

      //finally change the state to the total of all products
      state.cartTotalAmount = totalAmount;
    },

    //Calculte number of items in cart
    CALCULATE_TOTAL_ITEMS(state, action) {
      const array = [];

      state.cartItems.map((item) => {
        const { cartQuantity } = item;
        const quantity = cartQuantity;
        return array.push(quantity);
      });

      const totalQuantity = array.reduce((a, b) => {
        return a + b;
      }, 0);

      state.cartTotalQuantity = totalQuantity;
    },

    //SAVE URL
    SAVE_URL(state, action) {
      console.log("saving url:", action.payload);
      state.previousURL = action.payload;
    },
  },
});

export const {
  ADD_TO_CART,
  DECREASE_CART,
  REMOVE_FROM_CART,
  CLEAR_CART,
  CALCULATE_SUBTOTAL,
  CALCULATE_TOTAL_ITEMS,
  SAVE_URL,
} = cartSlice.actions;

export const selectCartItems = (state) => state.cart.cartItems;
export const selectCartTotalQuantity = (state) => state.cart.cartTotalQuantity;
export const selectCartTotalAmount = (state) => state.cart.cartTotalAmount;
export const selectPreviousURL = (state) => state.cart.previousURL;

export default cartSlice.reducer;
