'use client'

import { PageHeader } from '@/components/shared/PageHeader'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { BarChart3, Download, FileText, TrendingUp } from 'lucide-react'

export default function AdminReportsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Reports & Analytics"
        description="Generate comprehensive reports and view platform analytics"
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Business Intelligence</CardTitle>
            <CardDescription>
              Platform performance and revenue metrics
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="p-4 border rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <TrendingUp className="h-5 w-5 text-green-600" />
                    <span className="font-medium">Total Transaction Volume</span>
                  </div>
                  <p className="text-2xl font-bold">AED 2.5M</p>
                  <p className="text-sm text-green-600">+12.5% from last month</p>
                </div>
                <div className="p-4 border rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <BarChart3 className="h-5 w-5 text-blue-600" />
                    <span className="font-medium">Active Users</span>
                  </div>
                  <p className="text-2xl font-bold">1,247</p>
                  <p className="text-sm text-blue-600">+8.2% from last month</p>
                </div>
              </div>
              <Button className="w-full">
                <Download className="h-4 w-4 mr-2" />
                Download Full Report
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>System Operations</CardTitle>
            <CardDescription>
              Technical performance and system health
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="p-4 border rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <FileText className="h-5 w-5 text-purple-600" />
                    <span className="font-medium">API Latency</span>
                  </div>
                  <p className="text-2xl font-bold">245ms</p>
                  <p className="text-sm text-purple-600">Average response time</p>
                </div>
                <div className="p-4 border rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <BarChart3 className="h-5 w-5 text-orange-600" />
                    <span className="font-medium">Error Rate</span>
                  </div>
                  <p className="text-2xl font-bold">1.3%</p>
                  <p className="text-sm text-orange-600">System error rate</p>
                </div>
              </div>
              <Button variant="outline" className="w-full">
                <Download className="h-4 w-4 mr-2" />
                Download System Report
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
