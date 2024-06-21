import styles from "./Admin.module.scss";
import { Route, Routes } from "react-router-dom";

//admin components
import {
  Navbar,
  ViewProducts,
  AddProduct,
  Orders,
  AdminHome,
  AdminOrderDetails,
} from "../../components/adminComponents/index";

import NotFound from "../notFound/NotFound";

const Admin = () => {
  return (
    <div className={styles.admin}>
      <div className={styles.navbar}>
        <Navbar />
      </div>
      <div className={styles.content}>
        <Routes>
          <Route path="home" element={<AdminHome />} />
          <Route path="all-products" element={<ViewProducts />} />
          <Route path="add-product/:id" element={<AddProduct />} />
          <Route path="orders" element={<Orders />} />
          <Route path="order-details/:id" element={<AdminOrderDetails />} />
          <Route path="/*" element={<NotFound />} />
        </Routes>
      </div>
    </div>
  );
};

export default Admin;
