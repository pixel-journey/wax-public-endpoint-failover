import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Which WAX API, and the next endpoint",
  description: "Sequential failover across at most five https origins, plus a custom one. Chain id must be WAX mainnet.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
