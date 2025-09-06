import { http, createConfig } from "wagmi"
import { base, baseSepolia, mainnet } from "wagmi/chains"
import { metaMask } from "wagmi/connectors"

export const wagmiConfig = createConfig({
  chains: [base, baseSepolia, mainnet],
  connectors: [
    metaMask({
      dappMetadata: {
        name: "iS'khaftin",
        url: "https://iskhaftin.vercel.app",
      },
    }),
  ],
  transports: {
    [mainnet.id]: http(),
    [base.id]: http(),
    [baseSepolia.id]: http(),
  },
})
