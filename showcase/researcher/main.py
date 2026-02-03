import sys
import os
import fynq
from fynq.sdk.tools import search, fs

# browser tool is available as `browser` if imported relative/explicitly or via scrape_url
from fynq.sdk.tools.browser import scrape_url

def main():
    # 1. Initialize
    # Use environment variable FYNQ_TASK strictly as per standard, or fallback to argv
    task = os.getenv("FYNQ_TASK")
    if not task and len(sys.argv) > 1:
        task = sys.argv[1]
    
    if not task:
        task = "Latest advancements in AI Agents 2024"

    print(f"🕵️  Researcher Agent initialized for: '{task}'")

    # 2. Search Phase
    print(f"🌐 Searching DuckDuckGo for: {task}...")
    try:
        # Returns list of dicts
        search_results = search.web_search(task, max_results=3)
    except Exception as e:
        print(f"Search failed: {e}")
        return

    # 3. Deep Dive (Scraping)
    # We'll try to scrape the first result
    scraped_content = ""
    if search_results:
        first_url = search_results[0].get('href')
        if first_url:
            print(f"🕷️  Scraping deep dive: {first_url}...")
            try:
                scraped_content = scrape_url(first_url)
                # Limit content to avoid context overflow in tiny models
                scraped_content = scraped_content[:4000]
            except Exception as e:
                print(f"Scraping failed: {e}")

    # Prepare context for LLM
    print("🧠 Analyzing search results...")
    
    # Format search results as string
    context_str = "\n".join([f"- {r['title']}: {r['body']} ({r['href']})" for r in search_results])
    
    prompt = f"""
    You are an expert technical writer.
    
    TASK: Write a comprehensive Markdown report on: "{task}"
    
    SEARCH_SUMMARY:
    {context_str}

    DEEP_DIVE_CONTENT:
    {scraped_content}
    
    REQUIREMENTS:
    1. Use a professional tone.
    2. Use H1, H2 headers.
    3. Cite sources from the provided text using [Title](url).
    4. Do not invent information not present in the source material.
    5. Be concise but informative.
    """
    
    response = fynq.llm.chat(prompt)

    # 4. Publishing Phase
    filename = "report.md"
    print(f"💾 Saving report to {filename}...")
    
    try:
        fs.write_file(filename, response)
        print(f"✅ Mission Complete. Report saved to {filename}")
    except Exception as e:
        print(f"❌ Failed to write report: {e}")

if __name__ == "__main__":
    main()
