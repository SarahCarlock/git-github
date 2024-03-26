import { createSlice } from "@reduxjs/toolkit";

import { fetchSubTopPosts } from "../../redditAPI";
import { addPost } from "../postContent/postContentSlice";

export const initialState = {
  staticDataLoaded: false,
  subreddits: {},
  listingsLoaded: false,
  listings: {}
};

export const postListings = createSlice({
  name: "postListings",
  initialState,
  reducers: {
    addSubreddit(state, action) {
      const { name } = action.payload;
      state.subreddits[name] = { name: name, postsRetrieved: false };
    },

    changeStaticDataLoadedStatus(state, action) {
      const { loaded } = action.payload;
      state.staticDataLoaded = loaded;
    },

    changeSubRetrievedStatus(state, action) {
      const { name, retrieved } = action.payload;
      state.subreddits[name].postsRetrieved = retrieved;
    },

    addListing(state, action) {
      const { name, path, includedSubs, postIds } = action.payload;
      state.listings[name] = { name, path, includedSubs, postIds };
    },

    changeListingsLoadedStatus(state, action) {
      const { loaded } = action.payload;
      state.listingsLoaded = loaded;
    },

    updateListingPostIds(state, action) {
      const { name, postIds } = action.payload;
      state.listings[name].postIds = postIds;
    },

  },
});

export const { addSubreddit } = postListings.actions;
export const { changeStaticDataLoadedStatus } = postListings.actions;
export const { changeSubRetrievedStatus } = postListings.actions;
export const { addListing } = postListings.actions;
export const { changeListingsLoadedStatus } = postListings.actions;
export const { updateListingPostIds } = postListings.actions;

export const selectSubreddits = (state) => state.postListings.subreddits;
export const selectStaticDataLoadedStatus = (state) => state.postListings.staticDataLoaded;
export const selectListingsLoadedStatus = (state) => state.postListings.listingsLoaded;
export const selectAllListings = (state) => state.postListings.listings;
export const selectListing = (state, name) => state.postListings.listings[name];


const getPostCategory = (post, listings) => {
  // Assumes each subreddit is in a single category
  // If not, the first inclusive category will be assigned as *the* category
  let postCategory = null;
  for (const key in listings) {
    if (key === "All") {
      continue;
    }
    const category = listings[key];
    if (category.includedSubs.includes(post.subreddit)) {
      postCategory = category.name;
      break;
    }
  }
  return postCategory;
}

const fetchSubPostData = (sub) => async (dispatch, getState) => {
  try {
    const { data, successfulFetch } = await fetchSubTopPosts(sub, 'day');
    const postsData = data.data.children.map(post => post.data);

    const state = getState();
    let listings = selectAllListings(state);  // Used to categorise posts

    postsData.forEach(post => {
      const postSummary = {
        author: post.author,
        category: getPostCategory(post, listings),
        commentCount: post.num_comments,
        commentsPath: post.permalink,
        id: post.id,
        isSelfPost: post.is_self,
        link: post.url,
        selfText: post.selftext,
        subreddit: post.subreddit,
        thumbnail: post.thumbnail,
        title: post.title,
        upvotes: post.ups,
      };
      dispatch(addPost(postSummary));
    });

    dispatch(changeSubRetrievedStatus({ name: sub, retrieved: successfulFetch }));

    return postsData.map(post => post.id);
  } catch(e) {
    throw(e);
  }
};

export const generateOrderedPostIds = postIds => {
  // postIds: array of arrays, each containing post ids for a given subreddit
  // Alternately merge arrays of ids into a single array (feed)
  // Arrays within array can be of unknown number and length
  // E.g. [[1, 2, 3], [4, 5]] becomes [1, 4, 2, 5, 3]
  const sourceArrays = [...postIds];
  
  let maxLength = 0;
  sourceArrays.forEach(a => {
    maxLength = a.length > maxLength ? a.length : maxLength;
  });

  const orderedIds = [];
  for (let i = 0; i < maxLength; i++) {
    sourceArrays.forEach(arr => {
      if (arr.length > i) {
        orderedIds.push(arr[i]);
      }
    });
  }
  return orderedIds;
};

export const fetchListingsData = () => async (dispatch, getState) => {
  // https://redux.js.org/usage/writing-logic-thunks
  // https://redux.js.org/tutorials/essentials/part-5-async-logic
  const state = getState();
  const subreddits = selectSubreddits(state);
  const subNames = Object.keys(subreddits);

  // Make fewer requests during development to avoid rate limit
  // const twoSubs = subNames.slice(2, 4);

  // Dispatch sub post requests asynchronously; wait for all to resolve or reject
  // Use `twoSubs` instead of `subNames` during development
  const settledPromises = await Promise.allSettled(subNames.map(sub => {
    return dispatch(fetchSubPostData(sub));
  }));

  const subPostIds = [];
  settledPromises.forEach(subPromise => {
    if (subPromise.status === "fulfilled") {
      subPostIds.push(subPromise.value);
    }
  });

  const orderedFeedIds = generateOrderedPostIds(subPostIds);
  dispatch(addListing({ name: "All", path: "", includedSubs: subNames, postIds: orderedFeedIds }));
  dispatch(changeListingsLoadedStatus({ loaded: true }));
};

export default postListings.reducer;
