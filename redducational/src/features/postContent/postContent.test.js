// External libraries
import { screen } from "@testing-library/react";

// PostDetail
import PostDetail from "./PostDetail";

// postContentSlice
import reducer from "./postContentSlice";
import { initialState } from "./postContentSlice";
import { addPost } from "./postContentSlice";

// Test setup
import { renderWithProviders } from "../../testSetup/setupTests";
import { createRouterProvider } from "../../testSetup/testRouters";
import { testState1 } from "../../testSetup/testState";


describe('PostDetail.js', () => {

  test('Self text content is rendered if the post is a self post', () => {
    const routing = createRouterProvider(<PostDetail />, "/:id/", ["/1/"]);
    renderWithProviders(routing, { preloadedState: testState1 });
    expect(screen.getByText("Post 1 Self Text")).toBeInTheDocument();
  });

  test('An external link is rendered if the post is not a self post', () => {
    const routing = createRouterProvider(<PostDetail />, "/:id/", ["/2/"]);
    renderWithProviders(routing, { preloadedState: testState1 });
    expect(screen.getByText("Visit external link")).toBeInTheDocument();
  });

  test('Comments are rendered if the fetch was successful', () => {
    const routing = createRouterProvider(<PostDetail />, "/:id/", ["/1/"]);
    renderWithProviders(routing, { preloadedState: testState1 });
    expect(screen.getByText("Comment 1")).toBeInTheDocument();
    expect(screen.getByText("Comment 2")).toBeInTheDocument();
    expect(screen.getByText("Comment 3")).toBeInTheDocument();
  });

  test('A loading message is rendered if the comments fetch is pending', () => {
    const routing = createRouterProvider(<PostDetail />, "/:id/", ["/2/"]);
    renderWithProviders(routing, { preloadedState: testState1 });
    expect(screen.getByText("Loading comments...")).toBeInTheDocument();
  });

  test('A loading message is rendered if the comments fetch has not yet been initiated', () => {
    const routing = createRouterProvider(<PostDetail />, "/:id/", ["/4/"]);
    renderWithProviders(routing, { preloadedState: testState1 });
    expect(screen.getByText("Loading comments...")).toBeInTheDocument();
  });

  test('An error message is rendered if the comments fetch failed', () => {
    const routing = createRouterProvider(<PostDetail />, "/:id/", ["/3/"]);
    renderWithProviders(routing, { preloadedState: testState1 });
    expect(screen.getByText("Sorry, comments couldn't be loaded.")).toBeInTheDocument();
  });
});


describe('MarkdownLinkRenderer.js', () => {

  test('Comment links contain `target="_blank"` & `rel="noreferrer"` attributes', () => {
    const routing = createRouterProvider(<PostDetail />, "/:id/", ["/1/"]);
    renderWithProviders(routing, { preloadedState: testState1 });

    const link = screen.getByRole("link", { name: "comment link" });
    expect(link).toHaveAttribute("target", "_blank");
    expect(link).toHaveAttribute("rel", "noreferrer");
  });
});


describe('postListingsSlice.js', () => {

  test('addPost adds a subreddit to the initial state', () => {
    const payload = { id: "id1", title: 'post title' };
    expect(reducer(initialState, addPost(payload))).toEqual({
      ...initialState,
      posts: { id1: payload }
    });
  });
});