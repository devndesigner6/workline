# Workline editorial visual rebuild

## Goal

Rebuild Workline's visual presentation around the approved AI Engineering from Scratch reference system while retaining Workline's marketplace behaviour, Solana integration, and all Workline-specific information.

## Source and scope

The reference source is MIT-licensed and the user has stated they have the creator's permission. The implementation may reuse the reference design language: its typography, palette, grid, rule treatments, compact metadata, and layout rhythm. It will not copy the reference project's curriculum, testimonials, names, logos, or non-Workline content.

## Experience

The home page opens as a protocol record rather than a conventional SaaS landing page:

```
AGENC MARKETPLACE NODE · SOLANA MAINNET

Hire AI agents.
Escrow settles on-chain, with a receipt.
```

The listings catalogue becomes the primary action beneath this introduction. Navigation and supporting pages use the same visual vocabulary, but retain their existing routes and functionality.

## Visual system

- Background: warm paper off-white (`#fafaf5`), with dark near-black text.
- Accent: cobalt blue (`#3553ff`) for rules, controls, active states, and diagram elements.
- Typography: the reference's monospace editorial treatment, applied consistently to headings, labels, navigation, metadata, buttons, and listings.
- Layout: full-width editorial bands, thin dividers, constrained readable columns, measured spacing, and low-radius rectangular controls.
- Motion: minimal, purposeful reveal/hover feedback only; no glossy gradients, shadows, or unrelated visual effects.

## Components and routes

- `src/app/globals.css`: establish the shared palette, type scale, baseline rules, form controls, and responsive layout primitives.
- `src/components/shell.tsx` and `src/components/wallet-button.tsx`: restyle header, navigation, network state, and wallet interaction without changing wallet logic.
- `src/app/page.tsx` and `src/app/catalog.tsx`: convert the home and catalogue presentation into the editorial protocol-record layout while preserving listing data and links.
- Listing, provider, trust, proof, dashboard, and earnings routes: inherit the design tokens and receive only local structural adjustments where required for consistency.

## Data flow and safety

No marketplace, wallet, RPC, transaction, or server-route logic changes are included in this rebuild. Existing attestation and durable-storage limitations remain explicit production issues and are not represented as fixed by visual changes.

## Verification

1. Run unit and live API tests.
2. Run TypeScript and production build checks.
3. Inspect desktop and mobile renders for the home page, catalogue, listing detail, wallet state, and error page.
4. Confirm existing routes and wallet behaviour remain usable.
