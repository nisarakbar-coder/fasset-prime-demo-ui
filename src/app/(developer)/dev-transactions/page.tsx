'use client'

import { PageHeader } from '@/components/shared/PageHeader'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { CreditCard, Filter, Download } from 'lucide-react'

export default function DeveloperTransactionsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Transactions"
        description="Monitor and manage your API transactions"
        actions={
          <div className="flex items-center space-x-2">
            <Button variant="outline">
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        }
      />

      <Card>
        <CardHeader>
          <CardTitle>Transaction History</CardTitle>
          <CardDescription>
            All transactions processed through your API
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <h3 className="font-medium">AED 10,000</h3>
                <p className="text-sm text-muted-foreground">
                  Ethereum • 2024-01-10
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <Badge variant="default">SETTLED</Badge>
                <Button variant="outline" size="sm">
                  <CreditCard className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <h3 className="font-medium">AED 25,000</h3>
                <p className="text-sm text-muted-foreground">
                  Polygon • 2024-01-15
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <Badge variant="secondary">PAYOUT_SENT</Badge>
                <Button variant="outline" size="sm">
                  <CreditCard className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <h3 className="font-medium">AED 5,000</h3>
                <p className="text-sm text-muted-foreground">
                  Arbitrum • 2024-01-18
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <Badge variant="outline">KYC_PENDING</Badge>
                <Button variant="outline" size="sm">
                  <CreditCard className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
