'use client'

import { useState } from 'react'
import { format } from 'date-fns'
import { Copy, ExternalLink, MoreHorizontal } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Skeleton } from '@/components/ui/skeleton'
import { toast } from 'sonner'
import { PaymentLink, PaymentLinkStatus } from '@/lib/schemas/paymentLink'

interface PaymentLinkTableProps {
  paymentLinks: PaymentLink[]
  isLoading?: boolean
  onStatusFilter?: (status: PaymentLinkStatus | 'ALL') => void
  onProjectFilter?: (projectId: string | 'ALL') => void
  onSearch?: (query: string) => void
  projects?: Array<{ id: string; name: string; code: string }>
}

export function PaymentLinkTable({
  paymentLinks,
  isLoading = false,
  onStatusFilter,
  onProjectFilter,
  onSearch,
  projects = [],
}: PaymentLinkTableProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<PaymentLinkStatus | 'ALL'>('ALL')
  const [projectFilter, setProjectFilter] = useState<string>('ALL')

  const handleSearch = (value: string) => {
    setSearchQuery(value)
    onSearch?.(value)
  }

  const handleStatusFilter = (value: PaymentLinkStatus | 'ALL') => {
    setStatusFilter(value)
    onStatusFilter?.(value)
  }

  const handleProjectFilter = (value: string) => {
    setProjectFilter(value)
    onProjectFilter?.(value)
  }

  const copyToClipboard = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text)
      toast.success(`${label} copied to clipboard`)
    } catch (error) {
      toast.error('Failed to copy to clipboard')
    }
  }

  const getStatusBadgeVariant = (status: PaymentLinkStatus) => {
    switch (status) {
      case 'ACTIVE':
        return 'default'
      case 'PAID':
        return 'secondary'
      case 'EXPIRED':
        return 'outline'
      case 'CANCELLED':
        return 'destructive'
      default:
        return 'outline'
    }
  }

  const formatBuyerInfo = (buyer: PaymentLink['buyer']) => {
    if (buyer.type === 'email') {
      return buyer.email
    }
    return buyer.externalId
  }

  const formatAmount = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency === 'AED' ? 'AED' : 'USD',
      minimumFractionDigits: 2,
    }).format(amount)
  }

  const formatExpiry = (expiresAt: Date | string) => {
    const expiryDate = expiresAt instanceof Date ? expiresAt : new Date(expiresAt)
    const now = new Date()
    const isExpired = expiryDate < now
    const timeLeft = expiryDate.getTime() - now.getTime()
    const hoursLeft = Math.ceil(timeLeft / (1000 * 60 * 60))
    
    if (isExpired) {
      return 'Expired'
    }
    
    if (hoursLeft < 24) {
      return `${hoursLeft}h left`
    }
    
    const daysLeft = Math.ceil(hoursLeft / 24)
    return `${daysLeft}d left`
  }

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Payment Links</CardTitle>
          <CardDescription>Loading your payment links...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-center space-x-4 p-4 border rounded-lg">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-4 w-12" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Payment Links</CardTitle>
        <CardDescription>Manage and monitor your payment links</CardDescription>
      </CardHeader>
      <CardContent>
        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1">
            <Input
              placeholder="Search by ID, email, or external ID..."
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              className="w-full"
            />
          </div>
          <Select value={statusFilter} onValueChange={handleStatusFilter}>
            <SelectTrigger className="w-full sm:w-40">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All Status</SelectItem>
              <SelectItem value="ACTIVE">Active</SelectItem>
              <SelectItem value="PAID">Paid</SelectItem>
              <SelectItem value="EXPIRED">Expired</SelectItem>
              <SelectItem value="CANCELLED">Cancelled</SelectItem>
            </SelectContent>
          </Select>
          <Select value={projectFilter} onValueChange={handleProjectFilter}>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="Project" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All Projects</SelectItem>
              {projects.map((project) => (
                <SelectItem key={project.id} value={project.id}>
                  {project.name} ({project.code})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Table */}
        <div className="space-y-4">
          {paymentLinks.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No payment links found
            </div>
          ) : (
            paymentLinks.map((link) => (
              <div key={link.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                <div className="flex-1 grid grid-cols-1 md:grid-cols-6 gap-4">
                  {/* Created At */}
                  <div className="space-y-1">
                    <p className="text-sm font-medium">Created</p>
                    <p className="text-sm text-muted-foreground">
                      {format(new Date(link.createdAt), 'MMM dd, yyyy')}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {format(new Date(link.createdAt), 'HH:mm')}
                    </p>
                  </div>

                  {/* Link ID & Buyer */}
                  <div className="space-y-1">
                    <p className="text-sm font-medium">Link ID</p>
                    <p className="text-sm text-muted-foreground font-mono">
                      {link.id}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {formatBuyerInfo(link.buyer)}
                    </p>
                  </div>

                  {/* Project */}
                  <div className="space-y-1">
                    <p className="text-sm font-medium">Project</p>
                    <p className="text-sm text-muted-foreground">
                      {projects.find(p => p.id === link.projectId)?.name || 'Unknown'}
                    </p>
                  </div>

                  {/* Amount & Currency */}
                  <div className="space-y-1">
                    <p className="text-sm font-medium">Amount</p>
                    <p className="text-sm font-semibold">
                      {formatAmount(link.amount, link.currency)}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {link.paymentMethod}
                    </p>
                  </div>

                  {/* Status */}
                  <div className="space-y-1">
                    <p className="text-sm font-medium">Status</p>
                    <Badge variant={getStatusBadgeVariant(link.status)}>
                      {link.status}
                    </Badge>
                  </div>

                  {/* Expires */}
                  <div className="space-y-1">
                    <p className="text-sm font-medium">Expires</p>
                    <p className="text-sm text-muted-foreground">
                      {formatExpiry(link.expiresAt)}
                    </p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => copyToClipboard(link.url, 'Payment link')}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => window.open(link.url, '_blank')}
                  >
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => copyToClipboard(link.id, 'Link ID')}>
                        Copy Link ID
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => copyToClipboard(link.url, 'Payment URL')}>
                        Copy Payment URL
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => window.open(link.url, '_blank')}>
                        Open Payment Link
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  )
}
