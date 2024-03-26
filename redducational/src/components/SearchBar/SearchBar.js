import { MdSearch } from "react-icons/md";
import { Form } from "react-router-dom";

import styles from "./SearchBar.module.css";

export default function SearchBar() {
  return (
    <Form className={styles.searchForm} role="search" method="get" action="/search">
      <input
        id="q"
        className={styles.searchBar}
        name="q"
        type="search"
        placeholder="Search posts..."
        aria-label="Enter search query"
      />
      <button className={styles.searchButton} type="submit" aria-label="Search">
        <MdSearch color={'rgb(190, 195, 200)'} size={40} />
      </button>
    </Form>
  );
}