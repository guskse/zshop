import styles from "./Home.module.scss";

import InfoBox from "../../infoBox/InfoBox";

//custom Hook for fetching data from DB
import useFetchCollection from "../../../customHooks/useFetchCollection";

//chart component
import Chart from "../../chart/Chart";

//icons imports
import { AiFillDollarCircle } from "react-icons/ai";
import { BsCart4 } from "react-icons/bs";
import { FaCartArrowDown } from "react-icons/fa";

//loading spinner
import spinnerImg from "../../../assets/spinner.jpg";

//icons config
const earningIcon = <AiFillDollarCircle size={30} color="#b624ff" />;
const productIcon = <BsCart4 size={30} color="#1f93ff" />;
const ordersIcon = <FaCartArrowDown size={30} color="orangered" />;

const Home = () => {
  //fetch products collection data
  const { data: products } = useFetchCollection("products");
  const { data: orders, isLoading } = useFetchCollection("orders");

  //calc orders total amount
  let total = 0;
  orders.map((order) => {
    total += order.totalAmount;
    return total;
  });

  //format currency
  function formatCurrency(input) {
    // Convert number to string and replace decimal point with comma
    let formatted = input.toString().replace(".", ",");

    // Insert dots as thousand separators
    formatted = formatted.replace(/\B(?=(\d{3})+(?!\d))/g, ".");

    return formatted;
  }

  return (
    <>
      {isLoading ? (
        <img src={spinnerImg} alt="Loading..." style={{ width: "100px" }} />
      ) : (
        <div className={styles.home}>
          <h2>Admin Dashboard</h2>
          <div className={styles["info-box"]}>
            <InfoBox
              cardClass={`${styles.card} ${styles.card1}`}
              title={"Earnings"}
              count={`$${formatCurrency(total)}`}
              icon={earningIcon}
            />
            <InfoBox
              cardClass={`${styles.card} ${styles.card2}`}
              title={"Products"}
              count={products.length}
              icon={productIcon}
            />
            <InfoBox
              cardClass={`${styles.card} ${styles.card3}`}
              title={"Orders"}
              count={orders.length}
              icon={ordersIcon}
            />
          </div>
          <div>
            <Chart />
          </div>
        </div>
      )}
    </>
  );
};

export default Home;
