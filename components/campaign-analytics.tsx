"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Target, Heart } from "lucide-react"
import { formatDistanceToNow } from "date-fns"

interface CampaignAnalytics {
  totalRaised: number
  goalAmount: number
  donorCount: number
  averageDonation: number
  daysActive: number
  daysRemaining: number
  donationsToday: number
  recentDonations: Array<{
    amount: number
    donor: string
    timestamp: Date
    txHash?: string
  }>
  milestones: Array<{
    percentage: number
    reached: boolean
    reachedAt?: Date
  }>
}

interface CampaignAnalyticsProps {
  analytics: CampaignAnalytics
  className?: string
}

export function CampaignAnalytics({ analytics, className }: CampaignAnalyticsProps) {
  const progressPercentage = (analytics.totalRaised / analytics.goalAmount) * 100
  const isCompleted = analytics.totalRaised >= analytics.goalAmount

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Overview Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Raised</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">R{analytics.totalRaised.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              {progressPercentage.toFixed(1)}% of R{analytics.goalAmount.toLocaleString()}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Donors</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-secondary">{analytics.donorCount}</div>
            <p className="text-xs text-muted-foreground">Avg: R{analytics.averageDonation.toFixed(0)}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Days Active</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-accent">{analytics.daysActive}</div>
            <p className="text-xs text-muted-foreground">
              {analytics.daysRemaining > 0 ? `${analytics.daysRemaining} left` : "Campaign ended"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Today</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{analytics.donationsToday}</div>
            <p className="text-xs text-muted-foreground">donations</p>
          </CardContent>
        </Card>
      </div>

      {/* Progress with Milestones */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="w-5 h-5" />
            Campaign Progress
          </CardTitle>
          <CardDescription>Track your journey to the goal</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Progress</span>
              <span className="font-medium">{progressPercentage.toFixed(1)}%</span>
            </div>
            <Progress value={progressPercentage} className="h-3" />
          </div>

          {/* Milestones */}
          <div className="space-y-2">
            <h4 className="text-sm font-medium">Milestones</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {analytics.milestones.map((milestone) => (
                <div
                  key={milestone.percentage}
                  className={`flex items-center gap-2 p-2 rounded-lg border ${
                    milestone.reached
                      ? "bg-secondary/10 border-secondary text-secondary"
                      : "bg-muted/50 border-border text-muted-foreground"
                  }`}
                >
                  <div
                    className={`w-2 h-2 rounded-full ${milestone.reached ? "bg-secondary" : "bg-muted-foreground"}`}
                  />
                  <span className="text-xs font-medium">{milestone.percentage}%</span>
                  {milestone.reached && milestone.reachedAt && (
                    <Badge variant="secondary" className="text-xs">
                      ✓
                    </Badge>
                  )}
                </div>
              ))}
            </div>
          </div>

          {isCompleted && (
            <div className="bg-secondary/10 border border-secondary rounded-lg p-4 text-center">
              <div className="text-secondary font-semibold mb-1">🎉 Goal Reached!</div>
              <p className="text-sm text-muted-foreground">
                Thank you to all {analytics.donorCount} donors who made this possible!
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Recent Donations */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Heart className="w-5 h-5" />
            Recent Donations
          </CardTitle>
          <CardDescription>Latest community support</CardDescription>
        </CardHeader>
        <CardContent>
          {analytics.recentDonations.length > 0 ? (
            <div className="space-y-3">
              {analytics.recentDonations.slice(0, 5).map((donation, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                      <Heart className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium text-sm">{donation.donor}</p>
                      <p className="text-xs text-muted-foreground">
                        {formatDistanceToNow(donation.timestamp, { addSuffix: true })}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-primary">R{donation.amount}</p>
                    {donation.txHash && (
                      <p className="text-xs text-muted-foreground">
                        {donation.txHash.slice(0, 6)}...{donation.txHash.slice(-4)}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-6 text-muted-foreground">
              <Heart className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p>No donations yet. Be the first to support this cause!</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
