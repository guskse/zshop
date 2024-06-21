import styles from "./Pagination.module.scss";

import { useState } from "react";

const Pagination = ({
  currentPage,
  setCurrentPage,
  productsPerPage,
  totalProducts,
}) => {
  const pageNumbers = [];
  const totalPages = totalProducts / productsPerPage;

  //Limit the page numbers shown
  const [pageNumberLimit, setPageNumberLimit] = useState(5);
  const [maxPageNumberLimit, setMaxPageNumberLimit] = useState(5);
  const [minPageNumberLimit, setMinPageNumberLimit] = useState(0);

  for (let i = 1; i <= Math.ceil(totalProducts / productsPerPage); i++) {
    pageNumbers.push(i);
  }

  //function to go back to top of page when clicking in the pagination
  const backToTop = () => {
    window.scrollTo({
      top: 400,
      behavior: "smooth",
    });
  };

  //Paginate
  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
    backToTop();
  };

  //Go to next page
  const paginateNext = () => {
    setCurrentPage(currentPage + 1);

    backToTop();

    //show next set of pageNumbers depending on current page
    if (currentPage + 1 > maxPageNumberLimit) {
      setMaxPageNumberLimit(maxPageNumberLimit + pageNumberLimit);
      setMinPageNumberLimit(minPageNumberLimit + pageNumberLimit);
    }
  };

  //Go to prev page
  const paginatePrev = () => {
    setCurrentPage(currentPage - 1);

    backToTop();

    //show prev set of pageNumbers
    if ((currentPage - 1) % pageNumberLimit === 0) {
      setMaxPageNumberLimit(maxPageNumberLimit - pageNumberLimit);
      setMinPageNumberLimit(minPageNumberLimit - pageNumberLimit);
    }
  };

  return (
    <ul className={styles.pagination}>
      <li
        onClick={paginatePrev}
        className={currentPage === pageNumbers[0] ? `${styles.hidden}` : null}
      >
        Prev
      </li>

      {pageNumbers.map((pageNumber) => {
        if (
          pageNumber < maxPageNumberLimit + 1 &&
          pageNumber > minPageNumberLimit
        ) {
          return (
            <li
              key={pageNumber}
              onClick={() => paginate(pageNumber)}
              className={currentPage === pageNumber ? `${styles.active}` : ""}
            >
              {pageNumber}
            </li>
          );
        } else {
          return null;
        }
      })}

      <li
        onClick={paginateNext}
        className={
          currentPage === pageNumbers[pageNumbers.length - 1]
            ? `${styles.hidden}`
            : null
        }
      >
        Next
      </li>

      <p>
        <b className={styles.page}>{`page ${currentPage} `}</b>
        <span> of </span>
        <b>{`${Math.ceil(totalPages)}`} </b>
      </p>
    </ul>
  );
};

export default Pagination;
