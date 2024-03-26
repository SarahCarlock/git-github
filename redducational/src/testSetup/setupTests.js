import React from "react";
import "@testing-library/jest-dom";
import { render } from "@testing-library/react";
import { Provider } from "react-redux";

import { server } from "./mocks/server";
import { setupStore } from "../store";

// https://redux.js.org/usage/writing-tests#integration-testing-connected-components-and-redux-logic
// https://testing-library.com/docs/react-testing-library/setup/#custom-render
// https://mswjs.io/docs/getting-started/integrate/node

// Establish API mocking before all tests
beforeAll(() => server.listen());

// Reset any request handlers after each test
afterEach(() => server.resetHandlers());

// Clean up after all tests are finished
afterAll(() => server.close());

export function renderWithProviders(
  ui,
  {
    preloadedState = {},
    // Automatically create a store instance if no store was passed in
    store = setupStore(preloadedState),
    ...renderOptions
  } = {}
) {
  function Wrapper({ children }) {
    return <Provider store={store}>{children}</Provider>;
  }

  // Return an object with the store and all of React Testing Library's query functions
  return { store, ...render(ui, { wrapper: Wrapper, ...renderOptions }) };
}