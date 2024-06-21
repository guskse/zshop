//allow to use dotenv variables
require("dotenv").config();

const express = require("express");

const cors = require("cors");

//stripe with secretKey from .env (key from stripe app)
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

const app = express();

app.use(
  cors({
    origin: "http://localhost:4243", // use your actual domain name (or localhost), using * is not recommended
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "HEAD", "OPTIONS"],
    allowedHeaders: [
      "Content-Type",
      "Origin",
      "X-Requested-With",
      "Accept",
      "x-client-key",
      "x-client-token",
      "x-client-secret",
      "Authorization",
    ],
    credentials: true,
  })
);

//allow json responses
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Welcome to Shop Z Website");
});

const array = [];
const calculateOrderAmount = (items) => {
  //calculate order amount on the server to prevent
  //people from directly manipulating the amount on the client

  items.map((item) => {
    const { price, cartQuantity } = item;
    const cartItemAmount = price * cartQuantity;
    return array.push(cartItemAmount);
  });
  const totalAmount = array.reduce((a, b) => {
    return a + b;
  });

  return totalAmount * 100; //in cents
};

//payment intent
app.post("/create-payment-intent", async (req, res) => {
  console.log(req.body);

  //will be sent by front-end
  const { items, shipping, description } = req.body;

  //create paymentIntent with the order amount and currency
  const paymentIntent = await stripe.paymentIntents.create({
    amount: calculateOrderAmount(items),
    currency: "usd",
    automatic_payment_methods: {
      enabled: true,
    },
    description: description,
    shipping: {
      address: {
        line1: shipping.line1,
        line2: shipping.line2,
        city: shipping.city,
        country: shipping.country,
        postal_code: shipping.postal_code,
      },
      name: shipping.name,
      phone: shipping.phone,
    },
  });

  res.send({
    clientSecret: paymentIntent.client_secret,
  });
});

//listening on port
const PORT = process.env.PORT || 4242;
app.listen(PORT, () => console.log(`Node Server listening on port ${PORT}`));
