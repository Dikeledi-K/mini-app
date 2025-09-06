"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ExternalLink, Clock, CheckCircle, AlertCircle, Loader2 } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { getExplorerUrl } from "@/lib/donation-utils"

interface DonationRecord {
  id: string
  campaignId: string
  campaignTitle: string
  amount: number
  txHash: string
  status: "pending" | "confirmed" | "failed"
  timestamp: Date
  blockNumber?: number
  gasUsed?: string
}

interface DonationTrackerProps {
  donations: DonationRecord[]
  className?: string
}

export function DonationTracker({ donations, className }: DonationTrackerProps) {
  const [sortedDonations, setSortedDonations] = useState(donations)

  useEffect(() => {
    // Sort donations by timestamp (newest first)
    const sorted = [...donations].sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
    setSortedDonations(sorted)
  }, [donations])

  const getStatusIcon = (status: DonationRecord["status"]) => {
    switch (status) {
      case "pending":
        return <Loader2 className="w-4 h-4 animate-spin text-yellow-500" />
      case "confirmed":
        return <CheckCircle className="w-4 h-4 text-green-500" />
      case "failed":
        return <AlertCircle className="w-4 h-4 text-red-500" />
    }
  }

  const getStatusBadge = (status: DonationRecord["status"]) => {
    switch (status) {
      case "pending":
        return (
          <Badge variant="outline" className="text-yellow-600 border-yellow-200">
            Pending
          </Badge>
        )
      case "confirmed":
        return (
          <Badge variant="outline" className="text-green-600 border-green-200">
            Confirmed
          </Badge>
        )
      case "failed":
        return (
          <Badge variant="outline" className="text-red-600 border-red-200">
            Failed
          </Badge>
        )
    }
  }

  const totalDonated = sortedDonations.filter((d) => d.status === "confirmed").reduce((sum, d) => sum + d.amount, 0)

  const pendingAmount = sortedDonations.filter((d) => d.status === "pending").reduce((sum, d) => sum + d.amount, 0)

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Donated</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">R{totalDonated.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              {sortedDonations.filter((d) => d.status === "confirmed").length} confirmed donations
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Pending</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">R{pendingAmount.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              {sortedDonations.filter((d) => d.status === "pending").length} pending transactions
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Campaigns Supported</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-secondary">
              {new Set(sortedDonations.map((d) => d.campaignId)).size}
            </div>
            <p className="text-xs text-muted-foreground">unique campaigns</p>
          </CardContent>
        </Card>
      </div>

      {/* Donation History */}
      <Card>
        <CardHeader>
          <CardTitle>Donation History</CardTitle>
          <CardDescription>Track all your contributions to the community</CardDescription>
        </CardHeader>
        <CardContent>
          {sortedDonations.length > 0 ? (
            <div className="space-y-4">
              {sortedDonations.map((donation) => (
                <div key={donation.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-4">
                    {getStatusIcon(donation.status)}
                    <div>
                      <h4 className="font-medium text-sm">{donation.campaignTitle}</h4>
                      <div className="flex items-center gap-2 mt-1">
                        {getStatusBadge(donation.status)}
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {formatDistanceToNow(donation.timestamp, { addSuffix: true })}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-primary">R{donation.amount}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs text-muted-foreground font-mono">
                        {donation.txHash.slice(0, 6)}...{donation.txHash.slice(-4)}
                      </span>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => window.open(getExplorerUrl(donation.txHash, 8453), "_blank")}
                      >
                        <ExternalLink className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <p>No donations yet. Start supporting campaigns to see your history here!</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
