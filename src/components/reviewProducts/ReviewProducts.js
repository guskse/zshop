import styles from "./ReviewProducts.module.scss";

import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

//card component
import Card from "../card/Card";

//redux slices
import { useSelector } from "react-redux";
import { selectUserID, selectUserName } from "../../redux/slice/authSlice";

//review star rate functionality from react-star-rate package
import StarsRating from "react-star-rate";

//custom hook for fetching document (product in this case)
import useFetchDocument from "../../customHooks/useFetchDocument";

//toast
import { toast } from "react-toastify";

//firebase imports
import { addDoc, collection, Timestamp } from "firebase/firestore";
import { db } from "../../firebase/config"; //firebase local config

//loading spinner
import spinnerImg from "../../assets/spinner.jpg";

const ReviewProducts = () => {
  const [rate, setRate] = useState(0);
  const [review, setReview] = useState("");
  const [product, setProduct] = useState(null);

  //get id of product from url
  const { id } = useParams();

  //fetch product for review by id, from the firebase products collection
  const { document } = useFetchDocument("products", id);

  //redux state data
  const userID = useSelector(selectUserID);
  const userName = useSelector(selectUserName);

  useEffect(() => {
    setProduct(document);
  }, [document]);

  const navigate = useNavigate();

  //submit review func
  const submitReview = (e) => {
    e.preventDefault();

    //save the review in firebase/firestore
    const today = new Date();
    const date = today.toDateString();

    //will send to firebase the review of product
    const reviewConfig = {
      userID,
      userName,
      productID: id, //from params
      rate,
      review,
      reviewDate: date,
      createdAt: Timestamp.now().toDate(),
    };

    //save review to firebase
    try {
      addDoc(collection(db, "reviews"), reviewConfig);
      toast.success("Review submitted successfully!");
      navigate("/order-history");

      //reset the input fields
      setRate(0);
      setReview("");
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <section>
      <div className={`container ${styles.review}`}>
        <h2>Review Product</h2>

        {/* ONLY SHOW REVIEW FORM AFTER THERE IS A PRODUCT LOADED*/}
        {product === null ? (
          //show loading spinner while fetching the product from DB
          <img src={spinnerImg} alt="Loading" style={{ width: "100px" }} />
        ) : (
          <>
            <p>
              <b>Product name:</b> {product.name}
            </p>

            <img
              src={product.imageURL}
              alt={product.name}
              style={{ width: "100px" }}
            />

            <Card cardClass={styles.card}>
              <form onSubmit={(e) => submitReview(e)}>
                <label>Rating:</label>
                {/* REVIEW STARS FUNCTIONALITY  */}
                <StarsRating
                  value={rate}
                  onChange={(rate) => {
                    setRate(rate);
                  }}
                />

                <label>Review:</label>
                <textarea
                  value={review}
                  cols="30"
                  rows="10"
                  required
                  onChange={(e) => setReview(e.target.value)}
                ></textarea>

                <button type="submit" className="--btn --btn-primary">
                  Submit Review
                </button>
              </form>
            </Card>
          </>
        )}
      </div>
    </section>
  );
};

export default ReviewProducts;
