"use client"

import { useAccount, useConnect, useDisconnect } from "wagmi"
import { Button } from "@/components/ui/button"
import { Wallet, LogOut } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useEffect, useState } from "react"

export function WalletConnectButtonSimple() {
  const { address, isConnected, chain } = useAccount()
  const { connect, connectors, isPending } = useConnect()
  const { disconnect } = useDisconnect()
  const { toast } = useToast()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`
  }

  const connectWallet = () => {
    // Try to connect with the first available connector
    const connector = connectors[0]
    if (connector) {
      connect({ connector })
    } else {
      toast({
        title: "No wallet found",
        description: "Please install a wallet to continue",
        variant: "destructive",
      })
    }
  }

  // Always render the same initial state during SSR to prevent hydration mismatch
  if (!mounted) {
    return (
      <Button disabled className="bg-primary hover:bg-primary/90">
        <Wallet className="w-4 h-4 mr-2" />
        Loading...
      </Button>
    )
  }

  if (isConnected && address) {
    return (
      <div className="flex items-center gap-2">
        <Button variant="outline" className="bg-transparent">
          <Wallet className="w-4 h-4 mr-2" />
          {formatAddress(address)}
        </Button>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => disconnect()}
          className="text-muted-foreground hover:text-foreground"
        >
          <LogOut className="w-4 h-4" />
        </Button>
      </div>
    )
  }

  return (
    <Button onClick={connectWallet} disabled={isPending} className="bg-primary hover:bg-primary/90">
      <Wallet className="w-4 h-4 mr-2" />
      {isPending ? "Connecting..." : "Connect Wallet"}
    </Button>
  )
}
