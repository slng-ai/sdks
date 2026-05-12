// Single place that constructs both clients from one config blob.
//
// Imports the Stainless-generated HTTP client by relative path during dev
// (`../../../sdks/slng-typescript/src/index`). For npm release, this changes
// to `import Slng from "voiceai-sdk"`.

import Slng from "../../../sdks/slng-typescript/src/index";
import { StreamingClient } from "../../../streaming/ts/client";
import { load, requireApiKey } from "./config";

export interface Clients {
  http: InstanceType<typeof Slng>;
  streaming: StreamingClient;
  apiKey: string;
}

export function makeClients(): Clients {
  const apiKey = requireApiKey();
  const cfg = load();
  const http = new Slng({ apiKey, baseURL: cfg.baseUrl });
  const streaming = new StreamingClient({ apiKey, baseUrl: cfg.baseUrl });
  return { http, streaming, apiKey };
}
