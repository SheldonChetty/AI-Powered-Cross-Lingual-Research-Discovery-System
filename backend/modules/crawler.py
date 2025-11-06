import requests
import xml.etree.ElementTree as ET
from urllib.parse import quote_plus


# =========================
# arXiv (Free API)
# =========================
def crawl_arxiv(query, limit=10):
    """Fetch papers from arXiv API (free)."""
    query = quote_plus(query)
    base_url = "http://export.arxiv.org/api/query"
    params = {"search_query": f"all:{query}", "start": 0, "max_results": limit}

    try:
        r = requests.get(base_url, params=params, timeout=15)
        r.raise_for_status()
    except requests.RequestException:
        return []

    root = ET.fromstring(r.text)
    ns = {"atom": "http://www.w3.org/2005/Atom"}
    papers = []
    for entry in root.findall("atom:entry", ns)[:limit]:
        title = entry.find("atom:title", ns).text.strip()
        abstract = entry.find("atom:summary", ns).text.strip()
        link = entry.find("atom:id", ns).text.strip()
        papers.append({
            "title": title,
            "abstract": abstract[:200],  # preview (2–3 lines)
            "link": link,
            "source": "arXiv"
        })
    return papers


# =========================
# OpenAlex (Free API)
# =========================
def crawl_openalex(query, limit=10):
    """Fetch papers from OpenAlex (free)."""
    query = quote_plus(query)
    url = f"https://api.openalex.org/works?search={query}&per-page={limit}"

    try:
        r = requests.get(url, timeout=15)
        r.raise_for_status()
        data = r.json()
    except requests.RequestException:
        return []

    papers = []
    for work in data.get("results", [])[:limit]:
        title = work.get("display_name", "N/A")
        link = work.get("id", "N/A")

        # Convert OpenAlex abstract_inverted_index into readable text (if available)
        abstract_data = work.get("abstract_inverted_index")
        abstract = ""
        if isinstance(abstract_data, dict):
            words = {}
            for word, positions in abstract_data.items():
                for pos in positions:
                    words[pos] = word
            abstract = " ".join(words[i] for i in sorted(words.keys()))
        else:
            abstract = "N/A"

        papers.append({
            "title": title,
            "abstract": abstract[:200],
            "link": link,
            "source": "OpenAlex"
        })
    return papers


# =========================
# IEEE Xplore (Requires API Key)
# =========================
def crawl_ieee(query, limit=10, api_key=""):
    """Fetch papers from IEEE Xplore (requires valid API key)."""
    if not api_key:
        return []

    url = "https://ieeexploreapi.ieee.org/api/v1/search/articles"
    params = {
        "apikey": api_key,
        "querytext": query,
        "max_records": limit,
        "format": "json"
    }

    try:
        r = requests.get(url, params=params, timeout=15)
        r.raise_for_status()
        data = r.json()
    except requests.RequestException:
        return []

    papers = []
    for art in data.get("articles", []):
        papers.append({
            "title": art.get("title", "N/A"),
            "abstract": art.get("abstract", "N/A")[:200],
            "link": art.get("html_url") or art.get("pdf_url", "N/A"),
            "source": "IEEE"
        })
    return papers


# =========================
# Unified Crawl Function
# =========================
def unified_crawl(query, limit=10, source="all", api_key=""):
    """
    Unified crawler that fetches papers from selected sources.
    Supported: arXiv, OpenAlex, IEEE (requires key)
    """
    query = quote_plus(query)
    source = source.lower()
    results = []

    if source in ["all", "arxiv"]:
        results += crawl_arxiv(query, limit)
    if source in ["all", "openalex"]:
        results += crawl_openalex(query, limit)
    if source in ["all", "ieee"]:
        results += crawl_ieee(query, limit, api_key)

    # Deduplicate by title
    seen = set()
    unique = []
    for p in results:
        title = p["title"].strip().lower()
        if title not in seen:
            seen.add(title)
            unique.append(p)

    return unique[:limit]
