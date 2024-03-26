import { rest } from "msw";

// https://mswjs.io/docs/getting-started/mocks/rest-api
// https://mswjs.io/docs/basics/request-matching
export const handlers = [
  // GET subreddit top posts request
  rest.get("https://www.reddit.com/r/*/top/*", (req, res, ctx) => {
    return res(
      ctx.status(429), // Simulate rate limiting so backup JSON is used
    )
  }),

  // GET post comments request
  rest.get("https://www.reddit.com/r/*/comments/*", (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        "kind": "Listing",
        "data": {}
      }),
    )
  }),
];
