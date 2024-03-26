import { Link } from "react-router-dom";

import SearchBar from "../SearchBar/SearchBar";
import utilStyles from "../../App/utils.module.css";
import styles from "./Header.module.css";

export default function Header({ gridArea }) {
  return (
    <header className={styles.header} style={{gridArea}}>
      <div className={styles.appName}>
        <Link className={styles.link} to="/">
          <h1 className={styles.h1}><span className={utilStyles.orange}>redd</span>ucational</h1>
        </Link>
      </div>
      <SearchBar />
    </header>
  );
}
