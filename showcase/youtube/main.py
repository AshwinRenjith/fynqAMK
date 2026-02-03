import sys
import os
import fynq
from fynq.sdk.tools import search, fs
# We implemented 'scrape_url' in browser.py, so we import that.
from fynq.sdk.tools.browser import scrape_url

def main():
    # 1. Get Video URL
    video_url = os.getenv("FYNQ_TASK")
    if not video_url and len(sys.argv) > 1:
        video_url = sys.argv[1]
    
    if not video_url:
        video_url = "https://www.youtube.com/watch?v=9MegHiL93B0" # Example: Quantum Computing

    print(f"📺 Analyst Agent initialized for: {video_url}")

    # 2. Scrape Video Metadata (Title/Description)
    print("🕸️  Visiting YouTube page...")
    try:
        # User requested 'browser.visit_url', but our SDK has 'scrape_url'.
        # YouTube pages are huge, let's truncate to first 3000 chars which usually has the title/desc meta tags
        page_content = scrape_url(video_url)
        page_snippet = page_content[:3000]
    except Exception as e:
        print(f"❌ Failed to load page: {e}")
        return

    # 3. Ask LLM to extract the Title to perform a search
    # (We do this because raw HTML is messy)
    print("🧠 Extracting video info...")
    extraction_prompt = f"""
    EXTRACT the video title and channel name from this raw text.
    
    RAW TEXT:
    {page_snippet}
    
    OUTPUT FORMAT (String): Title - Channel
    """
    video_info = fynq.llm.chat(extraction_prompt).strip()
    print(f"📍 Identified: {video_info}")

    # 4. Search for extra context (Reviews, Summaries, Reddit discussions)
    print(f"🌐 Searching for context on: '{video_info}'...")
    try:
        # search.web_search returns a list of dicts {title, href, body}
        search_results_list = search.web_search(f"{video_info} summary review discussion")
        # Format it for the prompt
        search_results = "\n".join([f"- {r['title']}: {r['body']}" for r in search_results_list])
    except Exception as e:
        print(f"⚠️ Search failed, proceeding without context: {e}")
        search_results = "No external context found."

    # 5. Synthesize Report
    print("✍️  Writing analysis...")
    analysis_prompt = f"""
    You are a Video Analyst. Write a summary report for the video: "{video_info}".
    
    SOURCE 1 (Video Page Metadata):
    {page_snippet}
    
    SOURCE 2 (External Search Context):
    {search_results}
    
    TASK:
    Write a Markdown report titled "{video_info} - Analysis".
    Include:
    1. A Summary of what the video is likely about (based on description/search).
    2. Key themes or discussions found on the web.
    3. Potential target audience.
    """
    
    report = fynq.llm.chat(analysis_prompt)
    
    # 6. Save
    filename = "video_summary.md"
    print(f"💾 Saving to {filename}...")
    fs.write_file(filename, report)
    print(f"✅ Analysis complete.")

if __name__ == "__main__":
    main()
