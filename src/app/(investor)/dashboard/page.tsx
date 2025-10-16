'use client'

import { useState, useEffect } from 'react'
import { PageHeader } from '@/components/shared/PageHeader'
import { StatCard } from '@/components/shared/StatCard'
import { FunnelChart } from '@/components/shared/FunnelChart'
import { TimeSeriesChart } from '@/components/shared/TimeSeriesChart'
import { StatusPill } from '@/components/shared/StatusPill'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { 
  DollarSign, 
  TrendingUp, 
  Clock, 
  CheckCircle,
  ArrowRight,
  Wallet,
  CreditCard
} from 'lucide-react'
import Link from 'next/link'
import { useAuth } from '@/lib/auth'
import { mockTransactions, mockInvestors } from '@/lib/mock-data'

export default function InvestorDashboard() {
  const { user } = useAuth()
  const [investor, setInvestor] = useState(mockInvestors[0])
  const [recentTransactions, setRecentTransactions] = useState(mockTransactions.slice(0, 5))

  // Mock funnel data
  const funnelData = [
    { name: 'KYC Initiated', value: 100 },
    { name: 'KYC Passed', value: 85 },
    { name: 'Wallet Whitelisted', value: 80 },
    { name: 'Funded', value: 75 },
    { name: 'Settled', value: 70 },
  ]

  // Mock time series data
  const timeSeriesData = [
    { date: '2024-01-01', value: 10000 },
    { date: '2024-01-02', value: 15000 },
    { date: '2024-01-03', value: 12000 },
    { date: '2024-01-04', value: 18000 },
    { date: '2024-01-05', value: 20000 },
    { date: '2024-01-06', value: 25000 },
    { date: '2024-01-07', value: 30000 },
  ]

  const getNextStep = () => {
    if (investor.kycStatus === 'PENDING') {
      return { label: 'Complete KYC', href: '/investor/kyc', icon: CheckCircle }
    }
    if (!investor.walletWhitelisted) {
      return { label: 'Whitelist Wallet', href: '/investor/wallet-whitelist', icon: Wallet }
    }
    return { label: 'Fund Account', href: '/investor/fund', icon: CreditCard }
  }

  const nextStep = getNextStep()

  return (
    <div className="space-y-6">
      <PageHeader
        title="Dashboard"
        description="Welcome back! Here's your investment overview."
      />

      {/* Status Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Invested"
          value={`AED ${investor.totalInvested.toLocaleString()}`}
          icon={DollarSign}
          description="All time"
        />
        <StatCard
          title="Active Transactions"
          value={recentTransactions.filter(tx => tx.status !== 'SETTLED').length}
          icon={TrendingUp}
          description="In progress"
        />
        <StatCard
          title="KYC Status"
          value={investor.kycStatus}
          icon={CheckCircle}
          description="Verification status"
        />
        <StatCard
          title="Wallet Status"
          value={investor.walletWhitelisted ? 'Whitelisted' : 'Pending'}
          icon={Wallet}
          description="Blockchain wallet"
        />
      </div>

      {/* Next Steps */}
      <Card>
        <CardHeader>
          <CardTitle>Next Steps</CardTitle>
          <CardDescription>
            Complete these steps to start investing
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-full bg-primary/10">
                <nextStep.icon className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-medium">{nextStep.label}</h3>
                <p className="text-sm text-muted-foreground">
                  {nextStep.label === 'Complete KYC' && 'Verify your identity to continue'}
                  {nextStep.label === 'Whitelist Wallet' && 'Add your blockchain wallet address'}
                  {nextStep.label === 'Fund Account' && 'Deposit funds to start investing'}
                </p>
              </div>
            </div>
            <Button asChild>
              <Link href={nextStep.href}>
                Continue
                <ArrowRight className="h-4 w-4 ml-2" />
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent Transactions */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Transactions</CardTitle>
            <CardDescription>
              Your latest investment activity
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentTransactions.map((transaction) => (
                <div key={transaction.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">AED {transaction.amount.toLocaleString()}</p>
                    <p className="text-sm text-muted-foreground">
                      {transaction.chain} • {transaction.createdAt.toLocaleDateString()}
                    </p>
                  </div>
                  <StatusPill status={transaction.status} />
                </div>
              ))}
            </div>
            <Button variant="outline" className="w-full mt-4" asChild>
              <Link href="/investor/transactions">View All Transactions</Link>
            </Button>
          </CardContent>
        </Card>

        {/* Investment Funnel */}
        <FunnelChart
          data={funnelData}
          title="Investment Journey"
        />
      </div>

      {/* Portfolio Performance */}
      <Card>
        <CardHeader>
          <CardTitle>Portfolio Performance</CardTitle>
          <CardDescription>
            Your investment growth over time
          </CardDescription>
        </CardHeader>
        <CardContent>
          <TimeSeriesChart
            data={timeSeriesData}
            title=""
            dataKey="value"
            formatValue={(value) => `AED ${value.toLocaleString()}`}
          />
        </CardContent>
      </Card>

      {/* Help Section */}
      <Card>
        <CardHeader>
          <CardTitle>Need Help?</CardTitle>
          <CardDescription>
            Get support for your investment journey
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="p-4 border rounded-lg">
              <h3 className="font-medium mb-2">Getting Started</h3>
              <p className="text-sm text-muted-foreground mb-3">
                Learn how to complete your KYC and start investing
              </p>
              <Button variant="outline" size="sm">
                View Guide
              </Button>
            </div>
            <div className="p-4 border rounded-lg">
              <h3 className="font-medium mb-2">Contact Support</h3>
              <p className="text-sm text-muted-foreground mb-3">
                Get help from our support team
              </p>
              <Button variant="outline" size="sm" asChild>
                <Link href="/investor/support">Contact Us</Link>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
