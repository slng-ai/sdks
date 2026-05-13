#!/usr/bin/env bun
// Generate static model/voice catalog helpers for the published SDKs.
//
// Source of truth:
// - cli/src/lib/live-models.generated.ts for deployed model metadata
// - cli/src/lib/voice-catalog.generated.ts for voice metadata

import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { TTS_MODELS, STT_MODELS, type SttModel, type TtsModel } from "../cli/src/lib/models";
import { VOICE_CATALOG, type Voice } from "../cli/src/lib/voice-catalog.generated";

const REPO_ROOT = new URL("..", import.meta.url).pathname;
const TS_OUT = join(REPO_ROOT, "sdks/slng-typescript/src/lib/catalog.ts");
const PY_OUT = join(REPO_ROOT, "sdks/slng-python/src/voiceai_sdk/lib/catalog.py");

type ServiceType = "tts" | "stt";

interface SdkModel extends TtsModel, SttModel {
  service: ServiceType;
}

function slngFirstCompare(a: { id: string }, b: { id: string }): number {
  const aSlng = a.id.startsWith("slng/");
  const bSlng = b.id.startsWith("slng/");
  if (aSlng !== bSlng) return aSlng ? -1 : 1;
  return a.id.localeCompare(b.id);
}

function compact<T extends Record<string, unknown>>(value: T): T {
  return Object.fromEntries(Object.entries(value).filter(([, v]) => v !== undefined)) as T;
}

function modelFor(service: ServiceType, model: TtsModel | SttModel): SdkModel {
  return compact({
    service,
    id: model.id,
    provider: model.provider,
    family: model.family,
    languages: model.languages,
    name: model.name,
    shortDescription: model.shortDescription,
    capabilities: model.capabilities,
    useCases: "useCases" in model ? model.useCases : undefined,
    streaming: model.streaming,
    deployments: model.deployments,
  }) as SdkModel;
}

const models: SdkModel[] = [
  ...TTS_MODELS.map((m) => modelFor("tts", m)),
  ...STT_MODELS.map((m) => modelFor("stt", m)),
].sort(slngFirstCompare);

const voices: Record<string, Voice[]> = Object.fromEntries(
  Object.entries(VOICE_CATALOG).sort(([a], [b]) => a.localeCompare(b)),
);

function write(path: string, contents: string): void {
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, contents);
}

function tsCatalog(): string {
  return `// AUTO-GENERATED from the CLI model and voice catalogs.
// Do not edit by hand. Run \`bun run gen-sdk-catalogs\` from the repo root.

export type ServiceType = 'tts' | 'stt';

export interface ModelDeployments {
  regions: string[];
  worldParts: string[];
  platforms: string[];
  protocols: string[];
}

export interface ModelInfo {
  service: ServiceType;
  id: string;
  provider: string;
  family: string;
  languages?: string[];
  name?: string;
  shortDescription?: string;
  capabilities?: string[];
  useCases?: string[];
  streaming?: boolean;
  deployments?: ModelDeployments;
}

export interface VoiceInfo {
  voiceId: string;
  name?: string;
  gender?: string;
  tone?: string;
  useCase?: string;
  ageRange?: string;
  language?: string;
  sampleDir?: string;
  sampleUrl?: string;
}

export interface ListModelsOptions {
  service?: ServiceType;
  language?: string;
}

export interface ListVoicesOptions {
  model: string;
  language?: string;
}

const MODELS: readonly ModelInfo[] = ${JSON.stringify(models, null, 2)};

const VOICES_BY_MODEL: Readonly<Record<string, readonly VoiceInfo[]>> = ${JSON.stringify(voices, null, 2)};

function cloneModel(model: ModelInfo): ModelInfo {
  return JSON.parse(JSON.stringify(model)) as ModelInfo;
}

function cloneVoice(voice: VoiceInfo): VoiceInfo {
  return JSON.parse(JSON.stringify(voice)) as VoiceInfo;
}

export function listModels(options: ListModelsOptions = {}): ModelInfo[] {
  const { service, language } = options;
  return MODELS.filter((model) => {
    if (service && model.service !== service) return false;
    if (language && model.languages && !model.languages.includes(language)) return false;
    return true;
  }).map(cloneModel);
}

export function getModel(model: string): ModelInfo | undefined {
  const found = MODELS.find((entry) => entry.id === model);
  return found ? cloneModel(found) : undefined;
}

export function listVoices(options: ListVoicesOptions): VoiceInfo[] {
  const voices = VOICES_BY_MODEL[options.model] ?? [];
  return voices
    .filter((voice) => !options.language || voice.language === options.language)
    .map(cloneVoice);
}
`;
}

function pyCatalog(): string {
  return `# AUTO-GENERATED from the CLI model and voice catalogs.
# Do not edit by hand. Run \`bun run gen-sdk-catalogs\` from the repo root.

from __future__ import annotations

import json
from copy import deepcopy
from typing import cast
from typing_extensions import Literal, TypedDict, NotRequired

ServiceType = Literal["tts", "stt"]


class ModelDeployments(TypedDict, total=False):
    regions: list[str]
    worldParts: list[str]
    platforms: list[str]
    protocols: list[str]


class ModelInfo(TypedDict):
    service: ServiceType
    id: str
    provider: str
    family: str
    languages: NotRequired[list[str]]
    name: NotRequired[str]
    shortDescription: NotRequired[str]
    capabilities: NotRequired[list[str]]
    useCases: NotRequired[list[str]]
    streaming: NotRequired[bool]
    deployments: NotRequired[ModelDeployments]


class VoiceInfo(TypedDict):
    voiceId: str
    name: NotRequired[str]
    gender: NotRequired[str]
    tone: NotRequired[str]
    useCase: NotRequired[str]
    ageRange: NotRequired[str]
    language: NotRequired[str]
    sampleDir: NotRequired[str]
    sampleUrl: NotRequired[str]


_MODELS_JSON = r'''
${JSON.stringify(models, null, 2)}
'''

_VOICES_JSON = r'''
${JSON.stringify(voices, null, 2)}
'''

_MODELS = cast(tuple[ModelInfo, ...], tuple(json.loads(_MODELS_JSON)))
_VOICES_BY_MODEL = cast(dict[str, tuple[VoiceInfo, ...]], {
    model: tuple(model_voices) for model, model_voices in json.loads(_VOICES_JSON).items()
})


def list_models(service: ServiceType | None = None, language: str | None = None) -> list[ModelInfo]:
    models = [
        model
        for model in _MODELS
        if (service is None or model["service"] == service)
        and (language is None or "languages" not in model or language in model["languages"])
    ]
    return deepcopy(models)


def get_model(model: str) -> ModelInfo | None:
    for entry in _MODELS:
        if entry["id"] == model:
            return deepcopy(entry)
    return None


def list_voices(model: str, language: str | None = None) -> list[VoiceInfo]:
    voices = [
        voice
        for voice in _VOICES_BY_MODEL.get(model, ())
        if language is None or voice.get("language") == language
    ]
    return deepcopy(voices)
`;
}

write(TS_OUT, tsCatalog());
write(PY_OUT, pyCatalog());

console.log(`wrote ${TS_OUT}`);
console.log(`wrote ${PY_OUT}`);
console.log(`  ${models.length} models, ${Object.keys(voices).length} voice catalogs`);
