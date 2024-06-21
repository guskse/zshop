import styles from "./ProductDetails.module.scss";

import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";

import { Link } from "react-router-dom";

//CUSTOM HOOK for fetching document from firebase (will be used to fetch product)
import useFetchDocument from "../../../customHooks/useFetchDocument";

//CUSTOM HOOK for fetching collection (will be used to fetch reviews)
import useFetchCollection from "../../../customHooks/useFetchCollection";

//spinner img
// import spinnerImg from "../../../assets/spinner.jpg";

//redux tk
import { useDispatch, useSelector } from "react-redux";
import {
  ADD_TO_CART,
  CALCULATE_TOTAL_ITEMS,
  DECREASE_CART,
  selectCartItems,
} from "../../../redux/slice/cartSlice";

//card component
import Card from "../../card/Card";
import StarsRating from "react-star-rate";

const ProductDetails = () => {
  const [product, setProduct] = useState(null);
  const cartItems = useSelector(selectCartItems);

  //get id of product in the url
  const { id } = useParams();

  //check if product is in the cart
  const isItemAdded = cartItems.findIndex((item) => {
    return item.id === id;
  });
  //get the item state (will be used to check quantity in the add cart)
  const cartItem = cartItems.find((item) => item.id === id);

  //function to fetch product from firebase
  //send the collection name and id of product to the custom hook
  const { document } = useFetchDocument("products", id);

  //get all product Reviews from firebase collection "reviews"
  const { data } = useFetchCollection("reviews", id);

  //filter the reviews, only get the ones for specific product by id
  const filteredReviews = data.filter((review) => review.productID === id);
  console.log("reviews fetched:", filteredReviews);

  //do the fetching when first rendering the page
  useEffect(() => {
    setProduct(document);
  }, [document]);

  const dispatch = useDispatch();

  //add to cart function
  const addToCart = (item) => {
    dispatch(ADD_TO_CART(item));
    dispatch(CALCULATE_TOTAL_ITEMS());
  };

  //decrease cart function
  const decreaseCart = (item) => {
    dispatch(DECREASE_CART(item));
    dispatch(CALCULATE_TOTAL_ITEMS());
  };

  //render the products details on page
  return (
    <section>
      <div className={`container ${styles.product}`}>
        <h2>{product === null ? "Nothing found" : "Product Details"}</h2>
        <div>
          <Link to="/#products">&larr; Back to Products</Link>
        </div>
        {product === null ? (
          // <img src={spinnerImg} alt="loading spinner" width="100px" />
          ""
        ) : (
          <>
            <div className={styles.details}>
              <div className={styles.img}>
                <img src={product.imageURL} alt={product.name} />
              </div>
              <div className={styles.content}>
                <h3>{product.name}</h3>
                <p className={styles.price}>Price: {`$${product.price}`}</p>
                <p>{product.desc}</p>
                <p>
                  <b>SKU:</b> {product.id}
                </p>
                <p>
                  <b>Brand:</b> {product.brand}
                </p>

                {/* QTY BUTTONS */}
                <div className={styles.count}>
                  {isItemAdded < 0 ? null : (
                    <>
                      <button
                        className="--btn"
                        onClick={() => decreaseCart(product)}
                      >
                        {" "}
                        -{" "}
                      </button>
                      <p>
                        <b>{cartItem.cartQuantity}</b>
                      </p>
                      <button
                        className="--btn"
                        onClick={() => addToCart(product)}
                      >
                        {" "}
                        +{" "}
                      </button>
                    </>
                  )}
                </div>

                {/* BUTTON ADD TO CART */}
                <button
                  className="--btn --btn-danger"
                  onClick={() => addToCart(product)}
                >
                  ADD TO CART
                </button>
              </div>
            </div>
          </>
        )}

        {!product === null && (
          <Card cardClass={styles.card}>
            <h3>Product Reviews</h3>
            <div>
              {filteredReviews.length === 0 ? (
                <p>No reviews for this product yet.</p>
              ) : (
                filteredReviews.map((filteredReview, index) => {
                  const { rate, review, reviewDate, userName } = filteredReview;
                  return (
                    <div className={styles.review} key={index}>
                      <StarsRating value={rate} />
                      <p>{review}</p>
                      <p>
                        <b>{reviewDate}</b>
                      </p>
                      <p>
                        <span>
                          <b>By: </b>
                          {userName}
                        </span>
                      </p>
                    </div>
                  );
                })
              )}
            </div>
          </Card>
        )}
      </div>
    </section>
  );
};

export default ProductDetails;
