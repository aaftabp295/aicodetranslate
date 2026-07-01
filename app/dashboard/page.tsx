import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { getLangDisplayName } from '@/lib/languages'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Sparkles, Calendar, Code, ArrowRight } from 'lucide-react'
import { LanguageIcon } from '@/components/converter/LanguageIcon'

export const metadata = {
  title: 'Dashboard – Your Conversions',
  description: 'View your AI conversion history, tracked metrics, and plan quotas on AI Code Translate.',
}

export default async function DashboardPage() {
  const supabase = await createClient()

  // 1. Authenticate user
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // 2. Query conversions
  const { data: conversions, error: convError } = await supabase
    .from('conversions')
    .select('from_lang, to_lang, char_count, used_explain, created_at')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(50)

  if (convError) {
    console.error('Error fetching conversions:', convError)
  }

  // 3. Query subscriptions
  const { data: subscription } = await supabase
    .from('subscriptions')
    .select('plan')
    .eq('user_id', user.id)
    .maybeSingle()

  const isPro = subscription?.plan === 'pro'
  const currentPlan = isPro ? 'Pro Plan' : 'Free Plan'

  // Format date helper
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  return (
    <div className="py-10 max-w-6xl mx-auto px-4 space-y-8 animate-in fade-in duration-300">
      {/* Dashboard Title Header & Welcome message */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 border-b border-border pb-6">
        <div className="space-y-1.5 text-left">
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-3xl font-extrabold tracking-tight">Your Conversions</h1>
            <Badge className="bg-primary/10 text-primary border-primary/20 hover:bg-primary/15 font-semibold text-xs py-0.5 px-3">
              {currentPlan}
            </Badge>
          </div>
          <p className="text-muted-foreground text-sm">
            Welcome back, <strong className="text-foreground">{user.email}</strong>. View details for your last 50 translations.
          </p>
        </div>
        <Button asChild className="cursor-pointer font-bold shrink-0 bg-primary text-primary-foreground hover:bg-primary/95 shadow-sm">
          <Link href="/free-code-converter">
            <Sparkles className="mr-2 h-4 w-4" />
            <span>New Conversion</span>
          </Link>
        </Button>
      </div>

      {/* Upgrade CTA if on Free Plan */}
      {!isPro && (
        <Card className="border-border bg-card shadow-sm border-l-4 border-l-primary flex flex-col md:flex-row justify-between items-start md:items-center p-6 gap-6 rounded-lg">
          <div className="space-y-1.5 text-left">
            <h3 className="font-bold text-lg text-foreground flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              Upgrade to AI Code Translate Pro
            </h3>
            <p className="text-muted-foreground text-xs leading-relaxed max-w-3xl">
              You are currently on the Free Plan. Unlock unlimited code conversions, priority processing, complex logic mappings, and complete explanations.
            </p>
          </div>
          <Button asChild className="cursor-pointer font-bold shrink-0 bg-primary text-primary-foreground hover:bg-primary/95 text-xs h-10 px-6">
            <Link href="/pricing" className="flex items-center gap-1.5">
              <span>Upgrade to Pro</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </Card>
      )}

      {/* History Card wrapper */}
      <Card className="border-border bg-card shadow-sm overflow-hidden">
        <CardHeader className="pb-3 border-b border-border bg-muted/20">
          <CardTitle className="text-base font-semibold">Conversion Log History</CardTitle>
          <CardDescription className="text-xs">
            Logs contain layout metrics and date attributes (original source code is never stored).
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          {!conversions || conversions.length === 0 ? (
            <div className="text-center py-20 px-4 space-y-4">
              <div className="h-12 w-12 rounded-full bg-primary/10 text-primary flex items-center justify-center mx-auto">
                <Code className="h-6 w-6" />
              </div>
              <div className="space-y-1">
                <h3 className="font-semibold text-base text-foreground">No conversions yet</h3>
                <p className="text-xs text-muted-foreground max-w-xs mx-auto leading-relaxed">
                  Start translating code between languages to view your conversion metrics here!
                </p>
              </div>
              <Button asChild className="cursor-pointer font-bold mt-2" size="sm">
                <Link href="/free-code-converter">Start your first conversion</Link>
              </Button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader className="bg-muted/10 border-b border-border">
                  <TableRow className="border-border">
                    <TableHead className="text-xs font-semibold uppercase tracking-wider text-muted-foreground py-3">From</TableHead>
                    <TableHead className="text-xs font-semibold uppercase tracking-wider text-muted-foreground py-3">To</TableHead>
                    <TableHead className="text-xs font-semibold uppercase tracking-wider text-muted-foreground py-3">Characters</TableHead>
                    <TableHead className="text-xs font-semibold uppercase tracking-wider text-muted-foreground py-3 text-right">Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody className="divide-y divide-border">
                  {conversions.map((conv, idx) => {
                    const fromDisplay = getLangDisplayName(conv.from_lang)
                    const toDisplay = getLangDisplayName(conv.to_lang)
                    return (
                      <TableRow key={idx} className="border-border hover:bg-muted/20 transition-colors">
                        <TableCell className="font-medium text-sm py-4">
                          <div className="flex items-center gap-2">
                            <LanguageIcon lang={conv.from_lang} size={16} useBrandColor />
                            <span>{fromDisplay}</span>
                          </div>
                        </TableCell>
                        <TableCell className="font-medium text-sm py-4">
                          <div className="flex items-center gap-2">
                            <LanguageIcon lang={conv.to_lang} size={16} useBrandColor />
                            <span>{toDisplay}</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground py-4">
                          {conv.char_count ? conv.char_count.toLocaleString() : '0'} chars
                        </TableCell>
                        <TableCell className="text-right text-xs text-muted-foreground py-4">
                          <span className="inline-flex items-center gap-1.5 justify-end">
                            <Calendar className="h-3.5 w-3.5 text-muted-foreground/60" />
                            <span>{formatDate(conv.created_at)}</span>
                          </span>
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
