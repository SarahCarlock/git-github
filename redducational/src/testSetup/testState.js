export const testState1 = {
  postListings: {
    staticDataLoaded: true,
    subreddits: {},
    listingsLoaded: true,
    listings: {
      "All": {
        name: "All",
        path: "",
        includedSubs: ["Sub1", "Sub2", "Sub3"],
        postIds: ["1", "2", "3", "4", "5", "6", "20"]
      },
      "Cat 1": {
        name: "Cat 1",
        path: "cat-1",
        includedSubs: ["Sub1", "Sub3"],
        postIds: []
      },
      "Cat 2": {
        name: "Cat 2",
        path: "cat-2",
        includedSubs: ["Sub2"],
        postIds: []
      },
      "Empty Listing": {
        name: "Empty Listing",
        path: "empty-listing",
        includedSubs: [],
        postIds: []
      }
    }
  },
  postContent: { 
    posts: {
      "1": {
        category: "Cat 1",
        id: "1",
        isSelfPost: true,
        selfText: "Post 1 Self Text",
        subreddit: "Sub1",
        title: "Post 1",
        commentsStatus: "fulfilled",
        comments: [
          {
            author: "CommentAuthor1",
            body: "Comment 1",
            id: 1,
            score: 100,
            scoreHidden: false
          },
          {
            author: "CommentAuthor2",
            body: "Comment 2",
            id: 2,
            score: 80,
            scoreHidden: false
          }, 
          {
            author: "CommentAuthor3",
            body: "Comment 3",
            id: 3,
            score: 60,
            scoreHidden: false
          },
          {
            author: "CommentAuthor4",
            body: "Comment with a [comment link](https://www.example.com/)",
            id: 4,
            score: 40,
            scoreHidden: false
          }
        ]
      },
      "2": {
        category: "Cat 2",
        id: "2",
        isSelfPost: false,
        link: "https://www.example.com/",
        subreddit: "Sub2",
        title: "Post 2",
        commentsStatus: "pending"
      },
      "3": {
        category: "Cat 1",
        id: "3",
        subreddit: "Sub3",
        title: "Post 3",
        commentsStatus: "rejected"
      },
      "4": {
        category: "Cat 1",
        id: "4",
        subreddit: "Sub1",
        title: "Post 4"
      },
      "5": {
        category: "Cat 2",
        id: "5",
        subreddit: "Sub2",
        title: "Post 5"
      },
      "6": {
        category: "Cat 1",
        id: "6",
        subreddit: "Sub3",
        title: "Post 6"
      },
      "20": {
        category: "Cat 2",
        id: "20",
        subreddit: "Sub2",
        title: "Post 20"
      },
    }
  }
};