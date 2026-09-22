import express from "express";
import { fetchRssFeed } from "./services/rss.service";

const app = express();

app.use(express.json());

app.get("/test-rss", async (req, res) => {
  try {
    const feed = await fetchRssFeed(
      "https://feeds.bbci.co.uk/news/rss.xml"
    );

    res.json({
      title: feed.title,
      articleCount: feed.items.length,
      articles: feed.items.slice(0, 5),
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch RSS feed",
    });
  }
});

app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});