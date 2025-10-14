'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { PageHeader } from '@/components/shared/PageHeader'
import { CreatePaymentLinkForm } from '@/components/payment-links/CreatePaymentLinkForm'
import { EmptyState } from '@/components/payment-links/EmptyState'
import { usePermissions } from '@/lib/permissions'
import { apiClient } from '@/lib/api'
import { CreatePaymentLinkRequest, Project, SettlementAccount } from '@/lib/schemas/paymentLink'
import { toast } from 'sonner'

export default function CreatePaymentLinkPage() {
  const router = useRouter()
  const permissions = usePermissions()
  const [projects, setProjects] = useState<Project[]>([])
  const [settlementAccounts, setSettlementAccounts] = useState<SettlementAccount[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [createdLink, setCreatedLink] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)

  // Load data on component mount
  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      setIsLoading(true)
      
      // Load projects and settlement accounts in parallel
      const [projectsData, accountsData] = await Promise.all([
        apiClient.getProjects('active'),
        apiClient.getSettlementAccounts('developer'),
      ])
      
      setProjects(projectsData)
      setSettlementAccounts(accountsData)
    } catch (error) {
      console.error('Failed to load data:', error)
      toast.error('Failed to load form data')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = async (data: CreatePaymentLinkRequest) => {
    try {
      setIsSubmitting(true)
      setError(null)
      
      const response = await apiClient.createPaymentLink(data)
      setCreatedLink(response)
      
      toast.success('Payment link created successfully!')
    } catch (error) {
      console.error('Failed to create payment link:', error)
      const errorMessage = error instanceof Error ? error.message : 'Failed to create payment link'
      setError(errorMessage)
      toast.error(errorMessage)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleCancel = () => {
    router.push('/payment-links')
  }

  const handleCreateAnother = () => {
    setCreatedLink(null)
    setError(null)
  }

  const handleViewAllLinks = () => {
    router.push('/payment-links')
  }

  const handleOpenLink = () => {
    if (createdLink?.url) {
      window.open(createdLink.url, '_blank')
    }
  }

  // Check permissions
  if (!permissions.canCreatePaymentLinks) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="Create Payment Link"
          description="Generate a secure payment link for a buyer and route settlement to the developer account."
        />
        <EmptyState type="no-permission" />
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="Create Payment Link"
          description="Generate a secure payment link for a buyer and route settlement to the developer account."
        />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="h-8 bg-muted animate-pulse rounded" />
            <div className="h-64 bg-muted animate-pulse rounded" />
          </div>
          <div className="space-y-4">
            <div className="h-8 bg-muted animate-pulse rounded" />
            <div className="h-64 bg-muted animate-pulse rounded" />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Create Payment Link"
        description="Generate a secure payment link for a buyer and route settlement to the developer account."
        actions={
          <Button variant="outline" onClick={handleCancel}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Links
          </Button>
        }
      />

      {error && (
        <Alert variant="destructive">
          <X className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="max-w-2xl mx-auto space-y-6">
        {/* Form */}
        <CreatePaymentLinkForm
          onSubmit={handleSubmit}
          isLoading={isSubmitting}
          projects={projects}
          settlementAccounts={settlementAccounts}
        />
        
        {/* Action buttons */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Button
            variant="outline"
            onClick={handleCancel}
            className="flex-1"
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            onClick={() => {
              // Trigger form submission
              const form = document.querySelector('form')
              if (form) {
                form.requestSubmit()
              }
            }}
            disabled={isSubmitting}
            className="flex-1"
          >
            {isSubmitting ? 'Creating Link...' : 'Create Link'}
          </Button>
        </div>

        {/* Success state */}
        {createdLink && (
          <div className="p-6 bg-green-50 border border-green-200 rounded-lg">
            <h3 className="text-lg font-semibold text-green-800 mb-2">Payment Link Created!</h3>
            <p className="text-green-700 mb-4">Your payment link has been successfully created.</p>
            <div className="space-y-2 mb-4">
              <p className="text-sm"><strong>Link ID:</strong> {createdLink.id}</p>
              <p className="text-sm"><strong>Status:</strong> {createdLink.status}</p>
              <p className="text-sm"><strong>Created:</strong> {new Date(createdLink.createdAt).toLocaleString()}</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                onClick={handleOpenLink}
                className="flex-1"
              >
                Open Link
              </Button>
              <Button
                variant="outline"
                onClick={handleCreateAnother}
                className="flex-1"
              >
                Create Another
              </Button>
              <Button
                variant="outline"
                onClick={handleViewAllLinks}
                className="flex-1"
              >
                View All Links
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
