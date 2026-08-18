# Workline Editorial Rebuild Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Apply the approved paper-and-cobalt editorial design system to Workline without altering marketplace or wallet behavior.

**Architecture:** Retain the existing Next.js routes and AgenC components. Replace shared CSS tokens and layout presentation, then apply Workline-specific hero and catalogue copy through existing page components.

**Tech Stack:** Next.js App Router, React, TypeScript, Tailwind import layer, CSS custom properties, Vitest.

**Spec:** `docs/superpowers/specs/2026-08-18-workline-editorial-rebuild-design.md`

## Global Constraints

- Preserve every Solana, RPC, transaction, wallet, API, and server-route behavior.
- Use Workline-specific copy only; do not use the reference project's names, logos, curriculum material, or testimonials.
- Use paper `#fafaf5`, cobalt `#3553ff`, dark ink, monospace editorial type, thin rules, and low-radius rectangular controls.
- Do not modify `README.md`.

---

### Task 1: Establish shared editorial tokens and application chrome

**Files:**
- Modify: `src/app/globals.css`
- Modify: `src/components/shell.tsx`

**Interfaces:**
- Consumes: existing `.hw-*` selectors and `HireWireShell` route wrapper.
- Produces: stable `.hw-*` visual tokens consumed by every page and protocol component.

- [ ] **Step 1: Inspect existing selector usage**

Run: `rg 'hw-[a-z-]+' src`

Expected: selectors used by page components are identified before replacing global styles.

- [ ] **Step 2: Replace the dark ledger token layer with the approved paper-and-cobalt layer**

In `src/app/globals.css`, map `--ink` to `#fafaf5`, `--paper` to dark ink, and `--amber` to `#3553ff`; set `--agenc-*` variables to the same accessible surface, border, text, and action colors. Remove dark gradients and large rounded surfaces.

- [ ] **Step 3: Restyle shell without changing links or wallet behavior**

Keep the existing `NAV`, `WalletButton`, `PoweredByAgenC`, routes, and `referrerFeeBps` calculation. Change only class structure/copy styling where necessary for the protocol-index header and footer.

- [ ] **Step 4: Verify the type-check**

Run: `npm exec tsc -- --noEmit`

Expected: PASS.

### Task 2: Make the Workline home and catalogue read as a marketplace protocol record

**Files:**
- Modify: `src/app/catalog.tsx`
- Modify: `src/app/globals.css`

**Interfaces:**
- Consumes: existing `Catalog` data loading, search/filter/sort, listing card, and moderation projection props.
- Produces: the approved hero copy and editorial catalogue layout without changing data queries or listing links.

- [ ] **Step 1: Locate current hero and catalogue selectors**

Run: `rg -n 'hw-(hero|eyebrow|ledger|section-head|toolbar)' src/app/catalog.tsx src/app/globals.css`

Expected: existing hero data and class names are available for presentation-only edits.

- [ ] **Step 2: Replace only the hero copy**

Set the eyebrow to `AGENC MARKETPLACE NODE · SOLANA MAINNET`, the heading to `Hire AI agents.`, and the supporting sentence to `Escrow settles on-chain, with a receipt.` Do not remove live statistics, moderation information, catalogue controls, or listing components.

- [ ] **Step 3: Restyle the hero, toolbar, and cards as editorial records**

Use full-width bands, 1px cobalt rules, uppercase mono metadata, white/paper panels, and minimal hover states. Do not introduce reference-site text or assets.

- [ ] **Step 4: Run focused tests**

Run: `npm test -- --run test/rpc.test.ts`

Expected: PASS; presentation changes do not affect RPC behavior.

### Task 3: Verify production presentation and unchanged behavior

**Files:**
- Modify only if verification identifies a styling defect: `src/app/globals.css`, `src/components/shell.tsx`, or `src/app/catalog.tsx`

**Interfaces:**
- Consumes: Tasks 1 and 2.
- Produces: a buildable visual rebuild with unchanged application routes.

- [ ] **Step 1: Run complete tests**

Run: `npm test`

Expected: PASS.

- [ ] **Step 2: Run production verification**

Run: `npm exec tsc -- --noEmit; npm run build`

Expected: both commands exit 0.

- [ ] **Step 3: Inspect changed files before commit**

Run: `git diff --check; git status --short`

Expected: no whitespace errors and no unrelated file changes introduced by this rebuild.
