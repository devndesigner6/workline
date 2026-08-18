# Build Context

> Auto-generated from the solana.new scaffold workflow. Do not edit manually.

## Stack

| Field | Value |
|-------|-------|
| Template | Existing Workline marketplace (Next.js App Router) |
| Architecture pattern | Next.js + existing marketplace protocol SDK (integration-first; no new Anchor program) |
| Completed at | 2026-08-18T05:29:37Z |
| Scaffold source | solana.new / SendAI Superstack `scaffold-project` |

### Skills Installed

- `scaffold-project` (used for this context handoff)
- Wallet Standard discovery already present in the repository
- `@solana/kit` RPC transport already present in the repository

### MCPs Configured

- None required for the existing read/indexer and wallet flow.

### Repos Cloned

- None; the existing Workline repository already contains the marketplace integration.

## Build Status

| Field | Value |
|-------|-------|
| MVP complete | Yes |
| Tests passing | Yes |
| Devnet deployed | No |
| Mainnet deployed | Existing mainnet marketplace |
| Mainnet program ID | HJsZ53Zb27b8QMRbQpuDngE44AdwCGxvEZr61Zmxw1xK |
| RPC provider | Configurable via `AGENC_RPC_URL` (server) or `NEXT_PUBLIC_AGENC_RPC_URL` (browser) |

### Milestones

- [x] Existing marketplace and Wallet Standard integration reviewed
- [x] Shared RPC resolution and mainnet safety validation added
- [x] Regression tests added for RPC selection and cluster safety
- [x] Updated live catalog reads to the current `pageSize` API contract

## Review

| Field | Value |
|-------|-------|
| Security score | B+ |
| Quality score | B+ |
| Ready for mainnet | Yes, subject to deployment RPC and wallet smoke tests |

### Findings

| Severity | Category | Description | Fix |
|----------|----------|-------------|-----|
| medium | configuration | Server and browser RPC overrides used different names and validation paths | Centralized resolution; HTTPS, loopback, credentials, and known-cluster checks now fail closed |
| medium | integration | Hosted listings API retired the `limit` query parameter | Replaced catalog and proof reads with `pageSize` |

### Mainnet checklist

- [ ] Set a rate-appropriate HTTPS RPC endpoint in deployment secrets.
- [ ] Set `NEXT_PUBLIC_AGENC_RPC_URL` only when browser reads/writes need a dedicated endpoint.
- [ ] Verify the connected wallet reports `solana:mainnet` before signing.
- [ ] Run a small-value wallet smoke test and confirm the receipt on the configured explorer.
