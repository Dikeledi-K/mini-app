"use client"

import { useState } from "react"
import { createClient } from "@/lib/supabase/client"

export interface Donation {
  id: string
  campaign_id: string
  donor_id?: string
  amount: number
  currency: string
  transaction_hash?: string
  wallet_address?: string
  status: "pending" | "confirmed" | "failed"
  donor_name?: string
  message?: string
  created_at: string
  confirmed_at?: string
}

export function useDonations() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const createDonation = async (donation: Partial<Donation>) => {
    try {
      setLoading(true)
      setError(null)
      const supabase = createClient()

      const { data, error } = await supabase.from("donations").insert([donation]).select().single()

      if (error) throw error
      return data
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to create donation"
      setError(errorMessage)
      throw new Error(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const updateDonationStatus = async (id: string, status: "confirmed" | "failed", transactionHash?: string) => {
    try {
      setLoading(true)
      setError(null)
      const supabase = createClient()

      const updateData: any = {
        status,
        ...(status === "confirmed" && { confirmed_at: new Date().toISOString() }),
        ...(transactionHash && { transaction_hash: transactionHash }),
      }

      const { data, error } = await supabase.from("donations").update(updateData).eq("id", id).select().single()

      if (error) throw error
      return data
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to update donation"
      setError(errorMessage)
      throw new Error(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const getUserDonations = async (userId: string) => {
    try {
      setLoading(true)
      setError(null)
      const supabase = createClient()

      const { data, error } = await supabase
        .from("donations")
        .select(`
          *,
          campaigns(
            id,
            title,
            image_url
          )
        `)
        .eq("donor_id", userId)
        .order("created_at", { ascending: false })

      if (error) throw error
      return data || []
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to fetch donations"
      setError(errorMessage)
      throw new Error(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  return {
    loading,
    error,
    createDonation,
    updateDonationStatus,
    getUserDonations,
  }
}
