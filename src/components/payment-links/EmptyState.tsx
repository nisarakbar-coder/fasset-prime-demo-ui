'use client'

import { Link } from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { CreditCard, Plus, Search } from 'lucide-react'

interface EmptyStateProps {
  type: 'no-permission' | 'no-links' | 'no-results'
  onCreateLink?: () => void
}

export function EmptyState({ type, onCreateLink }: EmptyStateProps) {
  if (type === 'no-permission') {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <div className="rounded-full bg-muted p-3 mb-4">
            <CreditCard className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold mb-2">Access Restricted</h3>
          <p className="text-muted-foreground text-center mb-6 max-w-md">
            You don't have permission to create or view payment links. 
            Please contact your administrator to request access.
          </p>
          <Button variant="outline" asChild>
            <a href="/support">Contact Support</a>
          </Button>
        </CardContent>
      </Card>
    )
  }

  if (type === 'no-links') {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <div className="rounded-full bg-muted p-3 mb-4">
            <CreditCard className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold mb-2">No Payment Links Yet</h3>
          <p className="text-muted-foreground text-center mb-6 max-w-md">
            Create your first payment link to start accepting payments from buyers. 
            Payment links make it easy to collect payments for your projects.
          </p>
          <Button onClick={onCreateLink}>
            <Plus className="h-4 w-4 mr-2" />
            Create Payment Link
          </Button>
        </CardContent>
      </Card>
    )
  }

  if (type === 'no-results') {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <div className="rounded-full bg-muted p-3 mb-4">
            <Search className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold mb-2">No Results Found</h3>
          <p className="text-muted-foreground text-center mb-6 max-w-md">
            No payment links match your current filters. Try adjusting your search criteria 
            or clearing the filters to see all payment links.
          </p>
          <div className="flex gap-3">
            <Button variant="outline" onClick={() => window.location.reload()}>
              Clear Filters
            </Button>
            <Button onClick={onCreateLink}>
              <Plus className="h-4 w-4 mr-2" />
              Create New Link
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return null
}
