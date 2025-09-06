function withValidProperties(properties: Record<string, any>) {
  return Object.fromEntries(
    Object.entries(properties).filter(([_, value]) => (Array.isArray(value) ? value.length > 0 : !!value)),
  )
}

export async function GET() {
  const URL = process.env.NEXT_PUBLIC_URL as string
  return Response.json({
    accountAssociation: {
      header: process.env.FARCASTER_HEADER,
      payload: process.env.FARCASTER_PAYLOAD,
      signature: process.env.FARCASTER_SIGNATURE,
    },
    frame: withValidProperties({
      version: "1",
      name: process.env.NEXT_PUBLIC_ONCHAINKIT_PROJECT_NAME || "iS'khaftin",
      subtitle: "Ubuntu Community Crowdfunding",
      description:
        "Micro-crowdfunding platform for South African communities, embodying Ubuntu philosophy through blockchain transparency",
      screenshotUrls: [],
      iconUrl: `${URL}/icon-192x192.png`,
      splashImageUrl: `${URL}/frame-image.jpg`,
      splashBackgroundColor: "#F97316",
      homeUrl: URL,
      webhookUrl: `${URL}/api/webhook`,
      primaryCategory: "social",
      tags: ["crowdfunding", "community", "ubuntu", "south-africa", "blockchain"],
      heroImageUrl: `${URL}/frame-image.jpg`,
      tagline: "micro-crowdfunding",
      ogTitle: "iS'khaftin",
      ogDescription: "Transform social media engagement into direct community action through micro-donations",
      ogImageUrl: `${URL}/frame-image.jpg`,
      // use only while testing
      noindex: true,
    }),
  })
}
