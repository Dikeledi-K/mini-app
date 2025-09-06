"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ArrowLeft, Upload, Heart, Loader2 } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"

export default function CreateCampaignPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    goalAmount: "",
    walletAddress: "",
    category: "",
    location: "",
    deadline: "",
    image: null as File | null,
  })

  const categories = [
    "Education",
    "Healthcare",
    "Community",
    "Food Security",
    "Infrastructure",
    "Youth Development",
    "Emergency Relief",
    "Small Business",
  ]

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null
    setFormData((prev) => ({ ...prev, image: file }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    setLoading(true)
    setError(null)

    try {
      const supabase = createClient()

      let imageUrl = null
      if (formData.image) {
        const fileExt = formData.image.name.split(".").pop()
        const fileName = `${Math.random()}.${fileExt}`
        const filePath = `campaign-images/${fileName}`

        const { error: uploadError } = await supabase.storage.from("campaign-images").upload(filePath, formData.image)

        if (uploadError) {
          console.error("Image upload error:", uploadError)
        } else {
          const { data } = supabase.storage.from("campaign-images").getPublicUrl(filePath)
          imageUrl = data.publicUrl
        }
      }

      const { data, error: insertError } = await supabase
        .from("campaigns")
        .insert([
          {
            creator_id: null, // No user authentication needed for Farcaster mini app
            title: formData.title,
            description: formData.description,
            goal_amount: Number.parseFloat(formData.goalAmount),
            wallet_address: formData.walletAddress,
            category: formData.category || null,
            location: formData.location || null,
            deadline: formData.deadline ? new Date(formData.deadline).toISOString() : null,
            image_url: imageUrl,
            status: "active",
          },
        ])
        .select()
        .single()

      if (insertError) throw insertError

      router.push("/dashboard?tab=campaigns")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create campaign")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background">
        {/* Header */}
        <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
          <div className="container mx-auto px-4 py-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" asChild>
                <Link href="/dashboard">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Dashboard
                </Link>
              </Button>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                  <Heart className="w-4 h-4 text-primary-foreground" />
                </div>
                <h1 className="text-xl font-bold text-foreground">iS'khaftin</h1>
              </div>
            </div>
          </div>
        </header>

        <div className="container mx-auto px-4 py-8 max-w-2xl">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">Create Your Campaign</h1>
            <p className="text-muted-foreground text-lg">Share your community's need and let Ubuntu work its magic</p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Campaign Details</CardTitle>
              <CardDescription>Tell your community what help you need. Be specific and heartfelt.</CardDescription>
            </CardHeader>
            <CardContent>
              {error && (
                <Alert variant="destructive" className="mb-6">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Campaign Title */}
                <div className="space-y-2">
                  <Label htmlFor="title">Campaign Title *</Label>
                  <Input
                    id="title"
                    name="title"
                    placeholder="e.g., New Stove for Ma Dlamini's Kitchen"
                    value={formData.title}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                {/* Description */}
                <div className="space-y-2">
                  <Label htmlFor="description">Tell Your Story *</Label>
                  <Textarea
                    id="description"
                    name="description"
                    placeholder="Describe the need, why it matters to your community, and how the funds will be used..."
                    value={formData.description}
                    onChange={handleInputChange}
                    rows={4}
                    required
                  />
                </div>

                {/* Goal Amount */}
                <div className="space-y-2">
                  <Label htmlFor="goalAmount">Goal Amount (ZAR) *</Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">R</span>
                    <Input
                      id="goalAmount"
                      name="goalAmount"
                      type="number"
                      placeholder="2000"
                      value={formData.goalAmount}
                      onChange={handleInputChange}
                      className="pl-8"
                      min="100"
                      step="100"
                      required
                    />
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Keep it realistic and specific. Small goals are more likely to succeed.
                  </p>
                </div>

                {/* Category Selection */}
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Select value={formData.category} onValueChange={(value) => handleSelectChange("category", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Location Field */}
                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    name="location"
                    placeholder="e.g., Soweto, Johannesburg"
                    value={formData.location}
                    onChange={handleInputChange}
                  />
                </div>

                {/* Deadline Field */}
                <div className="space-y-2">
                  <Label htmlFor="deadline">Campaign Deadline (Optional)</Label>
                  <Input
                    id="deadline"
                    name="deadline"
                    type="date"
                    value={formData.deadline}
                    onChange={handleInputChange}
                    min={new Date().toISOString().split("T")[0]}
                  />
                </div>

                {/* Wallet Address */}
                <div className="space-y-2">
                  <Label htmlFor="walletAddress">Recipient Wallet Address *</Label>
                  <Input
                    id="walletAddress"
                    name="walletAddress"
                    placeholder="0x..."
                    value={formData.walletAddress}
                    onChange={handleInputChange}
                    required
                  />
                  <p className="text-sm text-muted-foreground">
                    The crypto wallet where funds will be sent. Make sure this is correct!
                  </p>
                </div>

                {/* Image Upload */}
                <div className="space-y-2">
                  <Label htmlFor="image">Campaign Image</Label>
                  <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
                    <input
                      id="image"
                      name="image"
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                    <Label htmlFor="image" className="cursor-pointer">
                      <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                      <p className="text-sm text-muted-foreground">
                        {formData.image ? formData.image.name : "Click to upload an image"}
                      </p>
                    </Label>
                  </div>
                </div>

                {/* Submit Button */}
                <div className="pt-4">
                  <Button type="submit" size="lg" className="w-full" disabled={loading}>
                    {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                    {loading ? "Creating Campaign..." : "Create Campaign"}
                  </Button>
                  <p className="text-xs text-muted-foreground mt-2 text-center">
                    By creating a campaign, you agree to use funds responsibly and transparently.
                  </p>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Tips Card */}
          <Card className="mt-8 bg-accent/5 border-accent/20">
            <CardHeader>
              <CardTitle className="text-accent">Tips for Success</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <p>
                • <strong>Be specific:</strong> "New stove for soup kitchen" works better than "help needed"
              </p>
              <p>
                • <strong>Show impact:</strong> Explain how this helps your community
              </p>
              <p>
                • <strong>Add a photo:</strong> Visual stories connect with people's hearts
              </p>
              <p>
                • <strong>Set realistic goals:</strong> Smaller amounts are easier to reach
              </p>
              <p>
                • <strong>Share widely:</strong> The more people see it, the more likely it succeeds
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
  )
}
