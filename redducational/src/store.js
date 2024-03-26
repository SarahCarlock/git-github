import { configureStore } from "@reduxjs/toolkit";

import postContentReducer from "./features/postContent/postContentSlice";
import postListingsReducer from "./features/postListings/postListingsSlice";

const reducers = {
  postContent: postContentReducer,
  postListings: postListingsReducer,
};

export default configureStore({
  reducer: reducers
});

export const setupStore = preloadedState => {
  return configureStore({
    reducer: reducers,
    preloadedState
  })
};