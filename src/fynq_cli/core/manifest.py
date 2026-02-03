from __future__ import annotations

from pathlib import Path
from typing import Any

import yaml
from pydantic import BaseModel, ConfigDict, Field, ValidationError, model_validator


class Package(BaseModel):
    model_config = ConfigDict(extra="forbid")

    name: str = Field(..., min_length=1)
    version: str = Field(..., min_length=1)
    description: str = Field(..., min_length=1)
    entry_point: str = Field(..., min_length=1)


class Capability(BaseModel):
    model_config = ConfigDict(extra="allow")

    llm: str | None = None
    memory: str | None = None

    @model_validator(mode="after")
    def validate_non_empty(self) -> "Capability":
        if not self.model_dump(exclude_none=True):
            raise ValueError("capability entries must include at least one key")
        return self


class Agent(BaseModel):
    model_config = ConfigDict(extra="forbid")

    capabilities: list[str] = Field(default_factory=list)
    system_prompt: str | None = None


class Tool(BaseModel):
    model_config = ConfigDict(extra="forbid")

    name: str = Field(..., min_length=1)
    provider: str = Field(..., min_length=1)
    permissions: list[str] = Field(default_factory=list)


class LLMConfig(BaseModel):
    model_config = ConfigDict(extra="forbid")
    
    model: str | None = None


class Manifest(BaseModel):
    model_config = ConfigDict(extra="forbid")

    fynq: str = Field(..., min_length=1)
    package: Package
    agent: Agent
    llm: LLMConfig | None = None
    tools: list[Tool] = Field(default_factory=list)


class ManifestError(Exception):
    pass


def load_manifest(path: Path) -> Manifest:
    if not path.exists():
        raise ManifestError(f"Manifest file not found: {path}")
    if not path.is_file():
        raise ManifestError(f"Manifest path is not a file: {path}")

    try:
        raw = yaml.safe_load(path.read_text(encoding="utf-8"))
    except OSError as exc:
        raise ManifestError(f"Failed to read manifest: {exc}") from exc
    except yaml.YAMLError as exc:
        raise ManifestError(f"Invalid YAML: {exc}") from exc

    if raw is None:
        raise ManifestError("Manifest is empty")
    if not isinstance(raw, dict):
        raise ManifestError("Manifest must be a YAML mapping")

    try:
        return Manifest.model_validate(raw)
    except ValidationError as exc:
        raise ManifestError(str(exc)) from exc
