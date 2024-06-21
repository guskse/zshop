import styles from "./CheckoutSummary.module.scss";

import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

//cart slice redux states
import {
  selectCartItems,
  selectCartTotalAmount,
  selectCartTotalQuantity,
} from "../../redux/slice/cartSlice";

//card component
import Card from "../card/Card";

const CheckoutSummary = () => {
  //get the cart state from the cartSlice and put it in the states:
  const cartItems = useSelector(selectCartItems);
  const cartTotalAmount = useSelector(selectCartTotalAmount);
  const cartTotalQuantity = useSelector(selectCartTotalQuantity);

  return (
    <div>
      <h3>Checkout Summary</h3>
      <div>
        {cartItems.length === 0 ? (
          <>
            <p>No item in your cart.</p>
            <button className="--btn">
              <Link to="/#products"> &larr; Go Back To Shop</Link>
            </button>
          </>
        ) : (
          <div>
            <p>
              <b>{`Cart item(s): ${cartTotalQuantity}`}</b>
            </p>
            <div className={styles.text}>
              <h4>Subtotal:</h4>
              <h3>${cartTotalAmount.toFixed(2)}</h3>
            </div>
            {cartItems.map((item) => {
              const { id, name, price, cartQuantity } = item;
              return (
                <Card key={id} cardClass={styles.card}>
                  <h4>Product: {name}</h4>
                  <p>Quantity: {cartQuantity}</p>
                  <p>Unit price: {price}</p>
                  <p>Set price: {price * cartQuantity}</p>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default CheckoutSummary;
