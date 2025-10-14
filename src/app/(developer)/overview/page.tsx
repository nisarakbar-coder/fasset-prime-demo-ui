'use client'

import { PageHeader } from '@/components/shared/PageHeader'
import { KPIGrid } from '@/components/shared/KPIGrid'
import { FunnelChart } from '@/components/shared/FunnelChart'
import { TimeSeriesChart } from '@/components/shared/TimeSeriesChart'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { 
  TrendingUp, 
  Users, 
  Clock, 
  CheckCircle,
  AlertTriangle,
  Activity
} from 'lucide-react'
import { mockTransactions, mockWebhookEvents, getTotalTransactionVolume, getSuccessRate, getAverageSettlementTime } from '@/lib/mock-data'

export default function DeveloperOverview() {
  // Mock data for charts
  const funnelData = [
    { name: 'API Calls', value: 10000 },
    { name: 'KYC Started', value: 8500 },
    { name: 'KYC Completed', value: 7500 },
    { name: 'Wallets Whitelisted', value: 7000 },
    { name: 'Transactions', value: 6500 },
    { name: 'Settled', value: 6000 },
  ]

  const timeSeriesData = [
    { date: '2024-01-01', value: 50000 },
    { date: '2024-01-02', value: 75000 },
    { date: '2024-01-03', value: 60000 },
    { date: '2024-01-04', value: 90000 },
    { date: '2024-01-05', value: 120000 },
    { date: '2024-01-06', value: 150000 },
    { date: '2024-01-07', value: 180000 },
  ]

  const recentTransactions = mockTransactions.slice(0, 5)
  const recentWebhooks = mockWebhookEvents.slice(0, 5)

  return (
    <div className="space-y-6">
      <PageHeader
        title="Developer Overview"
        description="Monitor your API usage, transactions, and system health"
      />

      {/* KPI Grid */}
      <KPIGrid />

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Conversion Funnel */}
        <FunnelChart
          data={funnelData}
          title="User Journey Funnel"
        />

        {/* Transaction Volume */}
        <TimeSeriesChart
          data={timeSeriesData}
          title="Transaction Volume (AED)"
          dataKey="value"
          formatValue={(value) => `AED ${value.toLocaleString()}`}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent Transactions */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Transactions</CardTitle>
            <CardDescription>
              Latest transaction activity
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
                  <Badge variant={
                    transaction.status === 'SETTLED' ? 'default' :
                    transaction.status === 'PENDING' ? 'secondary' :
                    'destructive'
                  }>
                    {transaction.status}
                  </Badge>
                </div>
              ))}
            </div>
            <Button variant="outline" className="w-full mt-4">
              View All Transactions
            </Button>
          </CardContent>
        </Card>

        {/* Webhook Status */}
        <Card>
          <CardHeader>
            <CardTitle>Webhook Status</CardTitle>
            <CardDescription>
              Recent webhook delivery attempts
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentWebhooks.map((webhook) => (
                <div key={webhook.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">{webhook.eventType}</p>
                    <p className="text-sm text-muted-foreground">
                      {webhook.createdAt.toLocaleDateString()} • {webhook.retryCount} retries
                    </p>
                  </div>
                  <Badge variant={
                    webhook.status === 'DELIVERED' ? 'default' :
                    webhook.status === 'PENDING' ? 'secondary' :
                    'destructive'
                  }>
                    {webhook.status}
                  </Badge>
                </div>
              ))}
            </div>
            <Button variant="outline" className="w-full mt-4">
              View All Webhooks
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* System Health */}
      <Card>
        <CardHeader>
          <CardTitle>System Health</CardTitle>
          <CardDescription>
            Monitor your API performance and system status
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-4">
            <div className="flex items-center space-x-3 p-4 border rounded-lg">
              <div className="p-2 rounded-full bg-green-100 dark:bg-green-900">
                <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="font-medium">API Status</p>
                <p className="text-sm text-green-600">Operational</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3 p-4 border rounded-lg">
              <div className="p-2 rounded-full bg-blue-100 dark:bg-blue-900">
                <Activity className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="font-medium">Response Time</p>
                <p className="text-sm text-blue-600">245ms avg</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3 p-4 border rounded-lg">
              <div className="p-2 rounded-full bg-yellow-100 dark:bg-yellow-900">
                <AlertTriangle className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
              </div>
              <div>
                <p className="font-medium">Error Rate</p>
                <p className="text-sm text-yellow-600">2.5%</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3 p-4 border rounded-lg">
              <div className="p-2 rounded-full bg-purple-100 dark:bg-purple-900">
                <TrendingUp className="h-5 w-5 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <p className="font-medium">Uptime</p>
                <p className="text-sm text-purple-600">99.8%</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>
            Common tasks and shortcuts
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <Button variant="outline" className="h-20 flex-col space-y-2">
              <TrendingUp className="h-6 w-6" />
              <span>View Analytics</span>
            </Button>
            <Button variant="outline" className="h-20 flex-col space-y-2">
              <Users className="h-6 w-6" />
              <span>Manage Users</span>
            </Button>
            <Button variant="outline" className="h-20 flex-col space-y-2">
              <Clock className="h-6 w-6" />
              <span>View Logs</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
