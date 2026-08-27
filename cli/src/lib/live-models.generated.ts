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
    "docs_url": "https://docs.slng.ai/api-reference/stt/deepgram-nova-3/nova-3-http",
    "deployments": {
      "regions": [
        "au",
        "eu",
        "us"
      ],
      "worldParts": [
        "au",
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
    "code": "fish/asr:default",
    "enabled": true,
    "internal": false,
    "service_type": "stt",
    "name": "Fish STT",
    "provider_code": "fish",
    "short_description": "ASR model created for batch transcription processes by Fish Audio.",
    "capabilities": [
      "HTTP",
      "Batch",
      "Long processing"
    ],
    "languages": [
      "ar",
      "de",
      "en",
      "es",
      "fr",
      "it",
      "ja",
      "ko",
      "nl",
      "pl",
      "pt",
      "ru",
      "zh"
    ],
    "streaming": true,
    "deployments": {
      "regions": [
        "us"
      ],
      "worldParts": [
        "us"
      ],
      "platforms": [],
      "protocols": [
        "https"
      ]
    }
  },
  {
    "code": "gradium/stt:default",
    "enabled": true,
    "internal": false,
    "service_type": "stt",
    "name": "Gradium STT",
    "provider_code": "gradium",
    "short_description": "Best-in-class accuracy with controllable latency and robust performance in noisy environments. Semantic voice activity detection that enables smart turn-taking, ensuring human responsiveness.",
    "capabilities": [
      "Streaming",
      "Controllable latency",
      "VAD",
      "Smart turn taking"
    ],
    "languages": [
      "de",
      "en",
      "fr",
      "it",
      "pt"
    ],
    "streaming": true,
    "docs_url": "https://docs.slng.ai/api-reference/stt/gradium-stt/gradium-stt-default-ws",
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
    "code": "reson8/reson8stt:v1",
    "enabled": true,
    "internal": false,
    "service_type": "stt",
    "name": "Resonant 1",
    "provider_code": "reson8",
    "short_description": "Hyper-customizable speech-to-text with real-time domain adaptation for European languages. EU-native infrastructure, zero audio retention.",
    "capabilities": [
      "Streaming",
      "Custom",
      "Real Time"
    ],
    "languages": [
      "en"
    ],
    "streaming": true,
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
      "bn",
      "en",
      "gu",
      "hi",
      "kn",
      "ks",
      "ml",
      "mr",
      "ne",
      "sa",
      "sd",
      "ta",
      "te",
      "ur"
    ],
    "streaming": true,
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
    "code": "slng/deepgram/nova:3-id",
    "enabled": true,
    "internal": false,
    "service_type": "stt",
    "name": "Nova 3 Indonesian",
    "provider_code": "deepgram",
    "short_description": "Advanced automatic speech recognition (ASR) model, designed to convert spoken audio into text with very high accuracy and low latency for real-time applications.",
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
    "docs_url": "https://docs.slng.ai/api-reference/stt/deepgram-nova-3/nova-3-multi-language-http"
  },
  {
    "code": "slng/deepgram/nova:3-te",
    "enabled": true,
    "internal": false,
    "service_type": "stt",
    "name": "Nova 3 Telugu",
    "provider_code": "deepgram",
    "short_description": "Advanced automatic speech recognition (ASR) model, designed to convert spoken audio into text with very high accuracy and low latency for real-time applications.",
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
    "streaming": true,
    "docs_url": "https://docs.slng.ai/api-reference/speechmatics/list-batch-jobs",
    "deployments": {
      "regions": [
        "europe-west4"
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
    "code": "slng/speechmatics/realtime:v2",
    "enabled": true,
    "internal": false,
    "service_type": "stt",
    "name": "Speechmatics realtime v2",
    "provider_code": "speechmatics",
    "short_description": "Speech to text API designed for real-world challenges",
    "capabilities": [
      "Streaming",
      "Transcription"
    ],
    "languages": [
      "id"
    ],
    "streaming": true,
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
    "code": "soniox/speech-ai:rt-v3",
    "enabled": true,
    "internal": false,
    "service_type": "stt",
    "name": "STT AI RT V3",
    "provider_code": "soniox",
    "short_description": "Speech-to-Text AI lets you transcribe audio in real time with low latency and high accuracy in over 60 languages. This is ideal for use cases like live captions, voice assistants, streaming analytics, and conversational AI.",
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
    "code": "soniox/speech-ai:rt-v5",
    "enabled": true,
    "internal": false,
    "service_type": "stt",
    "name": "STT AI RT V5",
    "provider_code": "soniox",
    "short_description": "Speech-to-Text AI lets you transcribe audio in real time with low latency and high accuracy in over 60 languages. This is ideal for use cases like live captions, voice assistants, streaming analytics, and conversational AI.",
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
    "code": "cartesia/sonic:3.5",
    "enabled": true,
    "internal": false,
    "service_type": "tts",
    "name": "Sonic 3.5",
    "provider_code": "cartesia",
    "short_description": "Sonic 3 delivers high-quality, natural-sounding speech with fine-grained generation controls including speed, volume, and emotion",
    "capabilities": [
      "Streaming",
      "Emotion control",
      "Ultra realistic",
      "Real time",
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
      "lv",
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
    "docs_url": "https://docs.slng.ai/api-reference/tts/deepgram-aura-2/aura-2-http",
    "deployments": {
      "regions": [
        "au",
        "eu",
        "us"
      ],
      "worldParts": [
        "au",
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
    "code": "fish/tts:s2-pro",
    "enabled": true,
    "internal": false,
    "service_type": "tts",
    "name": "Fish TTS S2 Pro",
    "provider_code": "fish",
    "short_description": "Instant voice cloning from 10 seconds of audio, 60+ emotion tags, sub-300ms streaming latency, and 500,000+ community voices.",
    "capabilities": [
      "Natural voices",
      "Emotion control",
      "Real time",
      "Multilingual"
    ],
    "languages": [
      "ar",
      "de",
      "en",
      "es",
      "fr",
      "it",
      "ja",
      "ko",
      "nl",
      "pl",
      "pt",
      "ru",
      "zh"
    ],
    "streaming": true,
    "docs_url": "https://docs.slng.ai/api-reference/tts/fish-audio-tts-s2-pro/fish-audio-tts-s2-pro-http",
    "deployments": {
      "regions": [
        "us"
      ],
      "worldParts": [
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
    "code": "fish/tts:s2.1-pro",
    "enabled": true,
    "internal": false,
    "service_type": "tts",
    "name": "Fish TTS S2.1 Pro",
    "provider_code": "fish",
    "short_description": "Instant voice cloning from 10 seconds of audio, 60+ emotion tags, sub-300ms streaming latency, and 500,000+ community voices.",
    "capabilities": [
      "Natural Voices",
      "Emotion Control",
      "Real time",
      "Multilingual"
    ],
    "languages": [
      "ar",
      "de",
      "en",
      "es",
      "fr",
      "it",
      "ja",
      "ko",
      "nl",
      "pl",
      "pt",
      "ru",
      "zh"
    ],
    "streaming": true,
    "docs_url": "https://docs.slng.ai/api-reference/tts/fish-audio-tts/fish-audio-tts-s2-1-pro-http",
    "deployments": {
      "regions": [
        "us"
      ],
      "worldParts": [
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
    "code": "gradium/tts:default",
    "enabled": true,
    "internal": false,
    "service_type": "tts",
    "name": "Gradium TTS",
    "provider_code": "gradium",
    "short_description": "Seamless real-time streaming with natural, expressive speech that masters complex pronunciations. Perfect text-audio synchronization through high-precision word-level timestamps.",
    "capabilities": [
      "Streaming",
      "Expressive voice",
      "Customizable"
    ],
    "languages": [
      "de",
      "en",
      "es",
      "fr",
      "ja",
      "ko",
      "pt"
    ],
    "streaming": true,
    "docs_url": "https://docs.slng.ai/api-reference/tts/gradium-tts/gradium-tts-default-http",
    "deployments": {
      "regions": [
        "eu"
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
    "code": "kugelaudio/kugel:2",
    "enabled": true,
    "internal": false,
    "service_type": "tts",
    "name": "Kugel 2",
    "provider_code": "kugelaudio",
    "short_description": "SOTA text-to-speech (TTS) model designed for real-time applications. Perfect if you're you’re building voice agents, interactive applications, or content creation tools.",
    "capabilities": [
      "Streaming",
      "Ultra-low latency",
      "Voice cloning",
      "Websocket"
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
      "ko",
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
      "th",
      "tr",
      "uk",
      "ur",
      "vi",
      "yue",
      "zh"
    ],
    "streaming": true,
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
      "ml",
      "mr",
      "ta",
      "te"
    ],
    "streaming": true,
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
    "capabilities": [
      "Streaming",
      "Multiple voices",
      "Production ready"
    ],
    "languages": [
      "en"
    ],
    "streaming": true,
    "docs_url": "https://docs.slng.ai/api-reference/tts/deepgram-aura-2/aura-2-english-http",
    "deployments": {
      "regions": [
        "us-central1"
      ],
      "worldParts": [
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
    "capabilities": [
      "Streaming",
      "Multiple voices",
      "Production ready"
    ],
    "languages": [
      "es"
    ],
    "streaming": true,
    "docs_url": "https://docs.slng.ai/api-reference/tts/deepgram-aura-2/aura-2-spanish-http"
  },
  {
    "code": "slng/inworld/max:1.5",
    "enabled": true,
    "internal": false,
    "service_type": "tts",
    "name": "TTS 1.5 Max",
    "provider_code": "inworld",
    "short_description": "Realtime AI that feels as human as it sounds.",
    "capabilities": [
      "Streaming",
      "Human sound",
      "SOTA"
    ],
    "languages": [
      "af",
      "am",
      "ar",
      "as",
      "az",
      "be",
      "bg",
      "bn",
      "bs",
      "ca",
      "cs",
      "da",
      "de",
      "el",
      "en",
      "es",
      "et",
      "eu",
      "fa",
      "fi",
      "fr",
      "ga",
      "gl",
      "gu",
      "he",
      "hi",
      "hr",
      "ht",
      "hu",
      "hy",
      "id",
      "is",
      "it",
      "ja",
      "jv",
      "ka",
      "kk",
      "kn",
      "ko",
      "ln",
      "lo",
      "lt",
      "lv",
      "mk",
      "ms",
      "my",
      "nb",
      "ne",
      "nl",
      "no",
      "pa",
      "pl",
      "pt",
      "ro",
      "ru",
      "sc",
      "sk",
      "sl",
      "sm",
      "so",
      "sq",
      "sr",
      "sv",
      "ta",
      "te",
      "tl",
      "uk",
      "vi",
      "zh",
      "zu"
    ],
    "streaming": true,
    "docs_url": "https://docs.slng.ai/api-reference/tts/inworld-max-1-5/inworld-max-1-5-ws",
    "deployments": {
      "regions": [
        "nebius-eu-north1"
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
