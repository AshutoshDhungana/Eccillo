"""Load ``.env`` for the standalone agent CLIs.

The Django app loads ``.env`` through its own bootstrap, but ``python -m
agent.chat`` / ``agent.demo`` run outside Django and read the raw process
environment.  This helper loads the project ``.env`` so those entrypoints pick
up ``AGENT_LLM_PROVIDER`` and the provider keys.

It is intentionally called only from the CLI entrypoints — importing the
``agent`` package as a library never mutates the environment as a side effect.
Existing environment variables always win (``override=False``), so an explicit
``$env:VAR=...`` in the shell still takes precedence over the file.
"""

from __future__ import annotations

from pathlib import Path


def load_env() -> list[str]:
    """Load ``.env`` from the repo root and/or ``backend/``. Returns files loaded."""
    try:
        from dotenv import load_dotenv
    except ImportError:  # python-dotenv not installed → rely on real env vars
        return []

    # agent/env.py -> agent -> backend -> repo root
    backend_dir = Path(__file__).resolve().parents[1]
    repo_root = backend_dir.parent
    loaded: list[str] = []
    for candidate in (repo_root / ".env", backend_dir / ".env"):
        if candidate.is_file() and load_dotenv(candidate, override=False):
            loaded.append(str(candidate))
    return loaded
