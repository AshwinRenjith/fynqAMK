This is your battle plan. We will divide the development into **4 Strategic Phases**.

The goal is to reach a **"Walking Skeleton"** (a technically working end-to-end system) as fast as possible in Phase 1, and then add the "muscle" (Cloud/Auth) in Phase 2.

Create a file named `ROADMAP.md` and use this structure.

---

# fynq: Development Roadmap

**Strategy:** Local-First, Cloud-Next.
**Goal:** Reach a working MVP within 4 weeks.

---

## Phase 1: The Local Engine (Weeks 1-2)

**Objective:** Build a CLI that can read a local `fynq.yaml` file and execute an agent on your laptop. No servers, no login, no internet.

**Why:** If the runtime doesn't work locally, the registry doesn't matter.

### 1.1 Project Scaffolding

* [ ] Initialize Git repo & `pyproject.toml`.
* [ ] Setup `Typer` app with a single command: `fynq version`.
* [ ] Setup `Rich` console for pretty logging.

### 1.2 The Manifest Parser

* [ ] Define the `Pydantic` models for `fynq.yaml`.
* [ ] Create a parser that reads a YAML file and validates it against the schema.
* [ ] **Milestone:** `fynq inspect ./agent.yaml` prints valid JSON.

### 1.3 The Execution Runtime (The Hard Part)

* [ ] Implement `LiteLLM` integration.
* [ ] Create the `fynq run` command.
* [ ] **Feature:** It should read `system_prompt` from the YAML and send a "Hello World" to OpenAI (using an env var key).
* [ ] **Feature:** Support for Local LLMs (Ollama) detection.

### 1.4 The Python SDK (`fynq-core`)

* [ ] Create the `fynq` python package.
* [ ] Implement `fynq.llm.chat()` function.
* [ ] **Test:** Create a `main.py` that imports `fynq`, calls the LLM, and prints the result.

**🎯 Phase 1 Deliverable:** You can write a Python script + YAML file, type `fynq run .`, and it uses Mistral/Ollama to answer a question.

---

## Phase 2: The Cloud Registry (Week 3)

**Objective:** Connect the local CLI to Supabase so users can share agents.

**Why:** This turns it from a "runner" into a "package manager."

### 2.1 Supabase Setup

* [ ] Create Supabase Project.
* [ ] Setup Database Tables (`packages`, `versions`, `users`).
* [ ] Setup Storage Buckets (`fynq-artifacts`).

### 2.2 Authentication

* [ ] Implement `fynq login`.
* [ ] Flow: CLI generates a link -> User logs in on Browser -> Callback to CLI.
* [ ] Store the session token in local `sqlite`.

### 2.3 The Publisher Flow

* [ ] Implement `fynq publish`.
* [ ] Logic: Zip the current folder -> Validate YAML -> Upload to Supabase Storage -> Update DB.

### 2.4 The Installer Flow

* [ ] Implement `fynq install <name>`.
* [ ] Logic: Query DB for URL -> Download Zip -> Extract to `~/.fynq/agents/`.
* [ ] Implement `fynq list` (read from SQLite).

**🎯 Phase 2 Deliverable:** You can publish an agent from your laptop and install it on a friend's laptop.

---

## Phase 3: Security & Polish (Week 4)

**Objective:** Make it safe, stable, and distributable.

**Why:** You cannot ask users to `pip install` your tool. It must be a binary.

### 3.1 The Compilation Pipeline

* [ ] Configure `PyInstaller`.
* [ ] Create a GitHub Action to build `fynq.exe` (Windows), `fynq` (Linux/Mac) automatically on every push.

### 3.2 The Permissions System

* [ ] Implement the "Ask User" logic.
* [ ] If an agent tries to use `fynq.tools.fs.write`, the CLI must pause and ask: *"Agent wants to write to Disk. Allow? [y/N]"*

### 3.3 The Standard Library (StdLib)

* [ ] Build `fynq.tools.browser` (using a lightweight scraper).
* [ ] Build `fynq.tools.fs` (safe file system access).
* [ ] Integrate `fynq.tools.search` (DuckDuckGo or Google API).

**🎯 Phase 3 Deliverable:** A single binary file that is safe to run and has built-in tools.

---

## Phase 4: Launch Content (Week 5)

**Objective:** Populate the registry so the first users have something to do.

**Why:** An empty registry is a dead product.

### 4.1 "The First Five"

Build 5 high-quality agents yourself to showcase the power:

1. **`@fynq/researcher`:** Scrapes web, writes markdown reports.
2. **`@fynq/coder`:** Simple script generator.
3. **`@fynq/youtube`:** Summarizes video transcripts.
4. **`@fynq/travel`:** The travel planner example.
5. **`@fynq/clean`:** A utility to organize desktop files.

### 4.2 Documentation

* [ ] Write `GETTING_STARTED.md`.
* [ ] Create a simple "How to build an Agent" video.

**🎯 Phase 4 Deliverable:** Public Launch on Twitter/Reddit/Product Hunt.

---

## The Golden Rule for Efficiency

**"Stop Starting, Start Finishing."**

Do **not** move to Phase 2 until Phase 1 is rock solid.

* If `fynq run` crashes, don't build the database.
* If the YAML parser is buggy, don't build the login system.

**Next Immediate Step:**
Start Phase 1.1. Initialize the folder and install `Typer`.