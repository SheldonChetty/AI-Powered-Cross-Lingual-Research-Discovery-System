import React from "react";

export default function CrawlerForm({
  query,
  setQuery,
  source,
  setSource,
  limit,
  setLimit,
  ieeeKey,
  setIeeeKey,
  handleCrawl,
  loading,
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 p-4 w-full">
      <h1 className="text-3xl font-bold text-center text-blue-600 mb-2">
        🔍 Research Paper Crawler
      </h1>

      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Enter research topic..."
        className="w-3/4 md:w-1/2 border border-gray-300 p-2 rounded-md focus:outline-none"
      />

      <div className="flex gap-3 justify-center">
        <select
          value={source}
          onChange={(e) => setSource(e.target.value)}
          className="border border-gray-300 p-2 rounded-md"
        >
          <option value="all">All Sources</option>
          <option value="arxiv">arXiv</option>
          <option value="openalex">OpenAlex</option>
          <option value="semantic_scholar">Semantic Scholar</option>
          <option value="ieee">IEEE Xplore</option>
        </select>

        <select
          value={limit}
          onChange={(e) => setLimit(Number(e.target.value))}
          className="border border-gray-300 p-2 rounded-md"
        >
          {[5, 10, 15, 20].map((n) => (
            <option key={n} value={n}>
              {n} Papers
            </option>
          ))}
        </select>
      </div>

      {source === "ieee" && (
        <input
          type="password"
          placeholder="Enter IEEE API Key"
          value={ieeeKey}
          onChange={(e) => setIeeeKey(e.target.value)}
          className="w-1/2 border border-gray-300 p-2 rounded-md focus:outline-none"
        />
      )}

      <button
        onClick={handleCrawl}
        disabled={loading}
        className="bg-blue-600 text-white px-5 py-2 rounded-md hover:bg-blue-700"
      >
        {loading ? "Loading..." : "Crawl"}
      </button>
    </div>
  );
}
