# fynq: Architecture & Technical Specification

**Version:** 0.1.0 (fynqAMK)
**Status:** In Development
**Author:** Ashwin
**Tech Stack:** Python (Typer/Rich), Supabase, SQLite, PyInstaller

---

## 1. Executive Summary

**fynq** is the universal package manager and runtime for AI agents. It abstracts the complexities of AI development—such as environment management, API key provisioning, and tool integration—into a single, dependency-free binary.

**The Problem:**
Running an AI agent today requires manual setup: cloning Git repos, fighting `pip install` conflicts, managing `.env` files, and installing local databases.

**The fynq Solution:**

* **For Consumers:** `fynq install <agent>` provides an instant, "it just works" experience.
* **For Developers:** A standard `fynq.yaml` manifest and Python SDK that handles the infrastructure, allowing devs to focus purely on agent logic.

---

## 2. Core Philosophy

1. **Configuration over Code:** Agents are defined by a strict Manifest (`fynq.yaml`). The infrastructure (LLM connection, Memory, Tools) is injected by the runtime, not hardcoded by the developer.
2. **Local-First, Cloud-Enabled:** The CLI works offline for local models. Cloud services (Supabase) are used only for discovery, sync, and optional "Pro" features.
3. **Hermetic Runtime:** The `fynq` binary encapsulates the execution environment. Users never interact with the agent's Python dependencies directly.
4. **Language Agnostic Interface:** While built in Python, the user experience is a compiled binary. The internal complexity is hidden.

---

## 3. System Architecture

The system operates on a **Hybrid Model**, utilizing **Supabase** for the cloud registry and **SQLite** for the local client.

### A. The Cloud Layer (Supabase)

*Serves as the centralized Registry and Authentication provider.*

* **Auth:** Handles user identity (`fynq login`) via GitHub/Email.
* **PostgreSQL Database:** Stores the "Index" of agents.
* `packages` table: metadata (name, version, description, author).
* `users` table: star ratings, download counts, tier status.


* **Storage (Buckets):** Hosts the versioned assets (`agent.yaml`, `source.tar.gz`) for every published package.
* **Vector Store (pgvector):** *Optional.* Used for "Pro" users to sync agent memory/context across devices.

### B. The Client Layer (The CLI)

*The single-file executable running on the user's machine.*

* **Runtime:** A Python-based engine compiled via PyInstaller.
* **Local Database (SQLite):** A lightweight `fynq.db` located in `~/.fynq/`.
* Tracks installed packages.
* Stores local configuration and secure API keys (encrypted).
* **Crucial:** Allows `fynq run` to operate instantly without network latency.


* **Execution Sandbox:** An isolated scope where the agent's code runs, preventing it from accidentally damaging the user's OS.

---

## 4. The Data Standard: `fynq.yaml`

This file is the heart of the ecosystem. It tells the Runtime what the agent *needs*, not how to get it.

```yaml
fynq: "1.0"
package:
  name: "@ashwin/researcher"
  version: "1.0.2"
  description: "Deep dive technical researcher that outputs markdown reports."
  entry_point: "main.py"

# The "Brain" Requirements
# The runtime fulfils these. The dev does NOT import openai/anthropic directly.
agent:
  capabilities:
    - llm: "smart"       # Maps to GPT-4o (Pro) or Llama-3-70b (Local)
    - memory: "vector"   # Maps to Supabase (Pro) or Chroma (Local)
  
  system_prompt: "./prompts/system.md"

# The "Body" (Tools)
# Uses the Model Context Protocol (MCP) logic
tools:
  - name: "internet"
    provider: "fynq/std/browser"
    permissions: ["network_outbound"]
  
  - name: "filesystem"
    provider: "fynq/std/fs"
    permissions: ["write:./reports"]

```

---

## 5. The Developer SDK (`fynq-core`)

We provide a Python library that developers use to write their agents. This SDK handles the "Dependency Injection."

**Example: `main.py**`

```python
import fynq

def main():
    # 1. Get Input
    # Fynq handles parsing CLI args: `fynq run agent --task "Research AI"`
    task = fynq.input.get("task")

    # 2. Use Tools
    # Fynq checks permissions and executes the browser tool
    print("Searching the web...")
    search_results = fynq.tools.use("internet").search(task)

    # 3. Think (The Brain)
    # Fynq routes this to the user's configured model (Local or Cloud)
    # The developer doesn't need to know if it's GPT-4 or Llama-3.
    response = fynq.llm.chat(
        messages=[
            {"role": "system", "content": "Summarize these results..."},
            {"role": "user", "content": search_results}
        ]
    )

    # 4. Output
    print(response.content)

if __name__ == "__main__":
    main()

```

---

## 6. The User Workflows

### 6.1 Installation (Cloud -> Local)

**Command:** `fynq install @ashwin/researcher`

1. **Check:** CLI checks `fynq.db` (SQLite) to see if already installed.
2. **Fetch:** CLI queries **Supabase DB** for the package URL.
3. **Download:** CLI downloads assets from **Supabase Storage**.
4. **Register:** CLI updates `fynq.db` with the new package location.
5. **Result:** Ready to run.

### 6.2 Execution (Local Runtime)

**Command:** `fynq run researcher`

1. **Load:** CLI reads `fynq.yaml` from the local cache.
2. **Auth Check:**
* *If Tier 1 (Local):* Connects to local Ollama instance.
* *If Tier 2 (BYOK):* Decrypts API Key from SQLite.
* *If Tier 3 (Pro):* Connects to Fynq Proxy.


3. **Run:** Executes `main.py` inside the runtime wrapper.

### 6.3 Publishing (Local -> Cloud)

**Command:** `fynq publish`

1. **Auth:** CLI verifies session token with Supabase Auth.
2. **Validate:** CLI ensures `fynq.yaml` is valid.
3. **Upload:** Pushes files to Supabase Storage.
4. **Index:** Inserts a record into the Supabase `packages` table.

---

## 7. Monetization & Routing Strategy

The **Fynq Router** (inside the CLI) determines how the "Brain" is powered.

| Tier | User Selection | Routing Logic | Cost to Us |
| --- | --- | --- | --- |
| **Free** | `Local` | `localhost:11434` (Ollama) | **$0.00** |
| **BYOK** | `API Key` | Direct call to `api.openai.com` using user's key | **$0.00** |
| **Pro** | `Fynq Cloud` | Proxy request via `api.fynq.ai` (Supabase Edge Function) | **Variable** (Covered by Sub) |

---

## 8. Directory Structure

The codebase is organized to separate the **CLI Tool** from the **SDK**.

```text
fynq/
├── fynq_cli/                  # The binary tool (Typer App)
│   ├── __init__.py
│   ├── main.py                # Entry point
│   ├── commands/              # install, run, publish, login
│   ├── core/
│   │   ├── runtime.py         # The Execution Engine
│   │   ├── database.py        # SQLite Manager
│   │   └── sandbox.py         # Isolation Logic
│   ├── api/
│   │   └── supabase_client.py # Cloud Registry connector
│   └── ui/                    # Rich (TUI) components
│
├── fynq_sdk/                  # The library for Agent Devs
│   ├── __init__.py            # 'import fynq'
│   ├── llm.py                 # Abstracted Model Interface
│   └── tools.py               # Abstracted Tool Interface
│
├── tests/
├── pyproject.toml             # Dependencies (Typer, Rich, Supabase)
├── build.spec                 # PyInstaller Configuration
└── ARCHITECTURE.md            # This file

```

---

## 9. Implementation Roadmap

### Phase 1: The Skeleton (Local Only)

* **Goal:** A CLI that works offline.
* **Tasks:**
1. Setup `Typer` app structure.
2. Implement `fynq init` (creates yaml).
3. Implement `fynq run` (executes python script using `subprocess` or `importlib`).
4. Implement SQLite integration for storing config.



### Phase 2: The Registry (Supabase Integration)

* **Goal:** Users can share agents.
* **Tasks:**
1. Setup Supabase project (Auth + Database + Storage).
2. Implement `fynq login` (Device flow or Token paste).
3. Implement `fynq publish` (Upload to Bucket).
4. Implement `fynq install` (Download from Bucket).



### Phase 3: The Runtime Polish

* **Goal:** "It just works" across different models.
* **Tasks:**
1. Integrate `LiteLLM` into the SDK to support OpenAI/Ollama switching.
2. Build the PyInstaller pipeline to generate the `fynq` binary.
3. Create the standard library tools (`fynq.tools.browser`).