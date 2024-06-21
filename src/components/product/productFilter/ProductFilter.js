import styles from "./ProductFilter.module.scss";

import { useDispatch, useSelector } from "react-redux";
import {
  selectProducts,
  selectMinPrice,
  selectMaxPrice,
} from "../../../redux/slice/productSlice";

//actions dispatchers from filterSlice
import {
  FILTER_BY_CATEGORY,
  FILTER_BY_BRAND,
  FILTER_BY_PRICE,
} from "../../../redux/slice/filterSlice";

import { useState, useEffect } from "react";

const ProductFilter = () => {
  const [category, setCategory] = useState("All");
  const [brand, setBrand] = useState("All");
  const [price, setPrice] = useState(3000);

  const minPrice = useSelector(selectMinPrice);
  const maxPrice = useSelector(selectMaxPrice);

  //get a hold of the products state in the productSlice
  let products = useSelector(selectProducts);

  products = products.products;

  //get all the categories from all the products and put it in an array
  const allCategories = [
    "All",
    ...new Set(products.map((product) => product.category)),
  ];

  //get all the brands from all the products and put it in an array
  const allBrands = [
    "All",
    ...new Set(products.map((product) => product.brand)),
  ];

  const dispatch = useDispatch();

  //filter products function (category)
  const filterProducts = (category) => {
    setCategory(category);
    dispatch(FILTER_BY_CATEGORY({ products, category }));
  };

  //filter everytime brand changes, call dispatch to filterSlice
  useEffect(() => {
    dispatch(FILTER_BY_BRAND({ products, brand }));
  }, [products, dispatch, brand]);

  //filter by value, re-render everytime change price filter
  useEffect(() => {
    dispatch(
      FILTER_BY_PRICE({
        products,
        price,
      })
    );
  }, [dispatch, products, price]);

  const clearFilters = () => {
    setCategory("All");
    setBrand("All");
    setPrice(maxPrice);
  };

  return (
    <div className={styles.filter}>
      <h4>Categories</h4>
      <div className={styles.category}>
        {allCategories.map((cat, index) => {
          return (
            <button
              key={index}
              type="button"
              className={`${category}` === cat ? `${styles.active}` : ""}
              onClick={() => filterProducts(cat)}
            >
              &#8250;{cat}
            </button>
          );
        })}
      </div>
      <h4>Brand</h4>
      <div className={styles.brand}>
        <select
          name="brand"
          value={brand}
          onChange={(e) => setBrand(e.target.value)}
        >
          {allBrands.map((brand, index) => {
            return (
              <option key={index} value={brand}>
                {brand}
              </option>
            );
          })}
        </select>
        <h4>Price</h4>
        <p>${price}</p>
        <div className={styles.price}>
          <input
            type="range"
            name="price"
            min={minPrice}
            max={maxPrice}
            value={price}
            step={5}
            onChange={(e) => setPrice(e.target.value)}
          />
        </div>
        <br />
        <button className="--btn --btn-danger" onClick={clearFilters}>
          Clear Filter
        </button>
      </div>
    </div>
  );
};

export default ProductFilter;
