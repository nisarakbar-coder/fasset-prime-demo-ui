'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Plus, Filter, Download } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { PageHeader } from '@/components/shared/PageHeader'
import { PaymentLinkTable } from '@/components/payment-links/PaymentLinkTable'
import { EmptyState } from '@/components/payment-links/EmptyState'
import { usePermissions } from '@/lib/permissions'
import { apiClient } from '@/lib/api'
import { PaymentLink, Project, PaymentLinkStatus } from '@/lib/schemas/paymentLink'
import { toast } from 'sonner'

export default function PaymentLinksPage() {
  const router = useRouter()
  const permissions = usePermissions()
  const [paymentLinks, setPaymentLinks] = useState<PaymentLink[]>([])
  const [projects, setProjects] = useState<Project[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [filters, setFilters] = useState({
    query: '',
    status: 'ALL' as PaymentLinkStatus | 'ALL',
    projectId: 'ALL',
  })

  // Load data on component mount
  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      setIsLoading(true)
      
      // Load payment links and projects in parallel
      const [linksResponse, projectsData] = await Promise.all([
        apiClient.listPaymentLinks(),
        apiClient.getProjects('active'),
      ])
      
      setPaymentLinks(linksResponse.data)
      setProjects(projectsData)
    } catch (error) {
      console.error('Failed to load data:', error)
      toast.error('Failed to load payment links')
    } finally {
      setIsLoading(false)
    }
  }

  const handleStatusFilter = (status: PaymentLinkStatus | 'ALL') => {
    setFilters(prev => ({ ...prev, status }))
    // In a real app, you would refetch data with the new filter
    // For now, we'll just update the local state
  }

  const handleProjectFilter = (projectId: string) => {
    setFilters(prev => ({ ...prev, projectId }))
    // In a real app, you would refetch data with the new filter
  }

  const handleSearch = (query: string) => {
    setFilters(prev => ({ ...prev, query }))
    // In a real app, you would refetch data with the new search query
  }

  const handleCreateLink = () => {
    router.push('/payment-links/new')
  }

  const handleExport = () => {
    // TODO: Implement export functionality
    toast.info('Export functionality coming soon')
  }

  // Check permissions
  if (!permissions.canViewPaymentLinks) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="Payment Links"
          description="Create and manage payment links for your projects"
        />
        <EmptyState type="no-permission" />
      </div>
    )
  }

  // Show empty state if no links and not loading
  if (!isLoading && paymentLinks.length === 0) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="Payment Links"
          description="Create and manage payment links for your projects"
          actions={
            permissions.canCreatePaymentLinks ? (
              <Button onClick={handleCreateLink}>
                <Plus className="h-4 w-4 mr-2" />
                Create Link
              </Button>
            ) : null
          }
        />
        <EmptyState type="no-links" onCreateLink={handleCreateLink} />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Payment Links"
        description="Create and manage payment links for your projects"
        actions={
          <div className="flex items-center space-x-2">
            <Button variant="outline" onClick={handleExport}>
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            {permissions.canCreatePaymentLinks && (
              <Button onClick={handleCreateLink}>
                <Plus className="h-4 w-4 mr-2" />
                Create Link
              </Button>
            )}
          </div>
        }
      />

      <PaymentLinkTable
        paymentLinks={paymentLinks}
        isLoading={isLoading}
        onStatusFilter={handleStatusFilter}
        onProjectFilter={handleProjectFilter}
        onSearch={handleSearch}
        projects={projects}
      />
    </div>
  )
}
