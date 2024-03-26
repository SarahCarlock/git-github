import ReactMarkdown from "react-markdown";
import { MdArrowUpward, MdPersonOutline } from "react-icons/md";

import MarkdownLinkRenderer from "./MarkdownLinkRenderer";
import utilStyles from "../../App/utils.module.css";
import styles from "./Comment.module.css";

export default function Comment({ comment }) {
  return (
    <article className={styles.comment}>
      <div className={`${utilStyles.flexRow} ${utilStyles.darkGrey}`}>
        <MdArrowUpward className={utilStyles.upvoteIcon} size={24} />
        <div className={styles.marginRight}>
          {comment.scoreHidden ? <span>???</span> : comment.score}
        </div>
        <div className={styles.username}>
          <MdPersonOutline className={styles.userIcon} size={24} />
          <div>{comment.author}</div>
        </div>
      </div>
      <div>
        <ReactMarkdown components={{a: MarkdownLinkRenderer}}>{comment.body}</ReactMarkdown>
      </div>
    </article>
  );
}
