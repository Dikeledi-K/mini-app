import type { NextRequest } from "next/server"

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    // Handle webhook events from Base/Farcaster
    console.log("[v0] Webhook received:", body)

    // Process different webhook event types
    switch (body.type) {
      case "frame_interaction":
        // Handle frame interactions
        break
      case "cast_created":
        // Handle new casts
        break
      default:
        console.log("[v0] Unknown webhook type:", body.type)
    }

    return Response.json({ success: true })
  } catch (error) {
    console.error("[v0] Webhook error:", error)
    return Response.json({ error: "Webhook processing failed" }, { status: 500 })
  }
}
