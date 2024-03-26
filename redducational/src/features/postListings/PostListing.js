import { useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";

import { selectAllPosts } from "../postContent/postContentSlice";
import PostListingItem from "../postContent/PostListingItem";
import { selectListingsLoadedStatus } from "./postListingsSlice";
import { selectListing } from "./postListingsSlice";

import utilStyles from "../../App/utils.module.css";
import styles from "./PostListing.module.css";

export default function PostListings({ name, search, gridArea }) {

  const listingsLoaded = useSelector(selectListingsLoadedStatus);
  const listing = useSelector(state => selectListing(state, name));
  const mainListing = useSelector(state => selectListing(state, "All"));
  const postsContent = useSelector(selectAllPosts);
  const [queryParams] = useSearchParams();

  function getCategoryPostIds() {
    const allPostIds = mainListing.postIds;
    const listingSubs = listing.includedSubs;
    const categoryPostIds = allPostIds.filter(postId => {
      // Post's subreddit is within listing's included subreddits
      const postSub = postsContent[postId].subreddit;
      return listingSubs.includes(postSub);
    });
    return categoryPostIds;
  }

  function getSearchPostIds() {
    const allPostIds = mainListing.postIds;
    const query = queryParams.get("q");
    if (!query) {
      return allPostIds;
    }

    const lowerCaseQuery = queryParams.get("q").toLowerCase();
    const searchPostIds = allPostIds.filter(postId => {
      // Post's title or subreddit name includes the search term (case-insensitive)
      const lowerCaseTitle = postsContent[postId].title.toLowerCase();
      const lowerCaseSub = postsContent[postId].subreddit.toLowerCase();
      return (lowerCaseTitle.includes(lowerCaseQuery) ||
              lowerCaseSub.includes(lowerCaseQuery));
    });
    return searchPostIds;
  }

  function generatePosts() {
    let postIds;
    if (name === "All") {
      postIds = mainListing.postIds;
    } else if (search) {
      postIds = getSearchPostIds();
    } else {
      postIds = getCategoryPostIds();
    }

    if (postIds.length === 0) {
      return <p>Sorry, no posts found.</p>
    }

    const listingIds = postIds.slice(0, 24);
    const posts = listingIds.map(id => <PostListingItem key={id} id={id} />);
    return <div>{posts}</div>;
  }

  return (
    <div style={{gridArea}} className={styles.postListing}>
      <div className={styles.listingHeader}>
        <h2 className={styles.h2}>{name}</h2>
        <div className={utilStyles.hLine}></div>
      </div>
      {listingsLoaded ? generatePosts() : <p>Loading posts...</p>}
    </div>
  );
}
