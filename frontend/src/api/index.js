import axios from "axios";

const API = axios.create({
  baseURL: "http://127.0.0.1:8000/api/",
});

export const crawlPapers = async (query, limit, source) => {
  const res = await API.get(`crawl/?query=${query}&limit=${limit}&source=${source}`);
  return res.data;
};
