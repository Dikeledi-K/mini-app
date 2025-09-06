"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"

export interface Campaign {
  id: string
  title: string
  description: string
  goal_amount: number
  current_amount: number
  goal_currency: string
  wallet_address: string
  image_url?: string
  category?: string
  location?: string
  status: string
  deadline?: string
  created_at: string
  updated_at: string
  creator_id: string
  // Computed fields
  progress_percentage?: number
  total_donations?: number
  unique_donors?: number
  days_left?: number
}

export function useCampaigns() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (mounted) {
      fetchCampaigns()
    }
  }, [mounted])

  const fetchCampaigns = async () => {
    try {
      setLoading(true)
      const supabase = createClient()

      const { data, error } = await supabase
        .from("campaigns")
        .select(`
          *,
          donations(
            id,
            amount,
            status,
            donor_id
          )
        `)
        .eq("status", "active")
        .order("created_at", { ascending: false })

      if (error) throw error

      // Process campaigns to add computed fields
      const processedCampaigns =
        data?.map((campaign) => {
          const confirmedDonations = campaign.donations?.filter((d) => d.status === "confirmed") || []
          const totalDonations = confirmedDonations.length
          const uniqueDonors = new Set(confirmedDonations.map((d) => d.donor_id)).size
          const progressPercentage = (campaign.current_amount / campaign.goal_amount) * 100

          let daysLeft = undefined
          if (campaign.deadline) {
            const deadlineDate = new Date(campaign.deadline)
            const today = new Date()
            const timeDiff = deadlineDate.getTime() - today.getTime()
            daysLeft = Math.ceil(timeDiff / (1000 * 3600 * 24))
          }

          return {
            ...campaign,
            progress_percentage: Math.round(progressPercentage * 100) / 100,
            total_donations: totalDonations,
            unique_donors: uniqueDonors,
            days_left: daysLeft > 0 ? daysLeft : undefined,
          }
        }) || []

      setCampaigns(processedCampaigns)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch campaigns")
    } finally {
      setLoading(false)
    }
  }

  return { campaigns, loading, error, refetch: fetchCampaigns }
}

export function useCampaign(id: string) {
  const [campaign, setCampaign] = useState<Campaign | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (mounted && id) {
      fetchCampaign(id)
    }
  }, [mounted, id])

  const fetchCampaign = async (campaignId: string) => {
    try {
      setLoading(true)
      const supabase = createClient()

      const { data, error } = await supabase
        .from("campaigns")
        .select(`
          *,
          donations(
            id,
            amount,
            status,
            donor_id,
            created_at
          )
        `)
        .eq("id", campaignId)
        .single()

      if (error) throw error

      // Process campaign data
      const confirmedDonations = data.donations?.filter((d) => d.status === "confirmed") || []
      const totalDonations = confirmedDonations.length
      const uniqueDonors = new Set(confirmedDonations.map((d) => d.donor_id)).size
      const progressPercentage = (data.current_amount / data.goal_amount) * 100

      let daysLeft = undefined
      if (data.deadline) {
        const deadlineDate = new Date(data.deadline)
        const today = new Date()
        const timeDiff = deadlineDate.getTime() - today.getTime()
        daysLeft = Math.ceil(timeDiff / (1000 * 3600 * 24))
      }

      setCampaign({
        ...data,
        progress_percentage: Math.round(progressPercentage * 100) / 100,
        total_donations: totalDonations,
        unique_donors: uniqueDonors,
        days_left: daysLeft > 0 ? daysLeft : undefined,
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch campaign")
    } finally {
      setLoading(false)
    }
  }

  return { campaign, loading, error, refetch: () => fetchCampaign(id) }
}
