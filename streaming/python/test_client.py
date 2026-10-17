# Run from the repo root:
#   uv run --with websockets python -m unittest streaming.python.test_client
import json
import unittest

from websockets.asyncio.server import serve

from .client import StreamingClient


class TtsFramesTest(unittest.IsolatedAsyncioTestCase):
    async def test_binary_frames_become_binary_events(self) -> None:
        async def stub(ws):
            await ws.recv()  # init
            await ws.send(json.dumps({"type": "ready"}))
            await ws.send(b"\x00\x01\x02\x03")
            await ws.send(json.dumps({"type": "audio_end"}))

        async with serve(stub, "127.0.0.1", 0) as server:
            port = server.sockets[0].getsockname()[1]
            client = StreamingClient("test-key", base_url=f"ws://127.0.0.1:{port}")
            async with client.connect_tts("slng/fish/tts:s2.1-pro") as session:
                await session.send({"type": "init"})
                events = [event async for event in session]

        self.assertEqual(
            events,
            [
                {"type": "ready"},
                {"type": "binary", "bytes": b"\x00\x01\x02\x03"},
                {"type": "audio_end"},
            ],
        )


class ProjectHeaderTest(unittest.IsolatedAsyncioTestCase):
    async def _handshake_headers(self, **kwargs):
        seen = {}

        async def stub(ws):
            seen.update(ws.request.headers)

        async with serve(stub, "127.0.0.1", 0) as server:
            port = server.sockets[0].getsockname()[1]
            client = StreamingClient("test-key", base_url=f"ws://127.0.0.1:{port}", **kwargs)
            async with client.connect_stt("deepgram/nova:3"):
                pass
        return {k.lower(): v for k, v in seen.items()}

    async def test_project_id_is_sent_as_header(self) -> None:
        headers = await self._handshake_headers(project_id="0b7e6c2a-1f3d-4a5b-9c8d-7e6f5a4b3c2d")
        self.assertEqual(headers["x-slng-project-id"], "0b7e6c2a-1f3d-4a5b-9c8d-7e6f5a4b3c2d")
        self.assertEqual(headers["authorization"], "Bearer test-key")

    async def test_no_project_header_by_default(self) -> None:
        headers = await self._handshake_headers()
        self.assertNotIn("x-slng-project-id", headers)


if __name__ == "__main__":
    unittest.main()
