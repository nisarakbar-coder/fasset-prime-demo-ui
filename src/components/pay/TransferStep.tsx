'use client'

import { useState, useEffect } from 'react'
import { PaymentLinkDetails, DepositAddress, TransactionStatus } from '@/lib/schemas/paymentConsumption'
import { formatCurrency, formatChainName, formatTransactionStatus } from '@/lib/utils/format'
import { apiClient } from '@/lib/api'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Copy, QrCode, CheckCircle, Clock, AlertCircle, ExternalLink } from 'lucide-react'
import { toast } from 'sonner'
import { QRCodeCanvas } from 'qrcode.react'

interface TransferStepProps {
  paymentLink: PaymentLinkDetails
  transactionStatus: string
  onStatusChange: (status: string) => void
}

export function TransferStep({ paymentLink, transactionStatus, onStatusChange }: TransferStepProps) {
  const [selectedChain, setSelectedChain] = useState<'erc20' | 'trc20'>('erc20')
  const [depositAddress, setDepositAddress] = useState<DepositAddress | null>(null)
  const [isLoadingAddress, setIsLoadingAddress] = useState(false)
  const [isPolling, setIsPolling] = useState(false)

  // Fetch deposit address when chain is selected
  useEffect(() => {
    if (paymentLink.paymentMethod === 'USDT_TO_AED') {
      fetchDepositAddress()
    }
  }, [selectedChain, paymentLink.id])

  // Poll for transaction status
  useEffect(() => {
    if (transactionStatus === 'PENDING' && !isPolling) {
      startPolling()
    }
  }, [transactionStatus])

  const fetchDepositAddress = async () => {
    try {
      setIsLoadingAddress(true)
      const address = await apiClient.getDepositAddress(paymentLink.id, selectedChain)
      setDepositAddress(address)
    } catch (error) {
      console.error('Failed to fetch deposit address:', error)
      toast.error('Failed to fetch deposit address. Please try again.')
    } finally {
      setIsLoadingAddress(false)
    }
  }

  const startPolling = () => {
    setIsPolling(true)
    const interval = setInterval(async () => {
      try {
        const status = await apiClient.getTransactionStatus(paymentLink.id)
        onStatusChange(status.status)
        
        if (status.status === 'SETTLED') {
          clearInterval(interval)
          setIsPolling(false)
        }
      } catch (error) {
        console.error('Failed to fetch transaction status:', error)
      }
    }, 5000) // Poll every 5 seconds

    // Cleanup after 10 minutes
    setTimeout(() => {
      clearInterval(interval)
      setIsPolling(false)
    }, 600000)
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    toast.success('Copied to clipboard!')
  }

  const getStatusIcon = () => {
    switch (transactionStatus) {
      case 'SETTLED':
        return <CheckCircle className="h-12 w-12 text-green-600" />
      case 'CONVERTING':
        return <Clock className="h-12 w-12 text-blue-600 animate-pulse" />
      case 'ONCHAIN_CONFIRMED':
        return <Clock className="h-12 w-12 text-amber-600" />
      default:
        return <Clock className="h-12 w-12 text-gray-600" />
    }
  }

  const getStatusMessage = () => {
    switch (transactionStatus) {
      case 'PENDING':
        return {
          title: 'Awaiting Payment',
          description: 'Send your USDT payment to the address below.',
          variant: 'default' as const,
        }
      case 'ONCHAIN_CONFIRMED':
        return {
          title: 'Payment Confirmed',
          description: 'Your payment has been confirmed on-chain. Converting to AED...',
          variant: 'default' as const,
        }
      case 'CONVERTING':
        return {
          title: 'Converting to AED',
          description: 'Your USDT is being converted to AED. This may take a few minutes.',
          variant: 'default' as const,
        }
      case 'SETTLED':
        return {
          title: 'Payment Settled',
          description: 'Your payment has been successfully settled to the developer.',
          variant: 'default' as const,
        }
      default:
        return {
          title: 'Processing Payment',
          description: 'Your payment is being processed.',
          variant: 'default' as const,
        }
    }
  }

  const statusInfo = getStatusMessage()

  if (paymentLink.paymentMethod === 'AED_BANK_TRANSFER') {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <div className="space-y-6">
            <div className="text-center space-y-4">
              {getStatusIcon()}
              <div>
                <h1 className="text-3xl font-bold">{statusInfo.title}</h1>
                <p className="text-lg text-muted-foreground">{statusInfo.description}</p>
              </div>
              <Badge variant={statusInfo.variant} className="text-lg px-4 py-2">
                {formatTransactionStatus(transactionStatus)}
              </Badge>
            </div>

        <Card>
          <CardHeader>
            <CardTitle>Bank Transfer Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-sm font-medium">Amount</Label>
                <p className="text-lg font-semibold">
                  {formatCurrency(paymentLink.amount, paymentLink.currency)}
                </p>
              </div>
              <div>
                <Label className="text-sm font-medium">Reference</Label>
                <div className="flex items-center gap-2">
                  <p className="font-mono text-sm">{paymentLink.id}</p>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => copyToClipboard(paymentLink.id)}
                  >
                    <Copy className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </div>
            
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Please include the reference code <strong>{paymentLink.id}</strong> in your bank transfer 
                to ensure proper processing.
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="space-y-6">
          <div className="text-center space-y-4">
            {getStatusIcon()}
            <div>
              <h1 className="text-3xl font-bold">{statusInfo.title}</h1>
              <p className="text-lg text-muted-foreground">{statusInfo.description}</p>
            </div>
            <Badge variant={statusInfo.variant} className="text-lg px-4 py-2">
              {formatTransactionStatus(transactionStatus)}
            </Badge>
          </div>

      {transactionStatus === 'PENDING' && (
        <div className="space-y-4">
          {/* Chain Selection */}
          <div className="space-y-2">
            <Label>Select Network</Label>
            <Select value={selectedChain} onValueChange={(value: 'erc20' | 'trc20') => setSelectedChain(value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="erc20">Ethereum (ERC-20)</SelectItem>
                <SelectItem value="trc20">Tron (TRC-20)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Deposit Address */}
          {depositAddress && (
            <Card>
              <CardHeader>
                <CardTitle>Send USDT Payment</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <div className="p-4 bg-muted rounded-lg inline-block">
                    <QRCodeCanvas value={depositAddress.address} size={200} />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Deposit Address</Label>
                  <div className="flex items-center gap-2">
                    <Input
                      value={depositAddress.address}
                      readOnly
                      className="font-mono text-sm"
                    />
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => copyToClipboard(depositAddress.address)}
                    >
                      <Copy className="h-3 w-3" />
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium">Amount</Label>
                    <p className="text-lg font-semibold">
                      {formatCurrency(paymentLink.amount, 'USDT')}
                    </p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Network</Label>
                    <p className="text-sm">{formatChainName(depositAddress.chain)}</p>
                  </div>
                </div>

                {depositAddress.memo && (
                  <div className="space-y-2">
                    <Label>Memo/Tag (Required)</Label>
                    <div className="flex items-center gap-2">
                      <Input
                        value={depositAddress.memo}
                        readOnly
                        className="font-mono text-sm"
                      />
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => copyToClipboard(depositAddress.memo!)}
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                )}

                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    Send exactly <strong>{formatCurrency(paymentLink.amount, 'USDT')}</strong> to this address. 
                    {depositAddress.confirmationsRequired && (
                      <> The transaction requires {depositAddress.confirmationsRequired} confirmations.</>
                    )}
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>
          )}

          {isLoadingAddress && (
            <div className="text-center">
              <Clock className="h-8 w-8 animate-spin mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">Loading deposit address...</p>
            </div>
          )}
        </div>
      )}

      {transactionStatus === 'ONCHAIN_CONFIRMED' && (
        <Alert>
          <CheckCircle className="h-4 w-4" />
          <AlertDescription>
            Your USDT payment has been confirmed on-chain. We&apos;re now converting it to AED 
            and will settle it to the developer shortly.
          </AlertDescription>
        </Alert>
      )}

      {transactionStatus === 'CONVERTING' && (
        <Alert>
          <Clock className="h-4 w-4" />
          <AlertDescription>
            Your USDT is being converted to AED. This process typically takes a few minutes. 
            You&apos;ll be notified once the settlement is complete.
          </AlertDescription>
        </Alert>
      )}

      {transactionStatus === 'SETTLED' && (
        <Alert>
          <CheckCircle className="h-4 w-4" />
          <AlertDescription>
            Payment completed successfully! Your funds have been settled to the developer.
          </AlertDescription>
        </Alert>
      )}
        </div>
      </div>
    </div>
  )
}
