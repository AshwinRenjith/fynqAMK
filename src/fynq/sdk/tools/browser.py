
import os
import httpx
from bs4 import BeautifulSoup

from fynq_cli.ui.console import console

def scrape_url(url: str) -> str:
    """
    Scrape text content from a URL.
    Requires 'network_access' capability.
    """
    # Check permission
    if not os.getenv("FYNQ_CAP_NETWORK_ACCESS"):
        console.print("[bold red]Permission Denied:[/bold red] 'network_access' capability required for browser.")
        raise PermissionError("Browser requires 'network_access' capability.")

    try:
        response = httpx.get(url, follow_redirects=True, timeout=10.0)
        response.raise_for_status()
        
        soup = BeautifulSoup(response.text, "html.parser")
        
        # Remove scripts and styles
        for script in soup(["script", "style"]):
            script.decompose()
            
        text = soup.get_text()
        
        # Clean up whitespace
        lines = (line.strip() for line in text.splitlines())
        chunks = (phrase.strip() for line in lines for phrase in line.split("  "))
        clean_text = '\n'.join(chunk for chunk in chunks if chunk)
        
        return clean_text
        
    except Exception as e:
        console.print(f"[red]Scrape Error:[/red] {e}")
        return f"Error scraping {url}: {str(e)}"
