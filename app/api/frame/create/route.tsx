import type { NextRequest } from "next/server"

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    // Handle create campaign frame action
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta property="fc:frame" content="vNext" />
          <meta property="fc:frame:image" content="${process.env.NEXT_PUBLIC_URL}/frame-image.jpg" />
          <meta property="fc:frame:button:1" content="✨ Start Creating" />
          <meta property="fc:frame:button:1:action" content="link" />
          <meta property="fc:frame:button:1:target" content="${process.env.NEXT_PUBLIC_URL}/create" />
          <meta property="fc:frame:button:2" content="🔙 Back to Home" />
          <meta property="fc:frame:button:2:action" content="post" />
          <meta property="fc:frame:button:2:target" content="${process.env.NEXT_PUBLIC_URL}/api/frame" />
        </head>
        <body>
          <h1>Create Your Campaign</h1>
        </body>
      </html>
    `

    return new Response(html, {
      headers: { "Content-Type": "text/html" },
    })
  } catch (error) {
    console.error("[v0] Create frame error:", error)
    return Response.json({ error: "Frame processing failed" }, { status: 500 })
  }
}
