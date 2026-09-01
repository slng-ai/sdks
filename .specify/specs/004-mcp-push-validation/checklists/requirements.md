# Specification Quality Checklist: Push agents with MCP references, and validate before publishing

**Purpose**: Validate specification completeness and quality before proceeding to planning
**Created**: 2026-09-01
**Feature**: [spec.md](../spec.md)

## Content Quality

- [x] No implementation details (languages, frameworks, APIs)
- [x] Focused on user value and business needs
- [x] Written for non-technical stakeholders
- [x] All mandatory sections completed

## Requirement Completeness

- [x] No [NEEDS CLARIFICATION] markers remain
- [x] Requirements are testable and unambiguous
- [x] Success criteria are measurable
- [x] Success criteria are technology-agnostic (no implementation details)
- [x] All acceptance scenarios are defined
- [x] Edge cases are identified
- [x] Scope is clearly bounded
- [x] Dependencies and assumptions identified

## Feature Readiness

- [x] All functional requirements have clear acceptance criteria
- [x] User scenarios cover primary flows
- [x] Feature meets measurable outcomes defined in Success Criteria
- [x] No implementation details leak into specification

## Notes

Iteration 1 findings, all corrected before this checklist was marked complete:

- **Endpoint paths leaked into requirements.** The first draft named routes and HTTP verbs in
  FR-003, FR-011 and FR-017. Rewritten as capabilities ("the platform's own capability snapshot",
  "connect to one MCP server"); the verified route behaviour is recorded in Assumptions as a
  dependency, which is where it belongs.
- **The freshness window was hard-coded as "5 minutes" in a requirement.** Replaced by FR-012 /
  FR-017 reading the platform's own scheduled refresh time, with the observed ≈5 min figure kept in
  Assumptions as evidence rather than as a constant to implement against.
- **Two success criteria were implementation metrics.** "Copies the cached hash" and "sends
  `mcp_refs` non-empty" restated the mechanism; replaced by SC-001 (zero dashboard steps) and SC-006
  (nothing created on refusal), which are observable without knowing how it works.
- **Data loss was missed entirely in the first pass.** The agent write currently sends an empty MCP
  reference list unconditionally, so removing the blocker without FR-006 and FR-008 would silently
  delete dashboard-made MCP attachments on the first update push. Added as a requirement, an edge
  case, an acceptance scenario, and SC-007.
- **`mcp run` was over-scoped.** The first draft implied it could invoke a named MCP tool. No such
  operation exists (verified live), so FR-014–FR-019 are scoped to connect-and-report, and the
  exclusion is stated in Assumptions.

Out-of-scope decisions recorded deliberately, not overlooked: creating or editing MCP servers from
the CLI; invoking a single MCP tool; any change to how the platform probes or caches capabilities.
