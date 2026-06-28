import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { getLangDisplayName } from '@/lib/languages'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Sparkles, Calendar, Code, AlignLeft } from 'lucide-react'

export const metadata = {
  title: 'Dashboard – Your Conversions',
  description: 'View your AI conversion history, tracked metrics, and plan quotas on CodeConvert.',
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
  const { data: conversions, error } = await supabase
    .from('conversions')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(50)

  if (error) {
    console.error('Error fetching conversions:', error)
  }

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
      {/* Dashboard Title Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-border pb-6">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">Your Conversions</h1>
          <p className="text-muted-foreground text-xs sm:text-sm mt-1">
            View details for your last 50 code translations.
          </p>
        </div>
        <Button asChild className="cursor-pointer font-bold shrink-0 bg-primary text-primary-foreground hover:bg-primary/95">
          <Link href="/">
            <Sparkles className="mr-2 h-4 w-4" />
            <span>New Conversion</span>
          </Link>
        </Button>
      </div>

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
                <Link href="/">Start converting</Link>
              </Button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader className="bg-muted/10 border-b border-border">
                  <TableRow className="border-border">
                    <TableHead className="w-[300px] text-xs font-semibold uppercase tracking-wider text-muted-foreground py-3">Language Pair</TableHead>
                    <TableHead className="text-xs font-semibold uppercase tracking-wider text-muted-foreground py-3">Characters</TableHead>
                    <TableHead className="text-xs font-semibold uppercase tracking-wider text-muted-foreground py-3">Explained</TableHead>
                    <TableHead className="text-xs font-semibold uppercase tracking-wider text-muted-foreground py-3 text-right">Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody className="divide-y divide-border">
                  {conversions.map((conv) => {
                    const fromDisplay = getLangDisplayName(conv.from_lang)
                    const toDisplay = getLangDisplayName(conv.to_lang)
                    return (
                      <TableRow key={conv.id} className="border-border hover:bg-muted/20 transition-colors">
                        <TableCell className="font-medium text-sm py-4 flex items-center gap-2">
                          <Code className="h-4 w-4 text-primary shrink-0" />
                          <span>
                            {fromDisplay} <span className="text-muted-foreground font-normal">→</span> {toDisplay}
                          </span>
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground py-4">
                          {conv.char_count.toLocaleString()} chars
                        </TableCell>
                        <TableCell className="py-4">
                          <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-semibold border ${
                            conv.used_explain 
                              ? 'bg-primary/10 text-primary border-primary/20' 
                              : 'bg-muted/50 text-muted-foreground border-border'
                          }`}>
                            {conv.used_explain ? 'Yes' : 'No'}
                          </span>
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
