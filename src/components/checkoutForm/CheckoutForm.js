import styles from "./CheckoutForm.module.scss";

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

//checkout summary component
import CheckoutSummary from "../checkoutSummary/CheckoutSummary";

//firebase imports
import { addDoc, collection, Timestamp } from "firebase/firestore";
import { db } from "../../firebase/config"; //local firebase config

//redux
import { useSelector, useDispatch } from "react-redux";
//redux slices and actions to dispatch
import { selectEmail, selectUserID } from "../../redux/slice/authSlice";
import {
  CLEAR_CART,
  selectCartItems,
  selectCartTotalAmount,
} from "../../redux/slice/cartSlice";

//stripe imports
import {
  PaymentElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";

//card component
import Card from "../card/Card";

//loading spinner
import spinnerImg from "../../assets/spinner.jpg";

//toast component
import { toast } from "react-toastify";
import { selectShippingAddress } from "../../redux/slice/checkoutSlice";

const CheckoutForm = () => {
  const [message, setMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  //stripe functions
  const stripe = useStripe();
  const elements = useElements();

  const dispatch = useDispatch();

  //data from slice
  const userID = useSelector(selectUserID);
  const userEmail = useSelector(selectEmail);
  const cartItems = useSelector(selectCartItems);
  const shippingAddress = useSelector(selectShippingAddress);
  const totalAmount = useSelector(selectCartTotalAmount);

  useEffect(() => {
    if (!stripe) {
      return;
    }

    const clientSecret = new URLSearchParams(window.location.search).get(
      "payment_intent_client_secret"
    );

    if (!clientSecret) {
      return;
    }
  }, [stripe]);

  const navigate = useNavigate();

  //will save order when user payment succeded
  const saveOrder = () => {
    const today = new Date();
    const date = today.toDateString();
    const time = today.toLocaleTimeString();

    //will send to firebase the product order and info
    const orderConfig = {
      userID,
      userEmail,
      orderDate: date,
      orderTime: time,
      totalAmount,
      cartItems,
      shippingAddress,
      orderStatus: "Order Placed",
      createdAt: Timestamp.now().toDate(),
    };

    //save order to firebase
    try {
      addDoc(collection(db, "orders"), orderConfig);
      //after saving the order, call the dispatch action to clear cart from cartSlice
      dispatch(CLEAR_CART());
      navigate("/checkout-success");
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    //will reset message
    setMessage(null);

    //stripe.js has not yet loaded return
    if (!stripe || !elements) {
      return;
    }

    setIsLoading(true);

    const confirmPayment = await stripe
      .confirmPayment({
        elements,
        confirmParams: {
          //make sure to change this to your payment completion page
          return_url: "http://localhost:4243/checkout-success",
        },
        redirect: "if_required",
      })
      .then((result) => {
        //bad -> error
        if (result.error) {
          toast.error(result.error.message);
          setMessage(result.error.message);
          return;
        }

        //ok -> payment intent
        if (result.paymentIntent) {
          if (result.paymentIntent.status === "succeeded") {
            setIsLoading(false);
            toast.success("Payment successful");
            saveOrder();
          }
        }
      });

    setIsLoading(false);
  };

  return (
    <section>
      <div className={`container ${styles.checkout}`}>
        <h2>Checkout</h2>
        <form onSubmit={handleSubmit}>
          <div>
            <Card cardClass={styles.card}>
              <CheckoutSummary />
            </Card>
          </div>
          <div>
            <Card cardClass={`${styles.card} ${styles.pay}`}>
              <h3>Stripe Checkout</h3>
              <PaymentElement id={styles["payment-element"]} />
              <button
                disabled={isLoading || !stripe || !elements}
                className={styles.button}
                id="submit"
              >
                <span id="button-text">
                  {isLoading ? (
                    <img
                      src={spinnerImg}
                      alt="loading spinner"
                      style={{ width: "20px" }}
                    />
                  ) : (
                    "Pay now"
                  )}
                </span>
              </button>
              {/* show any error or success messages */}
              {message && <div id={styles["payment-message"]}>{message}</div>}
            </Card>
          </div>
        </form>
      </div>
    </section>
  );
};

export default CheckoutForm;
