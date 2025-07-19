import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Web3Provider } from "./context/Web3Context";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ChainSure - Community-Governed Mutual Insurance",
  description: "Revolutionary blockchain-native insurance platform built on Binance Smart Chain. Join a community where every policyholder is a stakeholder with AI-powered claims processing and transparent governance.",
  keywords: ["blockchain", "insurance", "DeFi", "BSC", "mutual insurance", "community governance", "AI claims", "NFT policies"],
  authors: [{ name: "ChainSure Team" }],
  openGraph: {
    title: "ChainSure - Community-Governed Mutual Insurance",
    description: "Revolutionary blockchain-native insurance platform built on Binance Smart Chain",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "ChainSure - Community-Governed Mutual Insurance",
    description: "Revolutionary blockchain-native insurance platform built on Binance Smart Chain",
  },
  robots: "index, follow",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              // Add window.ethereum type declaration
              if (typeof window !== 'undefined') {
                window.ethereum = window.ethereum || {};
              }
            `,
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Web3Provider>
          {children}
        </Web3Provider>
      </body>
    </html>
  );
}
