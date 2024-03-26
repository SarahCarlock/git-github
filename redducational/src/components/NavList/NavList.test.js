import { screen } from "@testing-library/react";

import { renderWithProviders } from "../../testSetup/setupTests";
import { createRouterProvider } from "../../testSetup/testRouters";
import { testState1 } from "../../testSetup/testState";
import NavList from "./NavList";

test('Post listings are rendered within the NavList', () => {
  const nav = createRouterProvider(<NavList />);
  renderWithProviders(nav, { preloadedState: testState1 });
  expect(screen.getByText("All")).toBeInTheDocument();
  expect(screen.getByText("Cat 1")).toBeInTheDocument();
  expect(screen.getByText("Cat 2")).toBeInTheDocument();
});