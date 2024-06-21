import "./App.scss";

//react router imports
import { BrowserRouter, Routes, Route } from "react-router-dom";

//components imports
import {
  Footer,
  Header,
  ProductDetails,
  ReviewProducts,
} from "./components/index";

//pages imports
import {
  Home,
  Contact,
  Login,
  Register,
  Reset,
  Admin,
  Cart,
  Checkout,
  CheckoutSuccess,
  CheckoutDetails,
  OrderHistory,
  OrderDetails,
  NotFound,
} from "./pages/index";

//react toastify
import { ToastContainer } from "react-toastify";
//toast css
import "react-toastify/dist/ReactToastify.css";

//admin only route component
import AdminOnlyRoute from "./components/adminOnlyRoute/AdminOnlyRoute";

function App() {
  return (
    <>
      <BrowserRouter>
        <ToastContainer autoClose={2000} />
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/reset" element={<Reset />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/review-product/:id" element={<ReviewProducts />} />
          <Route path="/order-history" element={<OrderHistory />} />
          <Route path="/checkout-details" element={<CheckoutDetails />} />
          <Route path="/checkout-success" element={<CheckoutSuccess />} />
          <Route path="/product-details/:id" element={<ProductDetails />} />
          <Route path="/order-details/:id" element={<OrderDetails />} />

          {/* ADMIN PATHS */}
          <Route
            path="/admin/*"
            element={
              <AdminOnlyRoute>
                <Admin />
              </AdminOnlyRoute>
            }
          />
          <Route path="/*" element={<NotFound />} />
        </Routes>

        <Footer />
      </BrowserRouter>
    </>
  );
}

export default App;
