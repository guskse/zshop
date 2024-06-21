import styles from "./CheckoutDetails.module.scss";
import { useState } from "react";

//import external component from api for Country list (will be put in the form)
import { CountryDropdown } from "react-country-region-selector";

//card component
import Card from "../../components/card/Card";

//checkout Summary component
import CheckoutSummary from "../../components/checkoutSummary/CheckoutSummary";

//redux slice and checkout actions
import { useDispatch } from "react-redux";
import {
  SAVE_BILLING_ADDRESS,
  SAVE_SHIPPING_ADDRESS,
} from "../../redux/slice/checkoutSlice";

import { useNavigate } from "react-router-dom";

const initialAddressState = {
  name: "",
  line1: "",
  line2: "",
  state: "",
  city: "",
  postal_code: "",
  country: "",
  phone: "",
};

const CheckoutDetails = () => {
  const [shippingAddress, setShippingAddress] = useState({
    ...initialAddressState,
  });
  const [billingAddress, setBillingAddress] = useState({
    ...initialAddressState,
  });

  const handleShipping = (e) => {
    const { name, value } = e.target;
    setShippingAddress({
      ...shippingAddress,
      [name]: value,
    });
  };

  const handleBilling = (e) => {
    const { name, value } = e.target;
    setBillingAddress({
      ...billingAddress,
      [name]: value,
    });
  };

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    //on form submit, dispatch the actions that will take place in the
    //checkout slice
    dispatch(SAVE_SHIPPING_ADDRESS(shippingAddress));
    dispatch(SAVE_BILLING_ADDRESS(billingAddress));
    navigate("/checkout");
  };

  return (
    <section>
      <div className={`container ${styles.checkout}`}>
        <h2>Checkout Details</h2>
        <form onSubmit={handleSubmit}>
          <div>
            <Card cardClass={styles.card}>
              <h3>Shipping Address</h3>
              <label>Recipient Name:</label>
              <input
                type="text"
                placeholder="Recipient Name"
                name="name"
                value={shippingAddress.name}
                onChange={(e) => handleShipping(e)}
                required
              />

              <label>Address Line 1:</label>
              <input
                type="text"
                placeholder="Address Line 1"
                name="line1"
                value={shippingAddress.line1}
                onChange={(e) => handleShipping(e)}
                required
              />

              <label>Address Line 2 (Optional):</label>
              <input
                type="text"
                placeholder="Address Line 2"
                name="line2"
                value={shippingAddress.line2}
                onChange={(e) => handleShipping(e)}
              />

              <label>City:</label>
              <input
                type="text"
                placeholder="City"
                name="city"
                value={shippingAddress.city}
                onChange={(e) => handleShipping(e)}
                required
              />

              <label>State:</label>
              <input
                type="text"
                placeholder="State"
                name="state"
                value={shippingAddress.state}
                onChange={(e) => handleShipping(e)}
                required
              />

              <label>Postal/Zip Code:</label>
              <input
                type="text"
                placeholder="Postal Code"
                name="postal_code"
                value={shippingAddress.postal_code}
                onChange={(e) => handleShipping(e)}
                maxLength={10}
                required
              />

              {/* COUNTRY INPUT WILL USE EXTERNAL PACKAGE */}
              {/* SETUP WILL BE A LITTLE DIFFERENT */}
              <label>Country:</label>
              <CountryDropdown
                valueType="short"
                className={styles.select}
                value={shippingAddress.country}
                onChange={(val) =>
                  handleShipping({
                    target: {
                      name: "country",
                      value: val,
                    },
                  })
                }
              />

              <label>Phone</label>
              <input
                type="text"
                placeholder="Phone Number"
                required
                name="phone"
                maxLength={12}
                value={shippingAddress.phone}
                onChange={(e) => handleShipping(e)}
              />
            </Card>

            <Card cardClass={styles.card}>
              <h3>Billing Address</h3>
              <label> Name:</label>
              <input
                type="text"
                placeholder="Name"
                name="name"
                value={billingAddress.name}
                onChange={(e) => handleBilling(e)}
                required
              />

              <label>Address Line 1:</label>
              <input
                type="text"
                placeholder="Address Line 1"
                name="line1"
                value={billingAddress.line1}
                onChange={(e) => handleBilling(e)}
                required
              />

              <label>Address Line 2 (Optional):</label>
              <input
                type="text"
                placeholder="Address Line 2"
                name="line2"
                value={billingAddress.line2}
                onChange={(e) => handleBilling(e)}
              />

              <label>City:</label>
              <input
                type="text"
                placeholder="City"
                name="city"
                value={billingAddress.city}
                onChange={(e) => handleBilling(e)}
                required
              />

              <label>State:</label>
              <input
                type="text"
                placeholder="State"
                name="state"
                value={billingAddress.state}
                onChange={(e) => handleBilling(e)}
                required
              />

              <label>Postal/Zip Code:</label>
              <input
                type="text"
                placeholder="Postal Code"
                name="postal_code"
                value={billingAddress.postal_code}
                onChange={(e) => handleBilling(e)}
                maxLength={10}
                required
              />

              {/* COUNTRY INPUT WILL USE EXTERNAL PACKAGE */}
              {/* SETUP WILL BE A LITTLE DIFFERENT */}
              <label>Country:</label>
              <CountryDropdown
                valueType="short"
                className={styles.select}
                value={billingAddress.country}
                onChange={(val) =>
                  handleBilling({
                    target: {
                      name: "country",
                      value: val,
                    },
                  })
                }
              />

              <label>Phone</label>
              <input
                type="text"
                placeholder="Phone Number"
                required
                name="phone"
                maxLength={12}
                value={billingAddress.phone}
                onChange={(e) => handleBilling(e)}
              />
              <button type="submit" className="--btn --btn-primary">
                Proceed to Checkout
              </button>
            </Card>
          </div>
          <div>
            <Card cardClass={styles.card}>
              <CheckoutSummary />
            </Card>
          </div>
        </form>
      </div>
    </section>
  );
};

export default CheckoutDetails;
