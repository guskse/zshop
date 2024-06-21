import styles from "./ChangeOrderStatus.module.scss";

import { useState } from "react";
import { useNavigate } from "react-router-dom";

//firebase imports
import { Timestamp, setDoc, doc } from "firebase/firestore";
import { db } from "../../../firebase/config"; //local config

//loader component
import Loading from "../../loading/Loading";
import Card from "../../card/Card";

//toast
import { toast } from "react-toastify";

const ChangeOrderStatus = ({ order, id }) => {
  const [status, setStatus] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const editOrder = (e, orderID) => {
    setIsLoading(true);
    e.preventDefault();

    //change only the orderStatus
    const orderConfig = {
      ...order,
      orderStatus: status,
      editedAt: Timestamp.now().toDate(),
    };

    try {
      setDoc(doc(db, "orders", orderID), orderConfig);
      toast.success("Order Edited");
      setIsLoading(false);
      navigate("/admin/orders");
    } catch (error) {
      toast.error(error.message);
      setIsLoading(false);
    }

    console.log(orderConfig);
  };

  return (
    <>
      {isLoading ? (
        <Loading />
      ) : (
        <div className={`${styles.status}`}>
          <Card>
            <h4>Update Status</h4>
            <form onSubmit={(e) => editOrder(e, id)}>
              <span>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                >
                  <option value="" disabled>
                    {" "}
                    -- Change Order Status --
                  </option>
                  <option value="Order Placed">Order Placed</option>
                  <option value="Processing">Processing</option>
                  <option value="Shipped">Shipped</option>
                  <option value="Delivered">Delivered</option>
                </select>
              </span>
              <span>
                <button type="submit" className="--btn --btn-primary">
                  Update Status
                </button>
              </span>
            </form>
          </Card>
        </div>
      )}
    </>
  );
};

export default ChangeOrderStatus;
