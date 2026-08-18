export type SolanaNetwork = "localnet" | "devnet" | "mainnet";

const DEFAULT_RPC_URL: Record<SolanaNetwork, string> = {
  localnet: "http://127.0.0.1:8899",
  devnet: "https://api.devnet.solana.com",
  mainnet: "https://api.mainnet-beta.solana.com",
};

const RPC_HOST_PATTERN =
  /solana\.com|helius|rpcpool|quiknode|quicknode|alchemy|ankr|triton|syndica/i;

function isLoopback(hostname: string): boolean {
  return hostname === "localhost" || hostname === "127.0.0.1" || hostname === "[::1]";
}

function isKnownHost(hostname: string, pattern: RegExp): boolean {
  return pattern.test(hostname);
}

/** True when a configured API base looks like a JSON-RPC endpoint. */
export function isRpcEndpoint(value: string): boolean {
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:"
      ? RPC_HOST_PATTERN.test(url.hostname)
      : false;
  } catch {
    return false;
  }
}

/** Validate an RPC URL before it can be used for reads or wallet writes. */
export function validateRpcUrl(value: string, network: SolanaNetwork): string {
  let url: URL;
  try {
    url = new URL(value.trim());
  } catch {
    throw new Error("RPC URL must be an absolute URL");
  }

  if (url.protocol !== "http:" && url.protocol !== "https:") {
    throw new Error("RPC URL must use HTTP(S)");
  }
  if (url.username || url.password) {
    throw new Error("RPC URL must not contain credentials");
  }

  const loopback = isLoopback(url.hostname);
  if (network === "localnet") {
    if (!loopback) throw new Error("localnet RPC must use a loopback host");
  } else {
    if (url.protocol !== "https:") {
      throw new Error("mainnet/devnet RPC must use HTTPS");
    }
    if (loopback) {
      throw new Error(`${network} RPC must not use a loopback host`);
    }
  }

  if (
    network === "mainnet" &&
    isKnownHost(url.hostname, /(^|\.)api\.devnet\.solana\.com$/i)
  ) {
    throw new Error("mainnet RPC must not target devnet");
  }
  if (
    network === "devnet" &&
    isKnownHost(url.hostname, /(^|\.)api\.mainnet-beta\.solana\.com$/i)
  ) {
    throw new Error("devnet RPC must not target mainnet");
  }

  return url.toString();
}

/** Resolve and validate the single RPC URL used by server and client paths. */
export function resolveRpcUrl(
  network: SolanaNetwork,
  apiBaseUrl: string,
  override?: string,
): string {
  const explicit = override?.trim();
  const candidate =
    explicit || (isRpcEndpoint(apiBaseUrl) ? apiBaseUrl : DEFAULT_RPC_URL[network]);
  return validateRpcUrl(candidate, network);
}
