import styles from "./OrderDetails.module.scss";

import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

//custom hook to get collection from orders in firebase database
import useFetchDocument from "../../customHooks/useFetchDocument";

//loading spinner img
import spinnerImg from "../../assets/spinner.jpg";

const OrderDetails = () => {
  const [order, setOrder] = useState(null);
  const { id } = useParams();
  const { document } = useFetchDocument("orders", id);

  useEffect(() => {
    setOrder(document);
  }, [document]);

  return (
    <section>
      <div className={`container ${styles.table}`}>
        <h2>Order Details</h2>
        <div>
          <Link to="/order-history">&larr; Back to Orders</Link>
        </div>
        <br />
        {order === null ? (
          <img src={spinnerImg} alt="Loading" style={{ width: "50px" }} />
        ) : (
          <>
            <p>
              <b>Order ID:</b> {order.id}
            </p>
            <p>
              <b>Order Amount:</b> ${order.totalAmount}
            </p>
            <p>
              <b>Order Status:</b> {order.orderStatus}
            </p>
            <br />

            <table>
              <thead>
                <tr>
                  <th>s/n</th>
                  <th>Product</th>
                  <th>Price</th>
                  <th>Qty</th>
                  <th>Total</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {order.cartItems.map((cart, index) => {
                  const { id, name, imageURL, cartQuantity, price } = cart;
                  return (
                    <tr key={id}>
                      <td>{index + 1}</td>
                      <td>
                        <p>
                          <b>{name}</b>
                        </p>
                        <img
                          src={imageURL}
                          alt={name}
                          style={{ width: "100px" }}
                        />
                      </td>
                      <td>${price.toFixed(2)}</td>
                      <td>{cartQuantity}</td>
                      <td>${(price * cartQuantity).toFixed(2)}</td>
                      <td className={styles.icons}>
                        <Link to={`/review-product/${id}`}>
                          <button className="--btn --btn-primary">
                            Review Product
                          </button>
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </>
        )}
      </div>
    </section>
  );
};

export default OrderDetails;
