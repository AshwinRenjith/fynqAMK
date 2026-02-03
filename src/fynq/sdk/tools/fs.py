
import os
from pathlib import Path

def write_file(path: str, content: str) -> None:
    """
    Safely writes content to a file, provided the agent has the 'fs_write' capability.
    """
    if os.environ.get("FYNQ_CAP_FS_WRITE") != "1":
        raise PermissionError("Agent does not have 'fs_write' capability. Request it in agent.yaml.")

    # Basic path safety? For now, allowing any path as per prompt instructions, 
    # but in real sandbox we'd restrict to workspace.
    # The prompt mainly focuses on the Permission Gate, not Sandbox implementation yet.
    
    file_path = Path(path)
    # Ensure directory exists
    if file_path.parent:
        file_path.parent.mkdir(parents=True, exist_ok=True)
        
    file_path.write_text(content, encoding="utf-8")
