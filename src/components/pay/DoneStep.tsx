'use client'

import { PaymentLinkDetails } from '@/lib/schemas/paymentConsumption'
import { formatCurrency, formatPaymentMethod, formatDateTime } from '@/lib/utils/format'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { CheckCircle, Download, ExternalLink, Building2 } from 'lucide-react'
import Link from 'next/link'

interface DoneStepProps {
  paymentLink: PaymentLinkDetails
  transactionStatus: string
}

export function DoneStep({ paymentLink, transactionStatus }: DoneStepProps) {
  const handleDownloadReceipt = () => {
    // In a real app, this would generate and download a PDF receipt
    const receiptData = {
      paymentLinkId: paymentLink.id,
      project: paymentLink.project,
      amount: paymentLink.amount,
      currency: paymentLink.currency,
      paymentMethod: paymentLink.paymentMethod,
      status: transactionStatus,
      completedAt: new Date().toISOString(),
    }
    
    const dataStr = JSON.stringify(receiptData, null, 2)
    const dataBlob = new Blob([dataStr], { type: 'application/json' })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement('a')
    link.href = url
    link.download = `payment-receipt-${paymentLink.id}.json`
    link.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="space-y-6">
          {/* Success Message */}
          <div className="text-center space-y-4">
            <CheckCircle className="h-20 w-20 text-green-600 mx-auto" />
            <div>
              <h1 className="text-4xl font-bold">Payment Complete!</h1>
              <p className="text-xl text-muted-foreground">
                Your payment has been successfully processed and settled.
              </p>
            </div>
            <Badge variant="default" className="bg-green-100 text-green-800 text-lg px-4 py-2">
          Settled
        </Badge>
      </div>

      {/* Receipt */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            Payment Receipt
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Project Info */}
          <div className="p-4 bg-muted rounded-lg">
            <h3 className="font-semibold">{paymentLink.project.name}</h3>
            <p className="text-sm text-muted-foreground">Project Code: {paymentLink.project.code}</p>
          </div>

          {/* Payment Details */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Amount</p>
              <p className="text-xl font-bold">
                {formatCurrency(paymentLink.amount, paymentLink.currency)}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Payment Method</p>
              <p className="text-lg font-semibold">
                {formatPaymentMethod(paymentLink.paymentMethod)}
              </p>
            </div>
          </div>

          {/* Transaction Details */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Payment Link ID</p>
              <p className="font-mono text-sm">{paymentLink.id}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Status</p>
              <Badge variant="default" className="bg-green-100 text-green-800">
                {transactionStatus}
              </Badge>
            </div>
          </div>

          <div>
            <p className="text-sm font-medium text-muted-foreground">Completed At</p>
            <p className="text-sm">{formatDateTime(new Date())}</p>
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-4">
        <Button onClick={handleDownloadReceipt} variant="outline" className="flex-1">
          <Download className="h-4 w-4 mr-2" />
          Download Receipt
        </Button>
        <Button asChild className="flex-1">
          <Link href="/dashboard">
            <ExternalLink className="h-4 w-4 mr-2" />
            Go to Dashboard
          </Link>
        </Button>
      </div>

      {/* Additional Info */}
      <div className="text-center text-sm text-muted-foreground">
        <p>
          Thank you for your payment! The developer has been notified and will receive 
          the settled funds according to their settlement schedule.
        </p>
      </div>
        </div>
      </div>
    </div>
  )
}
