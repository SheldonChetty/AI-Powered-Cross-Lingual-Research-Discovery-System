import React from "react";

export default function PaperCard({ paper, index }) {
  return (
    <div className="bg-white shadow-md rounded-xl p-4 w-11/12 md:w-3/4 mx-auto mb-4 border border-gray-200 text-left">
      <h3 className="text-lg font-semibold text-gray-800">
        {index + 1}. {paper.title}
      </h3>

      <p className="text-gray-600 mt-1">
        ✏️ {paper.abstract && paper.abstract !== "N/A"
          ? paper.abstract.slice(0, 200)
          : "No abstract available."}
      </p>

      <a
        href={paper.link}
        target="_blank"
        rel="noreferrer"
        className="text-blue-500 hover:underline mt-2 inline-block"
      >
        🔗 View Paper
      </a>

      <p className="text-sm text-gray-500 mt-1">Source: {paper.source}</p>
    </div>
  );
}
