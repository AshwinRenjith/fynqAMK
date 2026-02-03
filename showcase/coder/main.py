import sys
import json
import re
import os
import fynq
from fynq.sdk.tools import fs

def clean_code(code_str):
    """Removes markdown code fences if present."""
    if code_str.strip().startswith("```"):
        lines = code_str.strip().splitlines()
        # Remove first line (```python) and last line (```)
        if len(lines) >= 2:
            return "\n".join(lines[1:-1])
    return code_str

def main():
    # 1. Get the prompt
    user_request = os.getenv("FYNQ_TASK")
    if not user_request and len(sys.argv) > 1:
        user_request = sys.argv[1]
    
    if not user_request:
        user_request = "A hello world python script"

    print(f"👨‍💻 Coder Agent received: '{user_request}'")

    # 2. Construct a 'System-like' prompt for structured output
    # We ask for a JSON object to keep it machine-readable.
    prompt = f"""
    You are an expert software engineer.
    
    TASK: Generate code for: "{user_request}"
    
    OUTPUT FORMAT:
    You must output ONLY a raw JSON object with the following structure. Do not include markdown formatting around the JSON.
    IMPORTANT: The 'code' field must be a single string. You MUST escape newlines as \\n and quotes as \\".
    {{
        "filename": "suggested_filename.ext",
        "code": "print('hello')\\nprint('world')"
    }}
    
    Make sure the code is production-ready, clean, and commented.
    """

    print("🧠 Generating code...")
    # Using the standard SDK entry point
    response = fynq.llm.chat(prompt)

    # 3. Parse the output
    try:
        # Sometimes LLMs wrap JSON in ```json blocks, let's strip them strictly
        json_str = response.strip()
        if json_str.startswith("```"):
            # Split by backticks and take content
            # This handles ```json ... ``` or just ``` ... ```
            parts = json_str.split("```")
            if len(parts) >= 2:
                json_str = parts[1]
                if json_str.startswith("json"):
                    json_str = json_str[4:]
        
        data = json.loads(json_str)
        filename = data.get("filename", "generated_script.txt")
        code_content = data.get("code", "")
        
        # 4. Save the file
        print(f"💾 saving to {filename}...")
        fs.write_file(filename, code_content)
        
        print(f"✅ Success! Run it with: python {filename}")

    except json.JSONDecodeError:
        print("⚠️  Warning: Invalid JSON from LLM (likely unescaped newlines). Attempting regex fallback...")
        
        # Fallback: Extract via Regex
        # We look for "filename": "..." and "code": "..."
        filename_pattern = r'"filename":\s*"([^"]+)"'
        filename_match = re.search(filename_pattern, json_str)
        filename = filename_match.group(1) if filename_match else "generated_script.py"

        # Code extraction: Be careful with nested quotes. 
        # We assume the code ends with a quote followed by closing brace or comma.
        # Using dotall to capture newlines.
        code_pattern = r'"code":\s*"(.*)"\s*}'
        code_match = re.search(code_pattern, json_str, re.DOTALL)
        
        if code_match:
            code_content = code_match.group(1)
            # If the LLM put literal newlines, we keep them.
            # If it escaped some, we might need to unescape.
            # json.loads would handle unescaping. Here we might need to do it manually if it contains \n literals.
            # But mostly we care about the raw text.
            # Basic unescape for \"
            code_content = code_content.replace('\\"', '"').replace('\\n', '\n')
            
            print(f"💾 saving to {filename}...")
            fs.write_file(filename, code_content)
            print(f"✅ Success! Run it with: python {filename}")
        else:
            print("❌ Error: Could not extract code via regex. Raw output:")
            print(response)

    except Exception as e:
        print(f"❌ Error: {e}")

if __name__ == "__main__":
    main()
