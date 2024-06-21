//custom hook for fetching the products from collection in database

//react hooks
import { useEffect, useState } from "react";

//firebase
import { collection, query, orderBy, onSnapshot } from "firebase/firestore";
import { db } from "../firebase/config"; //local config

const useFetchCollection = (collectionName) => {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const getCollection = () => {
    try {
      setIsLoading(true);

      //get data db reference (database in the firebase app)
      //collection name will be passed as argument (will be "products" in this case")
      const docRef = collection(db, collectionName);

      //get the products by upload time (more recent) will be the default
      const q = query(docRef, orderBy("createdAt", "desc"));

      //get the products id and info from the snapshot
      onSnapshot(q, (snapshot) => {
        // console.log(snapshot.docs);
        const allData = snapshot.docs.map((doc) => ({
          //add the id to the doc (it will be fetched without id, so we need to put it back)
          id: doc.id,
          ...doc.data(),
        }));
        setData(allData);
        // console.log("all data:", allData);
        setIsLoading(false);
      });
    } catch (error) {
      console.log("fetching error:", error);
      setIsLoading(false);
    }
  };

  //when rendering page, fetch the data from db
  useEffect(() => {
    getCollection();
  }, []);

  return { data, isLoading };
};

export default useFetchCollection;
