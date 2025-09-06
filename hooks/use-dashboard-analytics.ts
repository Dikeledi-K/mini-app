"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"

export interface DashboardAnalytics {
  totalDonated: number
  campaignsSupported: number
  totalCampaignsCreated: number
  totalRaisedFromMyCampaigns: number
  recentDonations: Array<{
    id: string
    campaign_title: string
    amount: number
    created_at: string
    status: string
  }>
  myCampaigns: Array<{
    id: string
    title: string
    goal_amount: number
    current_amount: number
    total_donations: number
    unique_donors: number
    created_at: string
    status: string
  }>
}

export function useDashboardAnalytics(userId?: string) {
  const [analytics, setAnalytics] = useState<DashboardAnalytics | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (mounted && userId) {
      fetchAnalytics(userId)

      // Set up real-time subscription for donations
      const supabase = createClient()
      const channel = supabase
        .channel("dashboard-updates")
        .on(
          "postgres_changes",
          {
            event: "*",
            schema: "public",
            table: "donations",
            filter: `donor_id=eq.${userId}`,
          },
          () => {
            fetchAnalytics(userId)
          },
        )
        .on(
          "postgres_changes",
          {
            event: "*",
            schema: "public",
            table: "campaigns",
            filter: `creator_id=eq.${userId}`,
          },
          () => {
            fetchAnalytics(userId)
          },
        )
        .subscribe()

      return () => {
        supabase.removeChannel(channel)
      }
    }
  }, [mounted, userId])

  const fetchAnalytics = async (userId: string) => {
    try {
      setLoading(true)
      const supabase = createClient()

      // Fetch user's donations
      const { data: donations, error: donationsError } = await supabase
        .from("donations")
        .select(`
          id,
          amount,
          status,
          created_at,
          campaigns(title)
        `)
        .eq("donor_id", userId)
        .eq("status", "confirmed")
        .order("created_at", { ascending: false })

      if (donationsError) throw donationsError

      // Fetch user's campaigns with stats
      const { data: campaigns, error: campaignsError } = await supabase
        .from("campaigns")
        .select(`
          id,
          title,
          goal_amount,
          current_amount,
          status,
          created_at,
          donations(
            id,
            amount,
            status,
            donor_id
          )
        `)
        .eq("creator_id", userId)
        .order("created_at", { ascending: false })

      if (campaignsError) throw campaignsError

      // Process the data
      const totalDonated = donations?.reduce((sum, d) => sum + d.amount, 0) || 0
      const campaignsSupported = new Set(donations?.map((d) => d.campaigns?.title)).size || 0
      const totalCampaignsCreated = campaigns?.length || 0
      const totalRaisedFromMyCampaigns = campaigns?.reduce((sum, c) => sum + c.current_amount, 0) || 0

      const recentDonations =
        donations?.slice(0, 5).map((d) => ({
          id: d.id,
          campaign_title: d.campaigns?.title || "Unknown Campaign",
          amount: d.amount,
          created_at: d.created_at,
          status: d.status,
        })) || []

      const myCampaigns =
        campaigns?.map((c) => {
          const confirmedDonations = c.donations?.filter((d) => d.status === "confirmed") || []
          return {
            id: c.id,
            title: c.title,
            goal_amount: c.goal_amount,
            current_amount: c.current_amount,
            total_donations: confirmedDonations.length,
            unique_donors: new Set(confirmedDonations.map((d) => d.donor_id)).size,
            created_at: c.created_at,
            status: c.status,
          }
        }) || []

      setAnalytics({
        totalDonated,
        campaignsSupported,
        totalCampaignsCreated,
        totalRaisedFromMyCampaigns,
        recentDonations,
        myCampaigns,
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch analytics")
    } finally {
      setLoading(false)
    }
  }

  return { analytics, loading, error, refetch: () => userId && fetchAnalytics(userId) }
}

export function usePlatformAnalytics() {
  const [analytics, setAnalytics] = useState<{
    totalCampaigns: number
    totalRaised: number
    totalDonations: number
    activeCampaigns: number
  } | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (mounted) {
      fetchPlatformAnalytics()
    }
  }, [mounted])

  const fetchPlatformAnalytics = async () => {
    try {
      setLoading(true)
      const supabase = createClient()

      // Get platform-wide statistics
      const { data: campaignStats, error: campaignError } = await supabase
        .from("campaigns")
        .select("id, current_amount, status")

      if (campaignError) throw campaignError

      const { data: donationStats, error: donationError } = await supabase
        .from("donations")
        .select("id, amount, status")
        .eq("status", "confirmed")

      if (donationError) throw donationError

      const totalCampaigns = campaignStats?.length || 0
      const totalRaised = campaignStats?.reduce((sum, c) => sum + c.current_amount, 0) || 0
      const totalDonations = donationStats?.length || 0
      const activeCampaigns = campaignStats?.filter((c) => c.status === "active").length || 0

      setAnalytics({
        totalCampaigns,
        totalRaised,
        totalDonations,
        activeCampaigns,
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch platform analytics")
    } finally {
      setLoading(false)
    }
  }

  return { analytics, loading, error, refetch: fetchPlatformAnalytics }
}
