#!/usr/bin/env python3
"""Live smoke test against the real Slng API.

Usage:
    SLNG_API_KEY=zpka_... uv run --with-editable sdks/slng-python python scripts/smoke_test.py
"""

import os
import sys

from slng import Slng


def main() -> None:
    api_key = os.environ.get("SLNG_API_KEY")
    if not api_key:
        sys.exit("set SLNG_API_KEY first")

    client = Slng(api_key=api_key)

    print("→ synthesizing 'hello world' with slng/deepgram/aura:2-en...")
    response = client.text_to_speech.create(
        model_variant="slng/deepgram/aura:2-en",
        voice="aura-2-thalia-en",
        text="Hello world. This is a Stainless SDK smoke test.",
    )

    out = "/tmp/slng-smoke.wav"
    response.write_to_file(out)
    print(f"✓ wrote audio to {out}")
    print(f"  play with: ffplay -autoexit {out}")


if __name__ == "__main__":
    main()
