"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { DonationButton } from "./donation-button"
import { Heart, Shield } from "lucide-react"

interface DonationModalProps {
  isOpen: boolean
  onClose: () => void
  campaignTitle: string
  onDonate: (amount: number) => Promise<void>
}

export function DonationModal({ isOpen, onClose, campaignTitle, onDonate }: DonationModalProps) {
  const [customAmount, setCustomAmount] = useState("")
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null)

  const presetAmounts = [50, 100, 200, 500]

  const handlePresetDonate = async (amount: number) => {
    setSelectedAmount(amount)
    await onDonate(amount)
    onClose()
  }

  const handleCustomDonate = async () => {
    const amount = Number.parseInt(customAmount)
    if (amount && amount > 0) {
      await onDonate(amount)
      onClose()
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Heart className="w-5 h-5 text-primary" />
            Support This Campaign
          </DialogTitle>
          <DialogDescription className="text-pretty">
            You're about to donate to "{campaignTitle}". Choose an amount below.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Preset Amounts */}
          <div className="space-y-3">
            <Label>Quick Donate</Label>
            <div className="grid grid-cols-2 gap-2">
              {presetAmounts.map((amount) => (
                <DonationButton key={amount} amount={amount} onDonate={handlePresetDonate} className="h-12" />
              ))}
            </div>
          </div>

          <Separator />

          {/* Custom Amount */}
          <div className="space-y-3">
            <Label htmlFor="custom-amount">Custom Amount</Label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">R</span>
                <Input
                  id="custom-amount"
                  type="number"
                  placeholder="Enter amount"
                  value={customAmount}
                  onChange={(e) => setCustomAmount(e.target.value)}
                  className="pl-8"
                  min="1"
                />
              </div>
              <Button onClick={handleCustomDonate} disabled={!customAmount || Number.parseInt(customAmount) <= 0}>
                Donate
              </Button>
            </div>
          </div>

          {/* Security Notice */}
          <div className="bg-muted/50 rounded-lg p-3 space-y-2">
            <div className="flex items-center gap-2 text-sm font-medium">
              <Shield className="w-4 h-4 text-secondary" />
              Secure & Transparent
            </div>
            <p className="text-xs text-muted-foreground">
              All donations are processed on-chain for complete transparency. You'll be redirected to your wallet to
              confirm the transaction.
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
