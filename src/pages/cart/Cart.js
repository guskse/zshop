import styles from "./Cart.module.scss";

import { Link, useNavigate } from "react-router-dom";

//redux
import { useDispatch, useSelector } from "react-redux";
import {
  selectCartItems,
  selectCartTotalQuantity,
  selectCartTotalAmount,
  ADD_TO_CART,
  DECREASE_CART,
  REMOVE_FROM_CART,
  CLEAR_CART,
  CALCULATE_SUBTOTAL,
  CALCULATE_TOTAL_ITEMS,
  SAVE_URL,
} from "../../redux/slice/cartSlice";
import { selectIsLoggedIn } from "../../redux/slice/authSlice";

//icon
import { FaTrashAlt } from "react-icons/fa";

//Card component
import Card from "../../components/card/Card";

import { useEffect } from "react";

const Cart = () => {
  const cartItems = useSelector(selectCartItems);
  const cartTotalQuantity = useSelector(selectCartTotalQuantity);
  const cartTotalAmount = useSelector(selectCartTotalAmount);

  //check if user is logged in (using the auth slice state)
  const isLoggedIn = useSelector(selectIsLoggedIn);

  const dispatch = useDispatch();

  //increase or decrease quantity of item functions
  const increaseCart = (item) => {
    dispatch(ADD_TO_CART(item));
  };

  const decreaseCart = (item) => {
    dispatch(DECREASE_CART(item));
  };

  const removeFromCart = (item) => {
    dispatch(REMOVE_FROM_CART(item));
  };

  const clearCart = () => {
    dispatch(CLEAR_CART());
  };

  //on render, calculate subtotal of cart
  //and number of items on cart
  useEffect(() => {
    dispatch(CALCULATE_SUBTOTAL());
    dispatch(CALCULATE_TOTAL_ITEMS());
    dispatch(SAVE_URL(""));
  }, [dispatch, cartItems]);

  const url = window.location.href;

  const navigate = useNavigate();

  //on checkout button click, send user to the checkout-details page
  const checkout = () => {
    if (isLoggedIn) {
      navigate("/checkout-details");
    } else {
      //if not logged in, go to login page (and save the url)
      dispatch(SAVE_URL(url));
      navigate("/login");
      //so that when user login again, he goes straight to the checkout page
    }
  };

  return (
    <section>
      <div className={`container ${styles.table}`}>
        <h2>Shopping Cart</h2>

        {cartItems.length === 0 ? (
          <>
            <p>Your Cart is Empty.</p>
            <br />
            <div>
              <Link to="/#products"> &larr; Continue Shopping</Link>
            </div>
          </>
        ) : (
          <>
            <table>
              <thead>
                <tr>
                  <th>s/n</th>
                  <th>Product</th>
                  <th>Price</th>
                  <th>Quantity</th>
                  <th>Total</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {cartItems.map((item, index) => {
                  const { id, name, price, imageURL, cartQuantity } = item;

                  return (
                    <tr key={id}>
                      <td>{index + 1}</td>

                      <td key={index}>
                        <Link to={`/product-details/${id}`}>
                          <p>
                            <b>{name}</b>
                          </p>

                          <img
                            src={imageURL}
                            style={{ width: "100px" }}
                            alt={name}
                          />
                        </Link>
                      </td>

                      <td>${price.toFixed(2)}</td>
                      <td>
                        <div className={styles.count}>
                          <button
                            className="--btn"
                            onClick={() => decreaseCart(item)}
                          >
                            -
                          </button>
                          <p>
                            <b>{cartQuantity}</b>
                          </p>
                          <button
                            className="--btn"
                            onClick={() => increaseCart(item)}
                          >
                            +
                          </button>
                        </div>
                      </td>
                      <td>${(cartQuantity * price).toFixed(2)}</td>
                      <td className={styles.icons}>
                        <FaTrashAlt
                          color="red"
                          size={20}
                          onClick={() => removeFromCart(item)}
                        />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            <div className={styles.summary}>
              <button
                className="--btn --btn-danger"
                onClick={() => clearCart()}
              >
                Clear Cart
              </button>

              <div className={styles.checkout}>
                <div>
                  <Link to="/#products">&larr; Continue Shopping</Link>
                </div>

                <br />

                <Card cardClass={styles.card} className={styles.card}>
                  <p>
                    <b>{`Cart Item(s): ${cartTotalQuantity}`}</b>
                  </p>
                  <div className={styles.text}>
                    <h4>Subtotal:</h4>
                    <h3>{`$${cartTotalAmount.toFixed(2)}`}</h3>
                  </div>
                  <p>Taxes and shipping calculated at checkout</p>
                  <button
                    className="--btn --btn-primary --btn-block"
                    onClick={checkout}
                  >
                    Checkout
                  </button>
                </Card>
              </div>
            </div>
          </>
        )}
      </div>
    </section>
  );
};

export default Cart;
