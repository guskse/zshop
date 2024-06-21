import styles from "./Auth.module.scss";
import { Link } from "react-router-dom";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

//firebase auth
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../../firebase/config";

//toast
import { toast } from "react-toastify";

//Card component
import Card from "../../components/card/Card";

//Image for reset Page
import resetImg from "../../assets/forgot.png";

//Loading component
import Loading from "../../components/loading/Loading";

const Reset = () => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  //reset password function
  const resetPassword = (e) => {
    setIsLoading(true);
    e.preventDefault();
    sendPasswordResetEmail(auth, email)
      .then(() => {
        toast.success("Check your Email for Reset Link!");
        navigate("/login");
        setIsLoading(false);
      })
      .catch((error) => {
        console.log(error);
        toast.error("Something went wrong. Try Again");
        setIsLoading(false);
      });
  };

  return (
    <>
      {isLoading && <Loading />}
      <section className={`container ${styles.auth}`}>
        {/* IMG */}
        <div className={styles.img}>
          <img src={resetImg} alt="person with a question mark" width="400" />
        </div>

        {/* FORM */}
        <Card>
          <div className={styles.form}>
            <h2>Reset Password</h2>
            <form onSubmit={resetPassword}>
              <input
                type="email"
                placeholder="Email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <button className="--btn --btn-primary --btn-block" type="submit">
                Send Confirmation
              </button>
              <div className={styles.links}>
                <Link to="/login">Back to Login</Link>
              </div>
            </form>
          </div>
        </Card>
      </section>
    </>
  );
};

export default Reset;
