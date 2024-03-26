import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import { fetchPostComments } from "../../redditAPI";

export const fetchPostCommentData = createAsyncThunk(
  "postContent/fetchPostCommentsStatus",
  async ({ commentsPath, postId }) => {
    const postData = await fetchPostComments(commentsPath);
    const commentsData = postData[1].data.children;

    const comments = [];
    commentsData.forEach(obj => {
      if (obj.kind === "t1") {
        const comment = obj.data;
        if (comment.body !== "[removed]") {
          comments.push({
            author: comment.author,
            body: comment.body,
            id: comment.id,
            score: comment.score,
            scoreHidden: comment.score_hidden,
          });
        }
      }
    });

    return { comments, postId };
  }
);

export const initialState = { posts: {} };
export const postContent = createSlice({
  name: "postContent",
  initialState,
  reducers: {
    addPost(state, action) {
      const { id } = action.payload;
      state.posts[id] = action.payload;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(fetchPostCommentData.pending, (state, action) => {
        const { postId } = action.meta.arg;
        state.posts[postId].commentsStatus = "pending";
      })
      .addCase(fetchPostCommentData.fulfilled, (state, action) => {
        const { comments, postId } = action.payload;
        state.posts[postId].comments = comments;
        state.posts[postId].commentsStatus = "fulfilled";
      })
      .addCase(fetchPostCommentData.rejected, (state, action) => {
        const { postId } = action.meta.arg;
        state.posts[postId].commentsStatus = "rejected";
      })
  },
});

export const { addPost } = postContent.actions;

export const selectAllPosts = (state) => state.postContent.posts;
export const selectPost = (state, id) => state.postContent.posts[id];

export default postContent.reducer;
