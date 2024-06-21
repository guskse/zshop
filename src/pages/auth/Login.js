import styles from "./Auth.module.scss";
import { Link } from "react-router-dom";
import { useState } from "react";

//firebase
import {
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { auth } from "../../firebase/config";

//Loading component
import Loading from "../../components/loading/Loading";

//Navigation
import { useNavigate } from "react-router-dom";

//toasitfy
import { toast } from "react-toastify";

//Card component
import Card from "../../components/card/Card";

//icons
import { FaGoogle } from "react-icons/fa";

//Image for login Page
import loginImg from "../../assets/login.png";

//check if there is a previousURL state in the auth
import { useSelector } from "react-redux";
import { selectPreviousURL } from "../../redux/slice/cartSlice";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  //will check if there is a previousURL in the cart state (so it'll redirect to checkout page)
  const prevURL = useSelector(selectPreviousURL);

  const redirectUser = () => {
    console.log("redirect user to:", prevURL);
    //if there is cart in the prevURL, it means the user was going to checkout
    //loggin in will redirect the user to the cart page
    if (prevURL.includes("cart")) {
      navigate("/cart");
    } else {
      //else go to homepage normally
      navigate("/");
    }
  };

  //loading spinner state
  const [isLoading, setIsLoading] = useState(false);

  //login function
  const loginUser = (e) => {
    e.preventDefault();
    setIsLoading(true);
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        console.log(user);
        toast.success("User logged in!");
        setIsLoading(false);
        //will go to homepage or cart page, depending on previousURL
        // (if user was logged out and clicked in checkout, will go to cart)
        //else will go to homepage
        redirectUser();
      })
      .catch((error) => {
        toast.error(error.message);
        setIsLoading(false);
      });
  };

  //login with google (firebase)
  const provider = new GoogleAuthProvider();
  // sign in with google function
  const signInWithGoogle = () => {
    signInWithPopup(auth, provider)
      .then((result) => {
        const user = result.user;
        toast.success("User logged in!");
        console.log(user);
        //will go to homepage or cart page, depending on previousURL
        // (if user was logged out and clicked in checkout, will go to cart)
        //else will go to homepage
        redirectUser();
      })
      .catch((error) => {
        toast.error("Something went wrong. Try Again");
      });
  };

  return (
    <>
      {isLoading && <Loading />}
      <section className={`container ${styles.auth}`}>
        {/* IMG */}
        <div className={styles.img}>
          <img
            src={loginImg}
            alt="a person standing next to a big cellphone"
            width="400"
          />
        </div>

        {/* FORM */}

        <Card>
          <div className={styles.form}>
            <h2>Login</h2>
            <form onSubmit={loginUser}>
              <input
                type="email"
                placeholder="Email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <input
                type="password"
                placeholder="Password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button className="--btn --btn-primary --btn-block">Login</button>
              <div className={styles.links}>
                <Link to="/reset">Reset password</Link>
              </div>
              <p>or</p>
              <button
                className="--btn --btn-danger --btn-block"
                onClick={signInWithGoogle}
              >
                <FaGoogle color="#fff" /> <span>Sign In With Google</span>
              </button>
              <span className={styles.register}>
                <p>Don't have an account?</p>
                <Link to="/register">Register</Link>
              </span>
            </form>
          </div>
        </Card>
      </section>
    </>
  );
};

export default Login;
