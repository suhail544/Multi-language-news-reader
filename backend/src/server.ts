import express from "express";
import { importRssFeed } from "./services/rss.service";

const app = express();

app.use(express.json());

app.post("/test-import", async (req, res) => {
  try {
    const result = await importRssFeed(
      "https://feeds.bbci.co.uk/news/rss.xml",
      1, // BBC source ID
      1  // English language ID
    );

    res.json(result);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to import RSS feed",
    });
  }
});

app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});