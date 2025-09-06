"use client"

import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Coffee as Confetti } from "lucide-react"
import { cn } from "@/lib/utils"

interface MilestoneCelebrationProps {
  milestone: number // percentage reached (25, 50, 75, 100)
  campaignTitle: string
  totalRaised: number
  goalAmount: number
  onShare?: () => void
  className?: string
}

export function MilestoneCelebration({
  milestone,
  campaignTitle,
  totalRaised,
  goalAmount,
  onShare,
  className,
}: MilestoneCelebrationProps) {
  const [isVisible, setIsVisible] = useState(true)
  const [animate, setAnimate] = useState(false)

  useEffect(() => {
    setAnimate(true)
    const timer = setTimeout(() => setAnimate(false), 2000)
    return () => clearTimeout(timer)
  }, [])

  const getMilestoneMessage = () => {
    switch (milestone) {
      case 25:
        return "Great start! The community is rallying behind this cause."
      case 50:
        return "Halfway there! Ubuntu is working its magic."
      case 75:
        return "Almost there! The finish line is in sight."
      case 100:
        return "Goal reached! Thank you to everyone who made this possible."
      default:
        return "Amazing progress! Keep the momentum going."
    }
  }

  const getMilestoneColor = () => {
    if (milestone >= 100) return "text-green-600 bg-green-50 border-green-200"
    if (milestone >= 75) return "text-blue-600 bg-blue-50 border-blue-200"
    if (milestone >= 50) return "text-yellow-600 bg-yellow-50 border-yellow-200"
    return "text-purple-600 bg-purple-50 border-purple-200"
  }

  if (!isVisible) return null

  return (
    <Card className={cn("border-2 border-dashed", getMilestoneColor(), className)}>
      <CardContent className="p-6 text-center space-y-4">
        <div className={cn("transition-all duration-500", animate && "animate-bounce")}>
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-current/10 flex items-center justify-center">
            <Confetti className="w-8 h-8" />
          </div>
        </div>

        <div className="space-y-2">
          <Badge variant="outline" className={cn("text-lg px-4 py-2", getMilestoneColor())}>
            {milestone}% Milestone Reached!
          </Badge>
          <h3 className="text-xl font-bold text-foreground">{campaignTitle}</h3>
          <p className="text-muted-foreground">{getMilestoneMessage()}</p>
        </div>

        <div className="bg-background/50 rounded-lg p-4 space-y-2">
          <div className="text-2xl font-bold text-primary">
            R{totalRaised.toLocaleString()} / R{goalAmount.toLocaleString()}
          </div>
          <div className="text-sm text-muted-foreground">
            {milestone < 100 ? `R${(goalAmount - totalRaised).toLocaleString()} to go!` : "Goal achieved!"}
          </div>
        </div>

        <div className="flex gap-2 justify-center">
          {onShare && (
            <Button onClick={onShare} variant="outline">
              Share the Good News
            </Button>
          )}
          <Button onClick={() => setIsVisible(false)} variant="ghost" size="sm">
            Dismiss
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
