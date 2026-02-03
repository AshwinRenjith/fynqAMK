
import typer
from rich.table import Table
from fynq_cli.ui.console import console

def request_permissions(capabilities: list[str]) -> bool:
    """
    Prompt the user to accept requested capabilities.
    Returns True if accepted (or empty), False if rejected.
    """
    if not capabilities:
        return True

    console.print()
    console.rule("[bold yellow]Permission Request[/bold yellow]")
    console.print("This agent is requesting the following capabilities:")
    
    table = Table(box=None, padding=(0, 2))
    table.add_column("Capability", style="cyan")
    table.add_column("Description", style="dim")
    
    for cap in capabilities:
        # We could add descriptions map here
        desc = "Unknown capability"
        if cap == "fs_write":
            desc = "Write access to the file system"
        elif cap == "network_access":
            desc = "Outbound network access"
            
        table.add_row(cap, desc)
        
    console.print(table)
    console.print()
    
    return typer.confirm("Allow execution?", default=False)
