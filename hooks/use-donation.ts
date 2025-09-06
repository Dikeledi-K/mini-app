"use client"

import { useEffect } from "react"
import { useAccount, useSendTransaction, useWaitForTransactionReceipt } from "wagmi"
import type { Address } from "viem"
import { zarToEth, getExplorerUrl } from "@/lib/donation-utils"
import { useToast } from "@/hooks/use-toast"

interface UseDonationProps {
  onSuccess?: (txHash: string) => void
  onError?: (error: Error) => void
}

export function useDonation({ onSuccess, onError }: UseDonationProps = {}) {
  const { address, isConnected, chain } = useAccount()
  const { sendTransaction, data: txHash, isPending: isSending, error: sendError } = useSendTransaction()
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash: txHash,
  })
  const { toast } = useToast()

  useEffect(() => {
    if (isConfirmed && txHash) {
      toast({
        title: "Donation confirmed!",
        description: "Your donation has been successfully processed on the blockchain",
      })
      onSuccess?.(txHash)
    }
  }, [isConfirmed, txHash, onSuccess, toast])

  useEffect(() => {
    if (sendError) {
      toast({
        title: "Donation failed",
        description: sendError.message,
        variant: "destructive",
      })
      onError?.(sendError)
    }
  }, [sendError, onError, toast])

  const donate = async (recipientAddress: Address, zarAmount: number) => {
    if (!isConnected || !address) {
      toast({
        title: "Wallet not connected",
        description: "Please connect your wallet to make a donation",
        variant: "destructive",
      })
      return
    }

    // Validate recipient address
    if (!recipientAddress || recipientAddress === "0x0000000000000000000000000000000000000000") {
      toast({
        title: "Invalid recipient address",
        description: "This campaign does not have a valid wallet address for donations",
        variant: "destructive",
      })
      return
    }

    try {
      // Convert ZAR to ETH
      const ethAmount = zarToEth(zarAmount)

      // Check if the amount is too small
      if (ethAmount === 0n) {
        toast({
          title: "Amount too small",
          description: "The donation amount is too small to process",
          variant: "destructive",
        })
        return
      }

      sendTransaction({
        to: recipientAddress,
        value: ethAmount,
      })

      toast({
        title: "Transaction initiated",
        description: `Please confirm the R${zarAmount} donation in your wallet`,
      })
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Transaction failed"

      toast({
        title: "Donation failed",
        description: errorMessage,
        variant: "destructive",
      })

      onError?.(error instanceof Error ? error : new Error(errorMessage))
    }
  }

  const viewTransaction = () => {
    if (txHash && chain) {
      const url = getExplorerUrl(txHash, chain.id)
      window.open(url, "_blank")
    }
  }

  return {
    donate,
    viewTransaction,
    isLoading: isSending || isConfirming,
    txHash,
    error: sendError?.message,
    isConnected,
    address,
    chain,
  }
}
