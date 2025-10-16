'use client'

import { useEffect, useState, use } from 'react'
import { useRouter } from 'next/navigation'
import { notFound } from 'next/navigation'
import { PaymentStepper } from '@/components/pay/PaymentStepper'
import { PublicPaymentLinkIntro } from '@/components/pay/PublicPaymentLinkIntro'
import { doesBuyerMatch, isPaymentLinkActive } from '@/lib/guards'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { AlertCircle, UserX } from 'lucide-react'
import { PaymentLinkDetails, KycStatus, WalletWhitelistStatus, TransactionStatus } from '@/lib/schemas/paymentConsumption'

interface PaymentPageProps {
  params: Promise<{
    plinkId: string
  }>
}

export default function PaymentPage({ params }: PaymentPageProps) {
  const { plinkId } = use(params)
  const [paymentLink, setPaymentLink] = useState<PaymentLinkDetails | null>(null)
  const [kycStatus, setKycStatus] = useState<KycStatus | null>(null)
  const [walletStatus, setWalletStatus] = useState<WalletWhitelistStatus | null>(null)
  const [transactionStatus, setTransactionStatus] = useState<TransactionStatus | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [user, setUser] = useState<{ id: string; name: string; email: string; role: string } | null>(null)
  const router = useRouter()

  useEffect(() => {
    const loadPaymentData = async () => {
      try {
        // Check authentication first
        const storedUser = localStorage.getItem('fasset-user')
        if (storedUser) {
          const parsedUser = JSON.parse(storedUser)
          if (parsedUser.role === 'INVESTOR') {
            setIsAuthenticated(true)
            setUser(parsedUser)
          }
        }

        // Fetch payment link details
        const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'
        const paymentResponse = await fetch(`${baseUrl}/api/payment-links/${plinkId}`, {
          cache: 'no-store'
        })
        
        if (!paymentResponse.ok) {
          throw new Error(`Failed to fetch payment link: ${paymentResponse.status}`)
        }
        
        const paymentData = await paymentResponse.json()
        setPaymentLink(paymentData)

        // If user is authenticated, fetch additional data for payment flow
        if (isAuthenticated) {
          const [kycResponse, walletResponse, transactionResponse] = await Promise.all([
            fetch(`${baseUrl}/api/kyc/status`, { cache: 'no-store' }),
            fetch(`${baseUrl}/api/wallets/whitelist?chain=erc20`, { cache: 'no-store' }),
            fetch(`${baseUrl}/api/transactions?plinkId=${plinkId}`, { cache: 'no-store' })
          ])

          if (kycResponse.ok) {
            const kycData = await kycResponse.json()
            setKycStatus(kycData)
          }

          if (walletResponse.ok) {
            const walletData = await walletResponse.json()
            setWalletStatus(walletData)
          }

          if (transactionResponse.ok) {
            const transactionData = await transactionResponse.json()
            setTransactionStatus(transactionData)
          }
        }
      } catch (err) {
        console.error('Failed to load payment data:', err)
        setError('Failed to load payment link')
      } finally {
        setIsLoading(false)
      }
    }

    loadPaymentData()
  }, [plinkId, isAuthenticated])

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading payment link...</p>
        </div>
      </div>
    )
  }

  // Show error state
  if (error || !paymentLink) {
    notFound()
  }

  // Check if payment link is active
  if (!isPaymentLinkActive(paymentLink)) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto">
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
        </div>
      </div>
    )
  }

  // If user is not authenticated, show public payment link intro
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <PublicPaymentLinkIntro paymentLink={paymentLink} />
        </div>
      </div>
    )
  }

  // If user is authenticated, check buyer match
  const userEmail = user?.email || 'buyer@example.com'
  const userExternalId = 'CUST-12345' // Mock external ID
  const buyerMatches = doesBuyerMatch(paymentLink, userEmail, userExternalId)

  if (!buyerMatches) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <UserX className="h-5 w-5 text-red-500" />
                  Buyer Mismatch
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    This payment link is intended for a different buyer. 
                    Your account ({userEmail}) does not match the intended recipient.
                  </AlertDescription>
                </Alert>
                
                <div className="text-center space-y-4">
                  <p className="text-sm text-muted-foreground">
                    If you believe this is an error, you can request reassignment of this payment link.
                  </p>
                  <Button variant="outline">
                    Request Reassignment
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    )
  }

  // User is authenticated and buyer matches, show payment stepper
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <PaymentStepper
          paymentLink={paymentLink}
          kycStatus={kycStatus || { status: 'KYC_NONE' }}
          walletStatus={walletStatus || { whitelisted: false, address: undefined, chain: undefined }}
          initialTransactionStatus={transactionStatus || { status: 'PENDING', txHash: null, updatedAt: new Date().toISOString() }}
          userEmail={userEmail}
          userExternalId={userExternalId}
        />
      </div>
    </div>
  )
}