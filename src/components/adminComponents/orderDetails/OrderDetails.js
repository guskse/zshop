import styles from "./OrderDetails.module.scss";

import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

//changeOrderStatus component
import ChangeOrderStatus from "../changeOrderStatus/ChangeOrderStatus";


//custom hook to get collection from orders in firebase database
import useFetchDocument from "../../../customHooks/useFetchDocument";

//loading spinner img
import spinnerImg from "../../../assets/spinner.jpg";

const OrderDetails = () => {
  const [order, setOrder] = useState(null);
  const { id } = useParams();
  const { document } = useFetchDocument("orders", id);

  useEffect(() => {
    setOrder(document);
  }, [document]);

  return (
    <>
      <div className={`${styles.table}`}>
        <h2>Order Details</h2>
        <div>
          <Link to="/admin/orders">&larr; Back to Orders</Link>
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
            <p>
              <b>Address:</b> {order.shippingAddress.line1} <br />
            </p>

            {order.shippingAddress.line2 ? (
              <p>
                <b>2nd Address:</b> {order.shippingAddress.line2}
              </p>
            ) : (
              ""
            )}

            <p>
              <b>Country:</b> {order.shippingAddress.country}
            </p>

            <p>
              <b>State:</b> {order.shippingAddress.state}
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
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </>
        )}
        <ChangeOrderStatus order={order} id={id} />
      </div>
    </>
  );
};

export default OrderDetails;
