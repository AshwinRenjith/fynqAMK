import sqlite3
from datetime import datetime
from pathlib import Path

from fynq_cli.core.auth import CONFIG_DIR

DB_PATH = CONFIG_DIR / "local.db"

def _get_connection():
    if not CONFIG_DIR.exists():
        CONFIG_DIR.mkdir(parents=True)
    
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    """Initialize the local database schema."""
    conn = _get_connection()
    with conn:
        conn.execute("""
            CREATE TABLE IF NOT EXISTS installed_packages (
                name TEXT PRIMARY KEY,
                version TEXT NOT NULL,
                install_path TEXT NOT NULL,
                installed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        """)
    conn.close()

def register_package(name: str, version: str, path: str):
    """Register or update an installed package."""
    init_db()  # Ensure table exists
    conn = _get_connection()
    with conn:
        conn.execute("""
            INSERT INTO installed_packages (name, version, install_path, installed_at)
            VALUES (?, ?, ?, ?)
            ON CONFLICT(name) DO UPDATE SET
                version = excluded.version,
                install_path = excluded.install_path,
                installed_at = excluded.installed_at
        """, (name, version, path, datetime.now()))
    conn.close()

def list_installed_packages() -> list[dict]:
    """Returns a list of all installed packages."""
    init_db()
    with _get_connection() as conn:
        cursor = conn.execute("SELECT name, version, install_path, installed_at FROM installed_packages")
        rows = cursor.fetchall()
        return [
            {
                "name": row[0],
                "version": row[1],
                "install_path": row[2],
                "installed_at": row[3],
            }
            for row in rows
        ]

def get_installed_package(name: str):
    """Retrieve details of an installed package."""
    init_db()
    conn = _get_connection()
    cursor = conn.execute("SELECT * FROM installed_packages WHERE name = ?", (name,))
    row = cursor.fetchone()
    conn.close()
    return dict(row) if row else None


def get_package_path(name: str) -> Path | None:
    """Get the installation path for a package by name."""
    pkg = get_installed_package(name)
    if pkg:
        return Path(pkg["install_path"])
    return None


def set_secret(key: str, value: str) -> None:
    """Save an API key or secret permanently."""
    init_db()  # Ensure tables exist
    conn = _get_connection()
    with conn:
        # Create table if not exists (lazy init)
        conn.execute("""
            CREATE TABLE IF NOT EXISTS secrets (
                key TEXT PRIMARY KEY,
                value TEXT NOT NULL
            )
        """)
        conn.execute("""
            INSERT INTO secrets (key, value)
            VALUES (?, ?)
            ON CONFLICT(key) DO UPDATE SET value = excluded.value
        """, (key, value))
    conn.close()


def get_all_secrets() -> dict[str, str]:
    """Retrieve all stored secrets."""
    init_db()
    conn = _get_connection()
    # Check if table exists first to avoid error on fresh install
    try:
        cursor = conn.execute("SELECT key, value FROM secrets")
        rows = cursor.fetchall()
        return {row["key"]: row["value"] for row in rows}
    except sqlite3.OperationalError:
        # Table likely doesn't exist yet
        return {}
    finally:
        conn.close()
