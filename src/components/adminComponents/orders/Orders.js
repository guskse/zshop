import styles from "./Orders.module.scss";

//custom hook for fetching collection from firebaseDB
import useFetchCollection from "../../../customHooks/useFetchCollection";

import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

//redux, slices and actions
import { useDispatch, useSelector } from "react-redux";
import {
  selectOrderHistory,
  STORE_ORDER,
} from "../../../redux/slice/orderSlice";

//Loading spinner
import Loading from "../../../components/loading/Loading";

const OrderHistory = () => {
  const { data, isLoading } = useFetchCollection("orders");

  let orders = useSelector(selectOrderHistory);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(STORE_ORDER(data));
  }, [data, dispatch]);

  const navigate = useNavigate();
  //handle click function
  const handleClick = (id) => {
    //go to admin order details page (to change order status and such)
    navigate(`/admin/order-details/${id}`);
  };

  return (
    <>
      <div className={` ${styles.order}`}>
        <h2>All Orders History</h2>
        <p>
          Open an order to change <b>Order Status</b>
        </p>
        <br />
        <>
          {isLoading && <Loading />}
          <div className={styles.table}>
            {orders.length === 0 ? (
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
                  {orders.map((order, index) => {
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
                              orderStatus !== "Delivered"
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
    </>
  );
};

export default OrderHistory;
