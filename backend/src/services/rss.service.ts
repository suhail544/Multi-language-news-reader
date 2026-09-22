import Parser from "rss-parser";

const parser = new Parser();

export async function fetchRssFeed(feedUrl: string) {
  try {
    const feed = await parser.parseURL(feedUrl);

    return feed;
  } catch (error) {
    console.error(`Failed to fetch RSS feed: ${feedUrl}`);
    throw error;
  }
}