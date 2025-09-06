"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { DonationButton } from "./donation-button"
import { ProgressBar } from "./progress-bar"
import { Users, Clock, MapPin } from "lucide-react"
import Image from "next/image"
import type { Campaign } from "@/hooks/use-campaigns"

interface CampaignCardProps {
  campaign: Campaign
  onDonate?: (campaignId: string, amount: number) => Promise<void>
  className?: string
}

export function CampaignCard({ campaign, onDonate, className }: CampaignCardProps) {
  const [localCurrentAmount, setLocalCurrentAmount] = useState(campaign.current_amount)
  const [localDonorCount, setLocalDonorCount] = useState(campaign.unique_donors || 0)

  const handleDonate = async (amount: number) => {
    if (onDonate) {
      await onDonate(campaign.id, amount)
      // Optimistically update the UI
      setLocalCurrentAmount((prev) => prev + amount)
      setLocalDonorCount((prev) => prev + 1)
    }
  }

  const isComplete = localCurrentAmount >= campaign.goal_amount

  return (
    <Card className={`overflow-hidden hover:shadow-lg transition-shadow ${className}`}>
      {campaign.image_url && (
        <div className="relative h-48 w-full">
          <Image src={campaign.image_url || "/placeholder.svg"} alt={campaign.title} fill className="object-cover" />
          {isComplete && (
            <div className="absolute top-2 right-2">
              <Badge className="bg-secondary text-secondary-foreground">Goal Reached!</Badge>
            </div>
          )}
        </div>
      )}

      <CardHeader className="pb-3">
        <h3 className="font-bold text-lg text-foreground line-clamp-2 text-balance">{campaign.title}</h3>
        <p className="text-muted-foreground text-sm line-clamp-3 text-pretty">{campaign.description}</p>
      </CardHeader>

      <CardContent className="space-y-4">
        <ProgressBar
          current={localCurrentAmount}
          goal={campaign.goal_amount}
          currency={campaign.goal_currency || "R"}
        />

        {/* Campaign Stats */}
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <div className="flex items-center gap-4">
            {localDonorCount > 0 && (
              <div className="flex items-center gap-1">
                <Users className="w-3 h-3" />
                <span>{localDonorCount} donors</span>
              </div>
            )}
            {campaign.days_left && (
              <div className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                <span>{campaign.days_left} days left</span>
              </div>
            )}
          </div>
          {campaign.location && (
            <div className="flex items-center gap-1">
              <MapPin className="w-3 h-3" />
              <span>{campaign.location}</span>
            </div>
          )}
        </div>

        {/* Donation Button */}
        <div className="pt-2">
          <DonationButton 
            amount={100} 
            recipientAddress={campaign.wallet_address as `0x${string}`}
            onDonate={handleDonate} 
            disabled={isComplete} 
            className="w-full" 
          />
        </div>
      </CardContent>
    </Card>
  )
}
