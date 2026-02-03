
import os
from typing import List
from duckduckgo_search import DDGS

from fynq_cli.ui.console import console

def web_search(query: str, max_results: int = 5) -> List[dict]:
    """
    Perform a web search using DuckDuckGo.
    Requires 'network_access' capability.
    """
    # Check permission
    if not os.getenv("FYNQ_CAP_NETWORK_ACCESS"):
        console.print("[bold red]Permission Denied:[/bold red] 'network_access' capability required for web search.")
        raise PermissionError("Web search requires 'network_access' capability.")
    
    results = []
    try:
        with DDGS() as ddgs:
            for r in ddgs.text(query, max_results=max_results):
                results.append(r)
    except Exception as e:
        console.print(f"[red]Search Error:[/red] {e}")
        return []
        
    return results
