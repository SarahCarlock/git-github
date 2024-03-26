import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Outlet } from "react-router-dom";

import { allSubreddits } from "../data/subreddits";
import { categories } from "../data/categories";
import { addSubreddit, addListing } from "../features/postListings/postListingsSlice";
import { changeStaticDataLoadedStatus, selectStaticDataLoadedStatus } from "../features/postListings/postListingsSlice";
import { fetchListingsData } from "../features/postListings/postListingsSlice";

import Header from "../components/Header/Header";
import NavList from "../components/NavList/NavList";
import styles from "./App.module.css";

function App() {

  const dispatch = useDispatch();
  const staticDataLoaded = useSelector(selectStaticDataLoadedStatus);

  useEffect(() => {
    // Load array of source subreddit names (used to fetch data) into state
    allSubreddits.forEach(subreddit => {
      dispatch(addSubreddit({ name: subreddit }));
    });

    // Load category names & paths (used to render category list) into state
    categories.forEach(category => {
      dispatch(addListing({
        name: category.name,
        path: category.path,
        includedSubs: category.includedSubs,
        postIds: []
      }));
    })

    dispatch(changeStaticDataLoadedStatus({ loaded: true }));
  }, [dispatch]);

  useEffect(() => {
    // Fetch post listings data
    if (staticDataLoaded) {
      dispatch(fetchListingsData());
    }
  }, [staticDataLoaded, dispatch]);

  return (
    <div className={styles.App}>
      <Header gridArea="header" />
      <NavList gridArea="nav" />
      <main>
        <Outlet />
      </main>
    </div>
  );
}

export default App;
