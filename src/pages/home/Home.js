import styles from "./Home.module.scss";

import { useEffect } from "react";

//admin only route button
import AdminOnlyRoute from "../../components/adminOnlyRoute/AdminOnlyRoute";

//Slider component
import Slider from "../../components/slider/Slider";

//product component
import Product from "../../components/product/Product";

//redux
import { useSelector } from "react-redux";
import { selectEmail } from "../../redux/slice/authSlice";

const Home = () => {
  //get the url
  const url = window.location.href;

  const scrollToProducts = () => {
    if (url.includes("#products")) {
      //go to #Products section
      window.scrollTo({
        top: 600, //height of slider (700px), will move from top 700px down
        behavior: "smooth",
      });
      return;
    }
  };

  //when first rendering the page, check if there is #products in the url
  //if so, it will go straight to id:#product section, else, will render normally
  useEffect(() => {
    scrollToProducts();
  }, [url]);

  //check if user is admin
  const userEmail = useSelector(selectEmail);
  //if email is admin email, show AdminOnlyRoute component

  return (
    <div>
      <Slider />
      {userEmail === "guskse@gmail.com" ? <AdminOnlyRoute /> : ""}
      <Product />
    </div>
  );
};

export default Home;
