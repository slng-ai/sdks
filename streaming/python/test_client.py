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


if __name__ == "__main__":
    unittest.main()
