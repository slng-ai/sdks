// Single place that constructs both clients from one config blob.

import Slng from "voiceai-sdk";
import { PROJECT_ID_HEADER, StreamingClient } from "../../../streaming/ts/client";
import { requireApiKey, resolveProjectId } from "./config";
import { resolveBaseUrl } from "./verify";

export interface Clients {
  http: InstanceType<typeof Slng>;
  streaming: StreamingClient;
  apiKey: string;
  baseUrl: string;
  projectId?: string;
}

/**
 * Both clients always get an explicit host. Their built-in default
 * (api.slng.ai) no longer resolves, and a key works only at its own gateway.
 */
export async function makeClients(region?: string, project?: string): Promise<Clients> {
  const apiKey = requireApiKey();
  const baseUrl = await resolveBaseUrl(apiKey, region);
  const projectId = resolveProjectId(project);
  const http = new Slng({
    apiKey,
    baseURL: baseUrl,
    ...(projectId && { defaultHeaders: { [PROJECT_ID_HEADER]: projectId } }),
  });
  const streaming = new StreamingClient({ apiKey, baseUrl, projectId });
  return { http, streaming, apiKey, baseUrl, projectId };
}
