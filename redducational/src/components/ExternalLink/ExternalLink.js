import { MdOpenInNew } from "react-icons/md";

import styles from "./ExternalLink.module.css";

export default function ExternalLink({ anchor, href }) {
  return (
    <div className={styles.externalLink}>
      <MdOpenInNew className={styles.icon} size={20} />
      <a className={styles.link} href={href} target="_blank" rel="noreferrer">{anchor}</a>
    </div>
  );
}
