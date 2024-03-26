import { NavLink } from "react-router-dom";

import styles from "./NavButton.module.css";

export default function NavButton({ anchor, path }) {
  return <NavLink 
    className={({ isActive }) => isActive ?
      `${styles.navButton} ${styles.navButtonActive}` : styles.navButton}
    to={path}
  >{anchor}</NavLink>;
}