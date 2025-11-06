import React, { useState } from "react";
import axios from "axios";
import CrawlerForm from "./Crawler/CrawlerForm";
import PaperCard from "./Crawler/PaperCard";

export default function Crawler() {
  const [query, setQuery] = useState("");
  const [source, setSource] = useState("all");
  const [limit, setLimit] = useState(10);
  const [ieeeKey, setIeeeKey] = useState("");
  const [papers, setPapers] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleCrawl = async () => {
    if (!query.trim()) return;

    setLoading(true);
    setPapers([]);

    try {
      const res = await axios.get("http://127.0.0.1:8000/api/crawl/", {
        params: { query, source, limit, apiKey: ieeeKey, t: Date.now() },
      });
      setPapers(res.data.results || []);
    } catch (err) {
      console.error("Error fetching:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white">
      <div className="bg-gray-100 text-gray-900 p-6 rounded-xl shadow-lg w-full md:w-3/4">
        <CrawlerForm
          query={query}
          setQuery={setQuery}
          source={source}
          setSource={setSource}
          limit={limit}
          setLimit={setLimit}
          ieeeKey={ieeeKey}
          setIeeeKey={setIeeeKey}
          handleCrawl={handleCrawl}
          loading={loading}
        />

        <div className="mt-8">
          {papers.length > 0 ? (
            papers.map((p, i) => <PaperCard key={i} paper={p} index={i} />)
          ) : (
            !loading && (
              <p className="text-center text-gray-600">
                Enter a topic and click "Crawl" to see results.
              </p>
            )
          )}
        </div>
      </div>
    </div>
  );
}
