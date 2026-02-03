import io
import shutil
import tarfile
from pathlib import Path

from fynq_cli.core.auth import get_client, CONFIG_DIR
from fynq_cli.core.database import register_package
from fynq_cli.ui.console import console

AGENTS_DIR = CONFIG_DIR / "agents"

def install_package(package_name: str) -> None:
    """
    Downloads and installs a package from the Fynq Registry.
    """
    client = get_client()

    console.print(f"Searching for [cyan]{package_name}[/cyan]...")

    # 1. Lookup Package
    # We select user_id and version. We assume we want the latest version if multiple exist (which shouldn't happen based on 'name' unique constraint)
    # or the row in 'packages' represents the canonical version.
    response = client.table("packages").select("name, version, user_id").eq("name", package_name).execute()
    
    if not response.data:
        console.print(f"[bold red]Error:[/bold red] Package '{package_name}' not found in registry.")
        raise ValueError("Package not found")
        
    pkg_info = response.data[0]
    version = pkg_info["version"]
    user_id = pkg_info["user_id"]
    
    console.print(f"Found [bold green]{package_name} v{version}[/bold green]")

    # 2. Download from Storage
    storage_path = f"{user_id}/{package_name}/{version}.tar.gz"
    
    with console.status("[bold green]Downloading...[/bold green]"):
        try:
            file_data = client.storage.from_("fynq-artifacts").download(storage_path)
        except Exception as e:
            console.print(f"[bold red]Download Failed:[/bold red] {e}")
            raise RuntimeError(f"Failed to download package artifact: {storage_path}") from e

    # 3. Install Location
    # ~/.fynq/agents/@local/test-agent
    # Since package name might contain slashes (e.g. @scope/pkg), we need to handle that.
    # We will create the full directory structure.
    install_path = AGENTS_DIR / package_name
    
    if install_path.exists():
        console.print(f"[dim]Removing previous version...[/dim]")
        shutil.rmtree(install_path)
    
    install_path.mkdir(parents=True, exist_ok=True)

    # 4. Extract
    with console.status("[bold green]Installing...[/bold green]"):
        file_obj = io.BytesIO(file_data)
        with tarfile.open(fileobj=file_obj, mode="r:gz") as tar:
            tar.extractall(path=install_path)

    # 5. Register in Local DB
    register_package(name=package_name, version=version, path=str(install_path))
    
    console.print(f"[bold green]Success![/bold green] Installed to {install_path}")
