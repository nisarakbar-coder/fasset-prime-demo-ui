'use client'

import { useState, useEffect } from 'react'
import { PageHeader } from '@/components/shared/PageHeader'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Copyable } from '@/components/shared/Copyable'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { 
  CreditCard, 
  Copy, 
  QrCode, 
  Clock, 
  AlertTriangle,
  CheckCircle,
  ExternalLink,
  RefreshCw
} from 'lucide-react'
import { toast } from 'sonner'

interface DepositAddress {
  address: string
  chain: string
  minConfirmations: number
  quoteExpiry: string
  networkFee: string
  currency: string
}

const chains = [
  { value: 'ETHEREUM', label: 'Ethereum', icon: '⟠', fee: '0.001 ETH' },
  { value: 'POLYGON', label: 'Polygon', icon: '⬟', fee: '0.01 MATIC' },
  { value: 'ARBITRUM', label: 'Arbitrum', icon: '🔷', fee: '0.0001 ETH' },
]

export default function FundPage() {
  const [selectedChain, setSelectedChain] = useState('ETHEREUM')
  const [depositAddress, setDepositAddress] = useState<DepositAddress | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [timeLeft, setTimeLeft] = useState(0)

  const fetchDepositAddress = async () => {
    setIsLoading(true)
    try {
      const response = await fetch(`/api/deposits/address?chain=${selectedChain}`)
      const data = await response.json()
      
      if (data.success) {
        setDepositAddress(data.data)
        const expiryTime = new Date(data.data.quoteExpiry).getTime()
        const now = Date.now()
        setTimeLeft(Math.max(0, Math.floor((expiryTime - now) / 1000)))
      } else {
        toast.error('Failed to generate deposit address')
      }
    } catch (error) {
      toast.error('Error generating deposit address')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchDepositAddress()
  }, [selectedChain])

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000)
      return () => clearTimeout(timer)
    }
  }, [timeLeft])

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
  }

  const selectedChainInfo = chains.find(c => c.value === selectedChain)

  return (
    <div className="space-y-6">
      <PageHeader
        title="Fund Account"
        description="Deposit USDT to your account to start investing"
      />

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Network Selection */}
          <Card>
            <CardHeader>
              <CardTitle>Select Network</CardTitle>
              <CardDescription>
                Choose the blockchain network for your deposit
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-3">
                {chains.map((chain) => (
                  <div
                    key={chain.value}
                    className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                      selectedChain === chain.value
                        ? 'border-primary bg-primary/5'
                        : 'border-muted hover:border-primary/50'
                    }`}
                    onClick={() => setSelectedChain(chain.value)}
                  >
                    <div className="flex items-center space-x-3 mb-2">
                      <span className="text-2xl">{chain.icon}</span>
                      <div>
                        <h3 className="font-medium">{chain.label}</h3>
                        <p className="text-sm text-muted-foreground">Fee: {chain.fee}</p>
                      </div>
                    </div>
                    {selectedChain === chain.value && (
                      <div className="flex items-center text-sm text-primary">
                        <CheckCircle className="h-4 w-4 mr-1" />
                        Selected
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Deposit Address */}
          {depositAddress && (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Deposit Address</CardTitle>
                    <CardDescription>
                      Send USDT to this address on {selectedChainInfo?.label}
                    </CardDescription>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={fetchDepositAddress}
                    disabled={isLoading}
                  >
                    <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                    Refresh
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Your Deposit Address</Label>
                  <Copyable 
                    value={depositAddress.address}
                    className="text-sm"
                  />
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Network</Label>
                    <div className="flex items-center space-x-2 p-3 border rounded-lg">
                      <span className="text-lg">{selectedChainInfo?.icon}</span>
                      <span className="font-medium">{selectedChainInfo?.label}</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Currency</Label>
                    <div className="p-3 border rounded-lg">
                      <span className="font-medium">{depositAddress.currency}</span>
                    </div>
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Minimum Confirmations</Label>
                    <div className="p-3 border rounded-lg">
                      <span className="font-medium">{depositAddress.minConfirmations}</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Network Fee</Label>
                    <div className="p-3 border rounded-lg">
                      <span className="font-medium">{depositAddress.networkFee}</span>
                    </div>
                  </div>
                </div>

                {/* Quote Expiry */}
                {timeLeft > 0 && (
                  <Alert>
                    <Clock className="h-4 w-4" />
                    <AlertDescription>
                      Quote expires in {formatTime(timeLeft)}. Generate a new address if needed.
                    </AlertDescription>
                  </Alert>
                )}

                {/* QR Code Placeholder */}
                <div className="space-y-2">
                  <Label>QR Code</Label>
                  <div className="flex justify-center p-8 border rounded-lg bg-muted/50">
                    <div className="text-center">
                      <QrCode className="h-24 w-24 mx-auto mb-2 text-muted-foreground" />
                      <p className="text-sm text-muted-foreground">QR Code for {depositAddress.address}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Important Notes */}
          <Card>
            <CardHeader>
              <CardTitle>Important Notes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Alert>
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Only send USDT</strong> to this address. Sending other tokens may result in permanent loss.
                  </AlertDescription>
                </Alert>
                
                <div className="space-y-2 text-sm">
                  <div className="flex items-start space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                    <span>Ensure you're sending on the correct network ({selectedChainInfo?.label})</span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                    <span>Minimum deposit: 100 USDT</span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                    <span>Deposits are processed automatically after confirmations</span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                    <span>You can track your deposit status in the dashboard</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Deposit Status */}
          <Card>
            <CardHeader>
              <CardTitle>Deposit Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Network</span>
                  <Badge variant="outline">
                    {selectedChainInfo?.label}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Status</span>
                  <Badge variant="secondary">Ready</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Quote Expiry</span>
                  <span className="text-sm text-muted-foreground">
                    {timeLeft > 0 ? formatTime(timeLeft) : 'Expired'}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Recent Deposits */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Deposits</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">1,000 USDT</p>
                    <p className="text-sm text-muted-foreground">Ethereum</p>
                  </div>
                  <Badge variant="default">Completed</Badge>
                </div>
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">500 USDT</p>
                    <p className="text-sm text-muted-foreground">Polygon</p>
                  </div>
                  <Badge variant="secondary">Pending</Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Help */}
          <Card>
            <CardHeader>
              <CardTitle>Need Help?</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <Button variant="outline" size="sm" className="w-full justify-start">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Deposit Guide
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Contact Support
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
