import Link from 'next/link'
import { Check, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

export const metadata = {
  title: 'Pricing Plans – AI Code Translate Pro',
  description: 'Choose the perfect AI Code Translate plan. Unlock unlimited conversions, priority processing, code explanation guides, and complete conversion histories.',
}

export default function PricingPage() {
  return (
    <div className="py-16 px-4 space-y-12 max-w-6xl mx-auto">
      {/* Page Header */}
      <div className="text-center space-y-3">
        <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight">Simple, Transparent Pricing</h1>
        <p className="text-muted-foreground text-sm sm:text-base max-w-xl mx-auto leading-relaxed">
          Start for free, then upgrade to Pro for unlimited AI power, conversion history, and priority speeds.
        </p>
      </div>

      {/* Pricing Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch pt-4">
        {/* Card 1: Free */}
        <Card className="flex flex-col border-border bg-card shadow-sm justify-between relative overflow-hidden">
          <div>
            <CardHeader className="pb-4">
              <div className="flex justify-between items-start">
                <Badge variant="secondary" className="font-semibold text-xs text-muted-foreground bg-muted">
                  Free Forever
                </Badge>
              </div>
              <CardTitle className="text-2xl font-bold mt-2">Free Plan</CardTitle>
              <CardDescription className="text-xs">Perfect for occasional translations</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-baseline">
                <span className="text-4xl font-extrabold">$0</span>
                <span className="text-muted-foreground text-xs ml-1">/ forever</span>
              </div>
              
              <ul className="space-y-3 text-sm text-foreground/90">
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-primary shrink-0" />
                  <span>5 conversions per day</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-primary shrink-0" />
                  <span>All 18 programming languages</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-primary shrink-0" />
                  <span>No account signup required</span>
                </li>
              </ul>
            </CardContent>
          </div>
          <CardFooter className="pt-4">
            <Button variant="outline" asChild className="w-full cursor-pointer font-bold border-border hover:bg-muted">
              <Link href="/">Start for Free</Link>
            </Button>
          </CardFooter>
        </Card>

        {/* Card 2: Pro Monthly */}
        <Card className="flex flex-col border-2 border-primary bg-card shadow-md justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 bg-primary text-primary-foreground text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-bl-lg flex items-center gap-1">
            <Sparkles className="h-3 w-3" />
            <span>Most Popular</span>
          </div>
          <div>
            <CardHeader className="pb-4">
              <div className="flex justify-between items-start">
                <Badge variant="default" className="font-semibold text-xs text-primary-foreground bg-primary">
                  Pro Monthly
                </Badge>
              </div>
              <CardTitle className="text-2xl font-bold mt-2">Monthly Subscription</CardTitle>
              <CardDescription className="text-xs">For heavy users and professional developers</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-baseline">
                <span className="text-4xl font-extrabold">$7</span>
                <span className="text-muted-foreground text-xs ml-1">/ month</span>
              </div>

              <ul className="space-y-3 text-sm text-foreground/90">
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-primary shrink-0" />
                  <span className="font-semibold">Unlimited conversions</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-primary shrink-0" />
                  <span>Priority translation processing</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-primary shrink-0" />
                  <span>Detailed step explanation guides</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-primary shrink-0" />
                  <span>Full database conversion history</span>
                </li>
              </ul>
            </CardContent>
          </div>
          <CardFooter className="pt-4">
            <Button disabled className="w-full font-bold bg-primary/20 text-primary-foreground/50 border border-transparent">
              Coming Soon
            </Button>
          </CardFooter>
        </Card>

        {/* Card 3: Pro Annual */}
        <Card className="flex flex-col border-border bg-card shadow-sm justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 bg-emerald-600 text-white text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-bl-lg">
            Save 42%
          </div>
          <div>
            <CardHeader className="pb-4">
              <div className="flex justify-between items-start">
                <Badge variant="secondary" className="font-semibold text-xs text-foreground bg-secondary/30">
                  Best Value
                </Badge>
              </div>
              <CardTitle className="text-2xl font-bold mt-2">Annual Subscription</CardTitle>
              <CardDescription className="text-xs">Great value for standard long-term projects</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-baseline flex-wrap gap-1">
                <span className="text-4xl font-extrabold">$49</span>
                <span className="text-muted-foreground text-xs">/ year</span>
                <span className="text-emerald-600 dark:text-emerald-400 text-xs font-semibold block w-full mt-1">
                  ($4.08/month - billed annually)
                </span>
              </div>

              <ul className="space-y-3 text-sm text-foreground/90">
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-primary shrink-0" />
                  <span className="font-semibold">Unlimited conversions</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-primary shrink-0" />
                  <span>Priority translation processing</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-primary shrink-0" />
                  <span>Detailed step explanation guides</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-primary shrink-0" />
                  <span>Full database conversion history</span>
                </li>
              </ul>
            </CardContent>
          </div>
          <CardFooter className="pt-4">
            <Button disabled className="w-full font-bold border-border">
              Coming Soon
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
