import { createMemoryRouter, RouterProvider } from "react-router-dom";
import { screen } from "@testing-library/react";

import App from "../App/App";

import { categoryListingRoutes } from "../routing";
import { renderWithProviders } from "../testSetup/setupTests";
import { createRouterProvider } from "../testSetup/testRouters";

// https://testing-library.com/docs/react-testing-library/intro
// https://jestjs.io/docs/asynchronous

test('App header content is rendered', () => {
  renderWithProviders(createRouterProvider(<App />));
  expect(screen.getByText("ucational")).toBeInTheDocument();
});

test('App nav link section is rendered', () => {
  renderWithProviders(createRouterProvider(<App />));
  expect(screen.getByText("Categories")).toBeInTheDocument();
});

test('Category listing routing', () => {
  const router = createMemoryRouter(categoryListingRoutes, {
    initialEntries: ["/categories/science"]
  });

  renderWithProviders(<RouterProvider router={router} />);
  expect(screen.getByText("Science")).toBeInTheDocument();
});
