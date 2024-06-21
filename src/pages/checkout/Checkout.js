import { useState, useEffect } from "react";

//toast
import { toast } from "react-toastify";

//checkout form component
import CheckoutForm from "../../components/checkoutForm/CheckoutForm";

//redux slices and states stuff (checkoutSlice, cartSlice info state)
import { useSelector, useDispatch } from "react-redux";
import {
  CALCULATE_SUBTOTAL,
  CALCULATE_TOTAL_ITEMS,
  selectCartItems,
  selectCartTotalAmount,
} from "../../redux/slice/cartSlice";
import { selectEmail } from "../../redux/slice/authSlice";

import {
  selectBillingAddress,
  selectShippingAddress,
} from "../../redux/slice/checkoutSlice";

//stripe components
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";

//public api key
// console.log("process.env", process.env); //check all the env variables
//react .env variables must begin with REACT_APP_....
const apiKey = `${process.env.REACT_APP_STRIPE_PUBLIC_KEY}`;

//public key from .env file
const stripePromise = loadStripe(apiKey);

const Checkout = () => {
  const [message, setMessage] = useState("Initializing Checkout...");
  const [clientSecret, setClientSecret] = useState("");

  //get info from the slices states
  const cartItems = useSelector(selectCartItems);
  const totalAmount = useSelector(selectCartTotalAmount);
  const customerEmail = useSelector(selectEmail);
  const shippingAddress = useSelector(selectShippingAddress);
  const billingAddress = useSelector(selectBillingAddress);

  const dispatch = useDispatch();

  //descritpion will be sent in the body of request to backend
  const description = `Z Shop payment: email: ${customerEmail}, total amount: $${totalAmount} `;

  //calculate cart totals quantity and amount $ on page render
  //or everytime cart items changes, calculate again
  useEffect(() => {
    dispatch(CALCULATE_SUBTOTAL());
    dispatch(CALCULATE_TOTAL_ITEMS());
  }, [dispatch, cartItems]);

  //send post request to backend
  useEffect(() => {
    //create payment intent as soon as the page loads
    fetch("http://localhost:4242/create-payment-intent", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      //will send the cart data and user data in the body of the request
      body: JSON.stringify({
        items: cartItems,
        userEmail: customerEmail,
        shipping: shippingAddress,
        billing: billingAddress,
        description: description,
      }),
    })
      .then((res) => {
        if (res.ok) {
          return res.json();
        }
        console.log("res not ok");
        //if some error occur, reject promise
        return res.json().then((json) => Promise.reject());
      })
      .then((data) => {
        setClientSecret(data.clientSecret);
      })
      .catch((err) => {
        console.log("error catching");
        setMessage("Failed To Initialize Checkout");
        toast.error("Something went wrong. Try again.");
      });
  }, [billingAddress, cartItems, customerEmail, description, shippingAddress]);

  let appearance = {
    theme: "stripe",
  };

  let options = {
    clientSecret,
    appearance,
  };

  return (
    <>
      <section>
        <div className="container">{!clientSecret && <h3>{message}</h3>}</div>
      </section>
      {clientSecret && (
        <Elements options={options} stripe={stripePromise}>
          <CheckoutForm />
        </Elements>
      )}
    </>
  );
};

export default Checkout;
