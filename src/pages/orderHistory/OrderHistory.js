import styles from "./OrderHistory.module.scss";
import useFetchCollection from "../../customHooks/useFetchCollection";

import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

//redux, slices and actions
import { useDispatch, useSelector } from "react-redux";
import { selectOrderHistory, STORE_ORDER } from "../../redux/slice/orderSlice";
import { selectUserID } from "../../redux/slice/authSlice";

//Loading spinner
import Loading from "../../components/loading/Loading";

const OrderHistory = () => {
  const { data, isLoading } = useFetchCollection("orders");

  let orders = useSelector(selectOrderHistory);
  let userID = useSelector(selectUserID);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(STORE_ORDER(data));
  }, [data, dispatch]);

  const navigate = useNavigate();
  //handle click function
  const handleClick = (id) => {
    navigate(`/order-details/${id}`);
  };

  //filter order based on userID
  const filteredOrder = orders.filter((order) => order.userID === userID);
  // console.log("filtered:", filteredOrder);

  return (
    <section>
      <div className={`container ${styles.order}`}>
        <h2>Your Order History</h2>
        <p>
          Open an order to leave a <b>Product Review</b>
        </p>
        <br />
        <>
          {isLoading && <Loading />}
          <div className={styles.table}>
            {filteredOrder.length === 0 ? (
              <p>No Order Found</p>
            ) : (
              <table>
                <thead>
                  <tr>
                    <th>s/n</th>
                    <th>Date</th>
                    <th>Order ID</th>
                    <th>Order Amount</th>
                    <th>Order Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredOrder.map((order, index) => {
                    const {
                      id,
                      orderDate,
                      totalAmount,
                      orderTime,
                      orderStatus,
                    } = order;
                    return (
                      <tr key={id} onClick={() => handleClick(id)}>
                        <td>{index + 1}</td>
                        <td>
                          {orderDate} at {orderTime}
                        </td>
                        <td>{id}</td>
                        <td>${totalAmount.toFixed(2)}</td>
                        <td>
                          <p
                            className={
                              orderStatus !== "delivered"
                                ? `${styles.pending}`
                                : `${styles.delivered}`
                            }
                          >
                            {orderStatus}
                          </p>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        </>
      </div>
    </section>
  );
};

export default OrderHistory;
