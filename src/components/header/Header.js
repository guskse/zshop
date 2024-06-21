import styles from "./Header.module.scss";
import { Link, NavLink } from "react-router-dom";
import { useEffect, useState } from "react";

import { AdminOnlyLink } from "../adminOnlyRoute/AdminOnlyRoute";

//redux
import { useSelector } from "react-redux";
//auth slice state
import { selectIsLoggedIn } from "../../redux/slice/authSlice";

//redux toolkit
import { useDispatch } from "react-redux";
import {
  SET_ACTIVE_USER,
  REMOVE_ACTIVE_USER,
} from "../../redux/slice/authSlice";

import {
  CALCULATE_TOTAL_ITEMS,
  selectCartTotalQuantity,
  selectCartItems,
} from "../../redux/slice/cartSlice";

//cart icon and other icons
import { FaShoppingCart, FaTimes } from "react-icons/fa";
import { HiOutlineMenuAlt3 } from "react-icons/hi";

//firebase
import { signOut, onAuthStateChanged } from "firebase/auth";
import { auth } from "../../firebase/config";

//toast
import { toast } from "react-toastify";

//icon
import { FaUserCircle } from "react-icons/fa";

//Navigate
import { useNavigate } from "react-router-dom";

//logo component
const logo = (
  <div className={styles.logo}>
    <Link to="/">
      <h2>
        Shop <span>Z</span>
      </h2>
    </Link>
  </div>
);

const activeLink = ({ isActive }) => (isActive ? `${styles.active}` : "");

const Header = () => {
  const [showMenu, setShowMenu] = useState(false);
  const [userName, setUserName] = useState("");
  // const [scrollPage, setScrollPage] = useState(false);

  //auth redux state to check if user is logged in or not
  const isLoggedIn = useSelector(selectIsLoggedIn);

  const dispatch = useDispatch(); //redux dispatch

  const navigate = useNavigate();

  //hamburger menu toggle function
  const toggleMenu = () => {
    setShowMenu(!showMenu);
  };

  //hide hamburger menu function
  const hideMenu = () => {
    setShowMenu(false);
  };

  //firebase function to logout user
  const logoutUser = () => {
    signOut(auth)
      .then(() => {
        toast.success("User logged out");

        //send action to redux toolkit
        dispatch(REMOVE_ACTIVE_USER());

        navigate("/");
      })
      .catch((error) => {
        toast.error("Something went wrong");
      });
  };

  //MONITOR CURRENTLY SIGNED IN USER
  useEffect(() => {
    //check if user is logged in or not (keep track of changes in auth)
    onAuthStateChanged(auth, (user) => {
      if (user) {
        //if there is a user, get its id (uid)
        const uid = user.uid;

        setUserName(user.displayName);

        //send user info in action to redux toolkit
        dispatch(
          SET_ACTIVE_USER({
            email: user.email,
            userName: user.displayName,
            userID: uid,
          })
        );
      } else {
        setUserName("");
        dispatch(REMOVE_ACTIVE_USER());
      }
    });
  }, [dispatch]);

  //get cart total quantity
  const cartTotalQty = useSelector(selectCartTotalQuantity);
  const cartItems = useSelector(selectCartItems);

  //cart component
  const cart = (
    <span className={styles.cart}>
      <Link to="/cart">
        <FaShoppingCart size={20} />
        <span>{cartTotalQty}</span>
      </Link>
    </span>
  );

  useEffect(() => {
    //dispatch on render and everytime cartTotal changes, or cartItems changes
    dispatch(CALCULATE_TOTAL_ITEMS());
  }, [dispatch, cartTotalQty, cartItems]);

  // const fixHeader = () => {
  //   if (window.scrollY > 300) {
  //     setScrollPage(true);
  //   } else {
  //     setScrollPage(false);
  //   }
  // };

  //add event to check if user scrolled page ( will make header fixed )
  // window.addEventListener("scroll", fixHeader);

  return (
    // <header className={scrollPage ? `${styles.fixed}` : null}
    <header>
      <div className={styles.header}>
        {logo}

        {/* LEFT SIDE OF HEADER */}
        <nav
          className={
            showMenu ? `${styles["show-nav"]}` : `${styles["hide-nav"]}`
          }
        >
          <div
            className={
              showMenu
                ? `${styles["nav-wrapper"]} ${styles["show-nav-wrapper"]}`
                : `${styles["nav-wrapper"]}`
            }
            onClick={hideMenu}
          ></div>
          <ul onClick={hideMenu}>
            <li className={styles["logo-mobile"]}>
              {logo}
              <FaTimes size={22} color="#fff" onClick={hideMenu} />
            </li>

            {/* will only show this if it's a admin logged in */}
            <AdminOnlyLink>
              <li>
                <Link to="/admin/home">
                  <button className="--btn --btn-primary">Admin</button>
                </Link>
              </li>
            </AdminOnlyLink>

            <li>
              <NavLink to="/" className={activeLink}>
                Home
              </NavLink>
            </li>

            <li>
              <NavLink to="/contact" className={activeLink}>
                Contact Us
              </NavLink>
            </li>
          </ul>

          {/* RIGHT SIDE OF HEADER  */}
          <div className={styles["header-right"]} onClick={hideMenu}>
            <span className={styles.links}>
              {!isLoggedIn && (
                <NavLink to="/login" className={activeLink}>
                  Login
                </NavLink>
              )}
              {isLoggedIn && (
                <a href="/">
                  <FaUserCircle size={16} />
                  Hi, {userName}
                </a>
              )}
              {!isLoggedIn && (
                <NavLink to="/register" className={activeLink}>
                  Register
                </NavLink>
              )}
              <NavLink to="/order-history" className={activeLink}>
                My Orders
              </NavLink>
              {isLoggedIn && (
                <NavLink to="/" onClick={logoutUser}>
                  Logout
                </NavLink>
              )}
            </span>
            {cart}
          </div>
        </nav>

        {/* HAMBURGUER MENU  */}
        <div className={styles["menu-icon"]}>
          {cart}
          <HiOutlineMenuAlt3 size={28} onClick={toggleMenu} />
        </div>
      </div>
    </header>
  );
};

export default Header;
