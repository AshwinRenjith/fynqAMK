import json
from pathlib import Path
from typing import Optional

import typer
from rich.prompt import Prompt
from supabase import Client, create_client
from gotrue.errors import AuthApiError

from fynq_cli.constants import SUPABASE_KEY, SUPABASE_URL
from fynq_cli.ui.console import console

CONFIG_DIR = Path.home() / ".fynq"
CONFIG_FILE = CONFIG_DIR / "config.json"


def _ensure_config_dir():
    if not CONFIG_DIR.exists():
        CONFIG_DIR.mkdir(parents=True)


def get_client() -> Client:
    """
    Returns an authenticated Supabase client if a valid session exists locally.
    Otherwise returns a client with just the anon key.
    """
    client = create_client(SUPABASE_URL, SUPABASE_KEY)
    
    if CONFIG_FILE.exists():
        try:
            data = json.loads(CONFIG_FILE.read_text(encoding="utf-8"))
            session_token = data.get("session_token")
            # In a real scenario, we might want to refresh the session here
            # For now, we just pass the token if the client supports it directly
            # or rely on the gotrue client to recover session.
            # supabase-py doesn't automatically load from file, we have to set the session.
            if session_token:
                client.auth.set_session(
                    session_token["access_token"],
                    session_token["refresh_token"],
                )
        except Exception:
            # If config is corrupt, just return unauthed client
            pass
            
    return client


def save_session(session):
    _ensure_config_dir()
    # session object from supabase is usually pydantic or similar, dump to json
    # Accessing .session from the response usually gives the session object
    # which we can dump.
    
    # We store the minimal needed info or the whole thing
    token_data = {
        "access_token": session.access_token,
        "refresh_token": session.refresh_token,
        "user_id": session.user.id,
        "email": session.user.email
    }
    
    CONFIG_FILE.write_text(
        json.dumps({"session_token": token_data}, indent=2),
        encoding="utf-8",
    )


def login():
    """Interactive login flow."""
    console.rule("[bold blue]Login to Fynq Cloud[/bold blue]")
    
    email = Prompt.ask("Email")
    password = Prompt.ask("Password", password=True)
    
    client = create_client(SUPABASE_URL, SUPABASE_KEY)
    
    try:
        with console.status("[bold green]Authenticating...[/bold green]"):
            response = client.auth.sign_in_with_password({"email": email, "password": password})
            
        if response.session:
            save_session(response.session)
            console.print(f"[bold green]Success![/bold green] Logged in as {response.user.email}")
        else:
            console.print("[bold red]Login failed:[/bold red] No session returned.")
            
    except AuthApiError as e:
        console.print(f"[bold red]Login failed:[/bold red] {e.message}")
    except Exception as e:
        console.print(f"[bold red]An error occurred:[/bold red] {e}")


def signup():
    """Interactive signup flow."""
    console.rule("[bold blue]Create Fynq Account[/bold blue]")
    
    email = Prompt.ask("Email")
    password = Prompt.ask("Password", password=True)
    
    client = create_client(SUPABASE_URL, SUPABASE_KEY)
    
    try:
        with console.status("[bold green]Creating account...[/bold green]"):
            response = client.auth.sign_up({"email": email, "password": password})
        
        if response.session:
            save_session(response.session)
            console.print(f"[bold green]Success![/bold green] Account created and logged in as {response.user.email}")
        elif response.user:
             console.print(f"[bold green]Success![/bold green] Account created for {response.user.email}. Please check your email to confirm if required.")
             
    except AuthApiError as e:
        console.print(f"[bold red]Signup failed:[/bold red] {e.message}")
    except Exception as e:
        console.print(f"[bold red]An error occurred:[/bold red] {e}")
