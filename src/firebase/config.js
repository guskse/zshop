import { initializeApp } from "firebase/app";

//npm install firebase to have access to the firebase services
//get firebase services (auth, db and storage)
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_APIKEY,
  authDomain: "shop-z.firebaseapp.com",
  projectId: "shop-z",
  storageBucket: "shop-z.appspot.com",
  messagingSenderId: "1071944931195",
  appId: "1:1071944931195:web:8d63ee19659317cc5f8fde",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

//export the firebase app
export default app;
