# Account spec (`/v1/me`)

`account.oas.json` is the OpenAPI spec for the SLNG Account API (`GET /v1/me`),
which returns the account, organization, and API key for the authenticated bearer
token. The CLI uses this endpoint as its lightweight auth probe (`voiceai whoami`,
`voiceai login`).

## Provenance

Vendored from the docs repo — this is the source of truth, not `gateway-specs`:

- Repo: `slng-ai/docs`
- Path: `api-reference/me/me.oas.json`
- Rendered: https://docs.slng.ai/api-reference/account/get-current-account

To refresh:

```sh
gh api repos/slng-ai/docs/contents/api-reference/me/me.oas.json --jq '.content' \
  | base64 -d > specs/account/account.oas.json
```

The `/v1/me` path and its `Account` schema are also merged into
`.stainless/openapi.json` (the combined doc Stainless consumes) so the generated
SDK gains a `me` resource. Keep both in sync when this spec changes.
