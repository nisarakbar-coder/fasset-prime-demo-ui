'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { AppShell } from '@/components/shared/AppShell'
import { Button } from '@/components/ui/button'
import { 
  BarChart3, 
  Key, 
  Webhook, 
  CreditCard, 
  Link as LinkIcon,
  DollarSign, 
  FileText, 
  FolderOpen, 
  Settings,
  LogOut
} from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'

const navigation = [
  { name: 'Overview', href: '/overview', icon: BarChart3 },
  { name: 'API Keys', href: '/api-keys', icon: Key },
  { name: 'Webhooks', href: '/webhooks', icon: Webhook },
  { name: 'Transactions', href: '/dev-transactions', icon: CreditCard },
  { name: 'Payment Links', href: '/payment-links', icon: LinkIcon },
  { name: 'Payouts', href: '/payouts', icon: DollarSign },
  { name: 'Reports', href: '/dev-reports', icon: FileText },
  { name: 'Projects', href: '/projects', icon: FolderOpen },
  { name: 'Settings', href: '/settings', icon: Settings },
]

export default function DeveloperLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [user, setUser] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    // Skip authentication check for login pages
    if (pathname === '/dev-login') {
      setIsLoading(false)
      return
    }

    // Check for stored user on mount
    if (typeof window !== 'undefined') {
      const storedUser = localStorage.getItem('fasset-user')
      if (storedUser) {
        try {
          const parsedUser = JSON.parse(storedUser)
          if (parsedUser.role === 'DEVELOPER') {
            setUser(parsedUser)
          } else {
            router.push('/')
          }
        } catch (error) {
          console.error('Failed to parse stored user:', error)
          localStorage.removeItem('fasset-user')
          router.push('/dev-login')
        }
      } else {
        router.push('/dev-login')
      }
    }
    setIsLoading(false)
  }, [router, pathname])

  const logout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('fasset-user')
    }
    router.push('/')
  }

  // For login pages, render children directly
  if (pathname === '/dev-login') {
    return <>{children}</>
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!user || user.role !== 'DEVELOPER') {
    return null
  }

  const sidebar = (
    <div className="flex flex-col h-full">
      <div className="p-6 border-b">
        <h2 className="text-lg font-semibold">Developer Portal</h2>
        <p className="text-sm text-muted-foreground">Welcome back, {user.name}</p>
      </div>
      
      <nav className="flex-1 p-4 space-y-2">
        {navigation.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                'flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                isActive
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted'
              )}
            >
              <item.icon className="h-4 w-4" />
              <span>{item.name}</span>
            </Link>
          )
        })}
      </nav>
      
      <div className="p-4 border-t">
        <Button
          variant="ghost"
          className="w-full justify-start"
          onClick={logout}
        >
          <LogOut className="h-4 w-4 mr-2" />
          Sign Out
        </Button>
      </div>
    </div>
  )

  return (
    <AppShell sidebar={sidebar}>
      {children}
    </AppShell>
  )
}