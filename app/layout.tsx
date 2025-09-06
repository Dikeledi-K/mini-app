import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Analytics } from "@vercel/analytics/next"
import { Web3Provider } from "@/components/providers/web3-provider"
import { MiniKitContextProvider } from "@/providers/MiniKitProvider"
import { Toaster } from "@/components/ui/toaster"
import { Suspense } from "react"
import "./globals.css"

export const metadata: Metadata = {
  title: "iS'khaftin - Ubuntu Community Crowdfunding",
  description: "Turn your community into a force for good with transparent, blockchain-powered micro-donations",
  generator: "v0.app",
  manifest: "/manifest.json",
  openGraph: {
    title: "iS'khaftin - Ubuntu Community Crowdfunding",
    description: "Turn your community into a force for good with transparent, blockchain-powered micro-donations",
    images: ["/frame-image.jpg"],
  },
  other: {
    "fc:frame": "vNext",
    "fc:frame:image": `${process.env.NEXT_PUBLIC_URL || "http://localhost:3000"}/frame-image.jpg`,
    "fc:frame:button:1": "🌍 Discover Campaigns",
    "fc:frame:button:1:action": "post",
    "fc:frame:button:1:target": `${process.env.NEXT_PUBLIC_URL || "http://localhost:3000"}/api/frame/discover`,
    "fc:frame:button:2": "💝 Create Campaign",
    "fc:frame:button:2:action": "post",
    "fc:frame:button:2:target": `${process.env.NEXT_PUBLIC_URL || "http://localhost:3000"}/api/frame/create`,
    "fc:frame:button:3": "📊 My Dashboard",
    "fc:frame:button:3:action": "post",
    "fc:frame:button:3:target": `${process.env.NEXT_PUBLIC_URL || "http://localhost:3000"}/api/frame/dashboard`,
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable}`}>
        <Suspense fallback={null}>
          <MiniKitContextProvider>
            <Web3Provider>
              {children}
              <Toaster />
            </Web3Provider>
          </MiniKitContextProvider>
        </Suspense>
        <Analytics />
      </body>
    </html>
  )
}
