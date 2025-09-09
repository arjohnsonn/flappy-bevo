import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
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
  title: "Flappy Bevo",
  description: "Play Flappy Bevo! Guide Bevo the Longhorn mascot through the UT towers in this fun Texas-themed Flappy Bird game. Hook 'em Horns!",
  keywords: ["flappy bird", "flappy bevo", "texas longhorns", "bevo", "ut austin", "game", "longhorns"],
  authors: [{ name: "Flappy Bevo Team" }],
  openGraph: {
    title: "Flappy Bevo",
    description: "Play Flappy Bevo! Guide Bevo through UT towers. Hook 'em Horns!",
    type: "website",
    images: [
      {
        url: "/bevo.png",
        width: 200,
        height: 200,
        alt: "Bevo the Longhorn Mascot",
      },
    ],
  },
  other: {
    "theme-color": "#BF5700",
    "msapplication-TileColor": "#BF5700",
  },
  twitter: {
    card: "summary",
    title: "Flappy Bevo",
    description: "Play Flappy Bevo! Guide Bevo through UT towers. Hook 'em Horns!",
    images: ["/bevo.png"],
  },
  viewport: "width=device-width, initial-scale=1",
  themeColor: "#BF5700",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
