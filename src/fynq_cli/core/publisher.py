import io
import tarfile
from pathlib import Path

from fynq_cli.core.auth import get_client
from fynq_cli.core.manifest import load_manifest
from fynq_cli.ui.console import console

IGNORED_ITEMS = {
    "__pycache__",
    ".git",
    ".venv",
    ".env",
    ".DS_Store",
    "fynq.db",
    "fynq_artifacts", # self reference precaution
}

def publish_package(agent_path: Path = Path("agent.yaml")) -> None:
    """
    Publishes the agent in the current directory (or at agent_path) to Fynq Cloud.
    """
    
    # 1. Auth Check
    client = get_client()
    # Check if we have a valid session
    try:
        user_response = client.auth.get_user()
    except Exception as exc:
        console.print("[bold red]Authentication Error:[/bold red] You must be logged in to publish.")
        console.print("Run [cyan]fynq auth login[/cyan] first.")
        raise RuntimeError("Not authenticated") from exc

    if not user_response or not user_response.user:
        console.print("[bold red]Authentication Error:[/bold red] You must be logged in to publish.")
        console.print("Run [cyan]fynq auth login[/cyan] first.")
        raise RuntimeError("Not authenticated")

    user = user_response.user
    user_id = user.id
    console.print(f"[dim]Authenticated as {user.email}[/dim]")

    # 2. Load Manifest
    # If agent_path is a directory, look for agent.yaml
    if agent_path.is_dir():
        agent_path = agent_path / "agent.yaml"
        
    if not agent_path.exists():
        raise FileNotFoundError(f"Manifest not found at {agent_path}")

    manifest = load_manifest(agent_path)
    package = manifest.package
    base_dir = agent_path.parent
    
    console.print(f"Preparing to publish [bold cyan]{package.name} v{package.version}[/bold cyan]...")

    # 3. Compress (Tarball)
    buffer = io.BytesIO()
    
    def filter_tar(tarinfo):
        name = tarinfo.name
        # tarinfo.name is relative path inside the tar, e.g. ./main.py or main.py
        parts = Path(name).parts
        
        # Check if any part of the path is in ignored items
        for part in parts:
            if part in IGNORED_ITEMS:
                return None
        return tarinfo

    with console.status("[bold green]Compressing...[/bold green]"):
        with tarfile.open(fileobj=buffer, mode="w:gz") as tar:
            # Add everything in base_dir to the tar
            # arcname="." means everything is at root of tar
            tar.add(base_dir, arcname=".", filter=filter_tar)
            
    buffer.seek(0)
    file_data = buffer.getvalue()
    size_mb = len(file_data) / (1024 * 1024)
    console.print(f"[dim]Package size: {size_mb:.2f} MB[/dim]")

    # 4. Upload to Storage
    # Path: {user_id}/{package_name}/{version}.tar.gz
    # package.name might contain special chars like @ or /, allowed in S3/Storage paths usually
    storage_path = f"{user_id}/{package.name}/{package.version}.tar.gz"
    
    with console.status("[bold green]Uploading...[/bold green]"):
        try:
            client.storage.from_("fynq-artifacts").upload(
                path=storage_path,
                file=file_data,
                file_options={"content-type": "application/gzip"}
            )
        except Exception as e:
            # Handle duplicates specifically if possible, otherwise generic error
            if "Duplicate" in str(e) or "409" in str(e):
                console.print(f"[bold yellow]Warning:[/bold yellow] Version {package.version} already exists in storage. Overwriting not allowed in this version.")
                # We might want to stop here or continue if it's just a retry
                # For now, let's stop strict.
                raise RuntimeError(f"Version {package.version} already exists.") from e
            else:
                 raise e

    # 5. Update Database
    with console.status("[bold green]Registering...[/bold green]"):
        db_data = {
            "name": package.name,
            "version": package.version,
            "description": package.description,
            "entry_point": package.entry_point,
            "user_id": user_id,
            # updated_at defaults to now() usually, or trigger
        }
        
        # Upsert based on name? 
        # The schema said name is unique. 
        # If we are updating a version, we are updating the same package row?
        # Typically registries have a 'packages' table and a 'versions' table.
        # But instructions said "Table packages: ... name, version ...".
        # This implies the table stores the *latest* version or a single entry per package?
        # User Instruction: Upsert a record into the packages table.
        
        # If name is unique, then we can only have ONE version record per package name in this table.
        # So this operation effectively updates the 'latest version' pointer.
        
        res = client.table("packages").upsert(db_data, on_conflict="name").execute()
        
    console.print(f"[bold green]Success![/bold green] Published {package.name} v{package.version}")
