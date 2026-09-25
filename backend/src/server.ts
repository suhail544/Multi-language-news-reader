import express from "express";
import { fetchRssFeed } from "./services/rss.service";
import { prisma } from "./services/database.service";
import { importRssFeed } from "./services/rss.service";

const app = express();

app.use(express.json());

app.get("/test-tamil-rss", async (req, res) => {
  try {
    const source = await prisma.newsSource.findUnique({
      where: {
        rssUrl: "https://tamil.oneindia.com/rss/feeds/tamil-news-fb.xml",
      },
    });
    if (!source) {
      return res.status(404).json({
        message: "not found",
      });
    }
    const result = await importRssFeed(
      source.rssUrl,
      source.id,
      source.languageId,
    );

    res.json(result);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch Tamil RSS feed",
    });
  }
});

app.get("/test-rss", async (req, res) => {
  try {
    const feed = await fetchRssFeed("https://feeds.bbci.co.uk/news/rss.xml");

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

app.get("/api/articles", async (req, res) => {
  try {
    const page = Math.max(
      1,
      Number.parseInt(String(req.query.page ?? "1"), 10) || 1,
    );

    const limit = Math.min(
      100,
      Math.max(1, Number.parseInt(String(req.query.limit ?? "10"), 10) || 10),
    );

    const skip = (page - 1) * limit;
    const languageCode =
      typeof req.query.language === "string" ? req.query.language : undefined;

    const searchTerm =
      typeof req.query.search === "string" ? req.query.search : undefined;

    const articles = await prisma.article.findMany({
      where: {
        ...(languageCode
          ? {
              language: {
                code: languageCode,
              },
            }
          : {}),

        ...(searchTerm
          ? {
              title: {
                contains: searchTerm,
                mode: "insensitive",
              },
            }
          : {}),
      },

      include: {
        source: true,
        language: true,
        category: true,
      },

      orderBy: {
        publishedAt: "desc",
      },

      skip,
      take: limit,
    });

    res.json({
      page,
      limit,
      total: articles.length,
      articles,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to fetch articles",
    });
  }
});

app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});
