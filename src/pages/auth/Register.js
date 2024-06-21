import styles from "./Auth.module.scss";
import { Link } from "react-router-dom";

import { useState } from "react";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth } from "../../firebase/config";

//Card component
import Card from "../../components/card/Card";

//Loading component
import Loading from "../../components/loading/Loading";

//Image for register Page
import registerImg from "../../assets/register.png";

//Navigation
import { useNavigate } from "react-router-dom";

//toasitfy
import { toast } from "react-toastify";

const Register = () => {
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [cpassword, setCPassword] = useState("");

  //will be used to redirect to login page after registering
  const navigate = useNavigate();

  //loading spinner state
  const [isLoading, setIsLoading] = useState(false);

  //form submit function
  const registerUser = (e) => {
    e.preventDefault();
    if (password !== cpassword) {
      toast.error("Credentials must match");
    } else {
      setIsLoading(true);
      // firebase register function
      createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
          //signed in
          const user = userCredential.user;
          console.log("registered user:", user);

          //put the display name in the user
          updateProfile(auth.currentUser, {
            displayName: displayName,
          });

          setIsLoading(false);
          toast.success("User registered successfully!");
          //redirect to login page
          navigate("/");
        })
        .catch((error) => {
          setIsLoading(false);
          toast.error(error.message);
        });
    }
  };

  return (
    <>
      {isLoading && <Loading />}
      <section className={`container ${styles.auth}`}>
        {/* FORM */}
        <Card>
          <div className={styles.form}>
            <h2>Register</h2>
            <form onSubmit={registerUser}>
              <input
                type="text"
                placeholder="Display Name"
                required
                autoComplete="no"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
              />
              <input
                type="email"
                placeholder="Email"
                required
                autoComplete="no"
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
              <input
                type="password"
                placeholder="Confirm Password"
                required
                value={cpassword}
                onChange={(e) => setCPassword(e.target.value)}
              />
              <button type="submit" className="--btn --btn-primary --btn-block">
                Register
              </button>

              <span className={styles.register}>
                <p>Already have an account?</p>
                <Link to="/login">Login instead</Link>
              </span>
            </form>
          </div>
        </Card>

        {/* IMG */}
        <div className={styles.img}>
          <img
            src={registerImg}
            alt="a person sitting next to a big cellphone"
            width="400"
          />
        </div>
      </section>
    </>
  );
};

export default Register;
