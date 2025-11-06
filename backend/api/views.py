from django.http import JsonResponse
from django.views.decorators.http import require_GET
from modules.crawler import unified_crawl

@require_GET
def crawl_papers(request):
    query = request.GET.get("query", "").strip()
    source = request.GET.get("source", "all").lower()
    api_key = request.GET.get("apiKey", "")
    limit = int(request.GET.get("limit", 10))

    if not query:
        return JsonResponse({"error": "Missing query"}, status=400)

    results = unified_crawl(query, limit, source, api_key)
    return JsonResponse({"count": len(results), "results": results})
