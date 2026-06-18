# Agents spec (`/v1/agents`)

`agents.oas.yaml` is the OpenAPI spec for the SLNG Voice Agents API: agents CRUD
(+ duplicate), calls (dispatch/list/get/tool-executions), and web sessions. It is
served from a **different host** than the rest of the API: `https://api.agents.slng.ai`.

The CLI's `voiceai agents …` commands talk to this API directly (`cli/src/lib/agents.ts`).

## Provenance

Vendored from the docs repo — this is the source of truth, not `gateway-specs`:

- Repo: `slng-ai/docs`
- Path: `api-reference/agents/agents.oas.yaml`

To refresh:

```sh
gh api repos/slng-ai/docs/contents/api-reference/agents/agents.oas.yaml --jq '.content' \
  | base64 -d > specs/agents/agents.oas.yaml
```

## Merge into the Stainless input

The agents paths and components are also merged into `.stainless/openapi.json`
(the combined doc Stainless consumes) so the generated SDK gains `client.agents.*`
methods. Two transforms are applied during the merge:

1. The agents `ErrorResponse` schema is renamed to `AgentsErrorResponse` (and its
   `$ref`s rewritten) — `ErrorResponse` already exists in the combined doc.
2. Each `/v1/agents…` path gets a path-level `servers: [{ url: https://api.agents.slng.ai }]`
   override so the SDK routes agents calls to the agents host while bridges/`me`
   stay on `api.slng.ai`.

Keep both in sync when this spec changes.
