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
  const [isGoogleLoading, setIsGoogleLoading] = React.useState(false)
  const [isSent, setIsSent] = React.useState(false)

  // Handle Google OAuth
  const handleGoogleLogin = async () => {
    setIsGoogleLoading(true)
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      })
      if (error) throw error
    } catch (err: any) {
      toast.error(err?.message || 'Failed to sign in with Google')
      setIsGoogleLoading(false)
    }
  }

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
              {/* Google OAuth Button */}
              <Button
                variant="outline"
                type="button"
                onClick={handleGoogleLogin}
                disabled={isGoogleLoading || isLoading}
                className="w-full flex items-center justify-center gap-2 cursor-pointer border-border font-semibold"
              >
                {isGoogleLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <svg className="h-4 w-4 shrink-0" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335"/>
                  </svg>
                )}
                <span>Continue with Google</span>
              </Button>

              {/* Visual Divider */}
              <div className="relative flex items-center justify-center">
                <span className="absolute inset-x-0 h-px bg-border" />
                <span className="relative bg-card px-3 text-[10px] uppercase text-muted-foreground font-semibold">
                  or
                </span>
              </div>

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
                    disabled={isGoogleLoading || isLoading}
                    required
                    className="border-border bg-background focus:ring-primary text-sm"
                  />
                </div>
                <Button
                  type="submit"
                  disabled={isGoogleLoading || isLoading}
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
