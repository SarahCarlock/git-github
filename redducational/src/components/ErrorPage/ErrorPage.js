import { Link, useRouteError } from "react-router-dom";

import styles from "./ErrorPage.module.css";

export default function ErrorPage() {
  const error = useRouteError();
  console.error(error);

  return (
    <div id="error-page" className={styles.center}>
      <h1>Oops!</h1>
      <p>Sorry, an unexpected error has occurred.</p>
      <p>
        <em>{error.statusText || error.message}</em>
      </p>
      <hr></hr>
      <h3>
        <Link to="/">Go to the homepage</Link>
      </h3>
    </div>
  );
}