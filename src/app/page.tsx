'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Users, Code, Shield } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function Home() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold tracking-tight mb-4">
            Fasset Prime Portals
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Access your dedicated portal for seamless digital asset management and investment opportunities.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center space-x-2">
                <Users className="h-6 w-6 text-blue-600" />
                <CardTitle>Investor Portal</CardTitle>
              </div>
              <CardDescription>
                Manage your investments, complete KYC, and track your portfolio
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                className="w-full" 
                onClick={() => router.push('/investor-login')}
              >
                Access Investor Portal
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center space-x-2">
                <Code className="h-6 w-6 text-green-600" />
                <CardTitle>Developer Portal</CardTitle>
              </div>
              <CardDescription>
                Integrate APIs, manage webhooks, and monitor transactions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                className="w-full" 
                onClick={() => router.push('/dev-login')}
              >
                Access Developer Portal
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center space-x-2">
                <Shield className="h-6 w-6 text-red-600" />
                <CardTitle>Admin Portal</CardTitle>
              </div>
              <CardDescription>
                Manage KYC queues, monitor compliance, and generate reports
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                className="w-full" 
                onClick={() => router.push('/admin-login')}
              >
                Access Admin Portal
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="text-center mt-16">
          <p className="text-sm text-muted-foreground">
            Demo credentials: investor@example.com / developer@example.com / admin@example.com
            <br />
            Password: password123
          </p>
        </div>
      </div>
    </div>
  )
}