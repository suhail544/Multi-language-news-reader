import { useEffect, useState } from "react";
import axios from "axios";
import type { Article } from "./types";
import "./App.css";

function App() {
  const [language, setLanguage] = useState("en");
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [refreshKey, setRefreshKey] = useState(0);
  const [importing, setImporting] = useState(false);

  useEffect(() => {
    async function fetchArticles() {
      try {
        setLoading(true);
        setError("");

        const response = await axios.get("http://localhost:3000/api/articles", {
          params: {
            language,
            search,
            page,
            limit: 10,
          },
        });

        setArticles(response.data.articles);
        setTotalPages(response.data.totalPages);
      } catch (error) {
        console.error(error);
        setError("Failed to fetch news articles.");
      } finally {
        setLoading(false);
      }
    }

    fetchArticles();
  }, [language, search, page, refreshKey]);

  async function handleRefresh() {
    try {
      setImporting(true);
      setError("");

      const sourceId = language === "en" ? 1 : 2;

      await axios.post(`http://localhost:3000/api/import/${sourceId}`);

      setPage(1);
      setRefreshKey((prev) => prev + 1);
    } catch (error) {
      console.error(error);
      setError("Failed to refresh news. Please try again.");
    } finally {
      setImporting(false);
    }
  }

  return (
    <div className="app">
      <header className="header">
        <h1>News Reader</h1>
        
        <select
          value={language}
          onChange={(event) => {
            setLanguage(event.target.value);
            setPage(1);
          }}
        >
          <option value="en">English</option>
          <option value="ta">தமிழ்</option>
        </select>

        <button onClick={handleRefresh} disabled={importing}>
          {importing ? "Refreshing..." : "Refresh News"}
        </button>
      </header>

      <main>
        <input
          type="text"
          placeholder="Search news..."
          className="search"
          value={search}
          onChange={(event) => {
            setSearch(event.target.value);
            setPage(1);
          }}
        />

        {loading && <p>Loading articles...</p>}

        {error && <p>{error}</p>}

        {!loading && !error && (
          <div className="news-list">
            {articles.map((article) => (
              <article key={article.id}>
                <h2>
                  <a href={article.url} target="_blank" rel="noreferrer">
                    {article.title}
                  </a>
                </h2>

                <p>{article.description}</p>

                <small>
                  {article.source.name} · {article.language.name}
                </small>
              </article>
            ))}
          </div>
        )}

        <div className="pagination">
          <button onClick={() => setPage(page - 1)} disabled={page === 1}>
            Previous
          </button>

          <span>
            Page {page} of {totalPages}
          </span>

          <button
            onClick={() => setPage(page + 1)}
            disabled={page === totalPages}
          >
            Next
          </button>
        </div>
      </main>
    </div>
  );
}

export default App;
