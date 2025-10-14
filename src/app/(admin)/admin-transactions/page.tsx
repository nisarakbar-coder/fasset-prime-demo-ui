'use client'

import { PageHeader } from '@/components/shared/PageHeader'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { CreditCard, AlertTriangle, CheckCircle, Pause } from 'lucide-react'

export default function AdminTransactionsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Transaction Monitoring"
        description="Monitor all transactions across the platform"
      />

      <div className="grid gap-6 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Transaction Overview</CardTitle>
            <CardDescription>
              Global transaction statistics
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Total Volume</span>
                <span className="font-mono">AED 2.5M</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Total Transactions</span>
                <span className="font-mono">1,247</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Success Rate</span>
                <span className="text-green-600">98.7%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Avg Settlement Time</span>
                <span className="font-mono">2.4h</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Risk Monitoring</CardTitle>
            <CardDescription>
              Transactions flagged for review
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <p className="font-medium">High Risk Transaction</p>
                  <p className="text-sm text-muted-foreground">AED 50,000</p>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant="destructive">High Risk</Badge>
                  <Button variant="outline" size="sm">
                    <Pause className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <p className="font-medium">Suspicious Pattern</p>
                  <p className="text-sm text-muted-foreground">AED 25,000</p>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant="default">Medium Risk</Badge>
                  <Button variant="outline" size="sm">
                    <AlertTriangle className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>System Status</CardTitle>
            <CardDescription>
              Transaction processing status
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <span className="text-sm">Processing: Normal</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <span className="text-sm">Settlement: Active</span>
              </div>
              <div className="flex items-center space-x-2">
                <AlertTriangle className="h-5 w-5 text-yellow-600" />
                <span className="text-sm">3 Transactions Paused</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
