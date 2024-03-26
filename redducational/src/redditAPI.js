import askhistorians from './data/topAllTimeListings/askhistorians.json';
import askscience from './data/topAllTimeListings/askscience.json';
import everythingscience from './data/topAllTimeListings/everythingscience.json';
import explainlikeimfive from './data/topAllTimeListings/explainlikeimfive.json';
import history from './data/topAllTimeListings/history.json';
import iwanttolearn from './data/topAllTimeListings/iwanttolearn.json';
import science from './data/topAllTimeListings/science.json';
import todayilearned from './data/topAllTimeListings/todayilearned.json';

const backupTopPostsJson = {
  askhistorians,
  askscience,
  everythingscience,
  explainlikeimfive,
  history,
  iwanttolearn,
  science,
  todayilearned,
};

export async function fetchSubTopPosts(sub, duration) {
  try {
    const url = `https://www.reddit.com/r/${sub}/top/.json?t=${duration}`;
    const response = await fetch(url);

    if (!response.ok) {
      console.log(`Request to ${url} was not successful.`);
      // Return static subreddit listings data (top posts of all time)
      const data = backupTopPostsJson[sub.toLowerCase()];
      return { data, successfulFetch: false };
    }

    const data = await response.json();
    return { data, successfulFetch: true };
  } catch(e) {
    // If fetch throws an error, e.g. CORS policy block
    // Try to return static subreddit listings data (top posts of all time)
    const data = backupTopPostsJson[sub.toLowerCase()];
    return { data, successfulFetch: false };
  }
}

export async function fetchPostComments(commentsPath) {
  const url = `https://www.reddit.com${commentsPath}.json`;
  const response = await fetch(url);
  const data = await response.json();
  return data;
}
