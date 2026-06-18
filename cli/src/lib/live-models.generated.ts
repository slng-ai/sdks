// AUTO-GENERATED from `api.slng.ai/v1/catalog/models`.
// Do not edit by hand. Run `bun run sync-models` to refresh (CI does this daily).

export interface ModelDeployments {
  regions: string[];
  worldParts: string[];
  platforms: string[];
  protocols: string[];
}

export interface LiveModel {
  code: string;
  enabled: boolean;
  internal: boolean;
  service_type: "tts" | "stt" | "llm" | string;
  name?: string;
  provider_code?: string | null;
  short_description?: string | null;
  long_description?: string | null;
  best_for?: string | null;
  use_cases?: string[];
  capabilities?: string[];
  languages?: string[];
  streaming?: boolean;
  auth_secret_key?: string | null;
  /** Aggregated from the catalog's region details at sync time. */
  deployments?: ModelDeployments;
  [k: string]: unknown;
}

export const LIVE_MODELS: readonly LiveModel[] = [
  {
    "code": "deepgram/nova:3",
    "enabled": true,
    "internal": false,
    "service_type": "stt",
    "name": "Nova 3",
    "provider_code": "deepgram",
    "short_description": "Advanced automatic speech recognition (ASR) model, designed to convert spoken audio into text with very high accuracy and low latency for real-time applications.",
    "long_description": "Deepgram Nova-3 is an advanced speech-to-text (STT) model designed to convert spoken audio into highly accurate text in real time. It is optimized for live applications, delivering low-latency transcription that enables responsive voice agents, captions, and interactive systems.\n\nThe model stands out for its strong performance in real-world conditions, including noisy environments, overlapping speakers, and variable audio quality. It also supports multilingual transcription, even handling code-switching within conversations, and allows developers to improve accuracy with domain-specific vocabulary without retraining.\n\nNova-3 is built for enterprise use, offering features like precise formatting for numbers and dates, timestamps, and handling of sensitive data. Overall, it focuses on making speech recognition reliable, fast, and adaptable for production-scale voice AI systems.",
    "best_for": "- Conversational AI & Voice Agents\n- Call Centers & Customer Support\n- Transcription & Documentation\n- Media & Live Captioning\n- Healthcare & Medical\n- Search, Analytics & Insights\n- Automotive & Voice Interfaces",
    "use_cases": [
      "Call centers",
      "Customer Support",
      "Voice Agents",
      "Healthcare",
      "Financial services"
    ],
    "capabilities": [
      "Streaming",
      "Medical transcription",
      "HTTPS",
      "WSS",
      "Real time",
      "Multi-language"
    ],
    "languages": [
      "ar",
      "be",
      "bg",
      "bn",
      "bs",
      "ca",
      "cs",
      "da",
      "el",
      "en",
      "et",
      "fa",
      "fi",
      "fr",
      "he",
      "hi",
      "hr",
      "hu",
      "id",
      "it",
      "ja",
      "kn",
      "ko",
      "lt",
      "lv",
      "mk",
      "mr",
      "ms",
      "nl",
      "no",
      "pl",
      "pt",
      "ro",
      "ru",
      "sk",
      "sl",
      "sr",
      "sv",
      "ta",
      "te",
      "th",
      "tl",
      "tr",
      "uk",
      "ur",
      "vi",
      "zh"
    ],
    "streaming": true,
    "api_path": "/v1/stt/deepgram/nova:3",
    "code_example": "curl -X POST https://api.slng.ai/v1/stt/deepgram/nova:3 \\\n  -H \"Authorization: Bearer <token>\" \\\n  -H \"Content-Type: application/json\" \\\n  --url \\\n  --data '{\n    \"url\": \"https://docs.slng.ai/audio/hello.wav\",\n    \"language\": \"en\"\n  }'",
    "code_examples": {
      "curl": "curl -X POST https://api.slng.ai/v1/stt/deepgram/nova:3 \\\n  -H \"Authorization: Bearer <token>\" \\\n  -H \"Content-Type: application/json\" \\\n  --url \\\n  --data '{\n    \"url\": \"https://docs.slng.ai/audio/hello.wav\",\n    \"language\": \"en\"\n  }'",
      "python": "import requests\n\nresponse = requests.post(\n    \"https://api.slng.ai/v1/stt/deepgram/nova:3\",\n    headers={\"Authorization\": \"Bearer <token>\", \"Content-Type\": \"application/json\"},\n    json={\"url\": \"https://docs.slng.ai/audio/hello.wav\", \"language\": \"en\"},\n)\nprint(response.status_code)",
      "typescript": "const response: Response = await fetch(\"https://api.slng.ai/v1/stt/deepgram/nova:3\", {\n  method: \"POST\",\n  headers: {\n    \"Authorization\": \"Bearer <token>\",\n    \"Content-Type\": \"application/json\"\n  },\n  body: JSON.stringify({\n      \"url\": \"https://docs.slng.ai/audio/hello.wav\",\n      \"language\": \"en\"\n  })\n});\nconst data: unknown = await response.json();"
    },
    "docs_url": "https://docs.slng.ai/api-reference/stt/deepgram-nova-3/nova-3-http",
    "deployments": {
      "regions": [
        "eu",
        "us"
      ],
      "worldParts": [
        "eu",
        "us"
      ],
      "platforms": [],
      "protocols": [
        "https",
        "wss"
      ]
    }
  },
  {
    "code": "deepgram/nova:3-medical",
    "enabled": true,
    "internal": false,
    "service_type": "stt",
    "name": "Nova 3 Medical",
    "provider_code": "deepgram",
    "short_description": "Nova 3 is Deepgram's most advanced automatic speech recognition (ASR) model, designed to convert spoken audio into text with very high accuracy and low latency for real-time applications.",
    "long_description": "Deepgram Nova-3 is an advanced speech-to-text (STT) model designed to convert spoken audio into highly accurate text in real time. It is optimized for live applications, delivering low-latency transcription that enables responsive voice agents, captions, and interactive systems.\n\nThe model stands out for its strong performance in real-world conditions, including noisy environments, overlapping speakers, and variable audio quality. It also supports multilingual transcription, even handling code-switching within conversations, and allows developers to improve accuracy with domain-specific vocabulary without retraining.\n\nNova-3 is built for enterprise use, offering features like precise formatting for numbers and dates, timestamps, and handling of sensitive data. Overall, it focuses on making speech recognition reliable, fast, and adaptable for production-scale voice AI systems.",
    "best_for": "- Conversational AI & Voice Agents\n- Healthcare & Medical",
    "use_cases": [
      "Voice Agents",
      "Healthcare"
    ],
    "capabilities": [
      "Streaming",
      "Medical transcription",
      "HTTPS",
      "WSS",
      "Real time",
      "Multi-language"
    ],
    "languages": [
      "en"
    ],
    "streaming": true,
    "api_path": "/v1/stt/deepgram/nova:3-medical",
    "code_example": "curl --request POST \\\n  --url https://api.slng.ai/v1/stt/deepgram/nova:3-medical \\\n  --header 'Authorization: Bearer <token>' \\\n  --header 'Content-Type: multipart/form-data' \\\n  --form audio='@example-file' \\\n  --form language=en",
    "code_examples": {
      "curl": "curl -X POST https://api.slng.ai/v1/stt/deepgram/nova:3-medical \\\n  -H \"Authorization: Bearer <token>\" \\\n  -H \"Content-Type: application/json\" \\\n  --url \\\n  --data '{\n    \"url\": \"https://docs.slng.ai/audio/hello.wav\",\n    \"language\": \"en\"\n  }'",
      "python": "import requests\n\nresponse = requests.post(\n    \"https://api.slng.ai/v1/stt/deepgram/nova:3-medical\",\n    headers={\"Authorization\": \"Bearer <token>\", \"Content-Type\": \"application/json\"},\n    json={\"url\": \"https://docs.slng.ai/audio/hello.wav\", \"language\": \"en\"},\n)\nprint(response.status_code)\n",
      "javascript": "const response = await fetch(\"https://api.slng.ai/v1/stt/deepgram/nova:3-medical\", {\n  method: \"POST\",\n  headers: {\n    \"Authorization\": \"Bearer <token>\",\n    \"Content-Type\": \"application/json\"\n  },\n  body: JSON.stringify({\n      \"url\": \"https://docs.slng.ai/audio/hello.wav\",\n      \"language\": \"en\"\n  })\n});\nconst data = await response.json();\n",
      "typescript": "const response: Response = await fetch(\"https://api.slng.ai/v1/stt/deepgram/nova:3-medical\", {\n  method: \"POST\",\n  headers: {\n    \"Authorization\": \"Bearer <token>\",\n    \"Content-Type\": \"application/json\"\n  },\n  body: JSON.stringify({\n      \"url\": \"https://docs.slng.ai/audio/hello.wav\",\n      \"language\": \"en\"\n  })\n});\nconst data: unknown = await response.json();\n"
    },
    "docs_url": "https://docs.slng.ai/api-reference/stt/deepgram-nova-3-medical/nova-3-medical-http",
    "deployments": {
      "regions": [
        "eu",
        "us"
      ],
      "worldParts": [
        "eu",
        "us"
      ],
      "platforms": [],
      "protocols": [
        "https",
        "wss"
      ]
    }
  },
  {
    "code": "reson8/reson8stt:v1",
    "enabled": true,
    "internal": false,
    "service_type": "stt",
    "name": "Resonant 1",
    "provider_code": "reson8",
    "short_description": "Hyper-customizable speech-to-text with real-time domain adaptation for European languages. EU-native infrastructure, zero audio retention.",
    "long_description": "Reson8 builds speech models that adapt to domain-specific vocabulary in real time using text-only context, no fine-tuning or audio data required. Purpose-built for European languages with models optimized for streaming and voice agents. EU-native infrastructure with zero audio retention.",
    "best_for": "- Voice Agents\n- Transcription\n- Assistants",
    "use_cases": [
      "Call centers",
      "Healthcare",
      "Medical transcription",
      "Custom Vocabulary"
    ],
    "capabilities": [
      "Streaming",
      "Custom",
      "Real Time"
    ],
    "languages": [
      "en"
    ],
    "streaming": true,
    "api_path": "/v1/stt/reson8/reson8stt:v1",
    "code_example": "wscat -c \"wss://api.slng.ai/v1/stt/reson8/reson8stt:v1\" \\\n  -H \"Authorization: Bearer <token>\"\n\n> {\"type\":\"init\",\"config\":{\"encoding\":\"pcm_s16le\",\"sample_rate\":16000,\"channels\":1,\"enable_partials\":true}}",
    "code_examples": {
      "curl": "wscat -c \"wss://api.slng.ai/v1/stt/reson8/reson8stt:v1\" \\\n  -H \"Authorization: Bearer <token>\"\n\n> {\"type\":\"init\",\"config\":{\"encoding\":\"pcm_s16le\",\"sample_rate\":16000,\"channels\":1,\"enable_partials\":true}}",
      "python": "import asyncio\nimport websockets\nimport json\n\n\nasync def main():\n    headers = {\"Authorization\": \"Bearer <token>\"}\n    async with websockets.connect(\n        \"wss://api.slng.ai/v1/stt/reson8/reson8stt:v1\", additional_headers=headers\n    ) as ws:\n        await ws.send(\n            json.dumps(\n                {\n                    \"type\": \"init\",\n                    \"config\": {\n                        \"encoding\": \"pcm_s16le\",\n                        \"sample_rate\": 16000,\n                        \"channels\": 1,\n                        \"enable_partials\": true,\n                    },\n                }\n            )\n        )\n        async for message in ws:\n            data = json.loads(message)\n            print(data)\n\n\nasyncio.run(main())\n",
      "typescript": "const ws = new WebSocket(\"wss://api.slng.ai/v1/stt/reson8/reson8stt:v1\", {\n  headers: { \"Authorization\": \"Bearer <token>\" }\n});\n\nws.on(\"open\", () => {\n  ws.send(JSON.stringify({\n      \"type\": \"init\",\n      \"config\": {\n          \"encoding\": \"pcm_s16le\",\n          \"sample_rate\": 16000,\n          \"channels\": 1,\n          \"enable_partials\": true\n      }\n  }));\n});\n\nws.on(\"message\", (data: string) => {\n  const parsed = JSON.parse(data);\n  console.log(parsed);\n});\n"
    },
    "docs_url": "https://docs.slng.ai/api-reference/stt/reson8-stt-v1/reson8-stt-v1-ws",
    "deployments": {
      "regions": [
        "eu"
      ],
      "worldParts": [
        "eu"
      ],
      "platforms": [],
      "protocols": [
        "wss"
      ]
    }
  },
  {
    "code": "sarvam/saaras:v3",
    "enabled": true,
    "internal": false,
    "service_type": "stt",
    "name": "Saaras V3",
    "provider_code": "sarvam",
    "short_description": "Powerful speech recognition model: Recommended — SOTA ASR with flexible output modes: transcribe, translate, verbatim, transliterate, and codemix",
    "long_description": "Saaras v3 is our state-of-the-art speech recognition model with flexible output formats. It supports multiple output modes including transcription, translation, verbatim, transliteration, and code-mixed outputs. Saaras is built to make Indic languages LLM-comprehensible, offering accurate transcriptions and translations across 23 languages (22 Indian languages + English).",
    "best_for": "- Voice Assistants \n- Live Transcription\n- Call Centers \n- Real time calls",
    "use_cases": [
      "Indian languages",
      "Call centers",
      "Customer Support",
      "Voice Agents",
      "Healthcare",
      "Financial services"
    ],
    "capabilities": [
      "Streaming",
      "Medical transcription",
      "HTTPS",
      "WSS",
      "Real time",
      "Multi-language"
    ],
    "languages": [
      "as",
      "bm",
      "bn",
      "en",
      "gu",
      "hi",
      "kn",
      "ml",
      "mr",
      "ne",
      "te",
      "ur"
    ],
    "streaming": true,
    "api_path": "/v1/stt/sarvam/saaras:v3",
    "code_example": "curl --request POST \\\n  --url https://api.slng.ai/v1/stt/sarvam/saaras:v3 \\\n  --header 'Authorization: Bearer <token>' \\\n  --header 'Content-Type: multipart/form-data' \\\n  --form audio='@example-file' \\\n  --form mode=transcribe \\\n  --form language_code=hi-IN",
    "code_examples": {
      "curl": "curl -X POST https://api.slng.ai/v1/stt/sarvam/saaras:v3 \\\n  -H \"Authorization: Bearer <token>\" \\\n  -H \"Content-Type: multipart/form-data\" \\\n  --url \\\n  --form \\\n  audio=@example-file \\\n  --form \\\n  mode=transcribe \\\n  --form \\\n  language_code=hi-IN",
      "python": "import requests\n\nresponse = requests.post(\n    \"https://api.slng.ai/v1/stt/sarvam/saaras:v3\",\n    headers={\"Authorization\": \"Bearer <token>\"},\n    files={\n        \"audio\": (\"audio.wav\", open(\"example-file\", \"rb\")),\n        \"mode\": (None, \"transcribe\"),\n        \"language_code\": (None, \"hi-IN\"),\n    },\n)\nprint(response.status_code)\n",
      "javascript": "const formData = new FormData();\nformData.append(\"audio\", audioBlob, \"audio.wav\");\nformData.append(\"mode\", \"transcribe\");\nformData.append(\"language_code\", \"hi-IN\");\n\nconst response = await fetch(\"https://api.slng.ai/v1/stt/sarvam/saaras:v3\", {\n  method: \"POST\",\n  headers: {\n    \"Authorization\": \"Bearer <token>\"\n  },\n  body: formData\n});\nconst data = await response.json();\n",
      "typescript": "const formData = new FormData();\nformData.append(\"audio\", audioBlob, \"audio.wav\");\nformData.append(\"mode\", \"transcribe\");\nformData.append(\"language_code\", \"hi-IN\");\n\nconst response: Response = await fetch(\"https://api.slng.ai/v1/stt/sarvam/saaras:v3\", {\n  method: \"POST\",\n  headers: {\n    \"Authorization\": \"Bearer <token>\"\n  },\n  body: formData\n});\nconst data: unknown = await response.json();\n"
    },
    "docs_url": "https://docs.slng.ai/api-reference/stt/sarvam-ai-saaras/saaras-v3-http",
    "deployments": {
      "regions": [
        "in"
      ],
      "worldParts": [
        "in"
      ],
      "platforms": [],
      "protocols": [
        "https",
        "wss"
      ]
    }
  },
  {
    "code": "slng/deepgram/nova:3-en",
    "enabled": true,
    "internal": false,
    "service_type": "stt",
    "name": "Nova 3 English",
    "provider_code": "deepgram",
    "short_description": "Advanced automatic speech recognition (ASR) model, designed to convert spoken audio into text with very high accuracy and low latency for real-time applications.",
    "long_description": "Deepgram Nova-3 is an advanced speech-to-text (STT) model designed to convert spoken audio into highly accurate text in real time. It is optimized for live applications, delivering low-latency transcription that enables responsive voice agents, captions, and interactive systems.\n\nThe model stands out for its strong performance in real-world conditions, including noisy environments, overlapping speakers, and variable audio quality. It also supports multilingual transcription, even handling code-switching within conversations, and allows developers to improve accuracy with domain-specific vocabulary without retraining.\n\nNova-3 is built for enterprise use, offering features like precise formatting for numbers and dates, timestamps, and handling of sensitive data. Overall, it focuses on making speech recognition reliable, fast, and adaptable for production-scale voice AI systems.",
    "best_for": "- Conversational AI & Voice Agents\n- Call Centers & Customer Support\n- Transcription & Documentation\n- Media & Live Captioning\n- Healthcare & Medical\n- Search, Analytics & Insights\n- Automotive & Voice Interfaces",
    "use_cases": [
      "Call centers",
      "Customer Support",
      "Voice Agents",
      "Healthcare",
      "Financial services"
    ],
    "capabilities": [
      "Streaming",
      "Medical transcription",
      "HTTPS",
      "WSS",
      "Real time",
      "Multi-language"
    ],
    "languages": [
      "en"
    ],
    "streaming": true,
    "api_path": "/v1/stt/slng/deepgram/nova:3-en",
    "code_example": "curl --request POST \\\n  --url https://api.slng.ai/v1/stt/slng/deepgram/nova:3-en \\\n  --header 'Authorization: Bearer <token>' \\\n  --header 'Content-Type: application/json' \\\n  --data '{\n  \"url\": \"https://docs.slng.ai/audio/hello.wav\",\n  \"language\": \"en\"\n}'",
    "code_examples": {
      "curl": "curl -X POST https://api.slng.ai/v1/stt/slng/deepgram/nova:3-en \\\n  -H \"Authorization: Bearer <token>\" \\\n  -H \"Content-Type: application/json\" \\\n  --url \\\n  --data '{\n    \"url\": \"https://docs.slng.ai/audio/hello.wav\",\n    \"language\": \"en\"\n  }'",
      "python": "import requests\n\nresponse = requests.post(\n    \"https://api.slng.ai/v1/stt/slng/deepgram/nova:3-en\",\n    headers={\"Authorization\": \"Bearer <token>\", \"Content-Type\": \"application/json\"},\n    json={\"url\": \"https://docs.slng.ai/audio/hello.wav\", \"language\": \"en\"},\n)\nprint(response.status_code)\n",
      "javascript": "const response = await fetch(\"https://api.slng.ai/v1/stt/slng/deepgram/nova:3-en\", {\n  method: \"POST\",\n  headers: {\n    \"Authorization\": \"Bearer <token>\",\n    \"Content-Type\": \"application/json\"\n  },\n  body: JSON.stringify({\n      \"url\": \"https://docs.slng.ai/audio/hello.wav\",\n      \"language\": \"en\"\n  })\n});\nconst data = await response.json();\n",
      "typescript": "const response: Response = await fetch(\"https://api.slng.ai/v1/stt/slng/deepgram/nova:3-en\", {\n  method: \"POST\",\n  headers: {\n    \"Authorization\": \"Bearer <token>\",\n    \"Content-Type\": \"application/json\"\n  },\n  body: JSON.stringify({\n      \"url\": \"https://docs.slng.ai/audio/hello.wav\",\n      \"language\": \"en\"\n  })\n});\nconst data: unknown = await response.json();\n"
    },
    "docs_url": "https://docs.slng.ai/api-reference/stt/deepgram-nova-3/nova-3-english-http",
    "deployments": {
      "regions": [
        "asia-south1",
        "australia-southeast1",
        "us-central1"
      ],
      "worldParts": [
        "au",
        "in",
        "us"
      ],
      "platforms": [],
      "protocols": [
        "https",
        "wss"
      ]
    }
  },
  {
    "code": "slng/deepgram/nova:3-es",
    "enabled": true,
    "internal": false,
    "service_type": "stt",
    "name": "Nova 3 Spanish",
    "provider_code": "deepgram",
    "short_description": "Advanced automatic speech recognition (ASR) model, designed to convert spoken audio into text with very high accuracy and low latency for real-time applications.",
    "long_description": "Deepgram Nova-3 is an advanced speech-to-text (STT) model designed to convert spoken audio into highly accurate text in real time. It is optimized for live applications, delivering low-latency transcription that enables responsive voice agents, captions, and interactive systems.",
    "best_for": "- Conversational AI & Voice Agents\n- Call Centers & Customer Support\n- Transcription & Documentation\n- Media & Live Captioning\n- Healthcare & Medical\n- Search, Analytics & Insights\n- Automotive & Voice Interfaces",
    "use_cases": [
      "Call centers",
      "Customer Support",
      "Voice Agents",
      "Healthcare",
      "Financial services"
    ],
    "capabilities": [
      "Streaming",
      "Medical transcription",
      "HTTPS",
      "WSS",
      "Real time",
      "Multi-language"
    ],
    "languages": [
      "es"
    ],
    "streaming": true,
    "api_path": "/v1/stt/slng/deepgram/nova:3-es",
    "code_example": "curl --request POST \\\n  --url https://api.slng.ai/v1/stt/slng/deepgram/nova:3-es \\\n  --header 'Authorization: Bearer <token>' \\\n  --header 'Content-Type: application/json' \\\n  --data '{\n  \"url\": \"https://docs.slng.ai/audio/hello-es.wav\",\n  \"language\": \"es\"\n}'",
    "code_examples": {
      "curl": "curl -X POST https://api.slng.ai/v1/stt/slng/deepgram/nova:3-es \\\n  -H \"Authorization: Bearer <token>\" \\\n  -H \"Content-Type: application/json\" \\\n  --url \\\n  --data '{\n    \"url\": \"https://docs.slng.ai/audio/hello-es.wav\",\n    \"language\": \"es\"\n  }'",
      "python": "import requests\n\nresponse = requests.post(\n    \"https://api.slng.ai/v1/stt/slng/deepgram/nova:3-es\",\n    headers={\"Authorization\": \"Bearer <token>\", \"Content-Type\": \"application/json\"},\n    json={\"url\": \"https://docs.slng.ai/audio/hello-es.wav\", \"language\": \"es\"},\n)\nprint(response.status_code)\n",
      "javascript": "const response = await fetch(\"https://api.slng.ai/v1/stt/slng/deepgram/nova:3-es\", {\n  method: \"POST\",\n  headers: {\n    \"Authorization\": \"Bearer <token>\",\n    \"Content-Type\": \"application/json\"\n  },\n  body: JSON.stringify({\n      \"url\": \"https://docs.slng.ai/audio/hello-es.wav\",\n      \"language\": \"es\"\n  })\n});\nconst data = await response.json();\n",
      "typescript": "const response: Response = await fetch(\"https://api.slng.ai/v1/stt/slng/deepgram/nova:3-es\", {\n  method: \"POST\",\n  headers: {\n    \"Authorization\": \"Bearer <token>\",\n    \"Content-Type\": \"application/json\"\n  },\n  body: JSON.stringify({\n      \"url\": \"https://docs.slng.ai/audio/hello-es.wav\",\n      \"language\": \"es\"\n  })\n});\nconst data: unknown = await response.json();\n"
    },
    "docs_url": "https://docs.slng.ai/api-reference/stt/deepgram-nova-3/nova-3-spanish-http"
  },
  {
    "code": "slng/deepgram/nova:3-hi",
    "enabled": true,
    "internal": false,
    "service_type": "stt",
    "name": "Nova 3 Hindi",
    "provider_code": "deepgram",
    "short_description": "Advanced automatic speech recognition (ASR) model, designed to convert spoken audio into text with very high accuracy and low latency for real-time applications.",
    "long_description": "Deepgram Nova-3 is an advanced speech-to-text (STT) model designed to convert spoken audio into highly accurate text in real time. It is optimized for live applications, delivering low-latency transcription that enables responsive voice agents, captions, and interactive systems.\n\nThe model stands out for its strong performance in real-world conditions, including noisy environments, overlapping speakers, and variable audio quality. It also supports multilingual transcription, even handling code-switching within conversations, and allows developers to improve accuracy with domain-specific vocabulary without retraining.\n\nNova-3 is built for enterprise use, offering features like precise formatting for numbers and dates, timestamps, and handling of sensitive data. Overall, it focuses on making speech recognition reliable, fast, and adaptable for production-scale voice AI systems.",
    "best_for": "- Conversational AI & Voice Agents\n- Call Centers & Customer Support\n- Transcription & Documentation\n- Media & Live Captioning\n- Healthcare & Medical\n- Search, Analytics & Insights\n- Automotive & Voice Interfaces",
    "use_cases": [
      "Call centers",
      "Customer Support",
      "Voice Agents",
      "Healthcare",
      "Financial services"
    ],
    "capabilities": [
      "Streaming",
      "Medical transcription",
      "HTTPS",
      "WSS",
      "Real time",
      "Multi-language"
    ],
    "languages": [
      "en",
      "hi"
    ],
    "streaming": true,
    "api_path": "/v1/stt/slng/deepgram/nova:3-hi",
    "code_example": "curl --request POST \\\n  --url https://api.slng.ai/v1/stt/slng/deepgram/nova:3-hi \\\n  --header 'Authorization: Bearer <token>' \\\n  --header 'Content-Type: application/json' \\\n  --data '{\n  \"url\": \"https://docs.slng.ai/audio/hello-hi.wav\",\n  \"language\": \"hi\"\n}'",
    "code_examples": {
      "curl": "curl -X POST https://api.slng.ai/v1/stt/slng/deepgram/nova:3-hi \\\n  -H \"Authorization: Bearer <token>\" \\\n  -H \"Content-Type: application/json\" \\\n  --url \\\n  --data '{\n    \"url\": \"https://docs.slng.ai/audio/hello-hi.wav\",\n    \"language\": \"hi\"\n  }'",
      "python": "import requests\n\nresponse = requests.post(\n    \"https://api.slng.ai/v1/stt/slng/deepgram/nova:3-hi\",\n    headers={\"Authorization\": \"Bearer <token>\", \"Content-Type\": \"application/json\"},\n    json={\"url\": \"https://docs.slng.ai/audio/hello-hi.wav\", \"language\": \"hi\"},\n)\nprint(response.status_code)\n",
      "javascript": "const response = await fetch(\"https://api.slng.ai/v1/stt/slng/deepgram/nova:3-hi\", {\n  method: \"POST\",\n  headers: {\n    \"Authorization\": \"Bearer <token>\",\n    \"Content-Type\": \"application/json\"\n  },\n  body: JSON.stringify({\n      \"url\": \"https://docs.slng.ai/audio/hello-hi.wav\",\n      \"language\": \"hi\"\n  })\n});\nconst data = await response.json();\n",
      "typescript": "const response: Response = await fetch(\"https://api.slng.ai/v1/stt/slng/deepgram/nova:3-hi\", {\n  method: \"POST\",\n  headers: {\n    \"Authorization\": \"Bearer <token>\",\n    \"Content-Type\": \"application/json\"\n  },\n  body: JSON.stringify({\n      \"url\": \"https://docs.slng.ai/audio/hello-hi.wav\",\n      \"language\": \"hi\"\n  })\n});\nconst data: unknown = await response.json();\n"
    },
    "docs_url": "https://docs.slng.ai/api-reference/stt/deepgram-nova-3/nova-3-hindi-http",
    "deployments": {
      "regions": [
        "asia-south1"
      ],
      "worldParts": [
        "in"
      ],
      "platforms": [],
      "protocols": [
        "https",
        "wss"
      ]
    }
  },
  {
    "code": "slng/deepgram/nova:3-in",
    "enabled": true,
    "internal": false,
    "service_type": "stt",
    "name": "Nova 3 Indonesian",
    "provider_code": "deepgram",
    "short_description": "Advanced automatic speech recognition (ASR) model, designed to convert spoken audio into text with very high accuracy and low latency for real-time applications.",
    "long_description": "Deepgram Nova-3 is an advanced speech-to-text (STT) model designed to convert spoken audio into highly accurate text in real time. It is optimized for live applications, delivering low-latency transcription that enables responsive voice agents, captions, and interactive systems.",
    "best_for": "- Conversational AI & Voice Agents\n- Call Centers & Customer Support\n- Transcription & Documentation\n- Media & Live Captioning\n- Healthcare & Medical\n- Search, Analytics & Insights\n- Automotive & Voice Interfaces",
    "use_cases": [
      "Call centers",
      "Customer Support",
      "Voice Agents",
      "Healthcare",
      "Financial services"
    ],
    "capabilities": [
      "Streaming",
      "HTTPS",
      "WSS",
      "Real time",
      "Multi-language"
    ],
    "languages": [
      "id"
    ],
    "streaming": true,
    "api_path": "/v1/stt/slng/deepgram/nova:3-in",
    "deployments": {
      "regions": [
        "asia-southeast2"
      ],
      "worldParts": [
        "id"
      ],
      "platforms": [],
      "protocols": [
        "wss"
      ]
    }
  },
  {
    "code": "slng/deepgram/nova:3-kn",
    "enabled": true,
    "internal": false,
    "service_type": "stt",
    "name": "Nova 3 Kannada",
    "provider_code": "deepgram",
    "short_description": "Advanced automatic speech recognition (ASR) model, designed to convert spoken audio into text with very high accuracy and low latency for real-time applications.",
    "long_description": "Deepgram Nova-3 is an advanced speech-to-text (STT) model designed to convert spoken audio into highly accurate text in real time. It is optimized for live applications, delivering low-latency transcription that enables responsive voice agents, captions, and interactive systems.\n\nThe model stands out for its strong performance in real-world conditions, including noisy environments, overlapping speakers, and variable audio quality. It also supports multilingual transcription, even handling code-switching within conversations, and allows developers to improve accuracy with domain-specific vocabulary without retraining.\n\nNova-3 is built for enterprise use, offering features like precise formatting for numbers and dates, timestamps, and handling of sensitive data. Overall, it focuses on making speech recognition reliable, fast, and adaptable for production-scale voice AI systems.",
    "best_for": "- Conversational AI & Voice Agents\n- Call Centers & Customer Support\n- Transcription & Documentation\n- Media & Live Captioning\n- Healthcare & Medical\n- Search, Analytics & Insights\n- Automotive & Voice Interfaces",
    "use_cases": [
      "Call centers",
      "Customer Support",
      "Voice Agents",
      "Healthcare",
      "Financial services"
    ],
    "capabilities": [
      "Streaming",
      "Medical transcription",
      "HTTPS",
      "WSS",
      "Real time",
      "Multi-language"
    ],
    "languages": [
      "kn"
    ],
    "streaming": true,
    "api_path": "/v1/stt/slng/deepgram/nova:3-kn",
    "code_example": "wscat -c \"wss://api.slng.ai/v1/stt/slng/deepgram/nova:3-kn\" \\\n  -H \"Authorization: Bearer <token>\"\n\n> {\"type\":\"init\",\"config\":{\"language\":\"kn\",\"sample_rate\":16000,\"encoding\":\"linear16\",\"enable_partials\":true,\"smart_format\":true,\"utterances\":true}}",
    "code_examples": {
      "curl": "wscat -c \"wss://api.slng.ai/v1/stt/slng/deepgram/nova:3-kn\" \\\n  -H \"Authorization: Bearer <token>\"\n\n> {\"type\":\"init\",\"config\":{\"language\":\"kn\",\"sample_rate\":16000,\"encoding\":\"linear16\",\"enable_partials\":true,\"smart_format\":true,\"utterances\":true}}",
      "python": "import asyncio\nimport websockets\nimport json\n\n\nasync def main():\n    headers = {\"Authorization\": \"Bearer <token>\"}\n    async with websockets.connect(\n        \"wss://api.slng.ai/v1/stt/slng/deepgram/nova:3-kn\", additional_headers=headers\n    ) as ws:\n        await ws.send(\n            json.dumps(\n                {\n                    \"type\": \"init\",\n                    \"config\": {\n                        \"language\": \"kn\",\n                        \"sample_rate\": 16000,\n                        \"encoding\": \"linear16\",\n                        \"enable_partials\": true,\n                        \"smart_format\": true,\n                        \"utterances\": true,\n                    },\n                }\n            )\n        )\n        async for message in ws:\n            data = json.loads(message)\n            print(data)\n\n\nasyncio.run(main())\n",
      "javascript": "const ws = new WebSocket(\"wss://api.slng.ai/v1/stt/slng/deepgram/nova:3-kn\", {\n  headers: { \"Authorization\": \"Bearer <token>\" }\n});\n\nws.on(\"open\", () => {\n  ws.send(JSON.stringify({\n      \"type\": \"init\",\n      \"config\": {\n          \"language\": \"kn\",\n          \"sample_rate\": 16000,\n          \"encoding\": \"linear16\",\n          \"enable_partials\": true,\n          \"smart_format\": true,\n          \"utterances\": true\n      }\n  }));\n});\n\nws.on(\"message\", (data) => {\n  console.log(JSON.parse(data));\n});\n",
      "typescript": "const ws = new WebSocket(\"wss://api.slng.ai/v1/stt/slng/deepgram/nova:3-kn\", {\n  headers: { \"Authorization\": \"Bearer <token>\" }\n});\n\nws.on(\"open\", () => {\n  ws.send(JSON.stringify({\n      \"type\": \"init\",\n      \"config\": {\n          \"language\": \"kn\",\n          \"sample_rate\": 16000,\n          \"encoding\": \"linear16\",\n          \"enable_partials\": true,\n          \"smart_format\": true,\n          \"utterances\": true\n      }\n  }));\n});\n\nws.on(\"message\", (data: string) => {\n  const parsed = JSON.parse(data);\n  console.log(parsed);\n});\n"
    },
    "docs_url": "https://docs.slng.ai/api-reference/stt/slng-deepgram-nova-3-kn/nova-3-(kannada)-http",
    "deployments": {
      "regions": [
        "asia-south1"
      ],
      "worldParts": [
        "in"
      ],
      "platforms": [],
      "protocols": [
        "wss"
      ]
    }
  },
  {
    "code": "slng/deepgram/nova:3-mr",
    "enabled": true,
    "internal": false,
    "service_type": "stt",
    "name": "Nova 3 Marathi",
    "provider_code": "deepgram",
    "short_description": "Advanced automatic speech recognition (ASR) model, designed to convert spoken audio into text with very high accuracy and low latency for real-time applications.",
    "long_description": "Deepgram Nova-3 is an advanced speech-to-text (STT) model designed to convert spoken audio into highly accurate text in real time. It is optimized for live applications, delivering low-latency transcription that enables responsive voice agents, captions, and interactive systems.\n\nThe model stands out for its strong performance in real-world conditions, including noisy environments, overlapping speakers, and variable audio quality. It also supports multilingual transcription, even handling code-switching within conversations, and allows developers to improve accuracy with domain-specific vocabulary without retraining.\n\nNova-3 is built for enterprise use, offering features like precise formatting for numbers and dates, timestamps, and handling of sensitive data. Overall, it focuses on making speech recognition reliable, fast, and adaptable for production-scale voice AI systems.",
    "best_for": "- Conversational AI & Voice Agents\n- Call Centers & Customer Support\n- Transcription & Documentation\n- Media & Live Captioning\n- Healthcare & Medical\n- Search, Analytics & Insights\n- Automotive & Voice Interfaces",
    "use_cases": [
      "Call centers",
      "Customer Support",
      "Voice Agents",
      "Healthcare",
      "Financial services"
    ],
    "capabilities": [
      "Streaming",
      "Medical transcription",
      "HTTPS",
      "WSS",
      "Real time",
      "Multi-language"
    ],
    "languages": [
      "mr"
    ],
    "streaming": true,
    "api_path": "/v1/stt/slng/deepgram/nova:3-mr",
    "code_example": "wscat -c \"wss://api.slng.ai/v1/stt/slng/deepgram/nova:3-mr\" \\\n  -H \"Authorization: Bearer <token>\"\n\n> {\"type\":\"init\",\"config\":{\"language\":\"mr\",\"sample_rate\":16000,\"encoding\":\"linear16\",\"enable_partials\":true,\"smart_format\":true,\"utterances\":true}}",
    "code_examples": {
      "curl": "wscat -c \"wss://api.slng.ai/v1/stt/slng/deepgram/nova:3-mr\" \\\n  -H \"Authorization: Bearer <token>\"\n\n> {\"type\":\"init\",\"config\":{\"language\":\"mr\",\"sample_rate\":16000,\"encoding\":\"linear16\",\"enable_partials\":true,\"smart_format\":true,\"utterances\":true}}",
      "python": "import asyncio\nimport websockets\nimport json\n\n\nasync def main():\n    headers = {\"Authorization\": \"Bearer <token>\"}\n    async with websockets.connect(\n        \"wss://api.slng.ai/v1/stt/slng/deepgram/nova:3-mr\", additional_headers=headers\n    ) as ws:\n        await ws.send(\n            json.dumps(\n                {\n                    \"type\": \"init\",\n                    \"config\": {\n                        \"language\": \"mr\",\n                        \"sample_rate\": 16000,\n                        \"encoding\": \"linear16\",\n                        \"enable_partials\": true,\n                        \"smart_format\": true,\n                        \"utterances\": true,\n                    },\n                }\n            )\n        )\n        async for message in ws:\n            data = json.loads(message)\n            print(data)\n\n\nasyncio.run(main())\n",
      "javascript": "const ws = new WebSocket(\"wss://api.slng.ai/v1/stt/slng/deepgram/nova:3-mr\", {\n  headers: { \"Authorization\": \"Bearer <token>\" }\n});\n\nws.on(\"open\", () => {\n  ws.send(JSON.stringify({\n      \"type\": \"init\",\n      \"config\": {\n          \"language\": \"mr\",\n          \"sample_rate\": 16000,\n          \"encoding\": \"linear16\",\n          \"enable_partials\": true,\n          \"smart_format\": true,\n          \"utterances\": true\n      }\n  }));\n});\n\nws.on(\"message\", (data) => {\n  console.log(JSON.parse(data));\n});\n",
      "typescript": "const ws = new WebSocket(\"wss://api.slng.ai/v1/stt/slng/deepgram/nova:3-mr\", {\n  headers: { \"Authorization\": \"Bearer <token>\" }\n});\n\nws.on(\"open\", () => {\n  ws.send(JSON.stringify({\n      \"type\": \"init\",\n      \"config\": {\n          \"language\": \"mr\",\n          \"sample_rate\": 16000,\n          \"encoding\": \"linear16\",\n          \"enable_partials\": true,\n          \"smart_format\": true,\n          \"utterances\": true\n      }\n  }));\n});\n\nws.on(\"message\", (data: string) => {\n  const parsed = JSON.parse(data);\n  console.log(parsed);\n});\n"
    },
    "docs_url": "https://docs.slng.ai/api-reference/stt/slng-deepgram-nova-3-mr/nova-3-(marathi)-http",
    "deployments": {
      "regions": [
        "asia-south1"
      ],
      "worldParts": [
        "in"
      ],
      "platforms": [],
      "protocols": [
        "wss"
      ]
    }
  },
  {
    "code": "slng/deepgram/nova:3-multi",
    "enabled": true,
    "internal": false,
    "service_type": "stt",
    "name": "Nova 3 Multi",
    "provider_code": "deepgram",
    "short_description": "Advanced automatic speech recognition (ASR) model, designed to convert spoken audio into text with very high accuracy and low latency for real-time applications.",
    "long_description": "Deepgram Nova-3 is an advanced speech-to-text (STT) model designed to convert spoken audio into highly accurate text in real time. It is optimized for live applications, delivering low-latency transcription that enables responsive voice agents, captions, and interactive systems.\n\nThe model stands out for its strong performance in real-world conditions, including noisy environments, overlapping speakers, and variable audio quality. It also supports multilingual transcription, even handling code-switching within conversations, and allows developers to improve accuracy with domain-specific vocabulary without retraining.\n\nNova-3 is built for enterprise use, offering features like precise formatting for numbers and dates, timestamps, and handling of sensitive data. Overall, it focuses on making speech recognition reliable, fast, and adaptable for production-scale voice AI systems.",
    "best_for": "- Conversational AI & Voice Agents\n- Call Centers & Customer Support\n- Transcription & Documentation\n- Media & Live Captioning\n- Healthcare & Medical\n- Search, Analytics & Insights\n- Automotive & Voice Interfaces",
    "use_cases": [
      "Call centers",
      "Customer Support",
      "Voice Agents",
      "Healthcare",
      "Financial services"
    ],
    "capabilities": [
      "Streaming",
      "Medical transcription",
      "HTTPS",
      "WSS",
      "Real time",
      "Multi-language"
    ],
    "languages": [
      "ar",
      "de",
      "en",
      "es",
      "fr",
      "hi",
      "it",
      "ja",
      "nl",
      "pt",
      "ru"
    ],
    "streaming": true,
    "api_path": "/stt/slng/deepgram/nova:3-multi",
    "code_example": "curl --request POST \\\n  --url https://api.slng.ai/stt/slng/deepgram/nova:3-multi \\\n  --header 'Authorization: Bearer <token>' \\\n  --header 'Content-Type: application/json' \\\n  --data '{\n  \"url\": \"https://docs.slng.ai/audio/hello.wav\",\n  \"language\": \"multi\"\n}'",
    "code_examples": {
      "curl": "curl -X POST https://api.slng.ai/stt/slng/deepgram/nova:3-multi \\\n  -H \"Authorization: Bearer <token>\" \\\n  -H \"Content-Type: application/json\" \\\n  --url \\\n  --data '{\n    \"url\": \"https://docs.slng.ai/audio/hello.wav\",\n    \"language\": \"multi\"\n  }'",
      "python": "import requests\n\nresponse = requests.post(\n    \"https://api.slng.ai/stt/slng/deepgram/nova:3-multi\",\n    headers={\"Authorization\": \"Bearer <token>\", \"Content-Type\": \"application/json\"},\n    json={\"url\": \"https://docs.slng.ai/audio/hello.wav\", \"language\": \"multi\"},\n)\nprint(response.status_code)\n",
      "javascript": "const response = await fetch(\"https://api.slng.ai/stt/slng/deepgram/nova:3-multi\", {\n  method: \"POST\",\n  headers: {\n    \"Authorization\": \"Bearer <token>\",\n    \"Content-Type\": \"application/json\"\n  },\n  body: JSON.stringify({\n      \"url\": \"https://docs.slng.ai/audio/hello.wav\",\n      \"language\": \"multi\"\n  })\n});\nconst data = await response.json();\n",
      "typescript": "const response: Response = await fetch(\"https://api.slng.ai/stt/slng/deepgram/nova:3-multi\", {\n  method: \"POST\",\n  headers: {\n    \"Authorization\": \"Bearer <token>\",\n    \"Content-Type\": \"application/json\"\n  },\n  body: JSON.stringify({\n      \"url\": \"https://docs.slng.ai/audio/hello.wav\",\n      \"language\": \"multi\"\n  })\n});\nconst data: unknown = await response.json();\n"
    },
    "docs_url": "https://docs.slng.ai/api-reference/stt/deepgram-nova-3/nova-3-multi-language-http",
    "deployments": {
      "regions": [
        "eu-north-1"
      ],
      "worldParts": [
        "eu"
      ],
      "platforms": [],
      "protocols": [
        "https",
        "wss"
      ]
    }
  },
  {
    "code": "slng/deepgram/nova:3-te",
    "enabled": true,
    "internal": false,
    "service_type": "stt",
    "name": "Nova 3 Telugu",
    "provider_code": "deepgram",
    "short_description": "Advanced automatic speech recognition (ASR) model, designed to convert spoken audio into text with very high accuracy and low latency for real-time applications.",
    "long_description": "Deepgram Nova-3 is an advanced speech-to-text (STT) model designed to convert spoken audio into highly accurate text in real time. It is optimized for live applications, delivering low-latency transcription that enables responsive voice agents, captions, and interactive systems.\n\nThe model stands out for its strong performance in real-world conditions, including noisy environments, overlapping speakers, and variable audio quality. It also supports multilingual transcription, even handling code-switching within conversations, and allows developers to improve accuracy with domain-specific vocabulary without retraining.\n\nNova-3 is built for enterprise use, offering features like precise formatting for numbers and dates, timestamps, and handling of sensitive data. Overall, it focuses on making speech recognition reliable, fast, and adaptable for production-scale voice AI systems.",
    "best_for": "- Conversational AI & Voice Agents\n- Call Centers & Customer Support\n- Transcription & Documentation\n- Media & Live Captioning\n- Healthcare & Medical\n- Search, Analytics & Insights\n- Automotive & Voice Interfaces",
    "use_cases": [
      "Call centers",
      "Customer Support",
      "Voice Agents",
      "Healthcare",
      "Financial services"
    ],
    "capabilities": [
      "Streaming",
      "Medical transcription",
      "HTTPS",
      "WSS",
      "Real time",
      "Multi-language"
    ],
    "languages": [
      "te"
    ],
    "streaming": true,
    "api_path": "/v1/stt/slng/deepgram/nova:3-te",
    "code_example": "wscat -c \"wss://api.slng.ai/v1/stt/slng/deepgram/nova:3-te\" \\\n  -H \"Authorization: Bearer <token>\"\n\n> {\"type\":\"init\",\"config\":{\"language\":\"te\",\"sample_rate\":16000,\"encoding\":\"linear16\",\"enable_partials\":true,\"smart_format\":true,\"utterances\":true}}",
    "code_examples": {
      "curl": "wscat -c \"wss://api.slng.ai/v1/stt/slng/deepgram/nova:3-te\" \\\n  -H \"Authorization: Bearer <token>\"\n\n> {\"type\":\"init\",\"config\":{\"language\":\"te\",\"sample_rate\":16000,\"encoding\":\"linear16\",\"enable_partials\":true,\"smart_format\":true,\"utterances\":true}}",
      "python": "import asyncio\nimport websockets\nimport json\n\n\nasync def main():\n    headers = {\"Authorization\": \"Bearer <token>\"}\n    async with websockets.connect(\n        \"wss://api.slng.ai/v1/stt/slng/deepgram/nova:3-te\", additional_headers=headers\n    ) as ws:\n        await ws.send(\n            json.dumps(\n                {\n                    \"type\": \"init\",\n                    \"config\": {\n                        \"language\": \"te\",\n                        \"sample_rate\": 16000,\n                        \"encoding\": \"linear16\",\n                        \"enable_partials\": true,\n                        \"smart_format\": true,\n                        \"utterances\": true,\n                    },\n                }\n            )\n        )\n        async for message in ws:\n            data = json.loads(message)\n            print(data)\n\n\nasyncio.run(main())\n",
      "javascript": "const ws = new WebSocket(\"wss://api.slng.ai/v1/stt/slng/deepgram/nova:3-te\", {\n  headers: { \"Authorization\": \"Bearer <token>\" }\n});\n\nws.on(\"open\", () => {\n  ws.send(JSON.stringify({\n      \"type\": \"init\",\n      \"config\": {\n          \"language\": \"te\",\n          \"sample_rate\": 16000,\n          \"encoding\": \"linear16\",\n          \"enable_partials\": true,\n          \"smart_format\": true,\n          \"utterances\": true\n      }\n  }));\n});\n\nws.on(\"message\", (data) => {\n  console.log(JSON.parse(data));\n});\n",
      "typescript": "const ws = new WebSocket(\"wss://api.slng.ai/v1/stt/slng/deepgram/nova:3-te\", {\n  headers: { \"Authorization\": \"Bearer <token>\" }\n});\n\nws.on(\"open\", () => {\n  ws.send(JSON.stringify({\n      \"type\": \"init\",\n      \"config\": {\n          \"language\": \"te\",\n          \"sample_rate\": 16000,\n          \"encoding\": \"linear16\",\n          \"enable_partials\": true,\n          \"smart_format\": true,\n          \"utterances\": true\n      }\n  }));\n});\n\nws.on(\"message\", (data: string) => {\n  const parsed = JSON.parse(data);\n  console.log(parsed);\n});\n"
    },
    "docs_url": "https://docs.slng.ai/api-reference/stt/slng-deepgram-nova-3-te/nova-3-(telugu)-http",
    "deployments": {
      "regions": [
        "asia-south1"
      ],
      "worldParts": [
        "in"
      ],
      "platforms": [],
      "protocols": [
        "wss"
      ]
    }
  },
  {
    "code": "slng/speechmatics/batch:15.0.0",
    "enabled": true,
    "internal": false,
    "service_type": "stt",
    "name": "Speechmatics Batch",
    "provider_code": "speechmatics",
    "short_description": "Submit audio for asynchronous transcription using direct file upload, URL input, or presigned S3 upload. Supported formats and limits.",
    "long_description": "Speechmatics creates the voice models, so you can focus on building seamless voice experiences.\n\nWith Speechmatics, you can:\nGenerate complete transcripts from recorded audio files (batch transcription)",
    "best_for": "- Batch transcription",
    "use_cases": [
      "Batch"
    ],
    "capabilities": [
      "Batch"
    ],
    "languages": [
      "ar",
      "ba",
      "be",
      "bg",
      "bn",
      "ca",
      "cs",
      "cy",
      "da",
      "de",
      "el",
      "en",
      "eo",
      "es",
      "et",
      "eu",
      "fa",
      "fi",
      "fr",
      "ga",
      "gl",
      "he",
      "hi",
      "hr",
      "hu",
      "ia",
      "id",
      "it",
      "ja",
      "ko",
      "lt",
      "lv",
      "mn",
      "mr",
      "ms",
      "mt",
      "nl",
      "no",
      "pl",
      "pt",
      "ro",
      "ru",
      "sk",
      "sl",
      "sv",
      "sw",
      "ta",
      "th",
      "tl",
      "tr",
      "ug",
      "uk",
      "ur",
      "vi",
      "zh"
    ],
    "streaming": false,
    "api_path": "/v1/stt/slng/speechmatics/batch:15.0.0",
    "docs_url": "https://docs.slng.ai/api-reference/speechmatics/list-batch-jobs",
    "deployments": {
      "regions": [
        "eu-north-1"
      ],
      "worldParts": [
        "eu"
      ],
      "platforms": [],
      "protocols": [
        "https"
      ]
    }
  },
  {
    "code": "soniox/speech-ai:rt-v3",
    "enabled": true,
    "internal": false,
    "service_type": "stt",
    "name": "STT AI RT V3",
    "provider_code": "soniox",
    "short_description": "Speech-to-Text AI lets you transcribe audio in real time with low latency and high accuracy in over 60 languages. This is ideal for use cases like live captions, voice assistants, streaming analytics, and conversational AI.",
    "long_description": "Soniox Speech-to-Text is a universal speech AI that lets you transcribe and translate speech in 60+ languages — from recorded files (async) or live audio streams (real-time). Languages can be freely mixed within the same conversation, and Soniox will handle them seamlessly with high accuracy and low latency.\n\nSoniox provides powerful, production-ready APIs for transcribing, translating, and understanding audio content. Whether you are building real-time voice interfaces, analyzing large volumes of audio, or extracting structured insights from speech, Soniox gives you the tools to do it efficiently and at scale.",
    "best_for": "- Transcription\n- Translation \n- ASR\n- SOTA",
    "use_cases": [
      "Call centers",
      "Customer Support",
      "Voice Agents",
      "Healthcare",
      "Financial services"
    ],
    "capabilities": [
      "Streaming",
      "Medical transcription",
      "HTTPS",
      "WSS",
      "Real time",
      "Multi-language"
    ],
    "languages": [
      "am",
      "ar",
      "ay",
      "az",
      "be",
      "bg",
      "bn",
      "bs",
      "ca",
      "da",
      "de",
      "el",
      "en",
      "es",
      "et",
      "eu",
      "fi",
      "fr",
      "ga",
      "gl",
      "gn",
      "he",
      "hi",
      "hr",
      "hy",
      "id",
      "is",
      "it",
      "ja",
      "ka",
      "kk",
      "kn",
      "ko",
      "ku",
      "la",
      "lb",
      "lt",
      "mr",
      "sa",
      "sw",
      "zh"
    ],
    "streaming": true,
    "api_path": "/v1/stt/soniox/speech-ai:rt-v3",
    "code_example": "wscat -c \"wss://api.slng.ai/v1/stt/soniox/speech-ai:rt-v3\" \\\n  -H \"Authorization: Bearer <token>\"\n\n> {\"type\":\"init\",\"config\":{\"language\":\"en\",\"sample_rate\":16000,\"audio_format\":\"pcm_s16le\",\"enable_partials\":true,\"enable_speaker_diarization\":true,\"language_hints\":[\"en\"]}}",
    "code_examples": {
      "curl": "wscat -c \"wss://api.slng.ai/v1/stt/soniox/speech-ai:rt-v3\" \\\n  -H \"Authorization: Bearer <token>\"\n\n> {\"type\":\"init\",\"config\":{\"language\":\"en\",\"sample_rate\":16000,\"audio_format\":\"pcm_s16le\",\"enable_partials\":true,\"enable_speaker_diarization\":true,\"language_hints\":[\"en\"]}}",
      "python": "import asyncio\nimport websockets\nimport json\n\n\nasync def main():\n    headers = {\"Authorization\": \"Bearer <token>\"}\n    async with websockets.connect(\n        \"wss://api.slng.ai/v1/stt/soniox/speech-ai:rt-v3\", additional_headers=headers\n    ) as ws:\n        await ws.send(\n            json.dumps(\n                {\n                    \"type\": \"init\",\n                    \"config\": {\n                        \"language\": \"en\",\n                        \"sample_rate\": 16000,\n                        \"audio_format\": \"pcm_s16le\",\n                        \"enable_partials\": true,\n                        \"enable_speaker_diarization\": true,\n                        \"language_hints\": [\"en\"],\n                    },\n                }\n            )\n        )\n        async for message in ws:\n            data = json.loads(message)\n            print(data)\n\n\nasyncio.run(main())\n",
      "javascript": "const ws = new WebSocket(\"wss://api.slng.ai/v1/stt/soniox/speech-ai:rt-v3\", {\n  headers: { \"Authorization\": \"Bearer <token>\" }\n});\n\nws.on(\"open\", () => {\n  ws.send(JSON.stringify({\n      \"type\": \"init\",\n      \"config\": {\n          \"language\": \"en\",\n          \"sample_rate\": 16000,\n          \"audio_format\": \"pcm_s16le\",\n          \"enable_partials\": true,\n          \"enable_speaker_diarization\": true,\n          \"language_hints\": [\n              \"en\"\n          ]\n      }\n  }));\n});\n\nws.on(\"message\", (data) => {\n  console.log(JSON.parse(data));\n});\n",
      "typescript": "const ws = new WebSocket(\"wss://api.slng.ai/v1/stt/soniox/speech-ai:rt-v3\", {\n  headers: { \"Authorization\": \"Bearer <token>\" }\n});\n\nws.on(\"open\", () => {\n  ws.send(JSON.stringify({\n      \"type\": \"init\",\n      \"config\": {\n          \"language\": \"en\",\n          \"sample_rate\": 16000,\n          \"audio_format\": \"pcm_s16le\",\n          \"enable_partials\": true,\n          \"enable_speaker_diarization\": true,\n          \"language_hints\": [\n              \"en\"\n          ]\n      }\n  }));\n});\n\nws.on(\"message\", (data: string) => {\n  const parsed = JSON.parse(data);\n  console.log(parsed);\n});\n"
    },
    "docs_url": "https://docs.slng.ai/api-reference/stt/soniox-speech-ai-rt-v3/speech-ai-real-time-v4-http",
    "deployments": {
      "regions": [
        "eu",
        "jp",
        "us"
      ],
      "worldParts": [
        "eu",
        "jp",
        "us"
      ],
      "platforms": [],
      "protocols": [
        "https",
        "wss"
      ]
    }
  },
  {
    "code": "soniox/speech-ai:rt-v4",
    "enabled": true,
    "internal": false,
    "service_type": "stt",
    "name": "STT AI RT V4",
    "provider_code": "soniox",
    "short_description": "Speech-to-Text AI lets you transcribe audio in real time with low latency and high accuracy in over 60 languages. This is ideal for use cases like live captions, voice assistants, streaming analytics, and conversational AI.",
    "long_description": "Soniox Speech-to-Text is a universal speech AI that lets you transcribe and translate speech in 60+ languages — from recorded files (async) or live audio streams (real-time). Languages can be freely mixed within the same conversation, and Soniox will handle them seamlessly with high accuracy and low latency.\n\nSoniox provides powerful, production-ready APIs for transcribing, translating, and understanding audio content. Whether you are building real-time voice interfaces, analyzing large volumes of audio, or extracting structured insights from speech, Soniox gives you the tools to do it efficiently and at scale.",
    "best_for": "- Transcription\n- Translation \n- ASR\n- SOTA",
    "use_cases": [
      "Call centers",
      "Customer Support",
      "Voice Agents",
      "Healthcare",
      "Financial services"
    ],
    "capabilities": [
      "Streaming",
      "Medical transcription",
      "HTTPS",
      "WSS",
      "Real time",
      "Multi-language"
    ],
    "languages": [
      "am",
      "ar",
      "ay",
      "az",
      "be",
      "bg",
      "bn",
      "bs",
      "ca",
      "co",
      "da",
      "de",
      "el",
      "en",
      "es",
      "et",
      "eu",
      "fi",
      "fr",
      "gl",
      "gn",
      "he",
      "hi",
      "hr",
      "id",
      "it",
      "ja",
      "ka",
      "kn",
      "ko",
      "ku",
      "lt",
      "lv",
      "mn",
      "mr",
      "my",
      "ne",
      "nl",
      "no",
      "pa",
      "pl",
      "pt",
      "ro",
      "ru",
      "sk",
      "sl",
      "so",
      "sv",
      "ta",
      "te",
      "uk",
      "vi",
      "zh"
    ],
    "streaming": true,
    "api_path": "/v1/stt/soniox/speech-ai:rt-v4",
    "code_example": "wscat -c \"wss://api.slng.ai/v1/stt/soniox/speech-ai:rt-v4\" \\\n  -H \"Authorization: Bearer <token>\"\n\n> {\"type\":\"init\",\"config\":{\"language\":\"en\",\"sample_rate\":16000,\"audio_format\":\"pcm_s16le\",\"enable_partials\":true,\"enable_speaker_diarization\":true,\"language_hints\":[\"en\"]}}",
    "code_examples": {
      "curl": "wscat -c \"wss://api.slng.ai/v1/stt/soniox/speech-ai:rt-v4\" \\\n  -H \"Authorization: Bearer <token>\"\n\n> {\"type\":\"init\",\"config\":{\"language\":\"en\",\"sample_rate\":16000,\"audio_format\":\"pcm_s16le\",\"enable_partials\":true,\"enable_speaker_diarization\":true,\"language_hints\":[\"en\"]}}",
      "python": "import asyncio\nimport websockets\nimport json\n\n\nasync def main():\n    headers = {\"Authorization\": \"Bearer <token>\"}\n    async with websockets.connect(\n        \"wss://api.slng.ai/v1/stt/soniox/speech-ai:rt-v4\", additional_headers=headers\n    ) as ws:\n        await ws.send(\n            json.dumps(\n                {\n                    \"type\": \"init\",\n                    \"config\": {\n                        \"language\": \"en\",\n                        \"sample_rate\": 16000,\n                        \"audio_format\": \"pcm_s16le\",\n                        \"enable_partials\": true,\n                        \"enable_speaker_diarization\": true,\n                        \"language_hints\": [\"en\"],\n                    },\n                }\n            )\n        )\n        async for message in ws:\n            data = json.loads(message)\n            print(data)\n\n\nasyncio.run(main())\n",
      "typescript": "const ws = new WebSocket(\"wss://api.slng.ai/v1/stt/soniox/speech-ai:rt-v4\", {\n  headers: { \"Authorization\": \"Bearer <token>\" }\n});\n\nws.on(\"open\", () => {\n  ws.send(JSON.stringify({\n      \"type\": \"init\",\n      \"config\": {\n          \"language\": \"en\",\n          \"sample_rate\": 16000,\n          \"audio_format\": \"pcm_s16le\",\n          \"enable_partials\": true,\n          \"enable_speaker_diarization\": true,\n          \"language_hints\": [\n              \"en\"\n          ]\n      }\n  }));\n});\n\nws.on(\"message\", (data: string) => {\n  const parsed = JSON.parse(data);\n  console.log(parsed);\n});\n"
    },
    "deployments": {
      "regions": [
        "eu",
        "jp",
        "us"
      ],
      "worldParts": [
        "eu",
        "jp",
        "us"
      ],
      "platforms": [],
      "protocols": [
        "wss"
      ]
    }
  },
  {
    "code": "cartesia/sonic:3",
    "enabled": true,
    "internal": false,
    "service_type": "tts",
    "name": "Sonic 3",
    "provider_code": "cartesia",
    "short_description": "Sonic 3 delivers high-quality, natural-sounding speech with fine-grained generation controls including speed, volume, and emotion",
    "long_description": "Sonic models take text input and and stream back ultra-realistic speech in response. They can also clone voices, with full control over pronunciation and accent.\n\nSonic 3 is the world’s fastest, most emotive, ultra-realistic text-to-speech model. It can stream out the first byte of audio in just 90ms, making it perfect for real-time and conversational experiences as well as dubbing, narration, AI avatars, and more. (To put things into perspective, 90ms is about twice as fast as the blink of an eye.)\n\nIf real-time performance is your top priority, Sonic Turbo offers even better performance, streaming out the first byte of audio in just 40ms.",
    "best_for": "- Voice agents\n- Voice Assistants\n- Real time voice calls \n- Fast calls",
    "use_cases": [
      "Call Centers",
      "Voice Synthesis",
      "Healthcare",
      "Customer Service"
    ],
    "capabilities": [
      "Streaming",
      "Emotion control",
      "Ultra-realistic",
      "Real-time",
      "SOTA"
    ],
    "languages": [
      "ar",
      "bg",
      "bn",
      "cs",
      "da",
      "de",
      "el",
      "en",
      "es",
      "fi",
      "fr",
      "gu",
      "he",
      "hi",
      "hu",
      "id",
      "it",
      "ja",
      "ka",
      "kn",
      "ko",
      "ml",
      "mr",
      "ms",
      "nl",
      "no",
      "pa",
      "pl",
      "pt",
      "ro",
      "ru",
      "sk",
      "sv",
      "ta",
      "te",
      "th",
      "tl",
      "tr",
      "uk",
      "vi",
      "zh"
    ],
    "streaming": true,
    "api_path": "/v1/tts/cartesia/sonic:3",
    "code_example": "wscat -c \"wss://api.slng.ai/v1/tts/cartesia/sonic:3\" \\\n  -H \"Authorization: Bearer $SLNG_API_KEY\" \\\n  -x '{\"type\":\"init\",\"model_id\":\"sonic-3\",\"voice\":\"f786b574-daa5-4673-aa0c-cbe3e8534c02\",\"encoding\":\"linear16\",\"sample_rate\":24000}' \\\n  -w 1 \\\n  -x '{\"type\":\"text\",\"text\":\"Hello from Cartesia Sonic 3.\",\"continue\":false}'",
    "code_examples": {
      "curl": "wscat -c \"wss://api.slng.ai/v1/tts/cartesia/sonic:3\" \\\n  -H \"Authorization: Bearer $SLNG_API_KEY\" \\\n  -x '{\"type\":\"init\",\"model_id\":\"sonic-3\",\"voice\":\"f786b574-daa5-4673-aa0c-cbe3e8534c02\",\"encoding\":\"linear16\",\"sample_rate\":24000}' \\\n  -w 1 \\\n  -x '{\"type\":\"text\",\"text\":\"Hello from Cartesia Sonic 3.\",\"continue\":false}'",
      "python": "import asyncio\nimport base64\nimport json\nimport os\nimport websockets\n\n\nasync def main():\n    url = \"wss://api.slng.ai/v1/tts/cartesia/sonic:3\"\n    headers = {\"Authorization\": f\"Bearer {os.environ['SLNG_API_KEY']}\"}\n\n    async with websockets.connect(url, extra_headers=headers) as ws:\n        await ws.send(\n            json.dumps(\n                {\n                    \"type\": \"init\",\n                    \"model_id\": \"sonic-3\",\n                    \"voice\": \"f786b574-daa5-4673-aa0c-cbe3e8534c02\",\n                    \"encoding\": \"linear16\",\n                    \"sample_rate\": 24000,\n                }\n            )\n        )\n        await ws.send(\n            json.dumps(\n                {\n                    \"type\": \"text\",\n                    \"text\": \"Hello from Cartesia Sonic 3.\",\n                    \"continue\": False,\n                }\n            )\n        )\n\n        with open(\"output.raw\", \"wb\") as f:\n            async for message in ws:\n                event = json.loads(message)\n                if event[\"type\"] == \"audio_chunk\":\n                    f.write(base64.b64decode(event[\"data\"]))\n                elif event[\"type\"] == \"audio_end\":\n                    break\n                elif event[\"type\"] == \"error\":\n                    raise RuntimeError(event[\"message\"])\n\n\nasyncio.run(main())",
      "typescript": "import WebSocket from \"ws\";\nimport fs from \"node:fs\";\n\ntype Event =\n  | { type: \"audio_chunk\"; data: string; context_id?: string }\n  | { type: \"audio_end\"; context_id?: string }\n  | { type: \"error\"; message: string; status_code?: number; error_code?: string };\n\nconst ws = new WebSocket(\"wss://api.slng.ai/v1/tts/cartesia/sonic:3\", {\n  headers: { Authorization: `Bearer ${process.env.SLNG_API_KEY}` },\n});\n\nconst out = fs.createWriteStream(\"output.raw\");\n\nws.on(\"open\", () => {\n  ws.send(JSON.stringify({\n    type: \"init\",\n    model_id: \"sonic-3\",\n    voice: \"f786b574-daa5-4673-aa0c-cbe3e8534c02\",\n    encoding: \"linear16\",\n    sample_rate: 24000,\n  }));\n  ws.send(JSON.stringify({\n    type: \"text\",\n    text: \"Hello from Cartesia Sonic 3.\",\n    continue: false,\n  }));\n});\n\nws.on(\"message\", (raw: WebSocket.RawData) => {\n  const event = JSON.parse(raw.toString()) as Event;\n  if (event.type === \"audio_chunk\") out.write(Buffer.from(event.data, \"base64\"));\n  else if (event.type === \"audio_end\") { out.end(); ws.close(); }\n  else if (event.type === \"error\") throw new Error(event.message);\n});"
    },
    "docs_url": "https://docs.slng.ai/api-reference/tts/cartesia-sonic-3/cartesia-sonic-3-ws",
    "deployments": {
      "regions": [
        "eu",
        "in",
        "us"
      ],
      "worldParts": [
        "eu",
        "in",
        "us"
      ],
      "platforms": [],
      "protocols": [
        "wss"
      ]
    }
  },
  {
    "code": "deepgram/aura:2",
    "enabled": true,
    "internal": false,
    "service_type": "tts",
    "name": "Aura 2",
    "provider_code": "deepgram",
    "short_description": "Deepgram's TTS model designed to generate realistic, human-like speech in real time, especially for AI voice agents and applications.",
    "long_description": "Deepgram Aura 2 is a real-time text-to-speech model built for conversational AI. It generates natural, human-like speech with low latency, making it ideal for voice assistants, chatbots, and call centers.\n\nAura stands out for its ability to adapt tone and pacing, handle structured data like numbers or dates clearly, and scale to large deployments. Aura also offers multiple voices and languages and integrates with Deepgram’s broader voice AI stack for full speech-to-speech systems.",
    "best_for": "- Conversational AI & Assistants\n- Customer Support & Call Centers\n- Healthcare & Patient Communication\n- Media, Accessibility & Devices",
    "use_cases": [
      "Call centers",
      "Voice agents",
      "Customer support",
      "Healthcare",
      "Media"
    ],
    "capabilities": [
      "Streaming",
      "Multiple voices",
      "Production ready"
    ],
    "languages": [
      "de",
      "en",
      "es",
      "fr",
      "it",
      "ja",
      "nl"
    ],
    "streaming": true,
    "api_path": "/v1/tts/deepgram/aura:2",
    "code_example": "curl -X POST https://api.slng.ai/v1/tts/deepgram/aura:2 \\\n  -H \"Authorization: Bearer <token>\" \\\n  -H \"Content-Type: application/json\" \\\n  --output \"hello.wav\" \\\n  --data '{\n    \"model\": \"aura-2-thalia-en\",\n    \"text\": \"Hello, from sunny Barcelona\"\n  }'",
    "code_examples": {
      "curl": "curl -X POST https://api.slng.ai/v1/tts/deepgram/aura:2 \\\n  -H \"Authorization: Bearer <token>\" \\\n  -H \"Content-Type: application/json\" \\\n  --output \"hello.wav\" \\\n  --data '{\n    \"model\": \"aura-2-thalia-en\",\n    \"text\": \"Hello, from sunny Barcelona\"\n  }'",
      "python": "import requests\n\nresponse = requests.post(\n    \"https://api.slng.ai/v1/tts/deepgram/aura:2\",\n    headers={\"Authorization\": \"Bearer <token>\", \"Content-Type\": \"application/json\"},\n    json={\n        \"model\": \"aura-2-thalia-en\",\n        \"text\": \"Hello, from sunny Barcelona\",\n    },\n)\nwith open(\"hello.wav\", \"wb\") as f:\n    f.write(response.content)",
      "typescript": "import { writeFile } from \"node:fs/promises\";\n\nconst response: Response = await fetch(\"https://api.slng.ai/v1/tts/deepgram/aura:2\", {\n  method: \"POST\",\n  headers: {\n    \"Authorization\": \"Bearer <token>\",\n    \"Content-Type\": \"application/json\"\n  },\n  body: JSON.stringify({\n      \"model\": \"aura-2-thalia-en\",\n      \"text\": \"Hello, from sunny Barcelona\"\n  })\n});\nawait writeFile(\"hello.wav\", Buffer.from(await response.arrayBuffer()));"
    },
    "docs_url": "https://docs.slng.ai/api-reference/tts/deepgram-aura-2/aura-2-http",
    "deployments": {
      "regions": [
        "eu",
        "us"
      ],
      "worldParts": [
        "eu",
        "us"
      ],
      "platforms": [],
      "protocols": [
        "https",
        "wss"
      ]
    }
  },
  {
    "code": "kugelaudio/kugel:1",
    "enabled": true,
    "internal": false,
    "service_type": "tts",
    "name": "Kugel V1",
    "provider_code": "kugelaudio",
    "short_description": "SOTA text-to-speech (TTS) model designed for real-time applications. Perfect if you're you’re building voice agents, interactive applications, or content creation tools.",
    "long_description": "KugelAudio is a speech AI provider focused on high-quality text-to-speech and voice synthesis, offering natural-sounding voices optimized for conversational and real-time applications. Their models are designed with low latency in mind, making them a good fit for voice agents, IVR systems, and interactive use cases where response speed matters.",
    "best_for": "- Conversational Agents\n- Real time\n- Natural-sounding Voices",
    "use_cases": [
      "Call centers",
      "Voice Assistants",
      "Real time calling"
    ],
    "capabilities": [
      "Streaming",
      "Ultra-low latency",
      "Voice cloning",
      "Websocket"
    ],
    "languages": [
      "de",
      "en",
      "es",
      "fr"
    ],
    "streaming": true,
    "api_path": "/v1/tts/kugelaudio/kugel:1",
    "code_example": "wscat -c \"wss://api.slng.ai/v1/tts/kugelaudio/kugel:1\" \\\n  -H \"Authorization: Bearer <token>\"\n\n> {\"type\":\"request\",\"text\":\"Hello from sunny Barcelona\",\"model_id\":\"kugel-1-turbo\",\"voice_id\":268,\"cfg_scale\":2,\"sample_rate\":24000}",
    "code_examples": {
      "curl": "wscat -c \"wss://api.slng.ai/v1/tts/kugelaudio/kugel:1\" \\\n  -H \"Authorization: Bearer <token>\"\n\n> {\"type\":\"request\",\"text\":\"Hello from sunny Barcelona\",\"model_id\":\"kugel-1-turbo\",\"voice_id\":268,\"cfg_scale\":2,\"sample_rate\":24000}",
      "python": "import asyncio\nimport websockets\nimport json\n\n\nasync def main():\n    headers = {\"Authorization\": \"Bearer <token>\"}\n    async with websockets.connect(\n        \"wss://api.slng.ai/v1/tts/kugelaudio/kugel:1\", additional_headers=headers\n    ) as ws:\n        await ws.send(\n            json.dumps(\n                {\n                    \"type\": \"request\",\n                    \"text\": \"Hello from sunny Barcelona\",\n                    \"model_id\": \"kugel-1-turbo\",\n                    \"voice_id\": 268,\n                    \"cfg_scale\": 2,\n                    \"sample_rate\": 24000,\n                }\n            )\n        )\n        async for message in ws:\n            data = json.loads(message)\n            print(data)\n\n\nasyncio.run(main())\n",
      "javascript": "const ws = new WebSocket(\"wss://api.slng.ai/v1/tts/kugelaudio/kugel:1\", {\n  headers: { \"Authorization\": \"Bearer <token>\" }\n});\n\nws.on(\"open\", () => {\n  ws.send(JSON.stringify({\n      \"type\": \"request\",\n      \"text\": \"Hello from sunny Barcelona\",\n      \"model_id\": \"kugel-1-turbo\",\n      \"voice_id\": 268,\n      \"cfg_scale\": 2,\n      \"sample_rate\": 24000\n  }));\n});\n\nws.on(\"message\", (data) => {\n  console.log(JSON.parse(data));\n});\n",
      "typescript": "const ws = new WebSocket(\"wss://api.slng.ai/v1/tts/kugelaudio/kugel:1\", {\n  headers: { \"Authorization\": \"Bearer <token>\" }\n});\n\nws.on(\"open\", () => {\n  ws.send(JSON.stringify({\n      \"type\": \"request\",\n      \"text\": \"Hello from sunny Barcelona\",\n      \"model_id\": \"kugel-1-turbo\",\n      \"voice_id\": 268,\n      \"cfg_scale\": 2,\n      \"sample_rate\": 24000\n  }));\n});\n\nws.on(\"message\", (data: string) => {\n  const parsed = JSON.parse(data);\n  console.log(parsed);\n});\n"
    },
    "docs_url": "https://docs.slng.ai/api-reference/tts/kugel-1/kugel-1-ws"
  },
  {
    "code": "kugelaudio/kugel:2",
    "enabled": true,
    "internal": false,
    "service_type": "tts",
    "name": "Kugel 2",
    "provider_code": "kugelaudio",
    "short_description": "SOTA text-to-speech (TTS) model designed for real-time applications. Perfect if you're you’re building voice agents, interactive applications, or content creation tools.",
    "long_description": "KugelAudio is a speech AI provider focused on high-quality text-to-speech and voice synthesis, offering natural-sounding voices optimized for conversational and real-time applications. Their models are designed with low latency in mind, making them a good fit for voice agents, IVR systems, and interactive use cases where response speed matters.",
    "best_for": "- Conversational Agents\n- Real time\n- Natural-sounding Voices",
    "use_cases": [
      "Call centers",
      "Voice Assistants",
      "Real time calling"
    ],
    "capabilities": [
      "Streaming",
      "Ultra-low latency",
      "Voice cloning",
      "Websocket"
    ],
    "languages": [
      "de",
      "en",
      "es",
      "fr",
      "nl"
    ],
    "streaming": true,
    "api_path": "/v1/tts/kugelaudio/kugel:2",
    "code_example": "wscat -c \"wss://api.slng.ai/v1/tts/kugelaudio/kugel:2\" \\\n  -H \"Authorization: Bearer <token>\"\n\n> {\"type\":\"request\",\"text\":\"Hello from sunny Barcelona\",\"model_id\":\"kugel-2\",\"voice_id\":268,\"cfg_scale\":2,\"sample_rate\":24000}",
    "code_examples": {
      "curl": "wscat -c \"wss://api.slng.ai/v1/tts/kugelaudio/kugel:2\" \\\n  -H \"Authorization: Bearer <token>\"\n\n> {\"type\":\"request\",\"text\":\"Hello from sunny Barcelona\",\"model_id\":\"kugel-2\",\"voice_id\":268,\"cfg_scale\":2,\"sample_rate\":24000}",
      "python": "import asyncio\nimport websockets\nimport json\n\n\nasync def main():\n    headers = {\"Authorization\": \"Bearer <token>\"}\n    async with websockets.connect(\n        \"wss://api.slng.ai/v1/tts/kugelaudio/kugel:2\", additional_headers=headers\n    ) as ws:\n        await ws.send(\n            json.dumps(\n                {\n                    \"type\": \"request\",\n                    \"text\": \"Hello from sunny Barcelona\",\n                    \"model_id\": \"kugel-2\",\n                    \"voice_id\": 268,\n                    \"cfg_scale\": 2,\n                    \"sample_rate\": 24000,\n                }\n            )\n        )\n        async for message in ws:\n            data = json.loads(message)\n            print(data)\n\n\nasyncio.run(main())\n",
      "typescript": "const ws = new WebSocket(\"wss://api.slng.ai/v1/tts/kugelaudio/kugel:2\", {\n  headers: { \"Authorization\": \"Bearer <token>\" }\n});\n\nws.on(\"open\", () => {\n  ws.send(JSON.stringify({\n      \"type\": \"request\",\n      \"text\": \"Hello from sunny Barcelona\",\n      \"model_id\": \"kugel-2\",\n      \"voice_id\": 268,\n      \"cfg_scale\": 2,\n      \"sample_rate\": 24000\n  }));\n});\n\nws.on(\"message\", (data: string) => {\n  const parsed = JSON.parse(data);\n  console.log(parsed);\n});\n"
    },
    "deployments": {
      "regions": [
        "eu"
      ],
      "worldParts": [
        "eu"
      ],
      "platforms": [],
      "protocols": [
        "wss"
      ]
    }
  },
  {
    "code": "murf/murftts:falcon",
    "enabled": true,
    "internal": false,
    "service_type": "tts",
    "name": "Falcon TTS",
    "provider_code": "murf",
    "short_description": "Ultra-fast, scalable, and reliable speech synthesis model built for real-time conversational AI. Designed for production environment.",
    "long_description": "Ultra-low Latency\nFalcon model is optimized for real-time use cases where responsiveness is critical. With time-to-first-audio under 130ms, it ensures conversations feel seamless, natural, and instant. Deployments near your data center ensure lower latency while meeting privacy and data residency requirements.\n\nEnterprise scale concurrency\nBuilt for large-scale deployments, Falcon can support 10,000+ concurrent calls in parallel without compromising audio quality or stability. This makes it ideal for enterprises running high-volume customer interactions.\n\nMultinative speech\nFalcon voices can seamlessly switch between multiple languages within a single sentence while preserving natural pronunciation for each language. For example, a customer support agent could effortlessly switch between English and Spanish, or Hindi and English, just like a bilingual human speaker.",
    "best_for": "- Voice Agents \n- Low latency use cases\n- Cost effective\n- Assistants\n- IVR",
    "use_cases": [
      "Customer support voice agents",
      "Debt servicing and collections",
      "Healthcare assistants",
      "Sales leads qualification",
      "Virtual assistants",
      "Voice IVR systems."
    ],
    "capabilities": [
      "Streaming",
      "Cost effective",
      "In region",
      "Fast inference"
    ],
    "languages": [
      "de",
      "el",
      "en",
      "es",
      "fr",
      "hi",
      "hr",
      "it",
      "ja",
      "ko",
      "lt",
      "ml",
      "mr",
      "nl",
      "pt",
      "sv",
      "ta",
      "te",
      "zh"
    ],
    "streaming": true,
    "api_path": "/v1/tts/murf/murftts:falcon",
    "code_example": "wscat -c \"wss://api.slng.ai/v1/tts/murf/murftts:falcon\" \\\n  -H \"Authorization: Bearer <token>\"\n\n> {\"type\":\"init\",\"model\":\"murftts:falcon\",\"voice\":\"en-US-natalie\",\"config\":{\"sample_rate\":24000,\"encoding\":\"mp3\",\"channel_type\":\"MONO\"}}",
    "code_examples": {
      "curl": "wscat -c \"wss://api.slng.ai/v1/tts/murf/murftts:falcon\" \\\n  -H \"Authorization: Bearer <token>\"\n\n> {\"type\":\"init\",\"model\":\"murftts:falcon\",\"voice\":\"en-US-natalie\",\"config\":{\"sample_rate\":24000,\"encoding\":\"mp3\",\"channel_type\":\"MONO\"}}",
      "python": "import asyncio\nimport websockets\nimport json\n\n\nasync def main():\n    headers = {\"Authorization\": \"Bearer <token>\"}\n    async with websockets.connect(\n        \"wss://api.slng.ai/v1/tts/murf/murftts:falcon\", additional_headers=headers\n    ) as ws:\n        await ws.send(\n            json.dumps(\n                {\n                    \"type\": \"init\",\n                    \"model\": \"murftts:falcon\",\n                    \"voice\": \"en-US-natalie\",\n                    \"config\": {\"sample_rate\": 24000, \"encoding\": \"mp3\", \"channel_type\": \"MONO\"},\n                }\n            )\n        )\n        async for message in ws:\n            data = json.loads(message)\n            print(data)\n\n\nasyncio.run(main())",
      "typescript": "const ws = new WebSocket(\"wss://api.slng.ai/v1/tts/murf/murftts:falcon\", {\n  headers: { \"Authorization\": \"Bearer <token>\" }\n});\n\nws.on(\"open\", () => {\n  ws.send(JSON.stringify({\n      \"type\": \"init\",\n      \"model\": \"murftts:falcon\",\n      \"voice\": \"en-US-natalie\",\n      \"config\": {\n          \"sample_rate\": 24000,\n          \"encoding\": \"mp3\",\n          \"channel_type\": \"MONO\"\n      }\n  }));\n});\n\nws.on(\"message\", (data: string) => {\n  const parsed = JSON.parse(data);\n  console.log(parsed);\n});"
    },
    "docs_url": "https://docs.slng.ai/api-reference/tts/murf-falcon/murf-falcon-ws",
    "deployments": {
      "regions": [
        "ae",
        "au",
        "eu",
        "gb",
        "in",
        "jp",
        "kr",
        "us"
      ],
      "worldParts": [
        "ae",
        "au",
        "eu",
        "gb",
        "in",
        "jp",
        "kr",
        "us"
      ],
      "platforms": [],
      "protocols": [
        "wss"
      ]
    }
  },
  {
    "code": "sarvam/bulbul:v3",
    "enabled": true,
    "internal": false,
    "service_type": "tts",
    "name": "Bulbul V3",
    "provider_code": "sarvam",
    "short_description": "Sarvam AI offers an Advanced TTS with 30+ voices and high-quality natural speech synthesis for Indian languages.",
    "long_description": "Bulbul v3 is Sarvam's latest TTS model built specifically for Indian languages and accents, covering 11 languages including Hindi, Bengali, Tamil, Telugu, Gujarati, Kannada, Malayalam, Marathi, Punjabi, Odia, and English. It delivers human-like prosody with natural intonation and emotional expression, making it well-suited for voice agents, content generation, and conversational AI across the Indian market.\nThe model ships with 30+ natural-sounding speaker voices (Shubh, Aditya, Priya, Simran, Roopa, and many more), supports up to 2,500 characters per request, and offers adjustable speech speed from 0.5x to 2.0x. Audio output is available at multiple sample rates from 8kHz up to 48kHz, with higher rates accessible via the REST API.",
    "best_for": "- Multiple voice options\n- Support for Indian languages\n- Natural prosody and intonation\n- High-quality audio output",
    "use_cases": [
      "Story narration",
      "Podcast generation",
      "Content creation",
      "E-learning"
    ],
    "capabilities": [
      "Low Latency",
      "Pace control",
      "Multiple Audio format",
      "Sample Rates"
    ],
    "languages": [
      "bn",
      "en",
      "gu",
      "hi",
      "kn",
      "ta",
      "te"
    ],
    "streaming": true,
    "api_path": "/v1/tts/sarvam/bulbul:v3",
    "code_example": "curl --request POST \\\n  --url https://api.slng.ai/v1/tts/sarvam/bulbul:v3 \\\n  --header 'Authorization: Bearer <token>' \\\n  --header 'Content-Type: application/json' \\\n  --data '{\n  \"text\": \"Hello, how are you today?\",\n  \"target_language_code\": \"en-IN\",\n  \"speaker\": \"shubh\"\n}'",
    "code_examples": {
      "curl": "curl -X POST https://api.slng.ai/v1/tts/sarvam/bulbul:v3 \\\n  -H \"Authorization: Bearer <token>\" \\\n  -H \"Content-Type: application/json\" \\\n  --output \"hello.wav\" \\\n  --data '{\n    \"text\": \"Hello, from sunny Barcelona\",\n    \"target_language_code\": \"en-IN\",\n    \"speaker\": \"shubh\"\n  }'",
      "python": "import requests\n\nresponse = requests.post(\n    \"https://api.slng.ai/v1/tts/sarvam/bulbul:v3\",\n    headers={\"Authorization\": \"Bearer <token>\", \"Content-Type\": \"application/json\"},\n    json={\n        \"text\": \"Hello, from sunny Barcelona\",\n        \"target_language_code\": \"en-IN\",\n        \"speaker\": \"shubh\",\n    },\n)\nwith open(\"hello.wav\", \"wb\") as f:\n    f.write(response.content)\n",
      "javascript": "import { writeFile } from \"node:fs/promises\";\n\nconst response = await fetch(\"https://api.slng.ai/v1/tts/sarvam/bulbul:v3\", {\n  method: \"POST\",\n  headers: {\n    \"Authorization\": \"Bearer <token>\",\n    \"Content-Type\": \"application/json\"\n  },\n  body: JSON.stringify({\n      \"text\": \"Hello, from sunny Barcelona\",\n      \"target_language_code\": \"en-IN\",\n      \"speaker\": \"shubh\"\n  })\n});\nawait writeFile(\"hello.wav\", Buffer.from(await response.arrayBuffer()));\n",
      "typescript": "import { writeFile } from \"node:fs/promises\";\n\nconst response: Response = await fetch(\"https://api.slng.ai/v1/tts/sarvam/bulbul:v3\", {\n  method: \"POST\",\n  headers: {\n    \"Authorization\": \"Bearer <token>\",\n    \"Content-Type\": \"application/json\"\n  },\n  body: JSON.stringify({\n      \"text\": \"Hello, from sunny Barcelona\",\n      \"target_language_code\": \"en-IN\",\n      \"speaker\": \"shubh\"\n  })\n});\nawait writeFile(\"hello.wav\", Buffer.from(await response.arrayBuffer()));\n"
    },
    "docs_url": "https://docs.slng.ai/api-reference/tts/sarvam-ai-bulbul-v3/bulbul-v3-http",
    "deployments": {
      "regions": [
        "in"
      ],
      "worldParts": [
        "in"
      ],
      "platforms": [],
      "protocols": [
        "https",
        "wss"
      ]
    }
  },
  {
    "code": "slng/deepgram/aura:2-en",
    "enabled": true,
    "internal": false,
    "service_type": "tts",
    "name": "Aura 2 English",
    "provider_code": "deepgram",
    "short_description": "Deepgram's TTS model designed to generate realistic, human-like speech in real time, especially for AI voice agents and applications.",
    "long_description": "Deepgram Aura 2 is a real-time text-to-speech model built for conversational AI. It generates natural, human-like speech with low latency, making it ideal for voice assistants, chatbots, and call centers.\n\nAura stands out for its ability to adapt tone and pacing, handle structured data like numbers or dates clearly, and scale to large deployments. Aura also offers multiple voices and languages and integrates with Deepgram’s broader voice AI stack for full speech-to-speech systems.",
    "best_for": "- Conversational AI & Assistants\n- Customer Support & Call Centers\n- Healthcare & Patient Communication\n- Media, Accessibility & Devices\n- Voice Chatbot",
    "use_cases": [
      "Voice agents",
      "Customer support",
      "Healthcare",
      "Media"
    ],
    "capabilities": [
      "Streaming",
      "Multiple voices",
      "Production ready"
    ],
    "languages": [
      "en"
    ],
    "streaming": true,
    "api_path": "/v1/tts/slng/deepgram/aura:2-en",
    "code_example": "curl -X POST https://api.slng.ai/v1/tts/slng/deepgram/aura:2-en \\\n  -H \"Authorization: Bearer <token>\" \\\n  -H \"Content-Type: application/json\" \\\n  --output \"hello.wav\" \\\n  --data '{\n    \"model\": \"aura-2-thalia-en\",\n    \"text\": \"Hello, from sunny Barcelona\"\n  }'",
    "code_examples": {
      "curl": "curl -X POST https://api.slng.ai/v1/tts/slng/deepgram/aura:2-en \\\n  -H \"Authorization: Bearer <token>\" \\\n  -H \"Content-Type: application/json\" \\\n  --output \"hello.wav\" \\\n  --data '{\n    \"model\": \"aura-2-thalia-en\",\n    \"text\": \"Hello, from sunny Barcelona\"\n  }'",
      "python": "import requests\n\nresponse = requests.post(\n    \"https://api.slng.ai/v1/tts/slng/deepgram/aura:2-en\",\n    headers={\"Authorization\": \"Bearer <token>\", \"Content-Type\": \"application/json\"},\n    json={\n        \"model\": \"aura-2-thalia-en\",\n        \"text\": \"Hello, from sunny Barcelona\",\n    },\n)\nwith open(\"hello.wav\", \"wb\") as f:\n    f.write(response.content)",
      "typescript": "import { writeFile } from \"node:fs/promises\";\n\nconst response: Response = await fetch(\"https://api.slng.ai/v1/tts/slng/deepgram/aura:2-en\", {\n  method: \"POST\",\n  headers: {\n    \"Authorization\": \"Bearer <token>\",\n    \"Content-Type\": \"application/json\"\n  },\n  body: JSON.stringify({\n      \"model\": \"aura-2-thalia-en\",\n      \"text\": \"Hello, from sunny Barcelona\"\n  })\n});\nawait writeFile(\"hello.wav\", Buffer.from(await response.arrayBuffer()));"
    },
    "docs_url": "https://docs.slng.ai/api-reference/tts/deepgram-aura-2/aura-2-english-http",
    "deployments": {
      "regions": [
        "eu-north-1",
        "us-central1"
      ],
      "worldParts": [
        "eu",
        "us"
      ],
      "platforms": [],
      "protocols": [
        "https",
        "wss"
      ]
    }
  },
  {
    "code": "slng/deepgram/aura:2-es",
    "enabled": true,
    "internal": false,
    "service_type": "tts",
    "name": "Aura 2 Spanish",
    "provider_code": "deepgram",
    "short_description": "Deepgram's TTS model designed to generate realistic, human-like speech in real time, especially for AI voice agents and applications.",
    "long_description": "Deepgram Aura 2 is a real-time text-to-speech model built for conversational AI. It generates natural, human-like speech with low latency, making it ideal for voice assistants, chatbots, and call centers.\n\nAura stands out for its ability to adapt tone and pacing, handle structured data like numbers or dates clearly, and scale to large deployments. Aura also offers multiple voices and languages and integrates with Deepgram’s broader voice AI stack for full speech-to-speech systems.",
    "best_for": "- Conversational AI & Assistants\n- Customer Support & Call Centers\n- Healthcare & Patient Communication\n- Media, Accessibility & Devices",
    "use_cases": [
      "Voice agents",
      "Customer support",
      "Healthcare",
      "Media"
    ],
    "capabilities": [
      "Streaming",
      "Multiple voices",
      "Production ready"
    ],
    "languages": [
      "es"
    ],
    "streaming": true,
    "api_path": "/v1/tts/slng/deepgram/aura:2-es",
    "code_example": "curl -X POST https://api.slng.ai/v1/tts/slng/deepgram/aura:2-es \\\n  -H \"Authorization: Bearer <token>\" \\\n  -H \"Content-Type: application/json\" \\\n  --output \"hello.wav\" \\\n  --data '{\n    \"model\": \"aura-2-celeste-es\",\n    \"text\": \"Hello, from sunny Barcelona\"\n  }'",
    "code_examples": {
      "curl": "curl -X POST https://api.slng.ai/v1/tts/slng/deepgram/aura:2-es \\\n  -H \"Authorization: Bearer <token>\" \\\n  -H \"Content-Type: application/json\" \\\n  --output \"hello.wav\" \\\n  --data '{\n    \"model\": \"aura-2-celeste-es\",\n    \"text\": \"Hello, from sunny Barcelona\"\n  }'",
      "python": "import requests\n\nresponse = requests.post(\n    \"https://api.slng.ai/v1/tts/slng/deepgram/aura:2-es\",\n    headers={\"Authorization\": \"Bearer <token>\", \"Content-Type\": \"application/json\"},\n    json={\n        \"model\": \"aura-2-celeste-es\",\n        \"text\": \"Hello, from sunny Barcelona\",\n    },\n)\nwith open(\"hello.wav\", \"wb\") as f:\n    f.write(response.content)",
      "typescript": "import { writeFile } from \"node:fs/promises\";\n\nconst response: Response = await fetch(\"https://api.slng.ai/v1/tts/slng/deepgram/aura:2-es\", {\n  method: \"POST\",\n  headers: {\n    \"Authorization\": \"Bearer <token>\",\n    \"Content-Type\": \"application/json\"\n  },\n  body: JSON.stringify({\n      \"model\": \"aura-2-celeste-es\",\n      \"text\": \"Hello, from sunny Barcelona\"\n  })\n});\nawait writeFile(\"hello.wav\", Buffer.from(await response.arrayBuffer()));"
    },
    "docs_url": "https://docs.slng.ai/api-reference/tts/deepgram-aura-2/aura-2-spanish-http",
    "deployments": {
      "regions": [
        "eu-north-1"
      ],
      "worldParts": [
        "eu"
      ],
      "platforms": [],
      "protocols": [
        "https",
        "wss"
      ]
    }
  },
  {
    "code": "slng/rime/arcana:3-en",
    "enabled": true,
    "internal": false,
    "service_type": "tts",
    "name": "Arcana V3 English",
    "provider_code": "rime",
    "short_description": "Ultra-realistic, expressive voices with low latency (~120ms TTFB out of engine) and native multilingual code-switching across more than 10 languages.",
    "long_description": "Real-Time Conversational Performance: Arcana v3 delivers TTS with industry-leading latency (sub 120ms on-prem latency and 200ms via the cloud API), enabling natural back-and-forth interactions without awkward pauses. \n\nThis is fast enough for mid-utterance control and barge-in with no awkward silences.\n\nMultilingual & Code-Switching: A single model supports more than 10 languages (English, Spanish, Hindi, Arabic, French, Portuguese, German, Japanese, Hebrew, and Tamil) and can switch between them mid-utterance without losing prosody or voice identity.\n\nWord-Level Timestamps: Structural metadata enables text-audio alignment, real-time highlighting, better interruption handling, and smarter orchestration in voice applications.",
    "best_for": "- Voice Assistants\n- Business Telephony\n- IVR\n- TTS",
    "use_cases": [
      "Call centers",
      "voice assistant",
      "IVR",
      "Healthcare"
    ],
    "capabilities": [
      "Streaming",
      "Expressiveness",
      "Latency",
      "High throughput"
    ],
    "languages": [
      "en"
    ],
    "streaming": true,
    "api_path": "/v1/tts/slng/rime/arcana:3-en",
    "code_example": "curl --request POST \\\n  --url https://api.slng.ai/v1/tts/slng/rime/arcana:3-en \\\n  --header 'Authorization: Bearer <token>' \\\n  --header 'Content-Type: application/json' \\\n  --data '{\n  \"text\": \"Hello from Rime Arcana v3 English. Testing text to speech synthesis.\",\n  \"speaker\": \"astra\"\n}'",
    "code_examples": {
      "curl": "curl -X POST https://api.slng.ai/v1/tts/slng/rime/arcana:3-en \\\n  -H \"Authorization: Bearer <token>\" \\\n  -H \"Content-Type: application/json\" \\\n  --output \"hello.wav\" \\\n  --data '{\n    \"text\": \"Hello, from sunny Barcelona\",\n    \"speaker\": \"astra\"\n  }'",
      "python": "import requests\n\nresponse = requests.post(\n    \"https://api.slng.ai/v1/tts/slng/rime/arcana:3-en\",\n    headers={\"Authorization\": \"Bearer <token>\", \"Content-Type\": \"application/json\"},\n    json={\n        \"text\": \"Hello, from sunny Barcelona\",\n        \"speaker\": \"astra\",\n    },\n)\nwith open(\"hello.wav\", \"wb\") as f:\n    f.write(response.content)\n",
      "typescript": "import { writeFile } from \"node:fs/promises\";\n\nconst response: Response = await fetch(\"https://api.slng.ai/v1/tts/slng/rime/arcana:3-en\", {\n  method: \"POST\",\n  headers: {\n    \"Authorization\": \"Bearer <token>\",\n    \"Content-Type\": \"application/json\"\n  },\n  body: JSON.stringify({\n      \"text\": \"Hello, from sunny Barcelona\",\n      \"speaker\": \"astra\"\n  })\n});\nawait writeFile(\"hello.wav\", Buffer.from(await response.arrayBuffer()));\n"
    },
    "docs_url": "https://docs.slng.ai/api-reference/endpoints/rime-arcana-v3/arcana-v3-english-http",
    "deployments": {
      "regions": [
        "ap-southeast-2",
        "asia-south1",
        "eu-north-1"
      ],
      "worldParts": [
        "au",
        "eu",
        "in"
      ],
      "platforms": [],
      "protocols": [
        "https",
        "wss"
      ]
    }
  },
  {
    "code": "slng/rime/arcana:3-es",
    "enabled": true,
    "internal": false,
    "service_type": "tts",
    "name": "Arcana V3 Spanish",
    "provider_code": "rime",
    "short_description": "Rime's flagship TTS model that combines ultra-realistic, expressive voices with low latency (~120ms TTFB out of engine) and native multilingual code-switching across more than 10 languages.\nEnterprise-grade ergonomics for high-volume, real-time deployments at scale.\nSpeaker performance optimized for business telephony and IVR.",
    "long_description": "Real-Time Conversational Performance: Arcana v3 delivers TTS with industry-leading latency (sub 120ms on-prem latency and 200ms via the cloud API), enabling natural back-and-forth interactions without awkward pauses. \n\nThis is fast enough for mid-utterance control and barge-in with no awkward silences.\n\nMultilingual & Code-Switching: A single model supports more than 10 languages (English, Spanish, Hindi, Arabic, French, Portuguese, German, Japanese, Hebrew, and Tamil) and can switch between them mid-utterance without losing prosody or voice identity.\n\nWord-Level Timestamps: Structural metadata enables text-audio alignment, real-time highlighting, better interruption handling, and smarter orchestration in voice applications.",
    "best_for": "- Voice Assistants\n- Business Telephony\n- IVR\n- TTS",
    "use_cases": [
      "Call centers",
      "voice assistant",
      "IVR",
      "Healthcare"
    ],
    "capabilities": [
      "Streaming",
      "Expressiveness",
      "Latency",
      "High throughput"
    ],
    "languages": [
      "es"
    ],
    "streaming": true,
    "api_path": "/v1/tts/slng/rime/arcana:3-es",
    "code_example": "curl --request POST \\\n  --url https://api.slng.ai/v1/tts/slng/rime/arcana:3-es \\\n  --header 'Authorization: Bearer <token>' \\\n  --header 'Content-Type: application/json' \\\n  --data '\n{\n  \"text\": \"Hola desde Rime Arcana v3 Español. Probando la síntesis de texto a voz.\",\n  \"speaker\": \"seraphina\"\n}\n'",
    "code_examples": {
      "curl": "curl --request POST \\\n  --url https://api.slng.ai/v1/tts/slng/rime/arcana:3-es \\\n  --header 'Authorization: Bearer <token>' \\\n  --header 'Content-Type: application/json' \\\n  --data '\n{\n  \"text\": \"Hola desde Rime Arcana v3 Español. Probando la síntesis de texto a voz.\",\n  \"speaker\": \"seraphina\"\n}\n'",
      "python": "import requests\n\nurl = \"https://api.slng.ai/v1/tts/slng/rime/arcana:3-es\"\n\npayload = {\n    \"text\": \"Hola desde Rime Arcana v3 Español. Probando la síntesis de texto a voz.\",\n    \"speaker\": \"seraphina\"\n}\nheaders = {\n    \"Authorization\": \"Bearer <token>\",\n    \"Content-Type\": \"application/json\"\n}\n\nresponse = requests.post(url, json=payload, headers=headers)\n\nprint(response.text)",
      "typescript": "onst options = {\n  method: 'POST',\n  headers: {Authorization: 'Bearer <token>', 'Content-Type': 'application/json'},\n  body: JSON.stringify({\n    text: 'Hola desde Rime Arcana v3 Español. Probando la síntesis de texto a voz.',\n    speaker: 'seraphina'\n  })\n};\n\nfetch('https://api.slng.ai/v1/tts/slng/rime/arcana:3-es', options)\n  .then(res => res.json())\n  .then(res => console.log(res))\n  .catch(err => console.error(err));"
    },
    "docs_url": "https://docs.slng.ai/api-reference/tts/rime-arcana-v3/arcana-v3-spanish-http",
    "deployments": {
      "regions": [
        "eu-north-1"
      ],
      "worldParts": [
        "eu"
      ],
      "platforms": [],
      "protocols": [
        "https",
        "wss"
      ]
    }
  },
  {
    "code": "soniox/tts-rt:v1",
    "enabled": true,
    "internal": false,
    "service_type": "tts",
    "name": "TTS RT V1",
    "provider_code": "soniox",
    "short_description": "Generates native-speaker-quality speech in over 60 languages with ultra-low latency, hallucination-free output, and accurate pronunciation of alphanumerics like phone numbers, email addresses, and IDs. This is ideal for use cases like voice agents, conversational AI, live narration, and interactive assistants.",
    "long_description": "Soniox TTS is a text-to-speech API engineered to handle the edge cases that break most production speech systems. Where other providers stumble on phone numbers, email addresses, foreign names, and mixed-language input, Soniox is purpose-built to get these details right, delivering high-fidelity speech across 60+ languages with robust pronunciation, precise alphanumeric rendering, and seamless mid-sentence language switching. A key differentiator is its hallucination-free guarantee: what you send in is exactly what gets spoken, with no invented words, dropped content, or unexpected substitutions. \n\nSoniox TTS supports streaming speech generation that begins producing audio before a full sentence is even available, enabling ultra-low-latency responses for real-time voice agents and live conversational systems. This makes it particularly well suited for interruption-friendly voice agents and any application where response time directly affects user experience.",
    "best_for": "- Voice Agents\n- Conversational AI\n- Live Narration \n- Interactive assistants",
    "use_cases": [
      "Voice agents",
      "Conversational AI",
      "Live Narration",
      "Real time"
    ],
    "capabilities": [
      "Streaming",
      "Ultra-low latency",
      "Wss"
    ],
    "languages": [
      "af",
      "ar",
      "az",
      "be",
      "bg",
      "bn",
      "bs",
      "ca",
      "cs",
      "cy",
      "da",
      "de",
      "el",
      "en",
      "es",
      "eu",
      "fi",
      "fr",
      "gl",
      "he",
      "hi",
      "hr",
      "hu",
      "id",
      "is",
      "ja",
      "ka",
      "kn",
      "ko",
      "ku",
      "lt",
      "lv",
      "mr",
      "nl",
      "no",
      "pa",
      "pl",
      "pt",
      "ro",
      "ru",
      "sl",
      "sq",
      "sv",
      "ta",
      "te",
      "tl",
      "uk",
      "vi",
      "zh"
    ],
    "streaming": true,
    "api_path": "/v1/tts/soniox/tts-rt:v1",
    "code_example": "curl --request POST \\\n  --url https://api.slng.ai/v1/tts/soniox/tts-rt:v1\\\n  --header 'Authorization: Bearer <token>' \\\n  --header 'Content-Type: application/json' \\\n  --data '\n{\n  \"text\": \"Hello from Soniox text-to-speech.\",\n  \"voice\": \"Adrian\",\n  \"audio_format\": \"wav\",\n  \"sample_rate\": 24000\n}\n'",
    "code_examples": {
      "curl": "curl -X POST https://api.slng.ai/v1/tts/soniox/tts-rt:v1 \\\n  -H \"Authorization: Bearer <token>\" \\\n  -H \"Content-Type: application/json\" \\\n  --output \"hello.wav\" \\\n  --data '{\n    \"text\": \"Hello, from sunny Barcelona\",\n    \"voice\": \"Adrian\",\n    \"audio_format\": \"wav\",\n    \"sample_rate\": 24000\n  }'",
      "python": "import requests\n\nurl = \"https://api.slng.ai/v1/tts/soniox/tts-rt:v1\"\n\npayload = {\n    \"text\": \"Hello, from sunny Barcelona\",\n    \"voice\": \"Adrian\",\n    \"audio_format\": \"wav\",\n    \"sample_rate\": 24000,\n}\nheaders = {\"Authorization\": \"Bearer <token>\", \"Content-Type\": \"application/json\"}\n\nresponse = requests.post(url, json=payload, headers=headers)\n\nwith open(\"hello.wav\", \"wb\") as f:\n    f.write(response.content)\n",
      "typescript": "const options = {\n  method: 'POST',\n  headers: {Authorization: 'Bearer <token>', 'Content-Type': 'application/json'},\n  body: JSON.stringify({\n    text: 'Hello from Soniox text-to-speech.',\n    voice: 'Adrian',\n    audio_format: 'wav',\n    sample_rate: 24000\n  })\n};\n\nfetch('https://api.slng.ai/v1/tts/soniox/tts-rt:v1', options)\n  .then(res => res.json())\n  .then(res => console.log(res))\n  .catch(err => console.error(err));\n"
    },
    "docs_url": "https://docs.slng.ai/api-reference/tts/soniox-tts-v1/soniox-tts-v1-http",
    "deployments": {
      "regions": [
        "eu",
        "jp",
        "us"
      ],
      "worldParts": [
        "eu",
        "jp",
        "us"
      ],
      "platforms": [],
      "protocols": [
        "https",
        "wss"
      ]
    }
  }
] as const;
