"use client"
import { Button } from "@/components/ui/button"
import { Heart, Loader2, ExternalLink } from "lucide-react"
import { useDonation } from "@/hooks/use-donation"
import type { Address } from "viem"
import { WalletConnectButtonSimple } from "./wallet-connect-button-simple"

interface DonationButtonProps {
  amount: number
  currency?: string
  recipientAddress: Address
  onDonate?: (amount: number, txHash: string) => Promise<void>
  disabled?: boolean
  className?: string
}

export function DonationButton({
  amount,
  currency = "R",
  recipientAddress,
  onDonate,
  disabled = false,
  className,
}: DonationButtonProps) {
  const { donate, isLoading, txHash, isConnected, viewTransaction } = useDonation({
    onSuccess: async (hash) => {
      if (onDonate) {
        await onDonate(amount, hash)
      }
    },
  })

  if (!isConnected) {
    return <WalletConnectButtonSimple />
  }

  const handleDonate = () => {
    donate(recipientAddress, amount)
  }

  if (txHash) {
    return (
      <Button onClick={viewTransaction} variant="outline" size="lg" className={`font-semibold ${className}`}>
        <ExternalLink className="w-4 h-4 mr-2" />
        View Transaction
      </Button>
    )
  }

  return (
    <Button onClick={handleDonate} disabled={disabled || isLoading} size="lg" className={`font-semibold ${className}`}>
      {isLoading ? (
        <>
          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          Processing...
        </>
      ) : (
        <>
          <Heart className="w-4 h-4 mr-2" />
          Donate {currency}
          {amount}
        </>
      )}
    </Button>
  )
}
