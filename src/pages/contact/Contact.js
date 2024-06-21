import styles from "./Contact.module.scss";

//card component
import Card from "../../components/card/Card";

//toast
import { toast } from "react-toastify";

//icons
import {
  FaPhoneAlt,
  FaEnvelope,
  FaInstagram,
  FaMapMarkedAlt,
} from "react-icons/fa";

//email browserjs package for managing emails imports
import { useRef } from "react";
import emailjs from "@emailjs/browser";

const Contact = () => {
  //send email functionality (EmailJS)
  const form = useRef();
  const sendEmail = (e) => {
    e.preventDefault();


    emailjs
      .sendForm(
        process.env.REACT_APP_EMAILJS_SERVICE_ID,
        process.env.REACT_APP_EMAILJS_TEMPLATE_ID,
        form.current,
        {
          publicKey: process.env.REACT_APP_EMAILJS_PUBLIC_KEY,
        }
      )
      .then(
        () => {
          toast.success("Message sent");
        },
        (error) => {
          toast.error(error.text);
        }
      );
    e.target.reset(); //reset input fields
  };

  return (
    <section>
      <div className={` container ${styles.contact}`}>
        <h2>Contact Form</h2>
        <div className={styles.section}>
          <form ref={form} onSubmit={sendEmail}>
            <Card cardClass={styles.card}>
              <label>Name:</label>
              <input
                type="text"
                required
                name="user_name"
                placeholder="Full Name"
              />
              <label>Email:</label>
              <input
                type="email"
                required
                name="user_email"
                placeholder="Email"
              />
              <label>Subject:</label>
              <input
                type="text"
                required
                name="subject"
                placeholder="Subject"
              />
              <label>Message:</label>
              <textarea name="message" maxLength={400} rows={5} />
              <button type="submit" className="--btn --btn-primary">
                Send Message
              </button>
            </Card>
          </form>

          <div className={styles.details}>
            <Card cardClass={styles.card2}>
              <h3>Our Contact Info</h3>
              <p>Fill the form or contact us via the channels below:</p>
              <div className={styles.icons}>
                <span>
                  <FaPhoneAlt size={20} />
                  <p>+12 3456-7891</p>
                </span>
                <span>
                  <FaEnvelope size={20} />
                  <p>support@zshop.com</p>
                </span>
                <span>
                  <FaMapMarkedAlt size={20} />
                  <p>Manaus, Brazil</p>
                </span>
                <span>
                  <FaInstagram size={20} />
                  <p>@zshop</p>
                </span>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
