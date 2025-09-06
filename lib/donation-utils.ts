import { parseEther, formatEther } from "viem"
import { base } from "wagmi/chains"

// Convert ZAR to ETH (mock exchange rate - in production, use real API)
const ZAR_TO_ETH_RATE = 0.000015 // Approximate rate: 1 ZAR ≈ 0.000015 ETH

export function zarToEth(zarAmount: number): bigint {
  const ethAmount = zarAmount * ZAR_TO_ETH_RATE
  return parseEther(ethAmount.toString())
}

export function ethToZar(ethAmount: bigint): number {
  const ethValue = Number(formatEther(ethAmount))
  return ethValue / ZAR_TO_ETH_RATE
}

export function formatZarAmount(amount: number): string {
  return new Intl.NumberFormat("en-ZA", {
    style: "currency",
    currency: "ZAR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

export function isValidEthereumAddress(address: string): boolean {
  return /^0x[a-fA-F0-9]{40}$/.test(address)
}

export const SUPPORTED_NETWORKS = [base.id] // Focus on Base for lower fees

export function getExplorerUrl(txHash: string, chainId: number): string {
  switch (chainId) {
    case base.id:
      return `https://basescan.org/tx/${txHash}`
    default:
      return `https://etherscan.io/tx/${txHash}`
  }
}
