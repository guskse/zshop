//custom hook for fetching document data from firebase

import { useState, useEffect } from "react";

//firebase imports
import { getDoc, doc } from "firebase/firestore";
import { db } from "../firebase/config";

//toast
import { toast } from "react-toastify";

const useFetchDocument = (collectionName, documentID) => {
  const [document, setDocument] = useState(null);

  const getDocument = async () => {
    const docRef = doc(db, collectionName, documentID);
    const docSnap = await getDoc(docRef);

    //if product is found and exist, put it in the product state
    if (docSnap.exists()) {
      //add the id to the object fetched
      const objectData = {
        id: documentID,
        ...docSnap.data(),
      };

      //set the data to the product state
      setDocument(objectData);
      // console.log("product details:", document);
    } else {
      toast.error("Document Not Found");
    }
  };

  useEffect(() => {
    getDocument();
  }, []);

  return { document };
};

export default useFetchDocument;
