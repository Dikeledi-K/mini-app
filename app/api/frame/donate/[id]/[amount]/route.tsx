import { type NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest, { params }: { params: { id: string; amount: string } }) {
  try {
    const { id, amount } = params

    // In a real implementation, this would process the actual donation
    const isSuccess = Math.random() > 0.1 // 90% success rate for demo

    if (isSuccess) {
      const frameHtml = `
        <!DOCTYPE html>
        <html>
          <head>
            <meta property="fc:frame" content="vNext" />
            <meta property="fc:frame:image" content="${process.env.NEXT_PUBLIC_URL || "http://localhost:3000"}/success-frame.jpg" />
            <meta property="fc:frame:button:1" content="🎉 Share Success" />
            <meta property="fc:frame:button:1:action" content="post" />
            <meta property="fc:frame:button:1:target" content="${process.env.NEXT_PUBLIC_URL || "http://localhost:3000"}/api/frame/share/${id}" />
            <meta property="fc:frame:button:2" content="🌍 More Campaigns" />
            <meta property="fc:frame:button:2:action" content="post" />
            <meta property="fc:frame:button:2:target" content="${process.env.NEXT_PUBLIC_URL || "http://localhost:3000"}/api/frame/discover" />
            <meta property="fc:frame:button:3" content="🏠 Home" />
            <meta property="fc:frame:button:3:action" content="post" />
            <meta property="fc:frame:button:3:target" content="${process.env.NEXT_PUBLIC_URL || "http://localhost:3000"}/api/frame" />
            <meta property="og:image" content="${process.env.NEXT_PUBLIC_URL || "http://localhost:3000"}/success-frame.jpg" />
            <title>Donation Successful - iS'khaftin</title>
          </head>
          <body>
            <h1>Ubuntu in Action! 🎉</h1>
            <p>Your R${amount} donation was successful. Thank you for embodying the spirit of Ubuntu!</p>
          </body>
        </html>
      `

      return new NextResponse(frameHtml, {
        headers: {
          "Content-Type": "text/html",
        },
      })
    } else {
      const frameHtml = `
        <!DOCTYPE html>
        <html>
          <head>
            <meta property="fc:frame" content="vNext" />
            <meta property="fc:frame:image" content="${process.env.NEXT_PUBLIC_URL || "http://localhost:3000"}/error-frame.jpg" />
            <meta property="fc:frame:button:1" content="🔄 Try Again" />
            <meta property="fc:frame:button:1:action" content="post" />
            <meta property="fc:frame:button:1:target" content="${process.env.NEXT_PUBLIC_URL || "http://localhost:3000"}/api/frame/campaign/${id}" />
            <meta property="fc:frame:button:2" content="🏠 Home" />
            <meta property="fc:frame:button:2:action" content="post" />
            <meta property="fc:frame:button:2:target" content="${process.env.NEXT_PUBLIC_URL || "http://localhost:3000"}/api/frame" />
            <meta property="og:image" content="${process.env.NEXT_PUBLIC_URL || "http://localhost:3000"}/error-frame.jpg" />
            <title>Donation Failed - iS'khaftin</title>
          </head>
          <body>
            <h1>Donation Failed</h1>
            <p>Something went wrong with your R${amount} donation. Please try again.</p>
          </body>
        </html>
      `

      return new NextResponse(frameHtml, {
        headers: {
          "Content-Type": "text/html",
        },
      })
    }
  } catch (error) {
    console.error("Donation frame error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
