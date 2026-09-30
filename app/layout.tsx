import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://meghavyuha.vercel.app"),
  title: "MEGHAVYUHA — Regime- and Error-Aware Probabilistic Rainfall Intelligence for India",
  description:
    "MEGHAVYUHA tests which rainfall correction earns its place in each forecast context. Regime- and Error-Aware Probabilistic Rainfall Intelligence for India (Smart India Hackathon 2026, Problem Statement 26080) by Against The Odds (Team ID: 149284).",
  keywords: [
    "MEGHAVYUHA",
    "Rainfall Forecasting",
    "Monsoon Post-Processing",
    "Smart India Hackathon 2026",
    "SIH 26080",
    "Against The Odds",
    "Error Atlas",
    "GEFSv12",
    "Probabilistic Precipitation",
  ],
  authors: [{ name: "Against The Odds — Team 149284" }],
  creator: "Against The Odds",
  publisher: "Against The Odds (SIH 2026 Team 149284)",
  openGraph: {
    title: "MEGHAVYUHA — Regime- and Error-Aware Probabilistic Rainfall Intelligence for India",
    description:
      "Different forecast contexts. Measured correction choices. Regime- and Error-Aware Probabilistic Rainfall Intelligence for India. Smart India Hackathon 2026 (PS 26080).",
    url: "https://meghavyuha.vercel.app",
    siteName: "MEGHAVYUHA",
    images: [
      {
        url: "/meghavyuha-logo.png",
        width: 512,
        height: 512,
        alt: "MEGHAVYUHA Logo",
      },
    ],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "MEGHAVYUHA — Rainfall Intelligence for India",
    description:
      "Regime- and Error-Aware Probabilistic Rainfall Intelligence for India. SIH 2026 PS 26080 by Against The Odds (Team 149284).",
    images: ["/meghavyuha-logo.png"],
  },
  icons: {
    icon: "/meghavyuha-logo.png",
    shortcut: "/meghavyuha-logo.png",
    apple: "/meghavyuha-logo.png",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#060810",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
