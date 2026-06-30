'use client'

import * as React from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'
import { Mail, Loader2, CheckCircle2 } from 'lucide-react'

export default function LoginPage() {
  const supabase = createClient()
  const [email, setEmail] = React.useState('')
  const [isLoading, setIsLoading] = React.useState(false)
  const [isSent, setIsSent] = React.useState(false)

  // Handle Email Magic Link
  const handleMagicLinkLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.trim()) {
      toast.error('Please enter a valid email address.')
      return
    }

    setIsLoading(true)
    try {
      const { error } = await supabase.auth.signInWithOtp({
        email: email.trim(),
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      })
      if (error) throw error
      setIsSent(true)
      toast.success('Magic link sent successfully!')
    } catch (err: any) {
      toast.error(err?.message || 'Failed to send magic link. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-[80vh] items-center justify-center px-4 py-12">
      <Card className="w-full max-w-[400px] border-border bg-card shadow-md">
        <CardHeader className="space-y-2 text-center">
          <CardTitle className="text-2xl font-bold tracking-tight">Welcome to AI Code Translate</CardTitle>
          <CardDescription className="text-xs text-muted-foreground">
            Sign in to save your conversion history and get more free conversions.
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {isSent ? (
            <div className="rounded-lg bg-emerald-500/10 border border-emerald-500/20 p-4 space-y-2 text-center animate-in fade-in zoom-in-95 duration-200">
              <CheckCircle2 className="h-8 w-8 text-emerald-500 mx-auto" />
              <h3 className="font-semibold text-sm text-foreground">Check your inbox</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                We've sent a magic link to <strong className="text-foreground">{email}</strong>. Click the link to complete your sign-in.
              </p>
            </div>
          ) : (
            <>
              {/* Email Magic Link Form */}
              <form onSubmit={handleMagicLinkLogin} className="space-y-4">
                <div className="space-y-1.5 text-left">
                  <Label htmlFor="email" className="text-xs font-semibold text-foreground/80">
                    Email Address
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={isLoading}
                    required
                    className="border-border bg-background focus:ring-primary text-sm"
                  />
                </div>
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full flex items-center justify-center gap-2 cursor-pointer font-bold"
                >
                  {isLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Mail className="h-4 w-4" />
                  )}
                  <span>Send Magic Link</span>
                </Button>
              </form>
            </>
          )}
        </CardContent>
        
        <CardFooter className="text-center justify-center border-t border-border/40 pt-4">
          <p className="text-[10px] text-muted-foreground leading-relaxed max-w-[280px]">
            By continuing, you agree to our terms of service and dynamic usage agreements.
          </p>
        </CardFooter>
      </Card>
    </div>
  )
}
