"use client"

import Link from "next/link"
import { useState } from "react"
import { Heart, Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { WalletConnectButtonSimple } from "@/components/wallet-connect-button-simple"

export function SiteHeader() {
  const [open, setOpen] = useState(false)

  return (
    <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
            <Heart className="w-4 h-4 text-primary-foreground" />
          </div>
          <Link href="/" className="text-xl font-bold text-foreground">
            iS'khaftin
          </Link>
        </div>

        <nav className="hidden md:flex items-center gap-6">
          <Link href="/discover" className="text-muted-foreground hover:text-foreground transition-colors">
            Discover
          </Link>
          <Link href="/how-it-works" className="text-muted-foreground hover:text-foreground transition-colors">
            How It Works
          </Link>
          <Button asChild>
            <Link href="/create">Start a Campaign</Link>
          </Button>
        </nav>

        <div className="flex items-center gap-2">
          <WalletConnectButtonSimple />
          <div className="md:hidden">
            <Sheet open={open} onOpenChange={setOpen}>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon" className="bg-transparent">
                  <Menu className="w-5 h-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="p-0">
                <div className="p-4 space-y-4">
                  <Link href="/discover" onClick={() => setOpen(false)} className="block py-2 text-foreground">
                    Discover
                  </Link>
                  <Link href="/how-it-works" onClick={() => setOpen(false)} className="block py-2 text-foreground">
                    How It Works
                  </Link>
                  <Button asChild className="w-full">
                    <Link href="/create" onClick={() => setOpen(false)}>
                      Start a Campaign
                    </Link>
                  </Button>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  )
}


