from __future__ import annotations

from pathlib import Path

import typer
from rich.panel import Panel

from fynq_cli import __version__
from fynq_cli.core.manifest import ManifestError, load_manifest
from fynq_cli.core.runtime import AgentRuntime
from fynq_cli.ui.console import console

app = typer.Typer(add_completion=False, help="fynq: AI agent package manager")


@app.command()
def version() -> None:
    """Print the current fynq CLI version."""
    console.print(
        Panel.fit(
            f"fynq {__version__}",
            title="Version",
            border_style="cyan",
        )
    )


@app.command()
def inspect(
    path: Path = typer.Argument(
        ...,
        exists=True,
        dir_okay=False,
        readable=True,
        help="Path to fynq manifest YAML (e.g., ./fynq.yaml).",
    )
) -> None:
    """Validate a fynq manifest and print the normalized JSON."""
    try:
        manifest = load_manifest(path)
    except ManifestError as exc:
        console.print(f"[red]Manifest error:[/red] {exc}")
        raise typer.Exit(code=1) from exc

    console.print_json(manifest.model_dump_json(indent=2))


@app.command()
def init(
    name: str = typer.Argument(..., help="Name of the agent (e.g., my-agent)."),
) -> None:
    """Scaffold a new agent project."""
    project_dir = Path(name)

    if project_dir.exists():
        console.print(
            f"[bold red]Error:[/bold red] Directory {name} already exists."
        )
        raise typer.Exit(code=1)

    project_dir.mkdir()
    (project_dir / "prompts").mkdir()

    yaml_content = (
        "fynq: \"1.0\"\n"
        "package:\n"
        f"  name: \"@local/{name}\"\n"
        "  version: \"0.1.0\"\n"
        "  description: \"A new fynq agent\"\n"
        "  entry_point: \"main.py\"\n"
        "agent:\n"
        "  system_prompt: \"./prompts/system.md\"\n"
        "  capabilities: []\n"
        "tools: []\n"
    )
    (project_dir / "agent.yaml").write_text(yaml_content, encoding="utf-8")

    (project_dir / "prompts" / "system.md").write_text(
        "You are a helpful assistant.\n",
        encoding="utf-8",
    )

    py_content = (
        "import os\n\n"
        "import fynq\n\n\n"
        "def main() -> None:\n"
        "    task = os.getenv(\"FYNQ_TASK\", \"Hello World\")\n"
        "    print(f\"Received task: {task}\")\n\n"
        "    response = fynq.llm.chat(task)\n"
        "    print(response)\n\n\n"
        "if __name__ == \"__main__\":\n"
        "    main()\n"
    )
    (project_dir / "main.py").write_text(py_content, encoding="utf-8")

    console.print(f"[bold green]Created new agent: {name}[/bold green]")
    console.print(
        f"Run it: [cyan]cd {name} && fynq run . --task 'Hello'[/cyan]"
    )


@app.command()
def run(
    target: str = typer.Argument(
        ...,
        help="Path to agent directory, agent.yaml, or installed package name (e.g. @local/agent).",
    ),
    task: str = typer.Option(
        ...,
        "--task",
        "-t",
        help="The input task for the agent.",
    ),
    model: str | None = typer.Option(
        None,
        "--model",
        "-m",
        help="Model to use (e.g., mistral/mistral-small, ollama/llama3). Defaults to manifest setting or mistral/mistral-tiny.",
    ),
) -> None:
    """Execute an agent."""
    from fynq_cli.core.database import get_package_path

    path: Path | None = None

    # 1. Check if it's an installed package
    installed_path = get_package_path(target)
    if installed_path:
        path = installed_path
        console.print(f"[dim]Resolving package {target} -> {path}[/dim]")
    else:
        # 2. Check as a file path
        possible_path = Path(target)
        if possible_path.exists():
             path = possible_path
    
    if not path:
        console.print(f"[bold red]Error:[/bold red] Could not find package '{target}' or file '{target}'")
        raise typer.Exit(code=1)

    # Normalize directory vs file
    if path.is_dir():
        path = path / "agent.yaml"
        
    if not path.exists():
         console.print(f"[bold red]Error:[/bold red] Agent manifest not found at {path}")
         raise typer.Exit(code=1)

    try:
        manifest = load_manifest(path)
    except ManifestError as exc:
        console.print(f"[bold red]Manifest Error:[/bold red] {exc}")
        raise typer.Exit(code=1) from exc

    runtime = AgentRuntime(manifest_path=path, manifest=manifest)
    
    # Determine model: CLI override > Manifest > Default
    final_model = model
    if not final_model and manifest.llm and manifest.llm.model:
        final_model = manifest.llm.model
    if not final_model:
        final_model = "mistral/mistral-tiny"

    console.rule(f"[bold blue]Running {manifest.package.name}[/bold blue]")
    runtime.run(user_input=task, model=final_model)


# Auth Command Group
auth_app = typer.Typer(help="Manage authentication and accounts.")
app.add_typer(auth_app, name="auth")


@auth_app.command("login")
def login_cmd() -> None:
    """Log in to Fynq Cloud."""
    from fynq_cli.core.auth import login
    login()


@auth_app.command("signup")
def signup_cmd() -> None:
    """Create a new Fynq Cloud account."""
    from fynq_cli.core.auth import signup
    signup()


@app.command()
def publish(
    path: Path = typer.Argument(
        ".",
        help="Path to the agent directory or agent.yaml.",
        exists=True
    )
) -> None:
    """Publish the agent to the Fynq Registry."""
    from fynq_cli.core.publisher import publish_package
    import sys
    
    try:
        publish_package(path)
    except Exception as e:
        console.print(f"[bold red]Publish Failed:[/bold red] {e}")
        sys.exit(1)


@app.command()
def install(
    name: str = typer.Argument(..., help="Name of the agent to install (e.g. @local/test-agent).")
) -> None:
    """Download and install an agent from the registry."""
    from fynq_cli.core.installer import install_package
    import sys
    
    try:
        install_package(name)
    except Exception as e:
        # Check if traceback is needed or just clean exit
        # console.print(f"[bold red]Install Failed:[/bold red] {e}") # Duplicate of what installer might print?
        # Installer likely printed specific error. Just exit.
        sys.exit(1)


@app.command("list")
def list_packages() -> None:
    """List all installed agents."""
    from fynq_cli.core.database import list_installed_packages
    from rich.table import Table

    packages = list_installed_packages()
    
    if not packages:
        console.print("[yellow]No agents installed.[/yellow]")
        return

    table = Table(title="Installed Agents")
    table.add_column("Name", style="cyan")
    table.add_column("Version", style="green")
    table.add_column("Path", style="dim")
    table.add_column("Installed At", style="magenta")

    for pkg in packages:
        table.add_row(
            pkg["name"],
            pkg["version"],
            pkg["install_path"],
            str(pkg["installed_at"])
        )
    
    console.print(table)


@app.command()
def config(
    key: str = typer.Argument(..., help="The config key to set (e.g. MISTRAL_API_KEY)."),
    value: str = typer.Argument(..., help="The value to set.")
) -> None:
    """Save an API key or configuration permanently."""
    from fynq_cli.core.database import set_secret
    
    set_secret(key, value)
    console.print(f"[green]Saved {key}[/green]")


if __name__ == "__main__":
    app()
