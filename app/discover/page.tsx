"use client"

import { useState, useMemo } from "react"
import { CampaignCard } from "@/components/campaign-card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Search, Clock, Target, TrendingUp, Loader2 } from "lucide-react"
import { useCampaigns } from "@/hooks/use-campaigns"
import { useDonations } from "@/hooks/use-donations"

type SortOption = "newest" | "oldest" | "most-funded" | "least-funded" | "ending-soon"
type FilterOption = "all" | "active" | "completed" | "urgent"

export default function DiscoverPage() {
  const { campaigns, loading, error, refetch } = useCampaigns()
  const { createDonation, updateDonationStatus } = useDonations()

  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedLocation, setSelectedLocation] = useState("all")
  const [sortBy, setSortBy] = useState<SortOption>("newest")
  const [filterBy, setFilterBy] = useState<FilterOption>("all")

  const categories = useMemo(() => {
    const uniqueCategories = [...new Set(campaigns.map((c) => c.category).filter(Boolean))]
    return ["all", ...uniqueCategories]
  }, [campaigns])

  const locations = useMemo(() => {
    const uniqueLocations = [...new Set(campaigns.map((c) => c.location).filter(Boolean))]
    return ["all", ...uniqueLocations]
  }, [campaigns])

  const filteredAndSortedCampaigns = useMemo(() => {
    const filtered = campaigns.filter((campaign) => {
      // Search filter
      const matchesSearch =
        campaign.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        campaign.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (campaign.location && campaign.location.toLowerCase().includes(searchQuery.toLowerCase()))

      // Category filter
      const matchesCategory = selectedCategory === "all" || campaign.category === selectedCategory

      // Location filter
      const matchesLocation =
        selectedLocation === "all" ||
        (campaign.location && campaign.location.toLowerCase().includes(selectedLocation.toLowerCase()))

      // Status filter
      const isCompleted = campaign.current_amount >= campaign.goal_amount
      const isUrgent = campaign.days_left && campaign.days_left <= 7 && !isCompleted
      const matchesFilter =
        filterBy === "all" ||
        (filterBy === "active" && !isCompleted) ||
        (filterBy === "completed" && isCompleted) ||
        (filterBy === "urgent" && isUrgent)

      return matchesSearch && matchesCategory && matchesLocation && matchesFilter
    })

    // Sort campaigns
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "newest":
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        case "oldest":
          return new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
        case "most-funded":
          return b.current_amount - a.current_amount
        case "least-funded":
          return a.current_amount - b.current_amount
        case "ending-soon":
          return (a.days_left || 999) - (b.days_left || 999)
        default:
          return 0
      }
    })

    return filtered
  }, [campaigns, searchQuery, selectedCategory, selectedLocation, sortBy, filterBy])

  const handleDonate = async (campaignId: string, amount: number) => {
    try {
      // Create donation record
      const donation = await createDonation({
        campaign_id: campaignId,
        amount: amount,
        currency: "ETH",
        status: "pending",
      })

      console.log(`Created donation ${donation.id} for campaign ${campaignId}`)

      // In a real implementation, this would trigger the blockchain transaction
      // For now, we'll simulate success after a delay
      setTimeout(async () => {
        await updateDonationStatus(donation.id, "confirmed", "0x" + Math.random().toString(16).substr(2, 64))
        refetch() // Refresh campaigns to show updated amounts
      }, 2000)
    } catch (error) {
      console.error("Donation failed:", error)
    }
  }

  const clearFilters = () => {
    setSearchQuery("")
    setSelectedCategory("all")
    setSelectedLocation("all")
    setSortBy("newest")
    setFilterBy("all")
  }

  const activeFiltersCount = [
    searchQuery !== "",
    selectedCategory !== "all",
    selectedLocation !== "all",
    filterBy !== "all",
  ].filter(Boolean).length

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading campaigns...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-destructive mb-4">Error loading campaigns: {error}</p>
          <Button onClick={refetch}>Try Again</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      

      <div className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Discover Campaigns</h1>
          <p className="text-muted-foreground text-lg">
            Find community needs you can help with. Every small donation makes a big difference.
          </p>
        </div>

        {/* Search and Filters */}
        <div className="space-y-4 mb-8">
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search campaigns, locations, or causes..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Filter Controls */}
          <div className="flex flex-wrap gap-4">
            <Select value={selectedCategory} onValueChange={(value) => setSelectedCategory(value)}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category} value={category || "all"}>
                    {category === "all" ? "All Categories" : category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedLocation} onValueChange={(value) => setSelectedLocation(value)}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Location" />
              </SelectTrigger>
              <SelectContent>
                {locations.map((location) => (
                  <SelectItem key={location} value={location || "all"}>
                    {location === "all" ? "All Locations" : location}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={filterBy} onValueChange={(value) => setFilterBy(value as FilterOption)}>
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="urgent">Urgent</SelectItem>
              </SelectContent>
            </Select>

            <Select value={sortBy} onValueChange={(value) => setSortBy(value as SortOption)}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest First</SelectItem>
                <SelectItem value="oldest">Oldest First</SelectItem>
                <SelectItem value="most-funded">Most Funded</SelectItem>
                <SelectItem value="least-funded">Least Funded</SelectItem>
                <SelectItem value="ending-soon">Ending Soon</SelectItem>
              </SelectContent>
            </Select>

            {activeFiltersCount > 0 && (
              <Button variant="outline" onClick={clearFilters} className="bg-transparent">
                Clear Filters ({activeFiltersCount})
              </Button>
            )}
          </div>
        </div>

        {/* Quick Filter Badges */}
        <div className="flex flex-wrap gap-2 mb-6">
          <Badge
            variant={filterBy === "urgent" ? "default" : "secondary"}
            className="cursor-pointer"
            onClick={() => setFilterBy(filterBy === "urgent" ? "all" : "urgent")}
          >
            <Clock className="w-3 h-3 mr-1" />
            Urgent (≤7 days)
          </Badge>
          <Badge
            variant={filterBy === "completed" ? "default" : "secondary"}
            className="cursor-pointer"
            onClick={() => setFilterBy(filterBy === "completed" ? "all" : "completed")}
          >
            <Target className="w-3 h-3 mr-1" />
            Goal Reached
          </Badge>
          <Badge
            variant={sortBy === "most-funded" ? "default" : "secondary"}
            className="cursor-pointer"
            onClick={() => setSortBy(sortBy === "most-funded" ? "newest" : "most-funded")}
          >
            <TrendingUp className="w-3 h-3 mr-1" />
            Most Funded
          </Badge>
        </div>

        {/* Results Summary */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-muted-foreground">
            {filteredAndSortedCampaigns.length} campaign{filteredAndSortedCampaigns.length !== 1 ? "s" : ""} found
          </p>
          {searchQuery && <p className="text-sm text-muted-foreground">Searching for "{searchQuery}"</p>}
        </div>

        {/* Campaign Grid */}
        {filteredAndSortedCampaigns.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAndSortedCampaigns.map((campaign) => (
              <CampaignCard key={campaign.id} campaign={campaign} onDonate={handleDonate} />
            ))}
          </div>
        ) : (
          /* Empty State */
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">No campaigns found</h3>
            <p className="text-muted-foreground mb-4">
              Try adjusting your search terms or filters to find more campaigns.
            </p>
            <Button onClick={clearFilters} variant="outline">
              Clear All Filters
            </Button>
          </div>
        )}

        {/* Load More - Only show if we have results */}
        {filteredAndSortedCampaigns.length > 0 && (
          <div className="text-center mt-12">
            <Button variant="outline" size="lg">
              Load More Campaigns
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
