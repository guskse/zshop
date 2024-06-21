import styles from "./ProductItem.module.scss";

import { Link } from "react-router-dom";

//redux
import { useDispatch } from "react-redux";
import { ADD_TO_CART } from "../../../redux/slice/cartSlice";

//Card component
import Card from "../../card/Card";

const ProductItem = ({ product, grid }) => {
  //deconstruct the product object
  const { id, name, desc, imageURL, price } = product;

  //shorten the text and add ... function
  const shortenText = (text, nOfChars) => {
    if (text.length > nOfChars) {
      const shortenText = text.substring(0, nOfChars).concat("...");
      return shortenText;
    }
    return text;
  };

  const dispatch = useDispatch();

  //ADD TO CART FUNCTION
  const addToCart = (product) => {
    dispatch(
      //call dispatch with product as payload (to cartSlice)
      ADD_TO_CART(product)
    );
  };

  return (
    <Card cardClass={grid ? `${styles.grid}` : `${styles.list}`}>
      <Link to={`/product-details/${id}`}>
        <div className={styles.img}>
          <img src={imageURL} alt={name} />
        </div>
      </Link>
      <div className={styles.content}>
        <div className={styles.details}>
          <p>{`$ ${price}`}</p>
          <h4>{shortenText(name, 20)}</h4>
        </div>

        {/* only show description on list mode */}
        {!grid && <p>{shortenText(desc, 150)}</p>}

        <button
          className="--btn --btn-danger"
          onClick={() => addToCart(product)}
        >
          Add To Cart
        </button>
      </div>
    </Card>
  );
};

export default ProductItem;
