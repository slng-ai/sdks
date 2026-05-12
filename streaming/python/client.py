from __future__ import annotations

import json
from contextlib import asynccontextmanager
from typing import Any, AsyncIterator, Literal, Optional, Union

import websockets
from websockets.asyncio.client import ClientConnection

Server = Literal["production", "staging"]

_SERVERS: dict[Server, str] = {
    "production": "wss://api.slng.ai",
    "staging": "wss://stageapi.slng.ai",
}


class StreamingClient:
    """Bearer-authenticated WebSocket client for the Slng Unified API streams.

    HTTP requests are served by the Stainless-generated client; this class
    only handles the WebSocket bridges (STT and TTS).
    """

    def __init__(
        self,
        api_key: str,
        *,
        server: Server = "production",
        base_url: Optional[str] = None,
    ) -> None:
        self._api_key = api_key
        self._base_url = base_url or _SERVERS[server]

    @asynccontextmanager
    async def connect_stt(self, model_variant: str) -> AsyncIterator["StreamingSession"]:
        path = f"/v1/bridges/unmute/stt/{model_variant}"
        async with self._connect(path) as session:
            yield session

    @asynccontextmanager
    async def connect_tts(self, model_variant: str) -> AsyncIterator["StreamingSession"]:
        path = f"/v1/bridges/unmute/tts/{model_variant}"
        async with self._connect(path) as session:
            yield session

    @asynccontextmanager
    async def _connect(self, path: str) -> AsyncIterator["StreamingSession"]:
        url = f"{self._base_url}{path}"
        headers = {"Authorization": f"Bearer {self._api_key}"}
        async with websockets.connect(url, additional_headers=headers) as ws:
            yield StreamingSession(ws)


class StreamingSession:
    """One open WebSocket. ``send`` writes a typed message dict; iterate the
    instance to receive messages until the server closes the connection."""

    def __init__(self, ws: ClientConnection) -> None:
        self._ws = ws

    async def send(self, message: dict[str, Any]) -> None:
        await self._ws.send(json.dumps(message))

    async def send_audio(self, audio: Union[bytes, bytearray, memoryview]) -> None:
        """Send raw PCM audio as a binary WebSocket frame. The live unmute
        bridge currently expects binary audio; JSON is reserved for control
        messages (init / finalize / close)."""
        await self._ws.send(bytes(audio))

    async def close(self, code: int = 1000, reason: str = "") -> None:
        await self._ws.close(code=code, reason=reason)

    def __aiter__(self) -> "StreamingSession":
        return self

    async def __anext__(self) -> dict[str, Any]:
        try:
            raw = await self._ws.recv()
        except websockets.ConnectionClosedOK:
            raise StopAsyncIteration
        if isinstance(raw, bytes):
            raw = raw.decode("utf-8")
        return json.loads(raw)
