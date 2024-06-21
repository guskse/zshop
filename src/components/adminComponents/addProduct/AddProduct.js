import styles from "./AddProduct.module.scss";

//hooks
import { useState } from "react";
import { useNavigate } from "react-router-dom";

//used to get the id from the url to edit product
import { useParams } from "react-router-dom";

//card component
import Card from "../../card/Card";

//load component
import Loading from "../../loading/Loading";

//import components from firebase local config
import { storage, db } from "../../../firebase/config";
//firebase firestore (for image storage and other data)
import {
  ref,
  uploadBytesResumable,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import { Timestamp, addDoc, collection, doc, setDoc } from "firebase/firestore";

//toast
import { toast } from "react-toastify";

//redux hooks
import { useSelector } from "react-redux";
import { selectProducts } from "../../../redux/slice/productSlice";

//categories array (for products category options in the form)
const categories = [
  { id: 1, name: "Laptop" },
  { id: 2, name: "Electronics" },
  { id: 3, name: "Fashion" },
  { id: 4, name: "Phone" },
  { id: 5, name: "Games" },
];

const AddProduct = () => {
  //get product from productSlice (redux toolkit) if there is any
  const { products } = useSelector(selectProducts);

  //get the id from the url (if edit)
  const { id } = useParams();

  //get a hold of the product that will be edited (by finding it by id)
  const productEdit = products.find((item) => id === item.id);

  //will be used to clean inputs after submitting the form
  const initialState = {
    name: "",
    imageURL: "",
    price: 0,
    category: "",
    brand: "",
    desc: "",
  };

  //detect form (if its to ADD product or ADD a product)
  //and return a value accordingly (can be a function or string etc...)
  const detectForm = (id, f1, f2) => {
    if (id === "ADD") {
      return f1;
    } else {
      return f2;
    }
  };

  //set initial state of product (will have product info if EDIT or will be empty if ADD)
  const [product, setProduct] = useState(() => {
    const newState = detectForm(id, { ...initialState }, productEdit);
    return newState;
  });

  //progress bar
  const [uploadProgress, setUploadProgress] = useState(0);

  //loading state
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e) => {
    //get name and value from e.target (inputs)
    const { name, value } = e.target;

    //set the product state to be the inputs values from the form
    setProduct({
      ...product,
      [name]: value,
    });
  };

  const handleImageChange = (e) => {
    //get a hold of the file uploaded in the input of form
    const file = e.target.files[0];

    if (file !== undefined) {
      //add date.now() to the name of file to make it unique everytime we upload a file
      //avoid files with same name
      const storageRef = ref(storage, `shopz/${Date.now()}${file.name}`);

      //upload the file to the firebase storage
      const uploadTask = uploadBytesResumable(storageRef, file);

      //get a hold of the status progress of the upload
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setUploadProgress(progress);
        },
        (error) => {
          //if something goes wrong with the upload, show message in toast container
          toast.error(error.message);
        },
        () => {
          //if all is good, get the URL image and put it in the product state
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            //get the URL in the database, for the image uploaded
            //and add it to the product state (product.imageURL)
            setProduct({ ...product, imageURL: downloadURL });
            //show success message in toast container :)
            toast.success("Image uploaded successfully");
          });
        }
      );
    }
  };

  const navigate = useNavigate();

  //finally add the product to the database
  const addProduct = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const docRef = await addDoc(collection(db, "products"), {
        name: product.name,
        imageURL: product.imageURL,
        price: Number(product.price),
        category: product.category,
        brand: product.brand,
        desc: product.desc,
        createdAt: Timestamp.now().toDate(),
      });
      console.log("docRef:", docRef);
      setProduct({ ...initialState });
      setIsLoading(false);
      toast.success("Product Created Successfully.");
      setUploadProgress(0);
      navigate("/admin/all-products");
    } catch (error) {
      toast.error(error.message);
      setIsLoading(false);
    }
  };

  //EDIT PRODUCT FUNCTION
  const editProduct = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    //if image has been edited, delete the previous and use the new one
    if (product.imageURL !== productEdit.imageURL) {
      //1º get the ref (image url) of the image associated with the product
      const storageRef = ref(storage, productEdit.imageURL);

      //2º delete the old image associated with the product
      await deleteObject(storageRef);
    }

    try {
      //edit product (firebase) by getting product id (from params)
      await setDoc(doc(db, "products", id), {
        name: product.name,
        imageURL: product.imageURL,
        price: Number(product.price),
        category: product.category,
        brand: product.brand,
        desc: product.desc,
        createdAt: productEdit.createdAt, //preserve the createdAt of product
        editedAt: Timestamp.now().toDate(),
      });
      setIsLoading(false);
      toast.success("Product Edited Successfully");
      setProduct(initialState);
      setUploadProgress(0);
      navigate("/admin/all-products");
    } catch (error) {
      toast.error(error.message);
      setIsLoading(false);
    }
  };

  return (
    <>
      {isLoading && <Loading />}
      <div className={styles.product}>
        <h2>{detectForm(id, "Add New Product", "Edit Product")}</h2>
        <Card cardClass={styles.card}>
          <form onSubmit={detectForm(id, addProduct, editProduct)}>
            <label>Product name:</label>
            <input
              type="text"
              placeholder="Product name"
              required
              value={product.name}
              name="name"
              onChange={(e) => handleInputChange(e)}
              autoComplete="off"
            />

            <label>Product image:</label>
            <Card className={styles.group}>
              {uploadProgress === 0 ? null : (
                <div className={styles.progress}>
                  <div
                    className={styles["progress-bar"]}
                    style={{ width: `${uploadProgress}%` }}
                  >
                    {uploadProgress < 100
                      ? `Uploading ${uploadProgress}%`
                      : ` Upload Completed ${uploadProgress}%`}
                  </div>
                </div>
              )}

              <input
                type="file"
                accept="image/*"
                placeholder="Upload Image"
                name="image"
                onChange={(e) => handleImageChange(e)}
              />

              {/* only show upload image input field when upload is 100% completed */}
              {product.imageURL === "" ? null : (
                <>
                  <label>Image URL</label>
                  <input
                    type="text"
                    // required
                    placeholder="Image URL"
                    name="imageURL"
                    value={product.imageURL}
                    disabled
                  />
                </>
              )}
            </Card>

            <label>Product price:</label>
            <input
              type="number"
              placeholder="Product price"
              value={product.price}
              name="price"
              onChange={(e) => handleInputChange(e)}
              required
              autoComplete="off"
              min={0}
              max={50000}
            />

            <label>Product category:</label>
            <select
              name="category"
              value={product.category}
              onChange={(e) => handleInputChange(e)}
              required
            >
              {/* first option - default option (disabled) */}
              <option value="" disabled>
                -- Choose product category --{" "}
              </option>

              {/* get the categories from the array  */}
              {/* cycle through the categories array */}
              {categories.map((category) => (
                <option key={category.id}>{category.name}</option>
              ))}
            </select>

            <label>Product Brand / Company:</label>
            <input
              type="text"
              placeholder="Product brand"
              value={product.brand}
              name="brand"
              onChange={(e) => handleInputChange(e)}
              required
              autoComplete="off"
            />

            <label>Product Description:</label>
            <textarea
              name="desc"
              cols="30"
              rows="5"
              value={product.desc}
              required
              onChange={(e) => handleInputChange(e)}
              autoComplete="off"
            />

            <button type="submit" className="--btn --btn-primary">
              {detectForm(id, "Save Product", "Edit Product")}
            </button>
          </form>
        </Card>
      </div>
    </>
  );
};

export default AddProduct;
