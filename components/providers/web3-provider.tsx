"use client"

import type React from "react"
import { OnchainKitProvider } from "@coinbase/onchainkit"
import { WagmiProvider } from "wagmi"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { base } from "wagmi/chains"
import { wagmiConfig } from "@/lib/wagmi-config"
import { useState } from "react"

export function Web3Provider({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient())

  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <OnchainKitProvider
          apiKey={process.env.NEXT_PUBLIC_ONCHAINKIT_API_KEY}
          chain={base}
          projectName={process.env.NEXT_PUBLIC_ONCHAINKIT_PROJECT_NAME || "iS'khaftin"}
        >
          {children}
        </OnchainKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  )
}
