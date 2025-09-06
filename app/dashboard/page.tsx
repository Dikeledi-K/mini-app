"use client"

import { useState, useEffect } from "react"
import { CampaignAnalytics } from "@/components/campaign-analytics"
import { DonationTracker } from "@/components/donation-tracker"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ClientOnly } from "@/components/client-only"
import { Heart, Plus, BarChart3, History, Loader2, TrendingUp, Users, Target } from "lucide-react"
import Link from "next/link"
import { useAccount } from "wagmi"
import { useDashboardAnalytics, usePlatformAnalytics } from "@/hooks/use-dashboard-analytics"
import { createClient } from "@/lib/supabase/client"

export default function DashboardPage() {
  const { address, isConnected } = useAccount()
  const [activeTab, setActiveTab] = useState("overview")
  const [userId, setUserId] = useState<string | null>(null)

  const { analytics, loading: analyticsLoading, error: analyticsError } = useDashboardAnalytics(userId || undefined)
  const { analytics: platformAnalytics, loading: platformLoading } = usePlatformAnalytics()

  useEffect(() => {
    const getUserId = async () => {
      if (address && isConnected) {
        const supabase = createClient()

        // Try to find existing user by wallet address
        const { data: existingUser } = await supabase.from("users").select("id").eq("wallet_address", address).single()

        if (existingUser) {
          setUserId(existingUser.id)
        } else {
          // Create new user record for Farcaster mini app
          const { data: newUser, error } = await supabase
            .from("users")
            .insert([{ 
              wallet_address: address,
              email: null, // No email needed for Farcaster mini app
              full_name: null,
              avatar_url: null
            }])
            .select("id")
            .single()

          if (newUser && !error) {
            setUserId(newUser.id)
          }
        }
      }
    }

    getUserId()
  }, [address, isConnected])

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
              <Heart className="w-6 h-6 text-primary-foreground" />
            </div>
            <CardTitle>Connect Your Wallet</CardTitle>
            <CardDescription>
              Connect your wallet to view your dashboard and track your contributions to the community.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            
            <p className="text-xs text-muted-foreground mt-4">Your wallet connection is secure and private.</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (analyticsLoading || !analytics) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading your dashboard...</p>
        </div>
      </div>
    )
  }

  if (analyticsError) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-destructive mb-4">Error loading dashboard: {analyticsError}</p>
          <Button onClick={() => window.location.reload()}>Try Again</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      

      <ClientOnly fallback={
        <div className="min-h-screen bg-background flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
            <p className="text-muted-foreground">Loading your dashboard...</p>
          </div>
        </div>
      }>
        <div className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">Your Dashboard</h1>
            <p className="text-muted-foreground text-lg">Track your campaigns and contributions to the community</p>
          </div>
          <Button asChild>
            <Link href="/create">
              <Plus className="w-4 h-4 mr-2" />
              New Campaign
            </Link>
          </Button>
        </div>

        {/* Dashboard Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="donations" className="flex items-center gap-2">
              <History className="w-4 h-4" />
              My Donations
            </TabsTrigger>
            <TabsTrigger value="campaigns" className="flex items-center gap-2">
              <Heart className="w-4 h-4" />
              My Campaigns
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Total Donated</p>
                      <p className="text-2xl font-bold text-primary">R{analytics.totalDonated}</p>
                    </div>
                    <Heart className="w-8 h-8 text-primary/20" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Campaigns Supported</p>
                      <p className="text-2xl font-bold text-secondary">{analytics.campaignsSupported}</p>
                    </div>
                    <Users className="w-8 h-8 text-secondary/20" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">My Campaigns</p>
                      <p className="text-2xl font-bold text-accent">{analytics.totalCampaignsCreated}</p>
                    </div>
                    <Target className="w-8 h-8 text-accent/20" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Total Raised</p>
                      <p className="text-2xl font-bold text-green-600">R{analytics.totalRaisedFromMyCampaigns}</p>
                    </div>
                    <TrendingUp className="w-8 h-8 text-green-600/20" />
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent Activity */}
              <Card>
                <CardHeader>
                  <CardTitle>Recent Donations</CardTitle>
                  <CardDescription>Your latest contributions to the community</CardDescription>
                </CardHeader>
                <CardContent>
                  {analytics.recentDonations.length > 0 ? (
                    <div className="space-y-3">
                      {analytics.recentDonations.map((donation) => (
                        <div key={donation.id} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                          <div>
                            <p className="font-medium text-sm">{donation.campaign_title}</p>
                            <p className="text-xs text-muted-foreground">
                              {new Date(donation.created_at).toLocaleDateString()}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold text-primary">R{donation.amount}</p>
                            <p className="text-xs text-green-600 capitalize">{donation.status}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Heart className="w-12 h-12 text-muted-foreground/20 mx-auto mb-4" />
                      <p className="text-muted-foreground">No donations yet</p>
                      <Button asChild className="mt-4">
                        <Link href="/discover">Discover Campaigns</Link>
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Platform Stats */}
              <Card>
                <CardHeader>
                  <CardTitle>Platform Impact</CardTitle>
                  <CardDescription>Community-wide Ubuntu spirit</CardDescription>
                </CardHeader>
                <CardContent>
                  {platformLoading ? (
                    <div className="flex items-center justify-center py-8">
                      <Loader2 className="w-6 h-6 animate-spin" />
                    </div>
                  ) : platformAnalytics ? (
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="text-center p-4 bg-primary/5 rounded-lg">
                          <div className="text-xl font-bold text-primary">R{platformAnalytics.totalRaised}</div>
                          <p className="text-xs text-muted-foreground">Total Raised</p>
                        </div>
                        <div className="text-center p-4 bg-secondary/5 rounded-lg">
                          <div className="text-xl font-bold text-secondary">{platformAnalytics.totalCampaigns}</div>
                          <p className="text-xs text-muted-foreground">Total Campaigns</p>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="text-center p-4 bg-accent/5 rounded-lg">
                          <div className="text-xl font-bold text-accent">{platformAnalytics.activeCampaigns}</div>
                          <p className="text-xs text-muted-foreground">Active Now</p>
                        </div>
                        <div className="text-center p-4 bg-green-600/5 rounded-lg">
                          <div className="text-xl font-bold text-green-600">{platformAnalytics.totalDonations}</div>
                          <p className="text-xs text-muted-foreground">Total Donations</p>
                        </div>
                      </div>
                    </div>
                  ) : null}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="donations">
            <DonationTracker
              donations={analytics.recentDonations.map((d) => ({
                id: d.id,
                campaignId: d.id,
                campaignTitle: d.campaign_title,
                amount: d.amount,
                txHash: "",
                status: d.status as "confirmed" | "pending" | "failed",
                timestamp: new Date(d.created_at),
                blockNumber: undefined,
              }))}
            />
          </TabsContent>

          <TabsContent value="campaigns">
            {analytics.myCampaigns.length > 0 ? (
              <div className="space-y-6">
                {analytics.myCampaigns.map((campaign) => (
                  <Card key={campaign.id}>
                    <CardHeader>
                      <CardTitle>{campaign.title}</CardTitle>
                      <CardDescription>Created on {new Date(campaign.created_at).toLocaleDateString()}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <CampaignAnalytics
                        analytics={{
                          totalRaised: campaign.current_amount,
                          goalAmount: campaign.goal_amount,
                          donorCount: campaign.unique_donors,
                          averageDonation:
                            campaign.total_donations > 0 ? campaign.current_amount / campaign.total_donations : 0,
                          daysActive: Math.floor(
                            (Date.now() - new Date(campaign.created_at).getTime()) / (1000 * 60 * 60 * 24),
                          ),
                          daysRemaining: 30, // Default for now
                          donationsToday: 0, // Would need additional query
                          recentDonations: [],
                          milestones: [
                            { percentage: 25, reached: campaign.current_amount >= campaign.goal_amount * 0.25 },
                            { percentage: 50, reached: campaign.current_amount >= campaign.goal_amount * 0.5 },
                            { percentage: 75, reached: campaign.current_amount >= campaign.goal_amount * 0.75 },
                            { percentage: 100, reached: campaign.current_amount >= campaign.goal_amount },
                          ],
                        }}
                      />
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="text-center py-12">
                  <Target className="w-16 h-16 text-muted-foreground/20 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-foreground mb-2">No campaigns yet</h3>
                  <p className="text-muted-foreground mb-4">
                    Start your first campaign and help your community through Ubuntu
                  </p>
                  <Button asChild>
                    <Link href="/create">Create Your First Campaign</Link>
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
        </div>
      </ClientOnly>
    </div>
  )
}
