import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { MdChatBubbleOutline, MdArrowUpward } from "react-icons/md";

import { selectPost } from "./postContentSlice";

import TextLabelPair from "../../components/TextLabelPair/TextLabelPair";
import utilStyles from "../../App/utils.module.css";
import styles from "./PostListingItem.module.css";

export default function PostListingItem({ id }) {

  const post = useSelector(state => selectPost(state, id));
  return (
    <article className={styles.listing}>
      <Link className={styles.link} to={post.commentsPath}>
        <div className={styles.content}>
          <TextLabelPair textOne={`r/${post.subreddit}`} textTwo={post.category} />
          <h3>{post.title}</h3>
          <div className={`${utilStyles.flexRow} ${utilStyles.darkGrey}`}>
            <MdArrowUpward className={utilStyles.upvoteIcon} size={24} />
            <div className={styles.marginRight}>{post.upvotes} votes</div>
            <div className={styles.comments}>
              <MdChatBubbleOutline className={styles.chatIcon} size={24} />
              <div>{post.commentCount} comments</div>
            </div>
          </div>
        </div>
      </Link>
    </article>
  );
}