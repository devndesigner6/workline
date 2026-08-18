import { describe, expect, it } from "vitest";
import { resolveRpcUrl } from "../src/lib/rpc";

describe("resolveRpcUrl", () => {
  it("prefers an explicit override and trims it", () => {
    expect(
      resolveRpcUrl("mainnet", "https://api.agenc.ag", " https://rpc.example.com/ "),
    ).toBe("https://rpc.example.com/");
  });

  it("uses an API base only when it is a recognized RPC endpoint", () => {
    expect(
      resolveRpcUrl("mainnet", "https://mainnet.helius-rpc.com/?api-key=test"),
    ).toBe("https://mainnet.helius-rpc.com/?api-key=test");
    expect(resolveRpcUrl("mainnet", "https://api.agenc.ag")).toBe(
      "https://api.mainnet-beta.solana.com/",
    );
  });

  it("rejects insecure or wrong-cluster mainnet endpoints", () => {
    expect(() =>
      resolveRpcUrl("mainnet", "https://api.agenc.ag", "http://rpc.example.com"),
    ).toThrow(/HTTPS/);
    expect(() =>
      resolveRpcUrl("mainnet", "https://api.agenc.ag", "https://api.devnet.solana.com"),
    ).toThrow(/mainnet/i);
    expect(() =>
      resolveRpcUrl("mainnet", "https://api.agenc.ag", "http://127.0.0.1:8899"),
    ).toThrow(/mainnet/i);
  });

  it("allows the localnet loopback RPC", () => {
    expect(resolveRpcUrl("localnet", "http://127.0.0.1:8899")).toBe(
      "http://127.0.0.1:8899/",
    );
  });
});
