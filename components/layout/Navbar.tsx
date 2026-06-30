'use client'

import * as React from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Code2, Menu, LayoutDashboard, LogOut } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

import { Button } from '@/components/ui/button'
import { ThemeToggle } from '@/components/layout/ThemeToggle'
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  NavigationMenuContent,
  navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { cn } from '@/lib/utils'

export function Navbar() {
  const router = useRouter()
  const supabase = createClient()
  const [user, setUser] = React.useState<any>(null)
  const [loading, setLoading] = React.useState(true)

  React.useEffect(() => {
    // Check current session
    async function getSession() {
      const {
        data: { session },
      } = await supabase.auth.getSession()
      setUser(session?.user ?? null)
      setLoading(false)
    }

    getSession()

    // Listen to real-time auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
      setLoading(false)
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [supabase.auth])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/')
    router.refresh()
  }

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/converters', label: 'Converters' },
    { href: '/pricing', label: 'Pricing' },
  ]

  const popularSources = [
    { lang: 'python', label: 'Python', desc: 'Simple, readable, widely used' },
    { lang: 'javascript', label: 'JavaScript', desc: 'The language of the web' },
    { lang: 'typescript', label: 'TypeScript', desc: 'JavaScript with types' },
    { lang: 'java', label: 'Java', desc: 'Enterprise-grade, cross-platform' },
    { lang: 'go', label: 'Go', desc: 'Fast, simple, concurrent' },
    { lang: 'rust', label: 'Rust', desc: 'Memory-safe systems language' },
  ]

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
        {/* Left: Logo */}
        <div className="flex items-center space-x-2">
          <Link href="/" className="flex items-center space-x-2 cursor-pointer">
            <Code2 className="h-6 w-6 text-primary" />
            <span className="font-sans text-lg font-bold tracking-tight text-foreground">
              AI Code Translate
            </span>
          </Link>
        </div>

        {/* Center: Desktop Navigation */}
        <div className="hidden md:flex">
          <NavigationMenu>
            <NavigationMenuList className="gap-1">
              {/* Home Link */}
              <NavigationMenuItem>
                <NavigationMenuLink asChild>
                  <Link
                    href="/"
                    className={cn(
                      navigationMenuTriggerStyle(),
                      "bg-transparent cursor-pointer font-medium hover:bg-muted focus:bg-muted"
                    )}
                  >
                    Home
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>

              {/* Converters Dropdown */}
              <NavigationMenuItem>
                <NavigationMenuTrigger className="bg-transparent cursor-pointer font-medium hover:bg-muted focus:bg-muted">
                  Converters
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <div className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2">
                    <div className="col-span-2 px-2 pb-1 border-b border-border">
                      <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                        Convert from...
                      </span>
                    </div>
                    {popularSources.map((src) => (
                      <Link
                        key={src.lang}
                        href={`/convert-from-${src.lang}`}
                        className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-muted hover:text-accent-foreground focus:bg-muted focus:text-accent-foreground"
                      >
                        <div className="text-sm font-semibold text-foreground group-hover:text-primary">
                          {src.label}
                        </div>
                        <p className="line-clamp-1 text-xs leading-normal text-muted-foreground">
                          {src.desc}
                        </p>
                      </Link>
                    ))}
                    <div className="col-span-2 mt-2 pt-2 border-t border-border flex justify-end">
                      <NavigationMenuLink asChild>
                        <Link
                          href="/converters"
                          className="flex items-center gap-1 text-xs font-semibold text-primary hover:underline cursor-pointer"
                        >
                          See all 18 languages &rarr;
                        </Link>
                      </NavigationMenuLink>
                    </div>
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>

              {/* Pricing Link */}
              <NavigationMenuItem>
                <NavigationMenuLink asChild>
                  <Link
                    href="/pricing"
                    className={cn(
                      navigationMenuTriggerStyle(),
                      "bg-transparent cursor-pointer font-medium hover:bg-muted focus:bg-muted"
                    )}
                  >
                    Pricing
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>

        {/* Right: Theme Toggle + Auth Button */}
        <div className="flex items-center space-x-3">
          <ThemeToggle />

          {!loading && (
            <>
              {user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      className="relative h-8 w-8 rounded-full cursor-pointer"
                    >
                      <Avatar className="h-8 w-8 border border-border">
                        <AvatarImage
                          src={user.user_metadata?.avatar_url || ''}
                          alt={user.email || 'User avatar'}
                        />
                        <AvatarFallback className="bg-primary/10 text-primary uppercase text-xs font-semibold">
                          {user.email?.substring(0, 2) || 'US'}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56 bg-popover border-border" align="end">
                    <DropdownMenuLabel className="font-normal">
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none text-foreground">
                          Account
                        </p>
                        <p className="text-xs leading-none text-muted-foreground break-all">
                          {user.email}
                        </p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator className="bg-border" />
                    <DropdownMenuItem asChild className="focus:bg-accent cursor-pointer">
                      <Link href="/dashboard" className="w-full flex items-center">
                        <LayoutDashboard className="mr-2 h-4 w-4" />
                        <span>Dashboard</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator className="bg-border" />
                    <DropdownMenuItem
                      onClick={handleSignOut}
                      className="focus:bg-destructive/10 focus:text-destructive cursor-pointer"
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Sign out</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Button variant="outline" size="sm" asChild className="cursor-pointer border-border font-semibold">
                  <Link href="/login">Log in</Link>
                </Button>
              )}
            </>
          )}

          {/* Mobile Hamburguer Menu */}
          <div className="flex md:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="h-9 w-9 cursor-pointer">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[240px] bg-card border-border p-6">
                <SheetHeader className="text-left mb-6">
                  <SheetTitle className="flex items-center space-x-2">
                    <Code2 className="h-5 w-5 text-primary" />
                    <span className="font-sans text-base font-bold">AI Code Translate</span>
                  </SheetTitle>
                </SheetHeader>
                <nav className="flex flex-col space-y-4">
                  {navLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className="text-sm font-medium hover:text-primary transition-colors cursor-pointer"
                    >
                      {link.label}
                    </Link>
                  ))}
                  {!loading && !user && (
                    <div className="pt-4 border-t border-border">
                      <Button className="w-full cursor-pointer font-semibold" asChild>
                        <Link href="/login">Log in</Link>
                      </Button>
                    </div>
                  )}
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  )
}
