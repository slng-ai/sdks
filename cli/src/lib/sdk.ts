// Single place that constructs both clients from one config blob.

import Slng from "voiceai-sdk";
import { StreamingClient } from "../../../streaming/ts/client";
import { requireApiKey } from "./config";
import { resolveBaseUrl } from "./verify";

export interface Clients {
  http: InstanceType<typeof Slng>;
  streaming: StreamingClient;
  apiKey: string;
  baseUrl: string;
}

/**
 * Both clients always get an explicit host. Their built-in default
 * (api.slng.ai) no longer resolves, and a key works only at its own gateway.
 */
export async function makeClients(region?: string): Promise<Clients> {
  const apiKey = requireApiKey();
  const baseUrl = await resolveBaseUrl(apiKey, region);
  const http = new Slng({ apiKey, baseURL: baseUrl });
  const streaming = new StreamingClient({ apiKey, baseUrl });
  return { http, streaming, apiKey, baseUrl };
}
