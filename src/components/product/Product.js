import styles from "./Product.module.scss";

//product components
import ProductFilter from "./productFilter/ProductFilter";
import ProductList from "./productList/ProductList";

//react hooks
import { useEffect, useState } from "react";

//icons
import { FaCog } from "react-icons/fa";

//redux
import {
  STORE_PRODUCTS,
  GET_PRICE_RANGE,
  selectProducts,
} from "../../redux/slice/productSlice";
import { useDispatch, useSelector } from "react-redux";

//custom hook for fetching data
import useFetchCollection from "../../customHooks/useFetchCollection";

//loading spinner
import spinnerImg from "../../assets/spinner.jpg";

const Product = () => {
  const { data, isLoading } = useFetchCollection("products");

  const [showFilter, setShowFilter] = useState(false);

  //redux tk get access to the store products state
  const products = useSelector(selectProducts);

  //redux
  const dispatch = useDispatch();

  //end the data fetched to the state in redux products store
  useEffect(() => {
    dispatch({ type: STORE_PRODUCTS, payload: data });

    //₢alc min and max price (range of products prices)
    dispatch(GET_PRICE_RANGE({ products: data }));
  }, [data]);

  //toggle filters (on mobile screen will show)
  const toggleFilter = () => {
    setShowFilter(!showFilter);
  };

  return (
    <section>
      <div className={`container ${styles.product}`}>
        <aside
          className={
            showFilter ? `${styles.filter} ${styles.show}` : `${styles.filter}`
          }
        >
          <ProductFilter />
        </aside>
        <div className={styles.content}>
          {isLoading ? (
            <img
              src={spinnerImg}
              alt="loading spinner"
              style={{ width: "50px" }}
              className="--center-all"
            />
          ) : (
            //pass the products fetched as prop to productList
            <ProductList products={products} />
          )}
          <div className={styles.icon} onClick={toggleFilter}>
            <FaCog size={25} color="orangered" />
            <p>{showFilter ? "Hide" : "Show"} Filters</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Product;
