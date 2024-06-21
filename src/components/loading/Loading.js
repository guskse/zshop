import styles from "./Loading.module.scss";

import ReactDOM from "react-dom";

//import image gif loader
import loaderImg from "../../assets/loader.gif";

const Loading = () => {
  return ReactDOM.createPortal(
    <div className={styles.wrapper}>
      <div className={styles.loader}>
        <img src={loaderImg} alt="loading spinner" />
      </div>
    </div>,
    document.getElementById("loader")
  );
};

export default Loading;
