import styles from "./ViewProducts.module.scss";

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

//pagination component
import Pagination from "../../../components/pagination/Pagination";

//redux
import { useDispatch, useSelector } from "react-redux";
import {
  STORE_PRODUCTS,
  selectProducts,
} from "../../../redux/slice/productSlice";

//filterSlice imports
import {
  FILTER_BY_SEARCH,
  selectFilteredProducts,
} from "../../../redux/slice/filterSlice";

//Search component
import Search from "../../Search/Search";

//notification (used for the delete product confirmation)
import Notiflix from "notiflix";

//firebase
import { doc, deleteDoc } from "firebase/firestore";
import { deleteObject, ref } from "firebase/storage";
import { db, storage } from "../../../firebase/config";

//loading component
import Loading from "../../../components/loading/Loading";

//toast
import { toast } from "react-toastify";

//icons
import { FaEdit, FaTrashAlt } from "react-icons/fa";

//custom hook for fetching data from firebase
import useFetchCollection from "../../../customHooks/useFetchCollection";

const ViewProducts = () => {
  const { data, isLoading } = useFetchCollection("products");

  //search state
  const [search, setSearch] = useState("");
  let filteredProducts = useSelector(selectFilteredProducts);
  filteredProducts = filteredProducts.filteredProducts;

  //redux tk get access to the store products state
  let products = useSelector(selectProducts);
  products = products.products;

  //redux
  const dispatch = useDispatch();

  //send the data fetched to the state in redux products store
  useEffect(() => {
    dispatch({ type: STORE_PRODUCTS, payload: data });
  }, [data]);

  //search action dispatcher to filterSlice
  useEffect(() => {
    dispatch(FILTER_BY_SEARCH({ products, search }));
  }, [dispatch, products, search]);

  //confirm delete function (with notiflix package)
  const confirmDelete = (id, imgURL) => {
    Notiflix.Confirm.show(
      "Delete Product",
      "You are about to delete this product",
      "Delete",
      "Cancel",
      function okCb() {
        //if confirm, run the deleteProduct function
        deleteProduct(id, imgURL);
      }
    );
  };

  //function to delete product and its image
  const deleteProduct = async (id, imgURL) => {
    try {
      //1º delete from the products database by product id
      await deleteDoc(doc(db, "products", id));

      //2º get the ref of the image associated with the product
      const storageRef = ref(storage, imgURL);

      //3º delete the image associated with the product
      await deleteObject(storageRef);

      toast.success("Product deleted successfully");

      //DONE
    } catch (error) {
      toast.error("Something went wrong");
      console.log(error);
    }
  };

  //Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage, setProductsPerPage] = useState(5);

  //Get Current Product Index (Pagination Stuff)
  let indexOfLastProduct = currentPage * productsPerPage;
  let indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );

  return (
    <>
      {isLoading && <Loading />}
      <div className={styles.table}>
        <h2>All Products</h2>

        <div>
          <p>
            <b>{filteredProducts.length}</b> products found
          </p>
          <Search
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
            }}
          />
        </div>

        {products.length === 0 ? (
          <p>No Products Found.</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>s/n</th>
                <th>Image</th>
                <th>Name</th>
                <th>Category</th>
                <th>Price</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentProducts.map((product, index) => {
                const { id, name, price, imageURL, category } = product;
                return (
                  <tr key={id}>
                    <td>{index + 1}</td>
                    <td>
                      <img
                        src={imageURL}
                        alt={name}
                        style={{ width: "100px" }}
                      />
                    </td>
                    <td>{name}</td>
                    <td>{category}</td>
                    <td>{`$${price}`}</td>
                    <td className={styles.icons}>
                      <Link to={`/admin/add-product/${id}`}>
                        <FaEdit size={20} color="blue" />
                      </Link>
                      &nbsp;
                      <FaTrashAlt
                        size={18}
                        color="red"
                        onClick={() => confirmDelete(id, imageURL)}
                      />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
      <Pagination
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        productsPerPage={productsPerPage}
        totalProducts={filteredProducts.length}
      />
    </>
  );
};

export default ViewProducts;
