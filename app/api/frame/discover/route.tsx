import { type NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
  try {
    const frameHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta property="fc:frame" content="vNext" />
          <meta property="fc:frame:image" content="${process.env.NEXT_PUBLIC_URL || "http://localhost:3000"}/discover-frame.jpg" />
          <meta property="fc:frame:button:1" content="🏠 Community Kitchen" />
          <meta property="fc:frame:button:1:action" content="post" />
          <meta property="fc:frame:button:1:target" content="${process.env.NEXT_PUBLIC_URL || "http://localhost:3000"}/api/frame/campaign/1" />
          <meta property="fc:frame:button:2" content="📚 School Books" />
          <meta property="fc:frame:button:2:action" content="post" />
          <meta property="fc:frame:button:2:target" content="${process.env.NEXT_PUBLIC_URL || "http://localhost:3000"}/api/frame/campaign/2" />
          <meta property="fc:frame:button:3" content="🌱 Garden Project" />
          <meta property="fc:frame:button:3:action" content="post" />
          <meta property="fc:frame:button:3:target" content="${process.env.NEXT_PUBLIC_URL || "http://localhost:3000"}/api/frame/campaign/3" />
          <meta property="fc:frame:button:4" content="⬅️ Back" />
          <meta property="fc:frame:button:4:action" content="post" />
          <meta property="fc:frame:button:4:target" content="${process.env.NEXT_PUBLIC_URL || "http://localhost:3000"}/api/frame" />
          <meta property="og:image" content="${process.env.NEXT_PUBLIC_URL || "http://localhost:3000"}/discover-frame.jpg" />
          <title>Discover Campaigns - iS'khaftin</title>
        </head>
        <body>
          <h1>Discover Ubuntu Campaigns</h1>
          <p>Choose a campaign to support your community</p>
        </body>
      </html>
    `

    return new NextResponse(frameHtml, {
      headers: {
        "Content-Type": "text/html",
      },
    })
  } catch (error) {
    console.error("Discover frame error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
