'use client'

import { PageHeader } from '@/components/shared/PageHeader'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { DollarSign, Download, Filter } from 'lucide-react'

export default function DeveloperPayoutsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Payouts"
        description="Track and manage payout transactions"
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
          <CardTitle>Payout History</CardTitle>
          <CardDescription>
            All payout transactions and their status
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <h3 className="font-medium">AED 10,000</h3>
                <p className="text-sm text-muted-foreground">
                  Bank Ref: PAY-2024-001 • 2024-01-12
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <Badge variant="default">SETTLED</Badge>
                <Button variant="outline" size="sm">
                  <DollarSign className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <h3 className="font-medium">AED 25,000</h3>
                <p className="text-sm text-muted-foreground">
                  Bank Ref: PAY-2024-002 • 2024-01-16
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <Badge variant="secondary">SENT</Badge>
                <Button variant="outline" size="sm">
                  <DollarSign className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
