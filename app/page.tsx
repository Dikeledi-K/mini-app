"use client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Heart, Users, Zap } from "lucide-react"
import Link from "next/link"
import { useEffect } from "react"
import { useMiniKit } from "@coinbase/onchainkit/minikit"

export default function HomePage() {
  const { setFrameReady, isFrameReady } = useMiniKit()

  useEffect(() => {
    if (!isFrameReady) setFrameReady()
  }, [isFrameReady, setFrameReady])

  return (
    <div className="min-h-screen bg-background">
      

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center max-w-4xl">
          <h2 className="text-4xl md:text-6xl font-bold text-foreground mb-6 text-balance">
            Turn Your Community Into a <span className="text-primary">Force for Good</span>
          </h2>
          <p className="text-xl text-muted-foreground mb-8 text-pretty max-w-2xl mx-auto">
            iS'khaftin embodies Ubuntu - "I am because we are." Create micro-crowdfunding campaigns for your South
            African community's needs, one small donation at a time.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild className="text-lg px-8">
              <Link href="/create">Create Campaign</Link>
            </Button>
            <Button size="lg" variant="outline" asChild className="text-lg px-8 bg-transparent">
              <Link href="/discover">Explore Campaigns</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 bg-card/30">
        <div className="container mx-auto">
          <h3 className="text-3xl font-bold text-center text-foreground mb-12">Ubuntu in Action</h3>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <Card className="text-center">
              <CardHeader>
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="w-6 h-6 text-primary" />
                </div>
                <CardTitle>Community First</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  Built for South African communities, embracing the spirit of Ubuntu and collective support.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <div className="w-12 h-12 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Zap className="w-6 h-6 text-secondary" />
                </div>
                <CardTitle>Instant Impact</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  Small donations (R100 ≈ $5) create big change. Every contribution matters and adds up quickly.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Heart className="w-6 h-6 text-accent" />
                </div>
                <CardTitle>Transparent Trust</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  Blockchain-powered transparency ensures every rand goes where it's needed most.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center max-w-3xl">
          <h3 className="text-3xl font-bold text-foreground mb-6">Ready to Make a Difference?</h3>
          <p className="text-lg text-muted-foreground mb-8">
            Whether you need help or want to help others, iS'khaftin connects communities through the power of
            collective action.
          </p>
          <Button size="lg" asChild className="text-lg px-8">
            <Link href="/create">Start Your Campaign Today</Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8 px-4 bg-card/30">
        <div className="container mx-auto text-center">
          <p className="text-muted-foreground">Built with Ubuntu spirit for South African communities</p>
        </div>
      </footer>
    </div>
  )
}
