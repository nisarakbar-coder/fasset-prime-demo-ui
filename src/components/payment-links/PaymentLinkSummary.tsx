'use client'

import { format } from 'date-fns'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Copy, ExternalLink, QrCode } from 'lucide-react'
import { toast } from 'sonner'
import { CreatePaymentLinkRequest, CreatePaymentLinkResponse } from '@/lib/schemas/paymentLink'

interface PaymentLinkSummaryProps {
  data?: CreatePaymentLinkRequest
  createdLink?: CreatePaymentLinkResponse
  projects?: Array<{ id: string; name: string; code: string }>
  settlementAccounts?: Array<{ id: string; alias: string; maskedIban: string }>
}

export function PaymentLinkSummary({ 
  data, 
  createdLink, 
  projects = [], 
  settlementAccounts = [] 
}: PaymentLinkSummaryProps) {
  const copyToClipboard = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text)
      toast.success(`${label} copied to clipboard`)
    } catch (error) {
      toast.error('Failed to copy to clipboard')
    }
  }

  const formatAmount = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency === 'AED' ? 'AED' : 'USD',
      minimumFractionDigits: 2,
    }).format(amount)
  }

  const formatBuyerInfo = (buyer: CreatePaymentLinkRequest['buyer']) => {
    if (buyer.type === 'email') {
      return buyer.email
    }
    return buyer.externalId
  }

  const getProjectName = (projectId: string) => {
    const project = projects.find(p => p.id === projectId)
    return project ? `${project.name} (${project.code})` : 'Unknown Project'
  }

  const getSettlementAccountName = (accountId: string) => {
    const account = settlementAccounts.find(a => a.id === accountId)
    return account ? `${account.alias} - ${account.maskedIban}` : 'Unknown Account'
  }

  const formatExpiry = (expiresAt: Date | string) => {
    const expiryDate = expiresAt instanceof Date ? expiresAt : new Date(expiresAt)
    const now = new Date()
    const timeLeft = expiryDate.getTime() - now.getTime()
    const hoursLeft = Math.ceil(timeLeft / (1000 * 60 * 60))
    
    if (hoursLeft < 24) {
      return `${hoursLeft} hours`
    }
    
    const daysLeft = Math.ceil(hoursLeft / 24)
    return `${daysLeft} days`
  }

  if (createdLink) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-green-600">Payment Link Created!</CardTitle>
          <CardDescription>
            Your payment link has been successfully created and is ready to use.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Link Details */}
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex-1">
                <p className="text-sm font-medium text-green-800">Payment Link URL</p>
                <p className="text-sm text-green-700 font-mono break-all">
                  {createdLink.url}
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => copyToClipboard(createdLink.url, 'Payment link')}
              >
                <Copy className="h-4 w-4" />
              </Button>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="font-medium">Link ID</p>
                <p className="text-muted-foreground font-mono">{createdLink.id}</p>
              </div>
              <div>
                <p className="font-medium">Status</p>
                <Badge variant="default">{createdLink.status}</Badge>
              </div>
              <div>
                <p className="font-medium">Created</p>
                <p className="text-muted-foreground">
                  {format(new Date(createdLink.createdAt), 'MMM dd, yyyy HH:mm')}
                </p>
              </div>
            </div>
          </div>

          {/* QR Code Placeholder */}
          <div className="flex justify-center p-6 border-2 border-dashed border-muted-foreground/25 rounded-lg">
            <div className="text-center space-y-2">
              <QrCode className="h-16 w-16 mx-auto text-muted-foreground" />
              <p className="text-sm text-muted-foreground">QR Code</p>
              <p className="text-xs text-muted-foreground">
                QR code will be generated here
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            <Button 
              className="flex-1" 
              onClick={() => window.open(createdLink.url, '_blank')}
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              Open Payment Link
            </Button>
            <Button variant="outline" className="flex-1">
              Create Another Link
            </Button>
            <Button variant="outline" className="flex-1">
              View All Links
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!data) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Live Preview</CardTitle>
          <CardDescription>
            Fill out the form to see a preview of your payment link
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <p>Form data will appear here as you fill it out</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Live Preview</CardTitle>
        <CardDescription>
          Preview of your payment link configuration
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Project */}
        <div className="space-y-1">
          <p className="text-sm font-medium">Project</p>
          <p className="text-sm text-muted-foreground">
            {getProjectName(data.projectId)}
          </p>
        </div>

        {/* Buyer */}
        <div className="space-y-1">
          <p className="text-sm font-medium">Buyer</p>
          <p className="text-sm text-muted-foreground">
            {formatBuyerInfo(data.buyer)}
          </p>
        </div>

        {/* Amount & Currency */}
        <div className="space-y-1">
          <p className="text-sm font-medium">Amount</p>
          <p className="text-lg font-semibold">
            {formatAmount(data.amount, data.currency)}
          </p>
          <p className="text-sm text-muted-foreground">
            Payment Method: {data.paymentMethod}
          </p>
        </div>

        {/* Settlement Account */}
        <div className="space-y-1">
          <p className="text-sm font-medium">Settlement Account</p>
          <p className="text-sm text-muted-foreground">
            {getSettlementAccountName(data.settlementAccountId)}
          </p>
        </div>

        {/* Expiry */}
        <div className="space-y-1">
          <p className="text-sm font-medium">Expires</p>
          <p className="text-sm text-muted-foreground">
            {format(new Date(data.expiresAt), 'MMM dd, yyyy HH:mm')}
          </p>
          <p className="text-xs text-muted-foreground">
            ({formatExpiry(data.expiresAt)} from now)
          </p>
        </div>

        {/* Compliance Flags */}
        <div className="space-y-2">
          <p className="text-sm font-medium">Compliance & Security</p>
          <div className="flex flex-wrap gap-2">
            {data.requireKyc && (
              <Badge variant="secondary">KYC Required</Badge>
            )}
            {data.requireWalletWhitelist && data.paymentMethod === 'USDT_TO_AED' && (
              <Badge variant="secondary">Wallet Whitelist Required</Badge>
            )}
          </div>
        </div>

        {/* URLs */}
        {(data.webhookUrl || data.successUrl || data.cancelUrl) && (
          <div className="space-y-2">
            <p className="text-sm font-medium">URLs</p>
            <div className="space-y-1 text-sm text-muted-foreground">
              {data.webhookUrl && (
                <p>Webhook: {data.webhookUrl}</p>
              )}
              {data.successUrl && (
                <p>Success: {data.successUrl}</p>
              )}
              {data.cancelUrl && (
                <p>Cancel: {data.cancelUrl}</p>
              )}
            </div>
          </div>
        )}

        {/* Notes */}
        {data.notes && (
          <div className="space-y-1">
            <p className="text-sm font-medium">Notes</p>
            <p className="text-sm text-muted-foreground">{data.notes}</p>
          </div>
        )}

        {/* Mock Pay Button */}
        <div className="pt-4 border-t">
          <Button 
            disabled 
            className="w-full"
            variant="outline"
          >
            Pay Now (Preview)
          </Button>
          <p className="text-xs text-muted-foreground text-center mt-2">
            This button will be enabled when the link is created
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
