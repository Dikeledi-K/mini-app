import { type NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
  try {
    const frameHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta property="fc:frame" content="vNext" />
          <meta property="fc:frame:image" content="${process.env.NEXT_PUBLIC_URL || "http://localhost:3000"}/frame-image.jpg" />
          <meta property="fc:frame:button:1" content="🌍 Discover Campaigns" />
          <meta property="fc:frame:button:1:action" content="post" />
          <meta property="fc:frame:button:1:target" content="${process.env.NEXT_PUBLIC_URL || "http://localhost:3000"}/api/frame/discover" />
          <meta property="fc:frame:button:2" content="💝 Create Campaign" />
          <meta property="fc:frame:button:2:action" content="post" />
          <meta property="fc:frame:button:2:target" content="${process.env.NEXT_PUBLIC_URL || "http://localhost:3000"}/api/frame/create" />
          <meta property="fc:frame:button:3" content="📊 My Dashboard" />
          <meta property="fc:frame:button:3:action" content="post" />
          <meta property="fc:frame:button:3:target" content="${process.env.NEXT_PUBLIC_URL || "http://localhost:3000"}/api/frame/dashboard" />
          <meta property="og:image" content="${process.env.NEXT_PUBLIC_URL || "http://localhost:3000"}/frame-image.jpg" />
          <title>iS'khaftin - Ubuntu Community Crowdfunding</title>
        </head>
        <body>
          <h1>iS'khaftin - Ubuntu Community Crowdfunding</h1>
          <p>Turn your community into a force for good with transparent, blockchain-powered micro-donations</p>
        </body>
      </html>
    `

    return new NextResponse(frameHtml, {
      headers: {
        "Content-Type": "text/html",
      },
    })
  } catch (error) {
    console.error("Frame error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function GET() {
  return POST({} as NextRequest)
}
