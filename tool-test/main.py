import fynq
from fynq.sdk.tools.search import web_search
from fynq.sdk.tools.browser import scrape_url

def main() -> None:
    print("Testing Web Search...")
    try:
        results = web_search("python programming", max_results=2)
        print(f"Search Results: {results}")
    except Exception as e:
        print(f"Search failed: {e}")

    print("\nTesting Browser...")
    try:
        # Scrape example.com
        content = scrape_url("https://example.com")
        print(f"Scraped Content: {content[:100]}...")
    except Exception as e:
        print(f"Browser failed: {e}")

if __name__ == "__main__":
    main()
