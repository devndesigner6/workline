/**
 * Root layout — mounts `<Providers>` (AgenC context + Wallet Standard signer
 * bridge) above the branded `<HireWireShell>` (header/nav/wallet control +
 * referral-disclosure footer). SSR-safe: the shell is a thin client boundary;
 * pages render on the server.
 *
 * Typefaces are loaded by the shared reference stylesheet in `globals.css`:
 * VT323 for display, Source Serif 4 for body copy, and JetBrains Mono for
 * protocol labels and addresses.
 */
import type { Metadata } from "next";
import { storeMetadata } from "@tetsuo-ai/store-core/seo";
import { storeConfig, seoContext } from "@/lib/config";
import { Providers } from "@/lib/providers";
import { HireWireShell } from "@/components/shell";
import "./globals.css";

export const metadata: Metadata = storeMetadata(seoContext);

// An AgenC store renders the LIVE on-chain book through a client provider;
// there is nothing to statically prerender. Render every route dynamically.
export const dynamic = "force-dynamic";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <HireWireShell referrerFeeBps={storeConfig.referrer.feeBps}>
            {children}
          </HireWireShell>
        </Providers>
      </body>
    </html>
  );
}
