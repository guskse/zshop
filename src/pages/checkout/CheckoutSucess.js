import { Link } from "react-router-dom";

const CheckoutSucess = () => {
  return (
    <section>
      <div className="container">
        <h2>Checkout Success</h2>
        <p>Thank you for your purchase</p>
        <br />
        <Link to="/order-history">
          <button className="--btn --btn-primary">View Order Status</button>
        </Link>
      </div>
    </section>
  );
};

export default CheckoutSucess;
