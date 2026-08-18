/**
 * `<Providers>` — the client boundary that mounts `<AgencProvider>` above the
 * whole app. It wires reads (indexer-first + gPA fallback), the referrer config
 * (validated + stored + disclosed + INJECTED into every hire at the provider
 * level — referral settlement is live on-chain), and the network.
 *
 * ## Read transport
 *
 * `AgencProvider` derives its read transport from `config.indexer` or
 * `config.queryTransport` only — it does NOT (v1) build a kit RPC from a bare
 * `rpcUrl`. So for the gPA / localnet path we construct the read transport here
 * with `createReadTransport({ rpc })` and pass it as `queryTransport`. When
 * `api.baseUrl` is a real hosted indexer we pass `indexer` and let the provider
 * resolve indexer-first.
 *
 * ## Signer — LIVE wallet wiring (this store is NOT read-only)
 *
 * Unlike the stock template (which ships no wallet-connect UI and stays
 * read-only in the browser), this store bridges any Wallet Standard wallet
 * (Phantom first) into the provider's `config.signer` seam via
 * `signerFromWalletAccount` — the exact bridge the official integration
 * guide names for buyers to sign hires. Connected → `HireActivationButton`
 * and the review/activation flows go fully live against mainnet; not
 * connected → reads still work and write CTAs show the connect-required
 * state. Discovery + connect lifecycle live in `./wallet` (layout-only glue;
 * all protocol logic stays in the official packages).
 */
"use client";
import { useMemo, type ReactNode } from "react";
import {
  AgencProvider,
  createReadTransport,
  type ReadTransport,
  type AgencProviderConfig,
} from "@tetsuo-ai/marketplace-react";
import { createSolanaRpc } from "@solana/kit";
import { address } from "@solana/addresses";
import {
  createIndexerClient,
  getServiceListingDecoder,
  type DecodedProgramAccount,
  type ServiceListing,
} from "@tetsuo-ai/marketplace-sdk";
import "@tetsuo-ai/marketplace-react/theme.css";
import "@tetsuo-ai/marketplace-react/components.css";
import { storeConfig } from "./config";
import { WalletContextProvider, useWallet } from "./wallet";
import { isRpcEndpoint, resolveRpcUrl } from "./rpc";

/**
 * Hosts that are JSON-RPC endpoints, not hosted indexers. A hosted mainnet
 * RPC in `api.baseUrl` must route to the gPA read path — treating it as an
 * indexer fires REST paths at a JSON-RPC server (403/404 and an empty
 * catalog).
 */
/**
 * Resolve the gPA/write RPC URL. `NEXT_PUBLIC_AGENC_RPC_URL` wins when set —
 * the per-network public defaults commonly reject browser JSON-RPC on
 * mainnet, so real deployments should provide their own endpoint.
 */
function rpcUrl(): string {
  return resolveRpcUrl(
    storeConfig.network,
    storeConfig.api.baseUrl,
    process.env.NEXT_PUBLIC_AGENC_RPC_URL,
  );
}

/** Is `api.baseUrl` a real indexer (vs a local or hosted bare RPC)? */
function indexerBaseUrl(): string | null {
  const base = storeConfig.api.baseUrl;
  if (isRpcEndpoint(base)) return null;
  try {
    const url = new URL(base);
    if (url.hostname === "127.0.0.1" || url.hostname === "localhost") return null;
  } catch {
    return null;
  }
  return base;
}

/** Decode the indexer's base64 account bytes in the browser without a second
 * round-trip through the SDK's conservative 12-item pagination loop. */
function decodeBase64(value: string): Uint8Array {
  const binary = atob(value);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i += 1) bytes[i] = binary.charCodeAt(i);
  return bytes;
}

function fastIndexerTransport(baseUrl: string, apiKey?: string): ReadTransport {
  const indexer = { baseUrl, apiKey };
  const client = createIndexerClient(indexer);
  const fallback = createReadTransport({ indexer });
  return {
    ...fallback,
    async listActiveListings(options): Promise<Array<DecodedProgramAccount<ServiceListing>>> {
      // The storefront hook has no filter. Keep filtered/advanced reads on the
      // SDK transport so category/provider semantics remain canonical there.
      if (options?.provider !== undefined || options?.category !== undefined) {
        return fallback.listActiveListings(options);
      }
      const decoder = getServiceListingDecoder();
      const rows: Array<DecodedProgramAccount<ServiceListing>> = [];
      for (let page = 1; ; page += 1) {
        const result = await client.listings({ page, pageSize: 100 });
        rows.push(
          ...result.items.map((item) => ({
            address: address(item.pda),
            account: decoder.decode(decodeBase64(item.accountData)),
          })),
        );
        if (result.items.length === 0 || rows.length >= result.total) break;
      }
      const state = options?.state ?? 0;
      return rows.filter((row) => row.account.state === state);
    },
  };
}

function AgencWithWallet({ children }: { children: ReactNode }) {
  const { signer } = useWallet();

  const config = useMemo<AgencProviderConfig>(() => {
    const indexer = indexerBaseUrl();
    // Referrer: validated + stored + disclosed + injected into every hire by
    // the provider (referral settlement is live on-chain). Earnings are read
    // from chain, never faked.
    const referrer = {
      wallet: storeConfig.referrer.wallet,
      feeBps: storeConfig.referrer.feeBps,
    };
    // The connected wallet's kit signer (or undefined while disconnected —
    // reads stay live, write CTAs show the connect-required state).
    const walletSigner = signer ?? undefined;
    if (indexer) {
      const queryTransport = fastIndexerTransport(indexer, storeConfig.api.apiKey);
      return {
        network: storeConfig.network,
        // The WRITE client (and single-account reads like the WP-A1
        // roster-attestor resolution) builds from rpcUrl — pass the working
        // endpoint explicitly instead of the per-network default.
        rpcUrl: rpcUrl(),
        indexer: { baseUrl: indexer, apiKey: storeConfig.api.apiKey },
        queryTransport,
        referrer,
        signer: walletSigner,
      };
    }
    // gPA / localnet: build the read transport explicitly and pass it through
    // the `queryTransport` seam.
    return {
      network: storeConfig.network,
      rpcUrl: rpcUrl(),
      queryTransport: createReadTransport({ rpc: createSolanaRpc(rpcUrl()) }),
      referrer,
      signer: walletSigner,
    };
  }, [signer]);

  return <AgencProvider config={config}>{children}</AgencProvider>;
}

export function Providers({ children }: { children: ReactNode }) {
  return (
    <WalletContextProvider>
      <AgencWithWallet>{children}</AgencWithWallet>
    </WalletContextProvider>
  );
}
