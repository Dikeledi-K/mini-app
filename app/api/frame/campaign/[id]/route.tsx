import { type NextRequest, NextResponse } from "next/server"

const campaigns = {
  "1": {
    title: "Community Kitchen Stove",
    description: "Help Soweto community center get a new stove for feeding 200+ families daily",
    raised: 2500,
    goal: 5000,
    image: "community-kitchen-stove.jpg",
  },
  "2": {
    title: "School Books for Limpopo",
    description: "Textbooks for 50 children in rural Limpopo primary school",
    raised: 1800,
    goal: 3000,
    image: "school-children-with-books.jpg",
  },
  "3": {
    title: "Community Vegetable Garden",
    description: "Seeds and tools for sustainable food security in Khayelitsha",
    raised: 800,
    goal: 2000,
    image: "community-vegetable-garden.jpg",
  },
}

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const campaign = campaigns[params.id as keyof typeof campaigns]

    if (!campaign) {
      return NextResponse.json({ error: "Campaign not found" }, { status: 404 })
    }

    const progress = Math.round((campaign.raised / campaign.goal) * 100)

    const frameHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta property="fc:frame" content="vNext" />
          <meta property="fc:frame:image" content="${process.env.NEXT_PUBLIC_URL || "http://localhost:3000"}/${campaign.image}" />
          <meta property="fc:frame:button:1" content="💝 Donate R100" />
          <meta property="fc:frame:button:1:action" content="post" />
          <meta property="fc:frame:button:1:target" content="${process.env.NEXT_PUBLIC_URL || "http://localhost:3000"}/api/frame/donate/${params.id}/100" />
          <meta property="fc:frame:button:2" content="💰 Donate R250" />
          <meta property="fc:frame:button:2:action" content="post" />
          <meta property="fc:frame:button:2:target" content="${process.env.NEXT_PUBLIC_URL || "http://localhost:3000"}/api/frame/donate/${params.id}/250" />
          <meta property="fc:frame:button:3" content="🎯 Custom Amount" />
          <meta property="fc:frame:button:3:action" content="post" />
          <meta property="fc:frame:button:3:target" content="${process.env.NEXT_PUBLIC_URL || "http://localhost:3000"}/api/frame/donate/${params.id}/custom" />
          <meta property="fc:frame:button:4" content="⬅️ Back" />
          <meta property="fc:frame:button:4:action" content="post" />
          <meta property="fc:frame:button:4:target" content="${process.env.NEXT_PUBLIC_URL || "http://localhost:3000"}/api/frame/discover" />
          <meta property="og:image" content="${process.env.NEXT_PUBLIC_URL || "http://localhost:3000"}/${campaign.image}" />
          <title>${campaign.title} - iS'khaftin</title>
        </head>
        <body>
          <h1>${campaign.title}</h1>
          <p>${campaign.description}</p>
          <p>Progress: R${campaign.raised} / R${campaign.goal} (${progress}%)</p>
        </body>
      </html>
    `

    return new NextResponse(frameHtml, {
      headers: {
        "Content-Type": "text/html",
      },
    })
  } catch (error) {
    console.error("Campaign frame error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
