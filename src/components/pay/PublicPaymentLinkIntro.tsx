'use client'

import { PaymentLinkDetails } from '@/lib/schemas/paymentConsumption'
import { formatCurrency, formatPaymentMethod, formatExpiry } from '@/lib/utils/format'
import { isPaymentLinkActive } from '@/lib/guards'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Building2, Clock, CreditCard, AlertCircle } from 'lucide-react'
import Link from 'next/link'

interface PublicPaymentLinkIntroProps {
  paymentLink: PaymentLinkDetails
}

export function PublicPaymentLinkIntro({ paymentLink }: PublicPaymentLinkIntroProps) {
  const isActive = isPaymentLinkActive(paymentLink)
  const nextParam = encodeURIComponent(`/payment/${paymentLink.id}`)

  if (!isActive) {
    return (
      <div className="max-w-2xl mx-auto space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-red-500" />
              Payment Link Unavailable
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                {paymentLink.status === 'EXPIRED' 
                  ? 'This payment link has expired and is no longer available for payments.'
                  : 'This payment link is no longer active and cannot be used for payments.'
                }
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Payment Link Details */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Payment Link
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Project Info */}
          <div className="flex items-center gap-3 p-4 bg-muted rounded-lg">
            <Building2 className="h-8 w-8 text-primary" />
            <div>
              <h3 className="font-semibold">{paymentLink.project.name}</h3>
              <p className="text-sm text-muted-foreground">Project Code: {paymentLink.project.code}</p>
            </div>
          </div>

          {/* Payment Details */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">Amount</p>
              <p className="text-2xl font-bold">
                {formatCurrency(paymentLink.amount, paymentLink.currency)}
              </p>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">Payment Method</p>
              <p className="text-lg font-semibold">
                {formatPaymentMethod(paymentLink.paymentMethod)}
              </p>
            </div>
          </div>

          {/* Expiry */}
          <div className="flex items-center gap-2 p-3 bg-amber-50 border border-amber-200 rounded-lg">
            <Clock className="h-4 w-4 text-amber-600" />
            <div>
              <p className="text-sm font-medium text-amber-800">Expires {formatExpiry(paymentLink.expiresAt)}</p>
              <p className="text-xs text-amber-700">
                Complete your payment before this time to ensure processing
              </p>
            </div>
          </div>

          {/* Status Badge */}
          <div className="flex justify-center">
            <Badge variant="default" className="bg-green-100 text-green-800 border-green-200">
              Active
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Auth Required Notice */}
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          You&apos;ll need an investor account to complete this payment. 
          Create an account or log in to continue.
        </AlertDescription>
      </Alert>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4">
        <Button asChild className="flex-1">
          <Link href={`/register?next=${nextParam}`}>
            Create Account
          </Link>
        </Button>
        <Button asChild variant="outline" className="flex-1">
          <Link href={`/investor-login?next=${nextParam}`}>
            Login
          </Link>
        </Button>
      </div>

      {/* Additional Info */}
      <div className="text-center text-sm text-muted-foreground">
        <p>
          After creating an account or logging in, you&apos;ll be redirected back to complete your payment.
        </p>
      </div>
    </div>
  )
}
