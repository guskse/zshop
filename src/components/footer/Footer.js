import styles from "./Footer.module.scss";


//get current year
const date = new Date();
const year = date.getFullYear();

const Footer = () => {
  return (
    <div className={styles.footer}>
      &copy; {year} All rights reserved.
    </div>
  );
};

export default Footer;
