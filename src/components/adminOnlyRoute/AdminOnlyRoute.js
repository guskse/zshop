import { useSelector } from "react-redux";
import { selectEmail } from "../../redux/slice/authSlice";
import { Link } from "react-router-dom";

const AdminOnlyRoute = ({ children }) => {
  //from auth slice redux get the email of the user logged in
  const userEmail = useSelector(selectEmail);

  //admin email with be in the env file (environment variables)
  if (userEmail === "guskse@gmail.com") {
    return children;
  } else {
    //if not admin, return a custom page to go back to homePage
    return (
      <section style={{ height: "80vh" }}>
        <div className="container">
          <h2>Permission Denied.</h2>
          <p>Nothing to see here. Please go back to the Home Page</p>
          <br />
          <Link to="/">
            <button className="--btn"> &larr; Back to Home</button>
          </Link>
        </div>
      </section>
    );
  }
};

export const AdminOnlyLink = ({ children }) => {
  //from auth slice redux get the email of the user logged in
  const userEmail = useSelector(selectEmail);

  //admin email with be in the env file (environment variables)
  if (userEmail === "guskse@gmail.com") {
    return children;
  } else {
    return null;
  }
};

export default AdminOnlyRoute;
