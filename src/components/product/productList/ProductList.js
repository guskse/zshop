import styles from "./ProductList.module.scss";

import { useState, useEffect } from "react";

//redux hooks
import { useDispatch, useSelector } from "react-redux";

//redux tk state (filterSlice)
import {
  selectFilteredProducts,
  FILTER_BY_SEARCH,
  SORT_PRODUCTS,
} from "../../../redux/slice/filterSlice";

//search component
import Search from "../../Search/Search";

//single product component
import ProductItem from "../productItem/ProductItem";

//pagination component
import Pagination from "../../pagination/Pagination";

//icons
import { BsFillGridFill } from "react-icons/bs";
import { FaListAlt } from "react-icons/fa";

const ProductList = ({ products }) => {
  const [grid, setGrid] = useState(true);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("latest");

  //redux dispatch
  const dispatch = useDispatch();

  let filteredProducts = useSelector(selectFilteredProducts);
  filteredProducts = filteredProducts.filteredProducts;

  products = products.products;

  //Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage, setProductsPerPage] = useState(6);

  //Get Current Product Index (Pagination Stuff)
  let indexOfLastProduct = currentPage * productsPerPage;
  let indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );

  //sort dispatcher to filterSlice
  useEffect(() => {
    dispatch(SORT_PRODUCTS({ products, sort }));
  }, [dispatch, products, sort]);

  //search dispatcher to filterSlice
  useEffect(() => {
    dispatch(FILTER_BY_SEARCH({ products, search }));
  }, [dispatch, products, search]);

  return (
    <div className={styles["product-list"]}>
      <div className={styles.top}>
        <div className={styles.icons}>
          <BsFillGridFill
            size={22}
            color="orangered"
            onClick={() => setGrid(true)}
          />
          <FaListAlt
            size={24}
            color="#0066d4"
            onClick={() => {
              setGrid(false);
            }}
          />

          <p>
            <b>{filteredProducts.length}</b> Products found.
          </p>
        </div>

        {/* SEARCH COMPONENT */}
        <div>
          <Search
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
            }}
          />
        </div>

        {/* SORT PRODUCTS */}
        <div className={styles.sort}>
          <label> Sort By: </label>
          <select value={sort} onChange={(e) => setSort(e.target.value)}>
            <option value="latest">latest</option>
            <option value="lowest-price">lowest price</option>
            <option value="highest-price">highest price</option>
            <option value="a-z">a - z</option>
            <option value="z-a">z - a</option>
          </select>
        </div>
      </div>

      {/* PRODUCTS SECTION */}
      <div className={grid ? `${styles.grid}` : `${styles.list}`} id="products">
        {products.length === 0 ? (
          <p>Nothing Found.</p>
        ) : (
          <>
            {currentProducts.map((product) => {
              return (
                <div key={product.id}>
                  <ProductItem product={product} grid={grid} />
                </div>
              );
            })}
          </>
        )}
      </div>
      <Pagination
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        productsPerPage={productsPerPage}
        totalProducts={filteredProducts.length}
      />
    </div>
  );
};

export default ProductList;
