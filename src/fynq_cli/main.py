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
def run(
    path: Path = typer.Argument(
        ...,
        exists=True,
        help="Path to the agent.yaml file or directory containing it.",
    ),
    task: str = typer.Option(
        ...,
        "--task",
        "-t",
        help="The input task for the agent.",
    ),
    model: str = typer.Option(
        "mistral/mistral-tiny",
        "--model",
        "-m",
        help="Model to use (e.g., mistral/mistral-small, ollama/llama3).",
    ),
) -> None:
    """Execute an agent."""
    if path.is_dir():
        path = path / "agent.yaml"

    if not path.exists():
        console.print(f"[bold red]Error:[/bold red] No manifest found at {path}")
        raise typer.Exit(code=1)

    try:
        manifest = load_manifest(path)
    except ManifestError as exc:
        console.print(f"[bold red]Manifest Error:[/bold red] {exc}")
        raise typer.Exit(code=1) from exc

    runtime = AgentRuntime(manifest_path=path, manifest=manifest)

    console.rule(f"[bold blue]Running {manifest.package.name}[/bold blue]")
    runtime.run(user_input=task, model=model)


if __name__ == "__main__":
    app()
