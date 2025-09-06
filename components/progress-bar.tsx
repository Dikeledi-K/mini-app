"use client"

import { cn } from "@/lib/utils"

interface ProgressBarProps {
  current: number
  goal: number
  currency?: string
  className?: string
  showLabels?: boolean
}

export function ProgressBar({ current, goal, currency = "R", className, showLabels = true }: ProgressBarProps) {
  const percentage = Math.min((current / goal) * 100, 100)
  const isComplete = current >= goal

  return (
    <div className={cn("space-y-2", className)}>
      {showLabels && (
        <div className="flex justify-between items-center text-sm">
          <span className="font-medium text-foreground">
            {currency}
            {current.toLocaleString()} raised
          </span>
          <span className="text-muted-foreground">
            {currency}
            {goal.toLocaleString()} goal
          </span>
        </div>
      )}

      <div className="w-full bg-muted rounded-full h-3 overflow-hidden">
        <div
          className={cn(
            "h-full transition-all duration-500 ease-out rounded-full",
            isComplete ? "bg-secondary" : "bg-primary",
          )}
          style={{ width: `${percentage}%` }}
        />
      </div>

      {showLabels && (
        <div className="flex justify-between items-center text-xs text-muted-foreground">
          <span>{percentage.toFixed(1)}% funded</span>
          {isComplete && <span className="text-secondary font-medium">Goal Reached!</span>}
        </div>
      )}
    </div>
  )
}
