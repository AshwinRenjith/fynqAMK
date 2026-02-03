from __future__ import annotations

import os
import subprocess
import sys
from pathlib import Path

from litellm import completion

from fynq_cli.core.manifest import Manifest
from fynq_cli.ui.console import console


class AgentRuntime:
    def __init__(self, manifest_path: Path, manifest: Manifest) -> None:
        self.manifest_path = manifest_path
        self.manifest = manifest
        self.base_dir = manifest_path.parent

    def load_system_prompt(self) -> str:
        prompt_path_str = self.manifest.agent.system_prompt
        if not prompt_path_str:
            raise FileNotFoundError("Missing system_prompt in manifest")

        full_path = (self.base_dir / prompt_path_str).resolve()

        if not full_path.exists():
            console.print(
                f"[bold red]Error:[/bold red] System prompt not found at {full_path}"
            )
            raise FileNotFoundError(f"Missing prompt file: {full_path}")

        return full_path.read_text(encoding="utf-8")

    def run(self, user_input: str, model: str = "mistral/mistral-tiny") -> None:
        entry_point = self.manifest.package.entry_point

        if entry_point:
            # Check Permissions
            from fynq_cli.ui.permissions import request_permissions
            if not request_permissions(self.manifest.agent.capabilities):
                console.print("[bold red]Execution Aborted:[/bold red] Permission denied by user.")
                return

            self._run_python_code(entry_point, user_input, model)
        else:
            self._run_default_chat_loop(user_input, model)

    def _run_python_code(self, entry_point: str, user_input: str, model: str) -> None:
        script_path = (self.base_dir / entry_point).resolve()

        if not script_path.exists():
            console.print(
                f"[bold red]Error:[/bold red] Entry point not found: {script_path}"
            )
            return

        console.print(f"[dim]Executing {entry_point} with model {model}...[/dim]")

        env = os.environ.copy()
        env["FYNQ_MODEL"] = model
        env["FYNQ_TASK"] = user_input
        
        # Inject Secrets
        from fynq_cli.core.database import get_all_secrets
        secrets = get_all_secrets()
        for key, value in secrets.items():
            if key not in env:
                env[key] = value

        # Inject Capabilities
        for cap in self.manifest.agent.capabilities:
            env_var = f"FYNQ_CAP_{cap.upper()}"
            env[env_var] = "1"

        # Determine SDK path and python interpreter
        if getattr(sys, 'frozen', False):
            # In compiled binary, sys._MEIPASS contains the bundled files
            # We explicitly added ('src/fynq', 'fynq') to datas, so 'fynq' folder is at root of _MEIPASS
            # PYTHONPATH needs to point to the parent of 'fynq' package
            sdk_path = Path(sys._MEIPASS) 
            # When frozen, sys.executable is the binary itself, not python interpreter.
            # We assume user has 'python3' available since they are developing agents.
            interpreter = "python3"
        else:
            # Running from source
            repo_root = Path(__file__).resolve().parents[3]
            sdk_path = repo_root / "src"
            interpreter = sys.executable

        pythonpath_entries = [str(self.base_dir), str(sdk_path)]
        existing_pythonpath = env.get("PYTHONPATH")
        if existing_pythonpath:
            pythonpath_entries.append(existing_pythonpath)
        env["PYTHONPATH"] = os.pathsep.join(pythonpath_entries)

        try:
            subprocess.run(
                [interpreter, str(script_path)],
                env=env,
                check=True,
            )
        except subprocess.CalledProcessError as exc:
            console.print(f"[bold red]Agent Crashed:[/bold red] {exc}")

    def _run_default_chat_loop(self, user_input: str, model: str) -> None:
        try:
            system_content = self.load_system_prompt()
        except FileNotFoundError:
            return

        messages = [
            {"role": "system", "content": system_content},
            {"role": "user", "content": user_input},
        ]

        console.print(f"[dim]Using model: {model}[/dim]")
        console.print("[bold green]Thinking...[/bold green]")

        try:
            response = completion(
                model=model,
                messages=messages,
                stream=True,
            )

            print()
            for chunk in response:
                content = chunk.choices[0].delta.content
                if content:
                    print(content, end="", flush=True)
            print()
        except Exception as exc:
            console.print(f"\n[bold red]Runtime Error:[/bold red] {exc}")
            console.print("[dim]Tip: Did you set MISTRAL_API_KEY?[/dim]")
