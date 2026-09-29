import express from "express";
import articleRoutes from "./routes/article.routes";
import rssRoutes from './routes/rss.routes'
import sourceRoutes from "./routes/source.routes";

const app = express();

app.use(express.json());

app.use("/api", articleRoutes);
app.use('/api', rssRoutes)
app.use("/api", sourceRoutes);

app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});