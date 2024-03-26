// External libraries
import { screen } from "@testing-library/react";

// PostListing
import PostListing from "./PostListing";

// postListingsSlice
import reducer from "./postListingsSlice";
import { initialState } from "./postListingsSlice";
import { addSubreddit, changeStaticDataLoadedStatus, changeSubRetrievedStatus } from "./postListingsSlice";
import { addListing, changeListingsLoadedStatus, updateListingPostIds } from "./postListingsSlice";
import { generateOrderedPostIds } from "./postListingsSlice";

// Test setup
import { renderWithProviders } from "../../testSetup/setupTests";
import { createRouterProvider } from "../../testSetup/testRouters";
import { testState1 } from "../../testSetup/testState";


describe('PostListings.js', () => {

  test('Listing name is rendered', () => {
    const name = "Science";
    renderWithProviders(createRouterProvider(<PostListing name={name} />));
    expect(screen.getByText(name)).toBeInTheDocument();
  });

  test('Posts are not filtered when rendered in the `All` listing feed', () => {
    const listing = createRouterProvider(<PostListing name="All" />);
    renderWithProviders(listing, { preloadedState: testState1 });

    expect(screen.getByText("Post 1")).toBeInTheDocument();
    expect(screen.getByText("Post 2")).toBeInTheDocument();
    expect(screen.getByText("Post 3")).toBeInTheDocument();
    expect(screen.getByText("Post 4")).toBeInTheDocument();
  });
  
  test('Posts are filtered by subreddit when rendered in a category listing feed', () => {
    const listing = createRouterProvider(<PostListing name="Cat 1" />);
    renderWithProviders(listing, { preloadedState: testState1 });

    // Cat 1 should include Sub1 and Sub3 (posts 1, 3, 4, and 6)
    expect(screen.getByText("Post 1")).toBeInTheDocument();
    expect(screen.getByText("Post 3")).toBeInTheDocument();
    expect(screen.getByText("Post 4")).toBeInTheDocument();
    expect(screen.getByText("Post 6")).toBeInTheDocument();
    expect(screen.queryByText("Post 2")).toBeNull();
    expect(screen.queryByText("Post 5")).toBeNull();
  });

  test('Posts are filtered by title when rendered in a search listing feed', () => {
    const component = <PostListing name="Search Results" search={true} />;
    const routing = createRouterProvider(component, "/search", ["/search?q=post+2"]);
    renderWithProviders(routing, { preloadedState: testState1 });

    expect(screen.getByText("Post 2")).toBeInTheDocument();
    expect(screen.getByText("Post 20")).toBeInTheDocument();
    expect(screen.queryByText("Post 1")).toBeNull();
    expect(screen.queryByText("Post 3")).toBeNull();
    expect(screen.queryByText("Post 4")).toBeNull();
    expect(screen.queryByText("Post 5")).toBeNull();
  });

  test('Posts are filtered by subreddit when rendered in a search listing feed', () => {
    const component = <PostListing name="Search Results" search={true} />;
    const routing = createRouterProvider(component, "/search", ["/search?q=Sub2"]);
    renderWithProviders(routing, { preloadedState: testState1 });

    expect(screen.getByText("Post 2")).toBeInTheDocument();
    expect(screen.getByText("Post 5")).toBeInTheDocument();
    expect(screen.getByText("Post 20")).toBeInTheDocument();
    expect(screen.queryByText("Post 1")).toBeNull();
    expect(screen.queryByText("Post 3")).toBeNull();
    expect(screen.queryByText("Post 6")).toBeNull();
  });

  test('All posts are rendered in a search listing feed without a `q` param', () => {
    const component = <PostListing name="Search Results" search={true} />;
    const routing = createRouterProvider(component, "/search", ["/search"]);
    renderWithProviders(routing, { preloadedState: testState1 });

    expect(screen.getByText("Post 1")).toBeInTheDocument();
    expect(screen.getByText("Post 2")).toBeInTheDocument();
    expect(screen.getByText("Post 3")).toBeInTheDocument();
    expect(screen.getByText("Post 4")).toBeInTheDocument();
  });
  
  test('A listing feed containing no posts renders an error message', () => {
    const listing = createRouterProvider(<PostListing name="Empty Listing" />);
    renderWithProviders(listing, { preloadedState: testState1 });
    expect(screen.getByText("Sorry, no posts found.")).toBeInTheDocument();
  });  
});


describe('postListingsSlice.js', () => {

  test('addSubreddit adds a subreddit to the initial state', () => {
    expect(reducer(initialState, addSubreddit({ name: "Sub1" }))).toEqual({
      ...initialState,
      subreddits: { Sub1: { name: "Sub1", postsRetrieved: false } }
    });
  });

  test('addSubreddit adds a subreddit to a populated subreddits object', () => {
    const prevState = { subreddits: { Sub1: { name: "Sub1", postsRetrieved: false } } };
    expect(reducer(prevState, addSubreddit({ name: "Sub2" }))).toEqual({
      subreddits: {
        Sub1: { name: "Sub1", postsRetrieved: false },
        Sub2: { name: "Sub2", postsRetrieved: false }
      }
    });
  });

  test('changeStaticDataLoadedStatus changes state to true', () => {
    expect(reducer(initialState, changeStaticDataLoadedStatus({ loaded: true }))).toEqual({
      ...initialState,
      staticDataLoaded: true
    });
  });

  test('changeSubRetrievedStatus changes state to true', () => {
    const prevState = { subreddits: { Sub1: { name: "Sub1", postsRetrieved: false } } };
    const payload = { name: "Sub1", retrieved: true };
    expect(reducer(prevState, changeSubRetrievedStatus(payload))).toEqual({
      subreddits: { Sub1: { name: "Sub1", postsRetrieved: true } }
    });
  });

  test('addListing adds a listing to the initial state', () => {
    const listing = { name: "All", path: "", includedSubs: ['a', 'b', 'c'], postIds: [1, 2, 3] };
    expect(reducer(initialState, addListing(listing))).toEqual({
      ...initialState,
      listings: { "All": listing }
    });
  });

  test('addListing adds a listing to a populated listings object', () => {
    const prevListing = { name: "All", path: "", includedSubs: ['a', 'b', 'c'], postIds: [1, 2, 3] };
    const prevState = { listings: { "All": prevListing } };
    const newListing = { name: "Cat 1", path: "cat-1", includedSubs: ['a', 'c'], postIds: [1, 3] };

    expect(reducer(prevState, addListing(newListing))).toEqual({
      listings: {
        "All": prevListing,
        "Cat 1": newListing
      }
    });
  });

  test('changeListingsLoadedStatus changes state to true', () => {
    expect(reducer(initialState, changeListingsLoadedStatus({ loaded: true }))).toEqual({
      ...initialState,
      listingsLoaded: true
    });
  });

  test('updateListingPostIds overwrites a listing\'s postIds', () => {
    const prevListing = { name: "Cat 1", path: "cat-1", includedSubs: ['a', 'c'], postIds: [] };
    const prevState = { listings: { "Cat 1": prevListing } };
    const payload = { name: "Cat 1", postIds: [1, 3] };

    expect(reducer(prevState, updateListingPostIds(payload))).toEqual({
      listings: {
        "Cat 1": {
          ...prevListing,
          postIds: [1, 3]
        }
      }
    });
  });

  test('generateOrderedPostIds alternately merges 2 arrays of equal length', () => {
    const arr1 = ['1', '2', '3'];
    const arr2 = ['4', '5', '6'];
    const expected = ['1', '4', '2', '5', '3', '6'];
    expect(generateOrderedPostIds([arr1, arr2])).toEqual(expected);
  });

  test('generateOrderedPostIds alternately merges 2 arrays of unequal length', () => {
    const arr1 = ['1', '2'];
    const arr2 = ['3', '4', '5'];
    const expected = ['1', '3', '2', '4', '5'];
    expect(generateOrderedPostIds([arr1, arr2])).toEqual(expected);
  });

  test('generateOrderedPostIds alternately merges 3 arrays of unequal length', () => {
    const arr1 = ['1'];
    const arr2 = ['2', '3', '4'];
    const arr3 = ['5', '6'];
    const expected = ['1', '2', '5', '3', '6', '4'];
    expect(generateOrderedPostIds([arr1, arr2, arr3])).toEqual(expected);
  });

  test('generateOrderedPostIds returns expected result if an array is empty', () => {
    const arr1 = ['1', '2'];
    const arr2 = [];
    const arr3 = ['3', '4', '5'];
    const expected = ['1', '3', '2', '4', '5'];
    expect(generateOrderedPostIds([arr1, arr2, arr3])).toEqual(expected);
  });
});
